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

    db.getResults().then((listOfCands)=>{
        if(listOfCands.length == 1){
          console.log("The winner is " + listOfCands[0] + "!");
        } else {
          candStr = "The winners are ";
          for(var i = 0; i < listOfCands.length; i+=1){
            if(i==0){//first
              candStr += listOfCands[i];
            }
            else if(i==listOfCands.length-1){// last
              candStr += " and " + listOfCands[i];
            }
            else{ //middle
              candStr += ", " + listOfCands[i];
            }
          }
          console.log(candStr + "!");
        }

    })

});


db.initDatabase(false).then(()=>{
    db.wipeBallots().then(
        db.getRegisteredVoters().then((voters)=>{
            voters.forEach((vote)=>{
                console.log(db.Voter.toVoter(vote))
            })
    }))

});

app.listen(3000, () => console.log('Lace open on port 3000!'));
