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
    db.vote(req.body.solecial,req.body.candidate)
    res.sendFile(__dirname +'/public/index.html');
    db.getWinner().then((winner)=>{
        console.log("the current winner is: " + winner)
    })

});


db.initDatabase(false).then(()=>{
   db.getRegisteredVoters().then((voters)=>{
       voters.forEach((vote)=>{
           console.log(db.Voter.toVoter(vote))
       })
   })
});

app.listen(3000, () => console.log('Lace open on port 3000!'));
