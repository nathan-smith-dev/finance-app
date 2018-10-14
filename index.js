require('dotenv').config();
const express = require('express'); 
const helmet = require('helmet'); 
const cors = require('cors'); 
const verifyToken = require('./routes/auth');
const path = require('path'); 
const { connect } = require('./db/postgres');

const expenses = require('./routes/expenses'); 
const incomes = require('./routes/incomes'); 
const transactions = require('./routes/transactions'); 
const roommates = require('./routes/roommates'); 
const categories = require('./routes/categories'); 
const users = require('./routes/users'); 

const app = express(); 
connect();

app.use(express.json()); 
app.use(helmet()); 
app.use(cors({ origin: true, allowedHeaders: ['x-auth-token', 'Content-Type'] }));
  

app.use('/api/expenses', expenses); 
app.use('/api/incomes', incomes); 
app.use('/api/transactions', transactions); 
app.use('/api/roommates', roommates); 
app.use('/api/users', users); 
app.use('/api/categories', categories); 

app.get('/api/temp', (req, res) => {
    const idToken = req.header('x-auth-token'); 
    if(!idToken) res.status(401).send('No auth token.'); 
    verifyToken(idToken, decodedToken => {
        res.send(decodedToken); 
    })
}); 

app.use(express.static('client/build'));
app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')));

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Listening on port: ${port}`); 
}); 