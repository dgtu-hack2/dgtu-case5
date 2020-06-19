const express = require("express");
const hostname = '10.0.0.4'; //'127.0.0.1';
const port = 8080;
const app = express();

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
 
// создаем парсер для данных в формате json
const jsonParser = express.json();

var mongo = require('mongodb');

var MongoClient = require('mongodb').MongoClient;
var mongoDbUrl = "mongodb://localhost:27017/mydb";
var dbo = null;
var dbName = "test";
var dgtuCollection = "testcol";

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
    });
}

/* MONGO DB TEST CRUD */

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
        return result;
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

/* API */
/*среднее время очереди личного кабинета*/
app.get("/api/getDiagram", jsonParser, function (request, response) {
     dbo.collection(dgtuCollection).find({}).toArray(function (err, results) {
        if (err) throw err;
         console.log(request.connection.remoteAddress) //определение ip со стороны клиента
        console.log("SELECT VALUE:", results);
        response.send(results);
    });
});

app.post("/api/postURL", jsonParser, function (request, response) {
    var requestBody = request.body;
});

/*HH REQUESTS*/
app.post("/api/hhInfo/:text", jsonParser, function (request, response) {
    const query = req.query;
    console.log(query)
    var requestBody = request.body;
    //https://api.hh.ru/vacancies?text=
});


/*server start */
app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});