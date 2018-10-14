const express = require('express'); 
const router = express.Router(); 
const { 
    createRoommateRequest, 
    createRoommateExpense, 
    getUserRoommates, 
    getRoommateExpenseNotifications, 
    getRoommateIncomesAndExpenses,
    getRoomateRequests,
    getRoomateRequest, 
    acceptRoommateRequest,
    updateRoommateExpense,
    deleteRoommate
} = require('../db/postgres');
const verifyToken = require('./auth'); 
const Joi = require('joi');

const formatDate = (date) => {
    const adjustedDate = calcTimezoneOffset(date); 
    return `${adjustedDate.getFullYear()}-${adjustedDate.getMonth() + 1}-${adjustedDate.getDate()}`; // add one to month because 0 index 
}

const calcTimezoneOffset = (date) => {
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() + userTimezoneOffset); 
}

const requestSchema = {
    recipientId: Joi.string().required()
}; 

const acceptRejectSchema = {
    accept: Joi.boolean().required()
}; 

const rommateExpenseSchema = {
	categoryId: Joi.string().guid(),
	amount: Joi.number(), 
	date: Joi.date(), 
	desc: Joi.string().allow(''), 
	acknowledged: Joi.bool(),
    resolved: Joi.bool(), 
    roommateId: Joi.string().length(28)
}; 


router.get('/', (req, res) => {
    const idToken = req.header('x-auth-token'); 
    if(!idToken) return res.status(401).send('No auth token.'); 

    verifyToken(idToken, decodedToken => {
        getUserRoommates(decodedToken.uid)
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

router.get('/requests', (req, res) => {
    const idToken = req.header('x-auth-token'); 
    if(!idToken) return res.status(401).send('No auth token.'); 

    verifyToken(idToken, decodedToken => {
        getRoomateRequests(decodedToken.uid)
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

router.post('/requests', (req, res) => {
    const idToken = req.header('x-auth-token'); 
    if(!idToken) return res.status(401).send('No auth token.'); 

    const { error, value } = Joi.validate(req.body, requestSchema, { stripUnknown : true }); 
    if(error) res.status(400).send(error.message);

    verifyToken(idToken, decodedToken => {
        createRoommateRequest(decodedToken.uid, value.recipientId)
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

router.get('/requests/:id', (req, res) => {
    const idToken = req.header('x-auth-token'); 
    if(!idToken) return res.status(401).send('No auth token.'); 

    verifyToken(idToken, decodedToken => {
        getRoomateRequest(req.params.id)
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

router.put('/requests/:id', (req, res) => {
    const idToken = req.header('x-auth-token'); 
    if(!idToken) return res.status(401).send('No auth token.'); 

    const { error, value } = Joi.validate(req.body, acceptRejectSchema, { stripUnknown : true }); 
    if(error) res.status(400).send(error.message);

    verifyToken(idToken, decodedToken => {
        acceptRoommateRequest(req.params.id, value.accept)
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

router.get('/expenses/notifications', (req, res) => {
    const idToken = req.header('x-auth-token'); 
    if(!idToken) return res.status(401).send('No auth token.'); 

    verifyToken(idToken, decodedToken => {
        getRoommateExpenseNotifications(decodedToken.uid, date)
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

router.post('/expenses', (req, res) => {
    const idToken = req.header('x-auth-token'); 
    if(!idToken) return res.status(401).send('No auth token.'); 

    const { error, value } = Joi.validate(req.body, rommateExpenseSchema, { stripUnknown : true }); 
    if(error) res.status(400).send(error.message);

    verifyToken(idToken, decodedToken => {
        createRoommateExpense(value.roommateId, decodedToken.uid, value.amount, value.desc, formatDate(value.date), null, value.categoryId)
        .then(result => {
            res.body = result[0];
            res.status(200).status(result[0]);
        })
        .catch(err => {
            console.log(err.message);
            res.status(500).send('Error completing request to server. '); 
        })
    }, err => {
        res.status(401).send('Invalid token. ');         
    });
}); 

router.put('/expenses/:id', (req, res) => {
    const idToken = req.header('x-auth-token'); 
    if(!idToken) return res.status(401).send('No auth token.'); 

    const { error, value } = Joi.validate(req.body, rommateExpenseSchema, { stripUnknown : true }); 
    if(error) res.status(400).send(error.message);

    verifyToken(idToken, decodedToken => {
        updateRoommateExpense(req.params.id, value.amount, formatDate(value.date), value.desc, value.categoryId, value.resolved, value.acknowledged)
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

router.get('/expenses/user/:id', (req, res) => {
    const idToken = req.header('x-auth-token'); 
    if(!idToken) return res.status(401).send('No auth token.'); 

    verifyToken(idToken, decodedToken => {
        if(req.query.year && req.query.month)
            query += `, @date = '${+req.query.year}-${+req.query.month}-01'`;

        getRoommateIncomesAndExpenses(decodedToken.uid, req.params.id)
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

router.delete('/:id', (req, res) => {
    const idToken = req.header('x-auth-token'); 
    if(!idToken) return res.status(401).send('No auth token.'); 

    verifyToken(idToken, decodedToken => {
        deleteRoommate(req.params.id, decodedToken.uid)
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