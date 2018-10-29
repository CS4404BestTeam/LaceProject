const express = require('express');
const app = express();

// app.get('/', (req, res) => {
//     res.sendFile('index.html');
// });

app.use(express.static('public'))

app.listen(3000, () => console.log('Lace open on port 3000!'));
