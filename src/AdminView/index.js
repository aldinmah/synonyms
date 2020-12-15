import React, { useState, useEffect } from 'react';
import { SYNONYM_APPROVED_MESSAGE } from '../Constants'

function AdminView(props) {
    const [onlyPending, setOnlyPending] = useState(false)
    const [notApprovedSynonyms, setNotApprovedSynonyms] = useState(props.localDBData);
    useEffect(() => {        
        setNotApprovedSynonyms(filterNotApprovedSynonyms(props.localDBData))
    }, [props.localDBData,onlyPending])

    function filterNotApprovedSynonyms(collection) {
        if(onlyPending)
            return props.localDBData;
        let notApproved = []
        if (collection.length) {
            collection.forEach(function (word) {
                if (!word.approved) notApproved.push(word)
            })
        }
        return notApproved
    }
    function changeApproval(word) {
        props.approveWordInDB(word.guid)
        props.showMessageBox(SYNONYM_APPROVED_MESSAGE)
    }

    return (
        <div className="admin-view-wrapper col-12 text-left p-0 m-0">
            <h4 className="col-12 py-3 m-0 admin-heading">Admin panel - synonyms approval <span className="num-of-approval float-right">{notApprovedSynonyms.length} items</span></h4>
            {props.localDBData.length>0 &&
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Word</th>
                            <th scope="col">Description/Score</th>
                            <th scope="col">Synonym for word</th>
                            <th scope="col" className="controls-column"><label><input type="checkbox" onChange={(e)=>{setOnlyPending(!onlyPending)}}/>Show all?</label></th>
                        </tr>
                    </thead>
                    <tbody>
                        {notApprovedSynonyms.length > 0 && notApprovedSynonyms.map(function (item, index) {
                            return <tr key={'tr+' + item + index}>
                                <th scope="row">{index + 1}</th>
                                <td>{item.word}</td>
                                <td>{item.score}</td>
                                <td>{item.syn_for.map(function (syn, syInd) {
                                    return <span key={"tsyn_" + syn + syInd}>{syn}{(syInd === item.syn_for.length || item.syn_for.length === 1) ? "" : ", "}</span>
                                })}</td>
                                <td>
                                    <button type="button" className={`btn approve-button ${item.approved?"btn-danger":"btn-success"}`} onClick={() => { changeApproval(item) }}>{item.approved?"Reject":"Approve"}</button>
                                </td>
                            </tr>
                        })}
                    </tbody>
                </table>
            }
            {notApprovedSynonyms.length===0 &&
                <span className="alert alert-warning no-results text-center row m-0 no-approved-list">There are no requests for approval.</span>
            }
        </div>
    )
}

export default AdminView;