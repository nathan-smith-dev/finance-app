const express = require('express'); 
const helmet = require('helmet'); 
const verifyToken = require('./routes/auth');

const expenses = require('./routes/expenses'); 
const incomes = require('./routes/incomes'); 
const roommates = require('./routes/roommates'); 
const categories = require('./routes/categories'); 

const app = express(); 

app.use(express.json()); 
app.use(helmet()); 
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, x-auth-token");
    next();
});
  

app.use('/api/expenses', expenses); 
app.use('/api/incomes', incomes); 
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