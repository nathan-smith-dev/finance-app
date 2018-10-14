const express = require('express'); 
const router = express.Router(); 
const { createUser, getAllUsers, getUser } = require('../db/postgres');
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
        getAllUsers()
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
        getUser(req.params.id)
        .then(result => {
            res.body = result;
            res.status(200).send(result);
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
        createUser(value.id, value.firstName, value.lastName, value.email)
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