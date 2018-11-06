const db = require("./LaceDatabase");
const fs = require("fs");
const express = require('express');
const app = express();
var bodyParser = require('body-parser');
const nCrypto = require("native-crypto");
app.use(express.static('public'));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile('index.html');
});
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/key', (req, res) => {
    res.sendFile(__dirname + '/public/privateKey.json');
});

app.post('/', (req, res) => {
    let signature = JSON.parse(req.body.signature);
    let sigBuffer = Buffer.from(signature.data);
    console.log(sigBuffer);
    fs.readFile("public/publicKey.json", null, (err, data) => {
        verify(req.body.solecial, req.body.candidate, sigBuffer, JSON.parse(data)).then((status) => {
            if (status) {
                db.vote(req.body.solecial, req.body.candidate);
                res.sendFile(__dirname + '/public/index.html');
                db.getWinner().then((winner) => {
                    console.log("the current winner is: " + winner)
                })
            }
            else {
                res.send("SIGNATURE CHECK ERROR!")
            }
        })

    });
});


db.initDatabase(false).then(() => {
}); // Just make sure its ready before the first vote comes in

app.listen(3000, () => console.log('Lace open on port 3000!'));

async function verify(solecialID, candidate, signature, key) {
    let data = solecialID.toString() + candidate.toString();
    var verifier = new nCrypto.Signature(key, signature);
    verifier.update(data);
    return await verifier.verify();
}

async function sign(solecialID, candidate, key) {
    let data = solecialID.toString() + candidate.toString();
    var signer = new nCrypto.Signature(key);
    signer.update(data);
    return await signer.sign();
}


