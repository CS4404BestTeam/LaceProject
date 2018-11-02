const db = require("./LaceDatabase");

const express = require('express');
const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile('index.html');
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
