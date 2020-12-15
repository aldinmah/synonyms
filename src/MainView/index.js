import React, { useState, useEffect } from 'react';
import API from '../API'
import localDB from '../API/localDB'
import { DATA_SOURCE, RESULTS_LAYOUT, LOADING_WITH_DOTS, SYNONYM_ADDED_MESSAGE, NO_SYNOYMS_FOUND_MESSAGE } from '../Constants'
import CardList from '../WordsView/CardList'
import TableList from '../WordsView/TableList'
import AdminView from '../AdminView'
import ToggleButton from "react-bootstrap/ToggleButton";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Carousel from 'react-bootstrap/Carousel'

function MainView(props) {

    const [selectedWord, setSelectedWord] = useState("")
    const [newSynonym, setNewSynonym] = useState("")
    const [synonymsData, setSynonymsData] = useState([])
    const [numberOfTransitiveSynonyms, setNumberOfTransitiveSynonyms] = useState(0)
    const [activeLayout, setActiveLayout] = useState(RESULTS_LAYOUT.CARDS)
    const [initLoad, setInitLoad] = useState(true)
    const [loading, setLoading] = useState(false)
    const [synonymAdded, setSynonymAdded] = useState(false)
    const [localDBData, setLocalDBData] = useState(localDB.loadDataFromStorage())
    const [dataSource, setDataSource] = useState('LOCAL')
    const [showAddSynonymBox,setShowAddSynonymBox] = useState(false)
    const [adminViewActive, setAdminViewActive] = useState(0);

    useEffect(() => {    
       localDB.saveDataToStorage(localDBData)
    }, [localDBData]);

    function retriveSynonym() {
        setLoading(true)
        if (dataSource === DATA_SOURCE.LOCAL) {
            let results = localDB.getBaseSynonyms(selectedWord, localDBData)
            let numTransitiveSyn = 0
            let approvedResults = results.filter(function(item){
                return item.approved === true
               });
               
            approvedResults.map((item) => {
                return numTransitiveSyn += item.wordRelatedSynonyms.length
            });
            console.log(approvedResults);
            
            setNumberOfTransitiveSynonyms(numTransitiveSyn)
            setSynonymsData(approvedResults)
            setLoading(false)
        } else {
            API.retriveSynonyms(selectedWord).then(words => {
                API.getRelatedSynonyms(words).then(relatedWords => {
                    let numTransitiveSyn = 0;
                    relatedWords.map((item) => {
                        return numTransitiveSyn += item.wordRelatedSynonyms.length
                    });
                    setNumberOfTransitiveSynonyms(numTransitiveSyn)
                    setSynonymsData(relatedWords)
                    setLoading(false)
                });
            });
        }
        if (initLoad)
            setInitLoad(false)
    }
    
    function guid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
    }
    function approveWordInDB(wordGuid) {
        let dbData = [...localDBData]
        dbData.forEach(function (item) {
            if(item.guid==wordGuid){
                item.approved = true;
            }
        })
        localDB.saveDataToStorage(dbData)
        setLocalDBData(dbData)
    }
    function addNewSynonym() {
        let dbData = [...localDBData]
        let itemExist = false
        let isNewWord = true
        dbData.forEach(function (item) {
           if (item.word.toLowerCase() === selectedWord.toLowerCase()) {
                itemExist = true
                isNewWord = false
                if (!item.syn_for.includes(newSynonym.toLowerCase())) {
                    isNewWord = true
                    item.syn_for.push(newSynonym)
                }
            }
        })
        
        if(!itemExist){
            let wordData = {
                guid: guid(),
                word: selectedWord,
                score: 'N/A',
                approved: false,
                syn_for: [newSynonym.toLowerCase()]
            }
            dbData.push(wordData)
        }
        if(isNewWord){
            let wordData = {
                guid: guid(),
                word: newSynonym,
                score: 'N/A',
                approved: false,
                syn_for: [selectedWord.toLowerCase()]
            }
            dbData.push(wordData)
        }
        setSynonymAdded(true)
        setLocalDBData(dbData)
        setNewSynonym('')
        setTimeout(() => {
            setSynonymAdded(false)
        }, 5000);
    }
    
    return (
        <div className="main-view-wrapper d-flex w-100 h-100 p-0 mx-auto flex-column">
            <div className="header-wrapper mb-4">
                <div className="header-content col-12 col-md-6 offset-md-3 py-2 px-0 float-left">
                    <div className="logo-wrapper float-left">
                        <img className="logo" src="/assets/images/logo.png" alt="logo" />
                    </div>
                    <div className="admin-box float-right">
                        <button type="button" className="admin-button" onClick={()=>{
                            setAdminViewActive(adminViewActive?0:1);
                            setSelectedWord('');
                        }}>{!adminViewActive?"Administration":"Back"}</button>    
                    </div>
                </div>
            </div>
            
            <div className="content-view text-center p-0 mb-4">
            <Carousel 
                activeIndex={adminViewActive} 
                controls={false}
                indicators={false}
                wrap={false}
            >
                <Carousel.Item>
                {synonymAdded &&
                    <span onClick={()=>{setSynonymAdded(!synonymAdded)}}
                        className="position-fixed float-left d-inline-block alert alert-success text-center syn-added-message">{SYNONYM_ADDED_MESSAGE}</span>
                }
                <div className="search-box m-y-1 p-3">
                    <div className="controls-wrapper col-12 row m-0 p-0 mb-2">
                        <div className="source-box col-12 float-left text-left p-0">
                            <div className="col-12 p-0">
                                <span className="source-label">Data source</span>
                                <ButtonGroup toggle>
                                    <ToggleButton
                                        className="btn btn-light"
                                        key="rb-source-api"
                                        type="radio"
                                        name="datasource"
                                        value={DATA_SOURCE.API}
                                        checked={dataSource === DATA_SOURCE.API}
                                        onChange={e => {
                                            setDataSource(e.target.value);
                                            setSelectedWord('');
                                            setSynonymsData([]);
                                            setInitLoad(true);
                                        }}
                                    >
                                        API (Datamuse)
                                    </ToggleButton>
                                    <ToggleButton
                                        className="btn btn-light"
                                        key="rb-source-local"
                                        type="radio"
                                        name="datasource"
                                        value={DATA_SOURCE.LOCAL}
                                        checked={dataSource === DATA_SOURCE.LOCAL}
                                        onChange={e => {
                                            setDataSource(e.target.value);
                                            setSelectedWord('');
                                            setSynonymsData([]);
                                            setInitLoad(true);
                                        }}
                                    >
                                        Local Storage
                                    </ToggleButton>
                                </ButtonGroup>
                            </div> 
                        </div>
                    </div>
                    <div className="row px-3">
                        <div className="input-wrapper col-12 col-md-8 m-y-1 p-0">
                            <input
                                type="text"
                                className="standard-input col-12 search-input"
                                placeholder="Search for word synonyms"
                                value={selectedWord}
                                onChange={e => {
                                    setSelectedWord(e.target.value)
                                }}
                                onKeyDown={e => {
                                    if (e.key === 'Enter' && selectedWord)
                                        retriveSynonym()
                                }}
                            />
                            <button type="button" onClick={retriveSynonym} className="input-icon loop-icon">
                                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 1000 1000" enableBackground="new 0 0 1000 1000"><g><g transform="translate(0.000000,511.000000) scale(0.100000,-0.100000)"><path d="M2906.9,4986.5c-728.2-131.8-1320.2-437.8-1831.8-951.6c-480.3-478.1-788.6-1045.5-931.5-1720.1c-58.1-270.3-58.1-1025.4,0-1295.7C398.2-176.1,1249.3-1141.1,2379.7-1514.2c377.5-125.1,592-156.4,1063.3-156.4c366.4,0,471.4,6.7,663.5,49.2c402.1,87.1,815.4,254.7,1121.4,451.3l129.6,84.9l440.1-440.1l437.8-437.8v-149.7c0-167.5,55.8-370.8,140.7-513.8c31.3-53.6,491.5-529.4,1025.4-1058.9c893.6-889.1,978.5-967.3,1112.5-1025.4c174.2-76,469.1-102.8,643.4-55.8c348.5,96.1,623.3,370.8,719.3,719.3c46.9,174.2,20.1,469.1-55.8,643.4c-58.1,134-136.3,218.9-1025.4,1112.5c-529.4,533.9-1005.3,994.1-1058.9,1025.4c-143,84.9-346.2,140.7-513.8,140.7h-149.7l-437.8,437.8l-440.1,440.1l84.9,129.6c196.6,306.1,364.1,719.3,451.3,1121.4c71.5,328.4,71.5,996.3,0,1324.7c-292.7,1347.1-1275.6,2336.7-2618.2,2633.8C3885.4,5013.3,3139.3,5026.7,2906.9,4986.5z M4035,4001.4C5127.5,3688.6,5833.4,2716.9,5782,1599.9C5723.9,362.3,4747.7-613.9,3510.1-672c-949.4-42.5-1814,469.1-2236.1,1322.5c-198.8,406.6-272.5,797.5-239,1275.6c60.3,819.9,600.9,1588.3,1364.9,1941.3C2898,4097.4,3519,4148.8,4035,4001.4z" /></g></g></svg>
                            </button>


                            {selectedWord && dataSource===DATA_SOURCE.LOCAL &&
                                <div className="add-synonym-field-box">
                                    <button 
                                        className="font-italic link-button my-1 p-0" 
                                        type="button"
                                        onClick={()=>{setShowAddSynonymBox(!showAddSynonymBox)}}
                                        >
                                            Add new synonym for <strong>{selectedWord}</strong>
                                    </button>
                                    <div className={`col-12 add-synonym-wrapper p-0 float-left ${(showAddSynonymBox) ? "" : "hide-box"}`}>
                                        <input
                                            type="text"
                                            className="standard-input col-8 float-left"
                                            placeholder="Add synonym"
                                            value={newSynonym}
                                            onChange={e => {
                                                setNewSynonym(e.target.value)
                                            }}
                                            onKeyDown={e => {
                                                if (e.key === 'Enter' && selectedWord)
                                                    addNewSynonym()
                                            }}
                                        />
                                        <button type="button" onClick={addNewSynonym} className="add-syn-btn float-left" disabled={newSynonym ? false : true}>
                                            Submit
                                        </button>
                                    </div>
                                </div>
                            }
                        </div>
                        <div className="layout-control col-12 col-md-4 text-right pr-0">

                            <button type="button" className={`layout-button cards-layout ${(activeLayout === 1) ? "active" : ""}`} onClick={() => setActiveLayout(RESULTS_LAYOUT.CARDS)}>
                                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" enableBackground="new 0 0 1000 1000"><g><path d="M61.6,10h154.7c28.5,0,51.6,23.1,51.6,51.6v154.8c0,28.5-23.1,51.6-51.6,51.6H61.6c-28.5,0-51.6-23.1-51.6-51.6V61.6C10,33.1,33.1,10,61.6,10z" /><path d="M422.6,10h154.7c28.5,0,51.6,23.1,51.6,51.6v154.8c0,28.5-23.1,51.6-51.6,51.6H422.6c-28.5,0-51.6-23.1-51.6-51.6V61.6C371.1,33.1,394.2,10,422.6,10z" /><path d="M783.7,10h154.7c28.5,0,51.6,23.1,51.6,51.6v154.8c0,28.5-23.1,51.6-51.6,51.6H783.7c-28.5,0-51.6-23.1-51.6-51.6V61.6C732.1,33.1,755.2,10,783.7,10z" /><path d="M783.7,371.1h154.7c28.5,0,51.6,23.1,51.6,51.6v154.7c0,28.5-23.1,51.6-51.6,51.6H783.7c-28.5,0-51.6-23.1-51.6-51.6V422.6C732.1,394.1,755.2,371.1,783.7,371.1z" /><path d="M422.6,371.1h154.7c28.5,0,51.6,23.1,51.6,51.6v154.7c0,28.5-23.1,51.6-51.6,51.6H422.6c-28.5,0-51.6-23.1-51.6-51.6V422.6C371.1,394.1,394.2,371.1,422.6,371.1z" /><path d="M61.6,371.1h154.7c28.5,0,51.6,23.1,51.6,51.6v154.7c0,28.5-23.1,51.6-51.6,51.6H61.6C33.1,629,10,605.9,10,577.4V422.6C10,394.1,33.1,371.1,61.6,371.1z" /><path d="M61.6,732.1h154.7c28.5,0,51.6,23.1,51.6,51.6v154.7c0,28.4-23.1,51.6-51.6,51.6H61.6C33.1,990,10,966.9,10,938.4V783.7C10,755.2,33.1,732.1,61.6,732.1z" /><path d="M422.6,732.1h154.7c28.5,0,51.6,23.1,51.6,51.6v154.7c0,28.4-23.1,51.6-51.6,51.6H422.6c-28.5,0-51.6-23.1-51.6-51.6V783.7C371.1,755.2,394.2,732.1,422.6,732.1z" /><path d="M783.7,732.1h154.7c28.5,0,51.6,23.1,51.6,51.6v154.7c0,28.4-23.1,51.6-51.6,51.6H783.7c-28.5,0-51.6-23.1-51.6-51.6V783.7C732.1,755.2,755.2,732.1,783.7,732.1z" /></g></svg>
                            </button>
                            <span className="std-label white"> / </span>
                            <button type="button" className={`layout-button table-layout ${(activeLayout === 2) ? "active" : ""}`} onClick={() => setActiveLayout(RESULTS_LAYOUT.TABLE)}>
                                <svg height="48" viewBox="0 0 48 48" width="48" xmlns="http://www.w3.org/2000/svg"><path d="M8 28h8v-8h-8v8zm0 10h8v-8h-8v8zm0-20h8v-8h-8v8zm10 10h24v-8h-24v8zm0 10h24v-8h-24v8zm0-28v8h24v-8h-24z" /><path d="M0 0h48v48h-48z" fill="none" /></svg>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="result-wrapper col-12 text-left p-0">
                    {loading &&
                        <div className="spinner-container p-5 p-y-3 text-center">
                            <div className="spinner-border">
                                <span className="sr-only">{LOADING_WITH_DOTS}</span>
                            </div>
                        </div>
                    }
                    {synonymsData.length === 0 && !initLoad && !loading &&
                        <div className="alert alert-warning no-results text-center row m-0" role="alert">
                            <span className="col-12 alert-text-row text-left my-2 pl-0">{NO_SYNOYMS_FOUND_MESSAGE}</span>
                            {dataSource===DATA_SOURCE.LOCAL &&
                                <div className="col-12 m-0 p-0 row">
                                    <span className="col-12 alert-text-row text-left mb-1 pl-0">or add a new synonym for <span className="alert-syn-word">{selectedWord}</span></span>
                                    <div className="col-12 add-synonym-wrapper p-0">
                                        <input
                                            type="text"
                                            className="standard-input col-8 float-left"
                                            placeholder="Add synonym"
                                            value={newSynonym}
                                            onChange={e => {
                                                setNewSynonym(e.target.value)
                                            }}
                                            onKeyDown={e => {
                                                if (e.key === 'Enter' && selectedWord)
                                                    addNewSynonym()
                                            }}
                                        />
                                        <button type="button" onClick={addNewSynonym} className="add-syn-btn float-left" disabled={newSynonym ? false : true}>
                                            Submit
                                        </button>
                                    </div>
                                </div>
                            }
                        </div>
                    }
                    {(initLoad || synonymsData.length !== 0) && !loading &&
                        <div>
                            {activeLayout === 1 &&
                                <CardList synonymsData={synonymsData} numberOfTransitiveSynonyms={numberOfTransitiveSynonyms} />
                            }
                            {activeLayout === 2 &&
                                <TableList synonymsData={synonymsData} numberOfTransitiveSynonyms={numberOfTransitiveSynonyms} />
                            }
                        </div>
                    }
                </div>
                </Carousel.Item>
                <Carousel.Item>
                    <AdminView localDBData={localDBData} approveWordInDB={approveWordInDB}/>
                </Carousel.Item>
            </Carousel>
                
            </div>

           
            <div className="footer-wrapper mt-auto text-center">
                <div className="footer-content col-12 col-md-6 offset-md-3 py-2">
                    <span>Lorem ipsum</span>
                </div>
            </div>
        </div>
    )
}

export default MainView;