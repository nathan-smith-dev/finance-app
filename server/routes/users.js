const express = require('express'); 
const router = express.Router(); 
const queryDataBase = require('../db/sqlserver.js'); 
const verifyToken = require('./auth'); 
const Joi = require('joi'); 

const schema = {
    id: Joi.string(), 
    email: Joi.string(), 
    firstName: Joi.string(),
    lastName: Joi.string()
}; 

router.get('/', (req, res) => {
    const idToken = req.header('x-auth-token'); 
    if(!idToken) return res.status(401).send('No auth token.'); 

    verifyToken(idToken, decodedToken => {
        let query = `EXEC GetAllUsers`; 

        const result = queryDataBase(query); 
        result.then(record => {
            res.body = record.recordset; 
            res.send(record.recordset); 
        })
        .catch(err => {
            console.log(err.message);
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
        console.log(req.params.id); 
        let query = `EXEC GetUser @userId = '${req.params.id}'`; 

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

router.post('/', (req, res) => {
    const idToken = req.header('x-auth-token'); 
    if(!idToken) return res.status(401).send('No auth token.'); 

    const { error, value } = Joi.validate(req.body, schema, { stripUnknown : true }); 
    if(error) res.status(400).send(error.message);

    verifyToken(idToken, decodedToken => {
        let query = `EXEC CreateUser @id = '${value.id}', , @fName = '${value.firstName}', @lName = '${value.lastName}', @email = '${value.email}'`; 

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