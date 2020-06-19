const express = require("express");
var mongo = require('mongodb');
const app = express();

var MongoClient = require('mongodb').MongoClient;

var mongoDbUrl = "mongodb://localhost:27017/mydb";
var dbo = null;

var dbName = "dgtu";

var dgtuCollection = "dgtu";

connectToDataBase();

function connectToDataBase() {
    MongoClient.connect(mongoDbUrl, {
        useUnifiedTopology: true
    }, function (err, db) {
        if (err) throw err;
        dbo = db.db(dbName);
        //dbo.createCollection("test", function (err, res) {
        //    if (err) throw err;
        //    console.log("Collection created!");
        //    insertValue();
        //    //db.close();
        //});
        //insertValue();
    });
}

/* MONGO DB TEST CRUD */

/* EXPORT FUNCTIONS TO MAIN APP */
module.exports = {
    insertValue: function(object) {
        insertValue(object);
    },
    searchOneValue: function(selectValue){
        searchOneValue(selectValue);
    },
    searchAllValues: function(){
        searchAllValues();
    }
}

function insertValue(object) {
    dbo.collection(dgtuCollection).insertOne(myobj, function (err, res) {
        if (err) throw err;
        console.log("Document was inserted: ", object)
    });
}

function searchOneValue(search) {
    /*var query = {
        address: 12
    };*/
    dbo.collection(dgtuCollection).find(query).toArray(function (err, result) {
        if (err) throw err;
        console.log(result);
        db.close();
    });
}

function searchValue() {
    dbo.collection(dgtuCollection).find({}).toArray(function (err, result) {
        if (err) throw err;
        console.log("SELECT VALUE:", result);
        deleteValue();
    });
}

function searchAllValues() {
    dbo.collection(dgtuCollection).find({}).toArray(function (err, result) {
        if (err) throw err;
        console.log("SELECT VALUE:", result);
        deleteValue();
    });
}

function deleteValue() {
    var queryToDelete = {
        address: 12
    };
    dbo.collection(dgtuCollection).deleteOne(queryToDelete, function (err, obj) {
        if (err) throw err;
        console.log("1 document deleted");
        //insertValue();
        updateValue();
    });
}

function updateValue() {
    var queryOfUpdate = {
        address: 12
    };
    var updatedValue = {
        $set: {
            name: "QWERTY",
            address: 13
        }
    };
    dbo.collection(dgtuCollection).updateOne(queryOfUpdate, updatedValue, function (err, res) {
        if (err) throw err;
        console.log("1 document updated");
        deleteAllFromCollection();
    });
}

function deleteAllFromCollection() {
    var queryToDelete = {};
    dbo.collection(dgtuCollection).deleteMany(queryToDelete, function (err, obj) {
        if (err) throw err;
        console.log("All documents deleted");

    });
}
