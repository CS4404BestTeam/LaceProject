const db = require("./LaceDatabase");

const express = require('express');
const app = express();
var bodyParser = require('body-parser')
app.use(express.static('public'));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.get('/', (req, res) => {
    res.sendFile('index.html');
});

app.post('/', (req, res) => {
    console.log("got vote" + JSON.stringify(req.body))
    db.vote(req.body.solecial,req.body.candidate)
    res.sendFile(__dirname +'/public/index.html');
});


db.initDatabase(false).then(()=>{
   db.register(1234,1234);
   db.getRegisteredVoters().then((voters)=>{
       voters.forEach((vote)=>{
           console.log(db.Voter.toVoter(vote))
       })
   })
});

app.listen(3000, () => console.log('Lace open on port 3000!'));
