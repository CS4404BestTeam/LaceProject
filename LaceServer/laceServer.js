const db = require("./LaceDatabase");

const express = require('express');
const app = express();
var bodyParser = require('body-parser')
const ursa = require("ursa");

var key = ursa.generatePrivateKey(1024, 65537);

app.use(express.static('public'));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.get('/', (req, res) => {
    res.sendFile('index.html');
});

app.post('/vote', (req, res) => {
    db.vote(req.body.vote.solecial,req.body.vote.candidate)
    res.sendFile(__dirname +'/public/index.html');
});


db.initDatabase(false).then(()=>{
   db.getRegisteredVoters().then((voters)=>{
       voters.forEach((vote)=>{
           console.log(db.Voter.toVoter(vote))
       })
   })
});

app.listen(3000, () => console.log('Lace open on port 3000!'));

function verify(solecialID, candidate, signature){
    let data = solecialID.toString() + candidate.toString();
    var verify = ursa.createVerifier("RSA-SHA256");
    verify.update(data);
    let status = verify.verify(key,signature,'hex');
    return status;
}

function sign(solecialID, candidate){
    let data = solecialID.toString() + candidate.toString();
    var signer = ursa.createSigner("RSA-SHA256");
    signer.update(data);
    let signature = signer.sign(key, 'hex');
    return signature;
}