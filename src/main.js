const idb = require('idb');

// DOM elements
const inputRecord = document.querySelector('button')
const itemDescription = document.querySelector('#item-description')
const itemValue = document.querySelector('#item-value')

const listName = document.querySelector('#list-name')
const listCreateButton = document.querySelector('button#list-create')

var dbPromise = idb.open('spend-lists',1, (upgradeDb)=>{

    // check which lists are already there

    // decide on what the new list is OR open the last


    switch(upgradeDb.oldVersion){
        case 0:
            var keyValStore = upgradeDb.createObjectStore('lists');
            keyValStore.put([{description: "hamburger", cost: 2.40}], "firstList")
    }
})


// utility functions
const addRecord = (listKey, description, cost)=>{
    return getList("firstList").then((listArray)=>{
        listArray.push({description: description, cost:cost })
        return listArray 
    }).then((updatedList)=>{
        return dbPromise.then((db)=>{
            var tx = db.transaction('lists', 'readwrite')
            var keyvalStore = tx.objectStore('lists')
            keyvalStore.put(updatedList, "firstList")
            return tx.complete;
        })
    })
}

var createList = (listName)=>{
    return dbPromise.then(function(db){
        var tx= db.transaction('keyval')
    })
}

var getList = (listKey)=>{
    return dbPromise.then((db)=>{
        var tx = db.transaction('lists');
        var keyvalStore = tx.objectStore('lists')
        return keyvalStore.get(listKey)
    })
}

inputRecord.addEventListener('click', ()=>{
    console.log("adding a record")

    //console.log(`key: ${recordKey.value} || value: ${recordValue.value}`)
    addRecord('firstList',  "hat", 34).then(()=>{console.log("record added")})
    //addRecord('keyval',itemDescription.value, itemValue.value)
})


listCreateButton.addEventListener('click',()=>{

})
