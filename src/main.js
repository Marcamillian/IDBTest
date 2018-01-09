const idb = require('idb');

let dbPromise = idb.open('test-db', 4, (upgradeDb)=>{
    switch(upgradeDb.oldVersion){
        case 0:
            var keyValStore = upgradeDb.createObjectStore('keyval');
            keyValStore.put("world", "hello")
            
    }
})

// DOM elements
const inputRecord = document.querySelector('button')
const recordKey = document.querySelector('#record-key')
const recordValue = document.querySelector('#record-value')

// utility functions
const addRecord = (storeKey, key, value)=>{
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

    addRecord('keyval',recordKey.value, recordValue.value)
})
