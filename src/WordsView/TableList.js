import "bootstrap/js/src/collapse.js";

function createChildRows(word,itemIndex) {    
    return (
    <tr key={itemIndex+"_row"}>
        <td colSpan="5" className="hiddenRow">
            <div className="accordian-body collapse p-2" id={"word_"+itemIndex}>
            {word.wordRelatedSynonyms.length>0 &&
                word.wordRelatedSynonyms.map((relatedWord, index) => (
                    <span key={`rel_ ${index}`}>{relatedWord.word}{(index===(word.wordRelatedSynonyms.length-1))?"":","} </span> 
                ))
            }
            {word.wordRelatedSynonyms.length===0 && 
                <span className="alert alert-info d-flex m-0">No transitive synonyms found.</span> 
            }
            </div>
        </td>
    </tr>);
 
}
function createRow(tableRowID, data, columns, cells = []) {     
    for (let i in columns) {
        if(i==0)
            cells.push(<td key={tableRowID+"_"+i}>{tableRowID+1}</td>)
        else if(i==1)
            cells.push(<td key={tableRowID+"_"+i}>{data.baseWord.word}</td>)
        else if(i==2)
            cells.push(<td key={tableRowID+"_"+i}>{data.baseWord.score?data.baseWord.score:"N/A"}</td>)
        else if(i==3)
            cells.push(<td key={tableRowID+"_"+i}>{data.wordRelatedSynonyms.length}</td>)
        else if(i==4)
            cells.push(<td className="controls text-center" key={tableRowID+"_"+i}><svg className="icon-expand" xmlns="http://www.w3.org/2000/svg" width="306px" height="306px" viewBox="0 0 306 306"><g><polygon points="270.3,58.65 153,175.95 35.7,58.65 0,94.35 153,247.35 306,94.35"/></g></svg><svg className="icon-collapse" xmlns="http://www.w3.org/2000/svg" width="306px" height="306px" viewBox="0 0 306 306"><g><polygon points="153,58.65 0,211.65 35.7,247.35 153,130.05 270.3,247.35 306,211.65"/></g></svg></td>)
    }
    
    return (<tr data-toggle="collapse" className="accordion-toggle" data-target={`#word_${tableRowID}`} aria-expanded="false" key={Date.now()+tableRowID+"_row"}>{cells}</tr>);
  }
function renderExpandableRows(props) {
    let rows = []
    for(let i=0;i<props.synonymsData.length;i++){
        rows.push(createRow(i,props.synonymsData[i],['#','Synonym',"Description","# of synonyms",""]))
        rows.push(createChildRows(props.synonymsData[i],i))
    }
   return rows
}

function TableList(props) {
    
    return (
        <table className="result-set table table-condensed">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Synonym</th>
                    <th>Description/Score</th>
                    <th className="w-30"># of Transitive Synonyms</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {renderExpandableRows(props)}
            </tbody>
        </table>
    )
}

export default TableList;