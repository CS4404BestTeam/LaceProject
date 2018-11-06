const db = require("./LaceDatabase");
const fs = require("fs");
const express = require('express');
const app = express();
var bodyParser = require('body-parser');
const nCrypto = require("native-crypto");

let key;

app.use(express.static('public'));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.get('/', (req, res) => {
    res.sendFile('index.html');
});
app.get('/key', (req, res) => {
    res.sendFile(__dirname + '/public/privateKey.json');
});

app.post('/vote', (req, res) => {
    console.log(req.body.vote);
    fs.readFile("public/publicKey.json", null, async (err, data) => {
        if (await verify(req.body.vote.solecial, req.body.vote.candidate, req.body.vote.signature, JSON.parse(data))) {
            db.vote(req.body.vote.solecial, req.body.vote.candidate);
            res.sendFile(__dirname + '/public/index.html');
        }
        else {
            res.send("SIGNATURE CHECK ERROR!")
        }
    });
});


db.initDatabase(false).then(() => {
    db.getRegisteredVoters().then(async (voters) => {
        fs.readFile("public/privateKey.json", null, async (err, data) => {
            console.log(data);
            console.log(await sign(1234, "Evan", JSON.parse(data)))
        })
    })
});

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

