const express = require('express'); 
const router = express.Router(); 
const queryDataBase = require('../db/sqlserver.js'); 
const verifyToken = require('./auth'); 

router.get('/', (req, res) => {
    const idToken = req.header('x-auth-token'); 
    if(!idToken) return res.status(401).send('No auth token.'); 

    verifyToken(idToken, decodedToken => {
        let query = `EXEC GetUserIncomes @userId = ${decodedToken.uid}`; 
        if(req.query.year && req.query.month)
            query += `, @date = '${+req.query.year}-${+req.query.month}-01'`
        if(req.query.category)
            query += `, @categoryName = ${req.query.category}`

        const result = queryDataBase(query); 
        result.then(record => {
            res.body = record.recordset; 
            res.send(record.recordset); 
        })
        .catch(err => {
            console.log(err.message)
            res.status(500).send('Error completing request to server. '); 
        })
    }, err => {
        res.status(401).send('Invalid token. ');         
    });
}); 

router.get('/:id', (req, res) => {
    const idToken = req.header('x-auth-token'); 
    if(!idToken) return res.status(401).send('No auth token.'); 

    verifyToken(idToken, decodedToken => {
        console.log(req.params.id)
        let query = `EXEC GetUserIncome @incomeId = '${req.params.id}'`; 

        const result = queryDataBase(query); 
        result.then(record => {
            res.body = record.recordset; 
            res.send(record.recordset); 
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