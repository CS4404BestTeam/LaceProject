CREATE TABLE registered_voters (
    SolecialID INTEGER PRIMARY KEY,
    RegistrarEmployeeID integer NOT NULL,
    RegistrationTime DATETIME DEFAULT CURRENT_TIME
);

CREATE TABLE ballots (
    SolecialID INTEGER PRIMARY KEY,
    CandidateName VARCHAR(100),
    VoteTime DATETIME DEFAULT CURRENT_TIME
);