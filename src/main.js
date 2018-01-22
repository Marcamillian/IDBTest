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

const listnameShowList = document.querySelector('#listname-show-list')

const listitemShowButton = document.querySelector('#listitem-show-button')
const listitemShowList = document.querySelector('#listitem-show-list')

// variables
let activeList;

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


// IDB functions
const addRecord = (listName, description, cost)=>{
    return dbPromise.then((db)=>{
        var tx = db.transaction('purchased-items', 'readwrite')
        var listStore = tx.objectStore('purchased-items')
        listStore.put( {listName: listName, description: description, price: cost})
        return tx.complete;
    })
}

const createList = (listName)=>{
    return dbPromise.then((db)=>{
        var tx = db.transaction('list-names', 'readwrite')
        var listNameStore = tx.objectStore('list-names')
        listNameStore.put(true, listName)
        return tx.complete
    })
}

const changeList = (listName)=>{
    return getList(listName).then((listObject)=>{
        if(listObject != undefined){
            activeList = listName;
            return true
        }else{
            return false
        }
    })
}

const getList = (listName)=>{
    return dbPromise.then((db)=>{
        var tx = db.transaction('list-names')
        var listNameStore = tx.objectStore('list-names')
        return listNameStore.get(listName)
    })
}

const getListNames =()=>{
    return dbPromise.then((db)=>{
        var tx = db.transaction('list-names')
        var listStore = tx.objectStore('list-names')
        return listStore.getAllKeys()
    })
}

const getListItems = (listName = "Default List")=>{
    return dbPromise.then((db)=>{
        var tx = db.transaction('purchased-items')
        var purchasedItemStore = tx.objectStore('purchased-items')
        return Promise.all([
            purchasedItemStore.getAll(),
            purchasedItemStore.getAllKeys()
        ])
    }).then((purchasedItemDetails)=>{
        return purchasedItemDetails[0].map((itemValues, index)=>{
            itemValues.storeKey = purchasedItemDetails[1][index]
            return itemValues
        }).filter((itemDetails)=>{
            return itemDetails.listName == listName
        })
    })
}

const deletePurchasedItem = (itemKey)=>{
    return dbPromise.then((db)=>{
        var tx = db.transaction('purchased-items', 'readwrite')
        var purchasedItemStore = tx.objectStore('purchased-items')
        return purchasedItemStore.delete(itemKey)
    })
}

const deleteList = (listKey)=>{
    // delete all the items with that list named

    // delete the list
}



// UI functions - pure functions
const listButtonGen = (listName = "Default List", callback = ()=>{console.log(`list changed: ${listName}`)})=>{
    let listItem = document.createElement('li')

    listItem.innerText = listName;
    listItem.addEventListener('click',()=>{
        changeList(listName).then(callback)
    })

    return listItem;
}

const purchasedItemGen = ({description = 'Missing Item', price = 0, storeKey = undefined} = {})=>{
    let listItem = document.createElement('li')
    let deleteButton = document.createElement('button')

    deleteButton.innerText = " - "
    deleteButton.addEventListener("click", ()=>{
        deletePurchasedItem(storeKey).then(()=>{
            updateListItemDisplay()
        })  
    })

    listItem.innerText = `${description} -  £${price}`
    listItem.appendChild(deleteButton)

    return listItem
}

const removeListItems = (element)=>{
    let listItems = element.querySelectorAll('li')
    listItems.forEach((li)=>{li.parentNode.removeChild(li)})
    return element
}

// === IMPLEMENTION SPECIFIC DETAILS === 

const updateListItemDisplay = ()=>{
    console.log(`updating list items`)
    getListItems(activeList).then((purchasedListItems)=>{
        // clear the list
        removeListItems(listitemShowList)
        purchasedListItems.forEach((listItem)=>{
            listitemShowList.appendChild(purchasedItemGen(listItem))
        })
    })
}
const updateListNameDisplay = ()=>{
    // clear the list of items
    removeListItems(listnameShowList)
    // populate the list is the listnames in the database
    return getListNames().then((names)=>{
        names.forEach((listName)=>{
            listnameShowList.appendChild(listButtonGen(listName, updateListItemDisplay))
        })

        return true
    })
}


// set the active list
getListNames().then((names)=>{
    activeList = names[0]
    updateListNameDisplay()
})


// events
inputRecord.addEventListener('click', ()=>{
    console.log("adding a record")
    console.log(`active list : ${activeList}`)
    //console.log(`key: ${recordKey.value} || value: ${recordValue.value}`)
    addRecord(activeList, itemDescription.value, itemValue.value ).then(()=>{
        console.log("record added")
        updateListItemDisplay()
    })
    //addRecord('keyval',itemDescription.value, itemValue.value)
})


listCreateButton.addEventListener('click',()=>{
    createList(listName.value).then(()=>{
        updateListNameDisplay()
    })
})

/*
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

listitemShowButton.addEventListener('click', ()=>{
    updateListItemDisplay()
})
*/


