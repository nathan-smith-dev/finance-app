const express = require('express'); 
const router = express.Router(); 
const { 
    createExpense, 
    getUserExpenses, 
    getExpense, 
    getTotalIncomesAndExpenes,
    updateExpense, 
    deleteExpense
} = require('../db/postgres');
const verifyToken = require('./auth'); 
const Joi = require('joi'); 

const schema = {
    amount: Joi.number().required().positive(),
    date: Joi.date().required(), 
    desc: Joi.string().allow(''), 
    categoryId: Joi.string().guid().required()
}; 

const formatDate = (date) => {
    const adjustedDate = calcTimezoneOffset(date); 
    return `${adjustedDate.getFullYear()}-${adjustedDate.getMonth() + 1}-${adjustedDate.getDate()}`; // add one to month because 0 index 
}

const calcTimezoneOffset = (date) => {
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() + userTimezoneOffset); 
}

router.get('/', (req, res) => {
    const idToken = req.header('x-auth-token'); 
    if(!idToken) return res.status(401).send('No auth token.'); 

    verifyToken(idToken, decodedToken => {
        const today = new Date();
        let date = `'${today.getFullYear()}-${today.getMonth() + 1}-01'`;
        let categoryName;
        if(req.query.year && req.query.month)
            date = `'${+req.query.year}-${+req.query.month}-01'`; 
        if(req.query.category)
            categoryName = req.query.category; 

        getUserExpenses(decodedToken.uid, date, categoryName)
        .then(result => {
            res.body = result;
            res.status(200).send(result);
        })
        .catch(err => {
            console.log(err.message); 
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
        createExpense(decodedToken.uid, value.amount, value.desc, formatDate(value.date), null, value.categoryId)
        .then(result => {
            res.body = result[0]; 
            res.status(200).send(result[0]);  
        })
        .catch(err => {
            console.log(err.message)
            res.status(500).send('Error completing request to server. '); 
        })
    }, err => {
        res.status(401).send('Invalid token. ');         
    });
}); 

router.get('/totals', (req, res) => {
    const idToken = req.header('x-auth-token'); 
    if(!idToken) return res.status(401).send('No auth token.'); 

    verifyToken(idToken, decodedToken => {
        let forYear = false;
        const today = new Date();
        let date = `'${today.getFullYear()}-${today.getMonth() + 1}-01'`;
        if(req.query.year && req.query.month)
            date = `'${+req.query.year}-${+req.query.month}-01'`; 
        else if(req.query.annual)
            forYear = true; 

        getTotalIncomesAndExpenes(decodedToken.uid, date, forYear)
        .then(result => {
            res.body = result;
            res.status(200).send(result);
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
        getExpense(req.params.id)
        .then(result => {
            res.body = result[0];
            res.status(200).send(result[0]);
        })
        .catch(err => {
            console.log(err.message)
            res.status(500).send('Error completing request to server. '); 
        })
    }, err => {
        res.status(401).send('Invalid token. ');         
    });
}); 

router.delete('/:id', (req, res) => {
    const idToken = req.header('x-auth-token'); 
    if(!idToken) return res.status(401).send('No auth token.'); 

    verifyToken(idToken, decodedToken => {
        deleteExpense(req.params.id)
        .then(result =>{
            res.body = result[0],
            res.status(200).send(result[0])
        })
        .catch(err => {
            console.log(err.message)
            res.status(500).send('Error completing request to server. '); 
        })
    }, err => {
        res.status(401).send('Invalid token. ');         
    });
}); 

router.put('/:id', (req, res) => {
    const idToken = req.header('x-auth-token'); 
    if(!idToken) return res.status(401).send('No auth token.'); 

    const { error, value } = Joi.validate(req.body, schema, { stripUnknown : true }); 
    if(error) res.status(400).send(error.message);

    verifyToken(idToken, decodedToken => {
        updateExpense(req.params.id, value.amount, formatDate(value.date), value.desc, value.categoryId)
        .then(result => {
            res.body = result[0];
            res.status(200).send(result[0]);
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