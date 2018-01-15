const idb = require('idb');

// DOM elements
const inputRecord = document.querySelector('button')
const itemDescription = document.querySelector('#item-description')
const itemValue = document.querySelector('#item-value')

const listName = document.querySelector('#list-name')
const listCreateButton = document.querySelector('button#list-create')
const listShowButton = document.querySelector('button#list-show')

// things to do with the list
const listNames = ['firstList']
let activeList = listNames[0]


var dbPromise = idb.open('spend-lists',1, (upgradeDb)=>{
    switch(upgradeDb.oldVersion){
        case 0:
            var listStore = upgradeDb.createObjectStore('purchased-items', {autoIncrement: true});
            listStore.createIndex('by-list', "listName")
    }


    console.log(` ${upgradeDb.oldVersion}`)
})

console.log(`database open: ${dbPromise}`)


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

var createList = (listName)=>{
    if(!listNames.includes(listName)){
        listNames.push(listName)
        activeList = listName
    }
}

var getList = (listName)=>{
    
}

let getListNames =()=>{
    return listNames
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
    console.log(getListNames())
})