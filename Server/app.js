const express = require("express");
 const hostname = '10.0.0.4';
// FOR LOCAL
//const hostname = '127.0.0.1';
const port = 8080;
const app = express();
const http = require('http');
const https = require('https');
const {
    spawn
} = require('child_process');

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
// FOR LOCAL
//var mongoDbUrl = "mongodb://168.63.61.94:27017/mydb";
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
        //console.log("1 document updated");
        deleteAllFromCollection();
    });
}

function deleteAllFromCollection() {
    var queryToDelete = {};
    dbo.collection(dgtuCollection).deleteMany(queryToDelete, function (err, obj) {
        if (err) throw err;
        //console.log("All documents deleted");

    });
}

/* API */
/*среднее время очереди личного кабинета*/
app.get("/api/getDiagram", jsonParser, function (request, response) {
    dbo.collection(dgtuCollection).find({}).toArray(function (err, results) {
        if (err) throw err;
        //var address = request.connection.remoteAddress;
        //if(!address.startsWith('127')){
        //    console.log('bad request')
        //}
        //console.log(request.connection.remoteAddress) //определение ip со стороны клиента
        //console.log("SELECT VALUE:", results);
        response.send(results);
    });
});

app.post("/api/postURL", jsonParser, function (request, response) {
    var requestBody = request.body;
});

app.get("/api/getPrograms", jsonParser, function (request, response) {
    var query = {
        item: "Progs"
    };
    dbo.collection(dgtuCollection).find(query).toArray(function (err, result) {
        if (err) throw err;

        //console.log(result);
        response.send(result);
    });
});

app.get("/api/getGraphsFunctions", jsonParser, function (request, response) {
    var query = {
        item: "FuncGraphs"
    };
    dbo.collection(dgtuCollection).find(query).toArray(function (err, result) {
        if (err) throw err;

        //console.log(result);
        response.send(result);
    });
});

// TODO fix дубль /api/getAllCompetitions
app.get("/api/getCompetitionList", jsonParser, function (request, response) {
    var pks = request.body;
    var query = {
        item: "PKs"
    };
    dbo.collection(dgtuCollection).find(query).toArray(function (err, result) {
        if (err) throw err;
        var list = [];
        var pksList = result;
        response.send(pksList);
        
    });
});

/*PYTHON EXECUTE*/
app.post("/api/executePython", jsonParser, function (req, res) {
    var dataToSend;
    // spawn new child process to call the python script

    const python = spawn('python', ['../translate.py', req.body.url]);
    // collect data from script
    python.stdout.on('data', function (data) {
        dataToSend = data.toString();
    });
    // // in close event we are sure that stream from child process is closed
    python.on('close', (code) => {
        console.log(`child process close all stdio with code ${code}`);
        // send data to browser
        res.send(dataToSend);
    });
});

app.get("/api/getStudents", jsonParser, function (request, response) {
    var query = {
        item: "Students"
    };
    dbo.collection(dgtuCollection).find(query).toArray(function (err, result) {
        if (err) throw err;
        
        //console.log(result);
        response.send(result);
    });
});

// TODO fix дубль /api/getCompetitionList
app.get("/api/getAllCompetitions", jsonParser, function (request, response) {
    var query = {
        item: "PKs"
    };
    dbo.collection(dgtuCollection).find(query).toArray(function (err, result) {
        if (err) throw err;

        //console.log(result);
        response.send(result);
    });
});
         


/*server start */
app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});