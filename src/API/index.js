const API_BASE_URL = 'https://api.datamuse.com/words?'
const API_TAGS = {
    meansLike: 'ml=',
    synonyms: 'rel_syn='
}
async function retriveSynonyms(selectedWord) {
    const response = await fetch(API_BASE_URL + API_TAGS.synonyms + selectedWord, {
        "method": "GET",
    })
    const results = await response.json()
    return results;
}
async function getRelatedSynonyms(wordCollection) {
    const promises = wordCollection.map(item => {        
        return fetch(API_BASE_URL + API_TAGS.synonyms + item.word)
    });
    const wordsSynonymsSet = await Promise.all(promises).then(results => {
        return Promise.all(results.map(r=>r.json()))
    }).then(values=>{
        const relatedSynonyms = wordCollection.map((word,index)=>{
            return {baseWord : word, wordRelatedSynonyms : values[index]}
        })
        return relatedSynonyms
    });
    return wordsSynonymsSet
}
export default {
    API_BASE_URL,
    API_TAGS,
    retriveSynonyms,
    getRelatedSynonyms
};
