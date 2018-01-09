const idb = require('idb');

let dbPromise = idb.open('spend-list', 4, (upgradeDb)=>{
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

const listName = document.querySelector('#list-name')
const listCreateButton = document.querySelector('button#list-create')

// utility functions
const addRecord = (storeKey, key, value)=>{
    return dbPromise.then(function(db){
        var tx = db.transaction('keyval', 'readwrite')
        var keyvalStore = tx.objectStore('keyval')
        
        keyvalStore.put(value, key)
        return tx.complete
    })
}

const createList = (listName)=>{
    return idb.open('spend-list', 4, (upgradeDb)=>{
        
        // create a new list with the list name
        var newStore = upgradeDb.createObjectStore(listName)
        newStore.put("new", "store")
    })
}

const showRecords = ()=>{
    return dbPromise.then(function(db){
        var tx = db.transaction('keyval')
        var keyvalStore = tx.objectStore('keyval')
        keyvalStore.getAll()
    }).then( (wholeList) => {
        console.log(`all of the things in the list ${wholeList}`)
    })
}

inputRecord.addEventListener('click', ()=>{
    console.log("adding a record")

    console.log(`key: ${recordKey.value} || value: ${recordValue.value}`)

    //addRecord('keyval',recordKey.value, recordValue.value)

    createList("something")
})


listCreateButton.addEventListener('click',()=>{
    console.log("trying to create a list")
    //dbPromise = createList("someList")

    showRecords()
})
