const express = require("express");
const hostname = '10.0.0.4'; //'127.0.0.1';
const port = 8080;
const app = express();
const mongo = require('./mongo');

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
 
// создаем парсер для данных в формате json
const jsonParser = express.json();

/* API */
/*среднее время очереди личного кабинета*/
app.get("/api/getDenisovId", jsonParser, function (request, response) {
    response.send("DENISOV IS ALIVE");
    var myobj = {
        name: "VALUE",
        address: 12
    };
    mongo.insertValue(myobj);
});

app.post("/api/postURL", jsonParser, function (request, response) {
    var requestBody = request.body;
});

/*server start */
app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});