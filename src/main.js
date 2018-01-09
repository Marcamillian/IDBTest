const idb = require('idb');

let dbPromise = idb.open('test-db', 4, (upgradeDb)=>{
    switch(upgradeDb.oldVersion){
        case 0:
            var keyValStore = upgradeDb.createObjectStore('keyval');
            keyValStore.put("world", "hello")
    }
})

// DOM elements
let inputRecord = document.querySelector('button')
let recordKey = document.querySelector('#record-key')
let recordValue = document.querySelector('#record-value')

// utility functions
const addRecord = (key, value)=>{
    return dbPromise.then(function(db){
        var tx = db.transaction('keyval', 'readwrite')
        var keyvalStore = tx.objectStore('keyval')
        
        keyvalStore.put(value, key)
        return tx.complete
    })
}

inputRecord.addEventListener('click', ()=>{
    console.log("adding a record")

    console.log(`key: ${recordKey.value} || value: ${recordValue.value}`)

    addRecord(recordKey.value, recordValue.value)
})
