const idb = require('idb');

// DOM elements
const inputRecord = document.querySelector('button')
const itemDescription = document.querySelector('#item-description')
const itemValue = document.querySelector('#item-value')

const listName = document.querySelector('#list-name')
const listCreateButton = document.querySelector('button#list-create')
const listShowButton = document.querySelector('button#list-show')
const changeListInput = document.querySelector('#change-list-name')
const changeListButton = document.querySelector('#change-list-button')

// variables
let currentList;

var dbPromise = idb.open('spend-lists',2, (upgradeDb)=>{
    switch(upgradeDb.oldVersion){
        case 0:
            var listStore = upgradeDb.createObjectStore('purchased-items', {autoIncrement: true});
            listStore.createIndex('by-list', "listName")
        case 1:
            var listNameStore = upgradeDb.createObjectStore('list-names');
            listNameStore.put(true,"Default List")
    }
})


// utility functions
const addRecord = (listName, description, cost)=>{
    return dbPromise.then((db)=>{
        var tx = db.transaction('purchased-items', 'readwrite')
        var listStore = tx.objectStore('purchased-items')
        listStore.put( {listName: listName, description: description, price: cost})
        return tx.complete;
    })
}

var createList = (listName)=>{
    return dbPromise.then((db)=>{
        var tx = db.transaction('list-names', 'readwrite')
        var listNameStore = tx.objectStore('list-names')
        listNameStore.put(true, listName)
        return tx.complete
    })
}

var changeList = (listName)=>{
    return getList(listName).then((listObject)=>{
        if(listObject != undefined){
            currentList = listName;
            return true
        }else{
            return false
        }
    })
}

var getList = (listName)=>{
    return dbPromise.then((db)=>{
        var tx = db.transaction('list-names')
        var listNameStore = tx.objectStore('list-names')
        return listNameStore.get(listName)
    })
}

let getListNames =()=>{
    return dbPromise.then((db)=>{
        var tx = db.transaction('list-names')
        var listStore = tx.objectStore('list-names')
        return listStore.getAllKeys()
    })
}


// events

inputRecord.addEventListener('click', ()=>{
    console.log("adding a record")
    console.log(`active list : ${activeList}`)
    //console.log(`key: ${recordKey.value} || value: ${recordValue.value}`)
    addRecord(activeList, itemDescription.value, itemValue.value ).then(()=>{console.log("record added")})
    //addRecord('keyval',itemDescription.value, itemValue.value)
})


listCreateButton.addEventListener('click',()=>{
    createList(listName.value)
})

listShowButton.addEventListener('click',()=>{
    getListNames().then((reply)=>{
        console.log(reply)
    })
})

changeListButton.addEventListener('click', ()=>{
    changeList(changeListInput.value).then((isListChanged)=>{
        console.log(`list changed - ${isListChanged}`)
    })
})