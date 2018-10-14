const express = require('express'); 
const router = express.Router(); 
const { getCountOfTransactionsByDate, getCountOfTransactionCategories } = require('../db/postgres');
const { getUserIncomesAndExpenses } = require('../db/postgres');
const verifyToken = require('./auth'); 

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

        getUserIncomesAndExpenses(decodedToken.uid, date, categoryName)
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

router.get('/dates', (req, res) => {
    const idToken = req.header('x-auth-token'); 
    if(!idToken) return res.status(401).send('No auth token.'); 

    verifyToken(idToken, decodedToken => {
        const today = new Date();
        let date = `'${today.getFullYear()}-${today.getMonth() + 1}-01'`;
        if(req.query.year && req.query.month)
            date = `'${+req.query.year}-${+req.query.month}-01'`;

        getCountOfTransactionsByDate(decodedToken.uid, date)
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

router.get('/categories', (req, res) => {
    const idToken = req.header('x-auth-token'); 
    if(!idToken) return res.status(401).send('No auth token.'); 

    verifyToken(idToken, decodedToken => {
        const today = new Date();
        let date = `'${today.getFullYear()}-${today.getMonth() + 1}-01'`;
        if(req.query.year && req.query.month)
            date = `'${+req.query.year}-${+req.query.month}-01'`;

        getCountOfTransactionCategories(decodedToken.uid, date)
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

module.exports = router; 