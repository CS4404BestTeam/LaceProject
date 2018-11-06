const express = require('express');
const app = express();
var bodyParser = require('body-parser');
const nCrypto = require("native-crypto");
const fs = require("fs");

let key;
fs.readFile("public/privateKey.json",null,(err,data)=>{
    key = JSON.parse(data);
});

app.use(express.static('public'));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.post('/', (req, res) => {
    sign(req.body.vote.solecial, req.body.vote.candidate, key).then((signature)=>{
        res.send(JSON.stringify(signature))
    });
});

app.listen(3002, () => console.log('SigningService on Port 3002!'));

async function sign(solecialID, candidate, key) {
    let data = solecialID.toString() + candidate.toString();
    var signer = new nCrypto.Signature(key);
    signer.update(data);
    return await signer.sign();
}

