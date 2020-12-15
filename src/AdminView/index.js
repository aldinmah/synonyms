import React, { useState, useEffect } from 'react';
import { SYNONYM_APPROVED_MESSAGE } from '../Constants'

function AdminView(props) {
    const [notApprovedSynonyms, setNotApprovedSynonyms] = useState(filterNotApprovedSynonyms(props.localDBData));
    const [showMessage, setShowMessage] = useState(false);

    useEffect(() => {
        setNotApprovedSynonyms(filterNotApprovedSynonyms(props.localDBData))
    }, [props.localDBData])

    function filterNotApprovedSynonyms(collection) {
        let notApproved = []
        if (collection.length) {
            collection.map(function (word) {
                if (!word.approved) notApproved.push(word)
            })
        }
        return notApproved
    }
    function approveWord(word) {
        var notApprovedNew = [...notApprovedSynonyms];
        var index = notApprovedNew.indexOf(word)
        if (index !== -1) {
            notApprovedNew.splice(index, 1)
            setNotApprovedSynonyms(notApprovedNew)
        }
        props.approveWordInDB(word.guid)
        setShowMessage(true)
        setTimeout(() => {
            setShowMessage(false)
        }, 5000);
    }

    return (
        <div className="admin-view-wrapper col-12 text-left p-0 m-0">
            {showMessage &&
                <span onClick={() => { setShowMessage(!showMessage) }}
                    className="position-fixed float-left d-inline-block alert alert-success text-center syn-approved-message">{SYNONYM_APPROVED_MESSAGE}</span>
            }
            <h4 className="col-12 py-3 m-0 admin-heading">Admin panel - synonyms approval <span className="num-of-approval float-right">{notApprovedSynonyms.length} items</span></h4>
            {notApprovedSynonyms.length>0 &&
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Word</th>
                            <th scope="col">Description/Score</th>
                            <th scope="col">Synonym for word</th>
                            <th scope="col"></th>
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
                                <td><button type="button" className="btn btn-success approve-button" onClick={() => { approveWord(item) }}>Approve</button></td>
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