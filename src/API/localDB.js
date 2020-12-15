import { WORDS_STORAGE_NAME } from "../Constants"

function saveDataToStorage(data) {
    localStorage.setItem(WORDS_STORAGE_NAME, JSON.stringify(data));
}
function loadDataFromStorage() {
    let wordData = localStorage.getItem(WORDS_STORAGE_NAME);
    if (wordData !== 'undefined' && wordData)
        wordData = JSON.parse(wordData)
    else
        wordData = []

    return wordData;
}
function clearDataFromStorage() {
    localStorage.removeItem(WORDS_STORAGE_NAME);
}
function getTransitiveWordByText(text, collection) {    
    let word = { word: '', score: '',approved: false}
    collection.forEach((baseWord) => {
        if (baseWord.word.toLowerCase() == text.toLowerCase()) {
            word = baseWord
        }
        else {
            word.word = text
            word.score = 'N/A'
        }
    });
    return word;
}
function getWordObjectByText(text, collection) {
    let word = { baseWord: { word: '', score: '' }, wordRelatedSynonyms: [], approved: false, syn_for: [] }
    collection.forEach((baseWord) => {
        if (baseWord.word.toLowerCase() === text.toLowerCase()) {
            word.baseWord = baseWord
            word.approved = baseWord.approved
        }
        else {
            word.baseWord.word = text
            word.baseWord.score = 'N/A'
        }
    });
    return word;
}
function checkIfWordExists(words, word) {
    return words.some(function (el) {
        return el.baseWord.word === word;
    });
}
function getBaseSynonyms(word, collection) {
    let results = [];
    collection.forEach((baseWord) => {
        if (word.toLowerCase() === baseWord.word.toLowerCase()) {
            baseWord.syn_for.forEach((item) => {
                let baseSynonym = getWordObjectByText(item, collection);
                if (baseSynonym.baseWord.syn_for) {
                    baseSynonym.baseWord.syn_for.forEach((transitiveSyn) => {
                        if (transitiveSyn.toLowerCase() !== baseWord.word.toLowerCase()){
                            let transitiveWord = getTransitiveWordByText(transitiveSyn, collection)
                            if(transitiveWord.approved)
                                baseSynonym.wordRelatedSynonyms.push(transitiveWord)
                        }
                            
                    });
                }
                if (!checkIfWordExists(results, baseSynonym.baseWord.word))
                    results.push(baseSynonym)
            });
        }
    });
    return results;
}
function getSynonymsForWord(word, collection) {
    let synonymList = []
    collection.forEach((item) => {
        if ((item.syn_for.includes(word.toLowerCase()) && item.approved) || word.toLowerCase() === item.word.toLowerCase())
            synonymList.push(item);
    });
    return synonymList;
}
export default {
    saveDataToStorage,
    loadDataFromStorage,
    clearDataFromStorage,
    getSynonymsForWord,
    getBaseSynonyms
};
