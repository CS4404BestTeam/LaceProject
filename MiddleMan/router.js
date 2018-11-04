
const express = require('express');
const app = express();
var querystring = require('querystring');
var bodyParser = require('body-parser')
var http = require("http");
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.get('/', (routerReq, routerRes) => {
    var indexOptions = {
        host: 'localhost',
        port: 3000,
        path: '/',
        method: "GET"
    }
    var indexReq = http.request(indexOptions, function(res) {

        var responseString = "";


        res.on("data", function (data) {
            responseString += data;
        });
        res.on("end", function () {
            routerRes.send(responseString)
        });
    })
    indexReq.write("");
    indexReq.end()
});

app.post('/', (routerReq, routerRes) => {
    console.log("got vote: "+JSON.stringify(routerReq.body))
    var data = querystring.stringify(routerReq.body);

    var options = {
        host: 'localhost',
        port: 3000,
        path: '/',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(data)
        }
    };

    var httpreq = http.request(options, function (response) {
        response.setEncoding('utf8');
        var responseString = ''
        response.on('data', function (data) {
            responseString += data;
        });
        response.on('end', function() {
            routerRes.send(responseString);
        })
    });
    httpreq.write(data);
    httpreq.end();
});

app.listen(3001, () => console.log('Router open on port 3001!'));
