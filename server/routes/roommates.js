const express = require('express'); 
const router = express.Router(); 
const queryDataBase = require('../db/sqlserver.js'); 
const verifyToken = require('./auth'); 
const toCamel = require('../middleware/toCamel'); 

router.get('/', (req, res) => {
    const idToken = req.header('x-auth-token'); 
    if(!idToken) return res.status(401).send('No auth token.'); 

    verifyToken(idToken, decodedToken => {
        let query = `EXEC GetUserRoommates @userId = ${decodedToken.uid}`; 

        const result = queryDataBase(query); 
        result.then(record => {
            res.body = record.recordset; 
            res.send(toCamel(record.recordset)); 
        })
        .catch(err => {
            console.log(err.message)
            res.status(500).send('Error completing request to server. '); 
        })
    }, err => {
        res.status(401).send('Invalid token. ');         
    });
}); 

module.exports = router; 