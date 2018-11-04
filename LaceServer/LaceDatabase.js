const fs = require('fs');
const sqlite3 = require('sqlite3');
let db = undefined;

exports.register = function(ssn, registrarID) {
    let sql = "INSERT INTO registered_voters(SolecialID, RegistrarEmployeeID) VALUES ('" + ssn + "','" + registrarID + "')";
    return new Promise((resolve, reject) => {
        db.exec(sql, (err) => {
            if (err) {
                console.log("An Error Occurred: " + err.message);
                resolve(false);
            } else {
                console.log(ssn + " successfully registered by " + registrarID);
                resolve(true);
            }
        });
    });
};

exports.getRegisteredVoters = function() {
    let sql = "SELECT * FROM registered_voters";
    return new Promise((resolve, reject) =>
    {
        db.all(sql, [], (err, rows) => {
            if (err) reject(err);

            let voters = [];
            rows.forEach((row) => {
                voters.push(new exports.Voter(row.SolecialID, row.RegistrarEmployeeID, row.RegistrationTime))
            });
            resolve(voters)
        });
    });
};

exports.wipeRegisteredVoters = function() {
    let sql = "DELETE FROM registered_voters";
    return new Promise((resolve, reject)=>{
        db.run(sql, [], (err)=>{
            if (err) reject(err);
            else resolve()
        });
    });
};


exports.vote = function(ssn, candidate) { // TODO Make sure the ssn is registered before allowing them  to vote
    let sql = "INSERT INTO ballots(SolecialID, CandidateName) VALUES ('" + ssn + "','" + candidate + "')";
    return new Promise((resolve, reject) => {
        db.exec(sql, (err) => {
            if (err) {
                console.log("An Error Occurred: " + err.message);
                resolve(false);
            } else {
                console.log(ssn + " successfully voted for " + candidate);
                resolve(true);
            }
        });
    });
};

exports.getVotes = function() {
    let sql = "SELECT * FROM ballots";
    return new Promise((resolve, reject) =>
    {
        db.all(sql, [], (err, rows) => {
            if (err) reject(err);

            let votes = [];
            rows.forEach((row) => {
                votes.push(new Ballot(row.SolecialID, row.CandidateName, row.VoteTime))
            });
            resolve(votes)
        });
    });
};

exports.wipeBallots = function() {
    let sql = "DELETE FROM ballots";
    return new Promise((resolve, reject)=>{
        db.run(sql, [], (err)=>{
            if (err) reject(err);
            else resolve()
        });
    });
};


exports.Voter = class{
    constructor(SolecialID, RegistrarEmployeeID, RegistrationTime){
        this.SolecialID = SolecialID;
        this.RegistrarEmployeeID = RegistrarEmployeeID;
        this.RegistrationTime = RegistrationTime;
    }

    static toVoter(obj) {
        return new exports.Voter(obj.SolecialID, obj.RegistrarEmployeeID, obj.RegistrationTime);
    }
};

exports.Ballot = class{
    constructor(SolecialID, CandidateName, VoteTime) {
        this.SolecialID = SolecialID;
        this.CandidateName = CandidateName;
        this.VoteTime = VoteTime;
    }

    static toBallot(obj) {
        return new Ballot(obj.SolecialID, obj.CandidateName, obj.VoteTime)
    }

};

exports.initDatabase = function(createDB = false) {
    return new Promise((resolve, reject)=>{
        db = new sqlite3.Database("LaceDatabase.db", (err) => {
            if (err) {
                console.log("An error occurred when loading the DB: " + err.message);
                reject(err);
            }
            if (createDB) {
                fs.readFile("createTable.sql", "", (err, data) => {
                    console.log(data.toString());
                    db.exec(data.toString());
                });
            }
            resolve()
        });
    });
};

exports.getWinner = function () {
    let sql = "SELECT CandidateName FROM ballots GROUP BY CandidateName ORDER BY COUNT(*) DESC LIMIT 1";
    return new Promise((resolve, reject)=>{
        db.all(sql, [], (err, rows) => {
            if (err) reject(err);

            let winner = '';
            rows.forEach((row) => {
                db.all(sql, [], (err, rows) => {
                    if (err) reject(err);
                    winner = rows[0].CandidateName;
                    resolve(rows[0].CandidateName)
                });
            });
            resolve(rows[0].CandidateName)
        });
    });
}

exports.getResults = function () {
    let sql = "SELECT * FROM ballots";
    return new Promise((resolve, reject)=>{
        db.all(sql, [], (err, rows) => {
            if (err) reject(err);

            let candidates = {};
            db.all(sql, [], (err, rows) => {
              if (err) {
                throw err;
              }
              rows.forEach((row) => {
                if(!candidates[row.CandidateName]){
                  candidates[row.CandidateName] = 1;
                } else {
                  candidates[row.CandidateName] += 1;
                }
              });
              resolve(getHighest(candidates))
            });
        });
    });
}

function getHighest(candidates){
  var winners = [];
  var winVal = 0;
  Object.keys(candidates).forEach((key) =>{
    if(candidates[key] > winVal){
      winVal = candidates[key];
      winners = [key]
    }else if(candidates[key] == winVal){
      winners.push(key)
    }
  })
  return winners
}
