const express = require('express'); 
const router = express.Router(); 
const { 
    createUserCategory, 
    getUserCategories, 
    getUserCategoryTotals, 
    getAllCategories, 
    getUserCategory, 
    deleteUserCategory
} = require('../db/postgres');
const verifyToken = require('./auth'); 
const Joi = require('joi'); 

const schema = {
    category: Joi.string().max(50).required()
}; 

router.get('/', (req, res) => {
    const idToken = req.header('x-auth-token'); 
    if(!idToken) return res.status(401).send('No auth token.'); 

    verifyToken(idToken, decodedToken => {
        getUserCategories(decodedToken.uid)
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
    if(error) return res.status(400).send(error.message);

    verifyToken(idToken, decodedToken => {
        createUserCategory(value.category, decodedToken.uid)
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
        const today = new Date();
        let date = `'${today.getFullYear()}-${today.getMonth() + 1}-01'`;
        let forYear = false;
        if(req.query.year && req.query.month)
            date = `'${+req.query.year}-${+req.query.month}-01'`;
        else if(req.query.annual)
            forYear = true;

        getUserCategoryTotals(decodedToken.uid, date, forYear)
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

router.get('/all', (req, res) => {
    const idToken = req.header('x-auth-token'); 
    if(!idToken) return res.status(401).send('No auth token.'); 

    verifyToken(idToken, decodedToken => {
        getAllCategories()
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
        getUserCategory(decodedToken.uid, req.params.id)
        .then(result => {
            res.body = result[0];
            res.status(200).send(result[0]);
        })
        .catch(err => {
            console.log(err.message);
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
        deleteUserCategory(decodedToken.uid, req.params.id)
        .then(result => {
            result.body = result[0];
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