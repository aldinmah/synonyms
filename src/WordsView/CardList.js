import { Accordion, Card } from 'react-bootstrap'
import ReactTooltip from "react-tooltip";

function CardList(props) {
    return (
        <div className="result-set accordion-wrapper col-12 text-left p-0 ">
            <Accordion className="col-12 text-left p-0" defaultActiveKey="0">
                <Card className="result-box first-level-results">
                    <Accordion.Toggle as={Card.Header} eventKey="0">
                        <span className="result-title">
                            Synonyms
                                    <span className="results-number float-right">
                                {!props.synonymsData.length ? 'No results found' : (props.synonymsData.length + " results found")}
                            </span>
                        </span>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                        <Card.Body className="col-12 float-left">
                            <ul className="synonyms-items col-12 p-0 float-left">
                                {props.synonymsData.map((synonymItem, index) => (
                                    <li className="word-item mx-2 my-1" key={`syn_ ${index}`}>
                                        <button type="button" data-tip data-for={`tooltip_syn_${index}`}> {synonymItem.baseWord.word} </button>
                                        <ReactTooltip id={`tooltip_syn_${index}`} type="info" >
                                            <span>Number of transitive synonyms <strong>{synonymItem.wordRelatedSynonyms.length}</strong></span>
                                        </ReactTooltip>
                                    </li>
                                ))}
                            </ul>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
            <Accordion className="col-12 text-left p-0">
                <Card className="result-box second-level-results">
                    <Accordion.Toggle as={Card.Header} eventKey="1">
                        <span className={`result-title ${!props.numberOfTransitiveSynonyms?"no-results":""}`}>
                            Transitive synonyms
                                    <span className="results-number float-right">
                                {!props.numberOfTransitiveSynonyms ? "No results found" : (props.numberOfTransitiveSynonyms + " results found")}
                            </span>
                        </span>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="1">
                        <Card.Body className="col-12 float-left">
                            <ul className="synonyms-items col-12 p-0 float-left">
                                {props.synonymsData.map((synonymItem,parentIndex) => (
                                    synonymItem.wordRelatedSynonyms.map((relatedWord, index) => (
                                        <li className="word-item mx-2 my-1" key={`rel_ ${index}_${parentIndex}`}>
                                            <button type="button" data-tip data-for={`tooltip_t_${index}_${parentIndex}`}> {relatedWord.word} </button>
                                            <ReactTooltip place="top" id={`tooltip_t_${index}_${parentIndex}`} type="info">
                                                <span>Synonym from <strong>{synonymItem.baseWord.word}</strong></span>
                                            </ReactTooltip>
                                        </li>
                                    ))
                                ))}
                            </ul>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
        </div>
    )
}

export default CardList;