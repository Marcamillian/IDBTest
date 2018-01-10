const idb = require('idb');

// DOM elements
const inputRecord = document.querySelector('button')
const itemDescription = document.querySelector('#item-description')
const itemValue = document.querySelector('#item-value')

const listName = document.querySelector('#list-name')
const listCreateButton = document.querySelector('button#list-create')
const listShowButton = document.querySelector('button#list-show')


var dbPromise = idb.open('spend-lists',1, (upgradeDb)=>{

    // check which lists are already there

    // decide on what the new list is OR open the last

    var listStore = upgradeDb.createObjectStore('lists', 1 , {keyPath:'id'});
    listStore.put([{description: "hamburger", cost: 2.40}])
    
})


// utility functions
const addRecord = (listKey, description, cost)=>{
    return getList("firstList").then((listArray)=>{
        listArray.push({description: description, cost:cost })
        return listArray 
    }).then((updatedList)=>{
        return dbPromise.then((db)=>{
            var tx = db.transaction('lists', 'readwrite')
            var listStore = tx.objectStore('lists')
            listStore.put(updatedList, "firstList")
            return tx.complete;
        })
    })
}

var createList = (listName)=>{
    return dbPromise.then(function(db){
        var tx= db.transaction('lists', 'readwrite')
        var listStore = tx.objectStore('lists')
        listStore.put({}, listName)
        return tx.complete
    })
}

var getList = (listKey)=>{
    return dbPromise.then((db)=>{
        var tx = db.transaction('lists');
        var listStore = tx.objectStore('lists')
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

    //console.log(`key: ${recordKey.value} || value: ${recordValue.value}`)
    addRecord('firstList',  "hat", 34).then(()=>{console.log("record added")})
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