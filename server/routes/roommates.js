const express = require('express'); 
const router = express.Router(); 
const queryDataBase = require('../db/sqlserver.js'); 
const verifyToken = require('./auth'); 
const Joi = require('joi');

const requestSchema = {
    recipientId: Joi.string().required()
}; 

const acceptRejectSchema = {
    accept: Joi.boolean().required()
}; 


router.get('/', (req, res) => {
    const idToken = req.header('x-auth-token'); 
    if(!idToken) return res.status(401).send('No auth token.'); 

    verifyToken(idToken, decodedToken => {
        let query = `EXEC GetUserRoommates @userId = ${decodedToken.uid}`; 

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

router.get('/requests', (req, res) => {
    const idToken = req.header('x-auth-token'); 
    if(!idToken) return res.status(401).send('No auth token.'); 

    verifyToken(idToken, decodedToken => {
        let query = `EXEC GetRoomateRequests @userId = ${decodedToken.uid}`; 
            
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

router.post('/requests', (req, res) => {
    const idToken = req.header('x-auth-token'); 
    if(!idToken) return res.status(401).send('No auth token.'); 

    const { error, value } = Joi.validate(req.body, requestSchema, { stripUnknown : true }); 
    if(error) res.status(400).send(error.message);

    verifyToken(idToken, decodedToken => {
        let query = `EXEC CreateRoommateRequest @requesterId = ${decodedToken.uid}, @recipientId = '${value.recipientId}'`; 

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

router.get('/requests/:id', (req, res) => {
    const idToken = req.header('x-auth-token'); 
    if(!idToken) return res.status(401).send('No auth token.'); 

    verifyToken(idToken, decodedToken => {
        let query = `EXEC GetRoomateRequest @requestId = '${req.params.id}'`; 
            
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

router.put('/requests/:id', (req, res) => {
    const idToken = req.header('x-auth-token'); 
    if(!idToken) return res.status(401).send('No auth token.'); 

    const { error, value } = Joi.validate(req.body, acceptRejectSchema, { stripUnknown : true }); 
    if(error) res.status(400).send(error.message);

    verifyToken(idToken, decodedToken => {
        let query = `EXEC AcceptRoomateRequest @requestId = '${req.params.id}', @accept = ${value.accept}`; 

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

router.get('/expenses/notifications', (req, res) => {
    const idToken = req.header('x-auth-token'); 
    if(!idToken) return res.status(401).send('No auth token.'); 

    verifyToken(idToken, decodedToken => {
        let query = `EXEC GetRoommateExpenseNotifications @expenseTo = ${decodedToken.uid}`; 
        if(req.query.year && req.query.month)
            query += `, @date = '${+req.query.year}-${+req.query.month}-01'`;
            
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

router.get('/expenses/:id', (req, res) => {
    const idToken = req.header('x-auth-token'); 
    if(!idToken) return res.status(401).send('No auth token.'); 

    verifyToken(idToken, decodedToken => {
        console.log(req.header('expenseFrom'));
        let query = `EXEC GetRoommateExpenses @expenseTo = ${decodedToken.uid}, @expenseFrom = ${req.params.id}`; 
        if(req.query.year && req.query.month)
            query += `, @date = '${+req.query.year}-${+req.query.month}-01'`;
            
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

module.exports = router; 