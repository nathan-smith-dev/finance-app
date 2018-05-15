const express = require('express'); 
const router = express.Router(); 
const queryDataBase = require('./db/sqlserver.js'); 
const verifyToken = require('./auth'); 

router.get('/', (req, res) => {
    const idToken = req.header('x-auth-token'); 
    if(!idToken) return res.status(401).send('No auth token.'); 
    verifyToken(idToken, decodedToken => {
        const result = queryDataBase(`SELECT Expenses.Amount, Categories.Name, Expenses.Date, Expenses.Description
        FROM Expenses
        JOIN Categories ON Expenses.CategoryID = Categories.CategoryID
        WHERE Expenses.UserID = '${decodedToken.uid}'`); 
        result.then(record => {
            res.send(record.recordset); 
        })
        .catch(err => {
            console.log(err.message)
        })
    });
}); 

module.exports = router; 