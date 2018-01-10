const idb = require('idb');

// DOM elements
const inputRecord = document.querySelector('button')
const itemDescription = document.querySelector('#item-description')
const itemValue = document.querySelector('#item-value')

const listName = document.querySelector('#list-name')
const listCreateButton = document.querySelector('button#list-create')
const listShowButton = document.querySelector('button#list-show')

// things to do with the list
const listNames = new Set(['firstList'])
let activeList = 'firstList'


var dbPromise = idb.open('spend-lists',1, (upgradeDb)=>{
    var listStore = upgradeDb.createObjectStore('purchased-items', {autoIncrement: true});
    listStore.createIndex('by-list', "listName")
})


// utility functions
const addRecord = (listName, description, cost)=>{

    console.log(`description: ${description} cost: ${cost}`)
    return dbPromise.then((db)=>{
        var tx = db.transaction('purchased-items', 'readwrite')
        var listStore = tx.objectStore('purchased-items')
        listStore.put( {listName: listName, description: description, price: cost})
        return tx.complete;
    })
}
try{
    addRecord("someList", "hat", 50).then(()=>{
        console.log("added a default thing")
    })
}catch(err){
    console.log(`something couldn't be added ${err.message}`)
}


var createList = (listName)=>{
    listNames.push(listName)

}

var getList = (listKey)=>{
    return dbPromise.then((db)=>{
        var tx = db.transaction('purchased-items');
        var listStore = tx.objectStore('purchased-items')
        return listStore.get(listKey)
    })
}

let getListNames =()=>{
    return dbPromise.then((db)=>{
        var tx = db.transaction('lists');
        var listStore = tx.objectStore('lists')
        console.log(listStore.indexNames)
        return listStore.getAll()
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
    
    createList(listName.value).then(()=>{
        console.log(`List created: ${listName.value}`)
    })
})

listShowButton.addEventListener('click',()=>{
    getListNames().then((lists)=>{
        console.log(lists)
    })
})