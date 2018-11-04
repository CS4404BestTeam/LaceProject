
const express = require('express');
const app = express();
var reqLib = require('request')
var bodyParser = require('body-parser')
var http = require("http");
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

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
        console.log(responseString)

        globalRouterRes.send(responseString)
    });
})

var globalRouterRes;

app.get('/', (routerReq, routerRes) => {
    console.log("got req");
    indexReq.write("");
    globalRouterRes = routerRes
    indexReq.end()
});


var postOptions = {
    host: 'localhost',
    port: 3000,
    path: '/vote',
    method: "POST"

}
var postReq = http.request(postOptions, function(res) {

    var responseString = "";

    res.on("data", function (data) {
        responseString += data;
    });
    res.on("end", function () {
        console.log(responseString)
        globalPostRouterRes.send(responseString)
    });
})

var globalPostRouterRes;

app.post('/vote', (routerReq, routerRes) => {

    console.log(routerReq.body)

    postReq.write(JSON.stringify(routerReq.body));
    //postReq.write("vote[solecial]=10&vote[candidate]=abrd");
    globalPostRouterRes = routerRes
    postReq.end()
});

app.listen(3001, () => console.log('Router open on port 3001!'));
