const admin = require('firebase-admin'); 

const serviceAccount = require('../serviceAccountKey.json'); 

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://react-finance-f20df.firebaseio.com'
});

const verifyToken = (token, callback, err) => {
    admin.auth().verifyIdToken(token)
        .then(function(decodedToken) {
            callback(decodedToken); 
        }).catch(function(error) {
            err(error); 
        });
}; 

module.exports = verifyToken; 