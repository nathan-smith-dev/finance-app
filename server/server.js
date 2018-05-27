const express = require('express'); 
const helmet = require('helmet'); 
const cors = require('cors'); 
const verifyToken = require('./routes/auth');

const expenses = require('./routes/expenses'); 
const incomes = require('./routes/incomes'); 
const transactions = require('./routes/transactions'); 
const roommates = require('./routes/roommates'); 
const categories = require('./routes/categories'); 

const app = express(); 

app.use(express.json()); 
app.use(helmet()); 
app.use(cors({ origin: true, allowedHeaders: ['x-auth-token', 'Content-Type'] }));
  

app.use('/api/expenses', expenses); 
app.use('/api/incomes', incomes); 
app.use('/api/transactions', transactions); 
app.use('/api/roommates', roommates); 
app.use('/api/categories', categories); 

app.get('/api/temp', (req, res) => {
    const idToken = req.header('x-auth-token'); 
    if(!idToken) res.status(401).send('No auth token.'); 
    verifyToken(idToken, decodedToken => {
        res.send(decodedToken); 
    })
}); 

app.use('/roommates', express.static(__dirname + '/build'));
app.use(express.static(__dirname + '/build'));

const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`Listening on port: ${port}`); 
})