const admin = require('firebase-admin');
const { AuthenticationError } = require('apollo-server-express');

async function getUserFromRequest(req) {
    const token = req.headers['x-auth-token'] || '';
   
    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        const user = {
            id: decodedToken.uid
        };

        return user;
    } catch(err) {
        throw new AuthenticationError('Invalid token.');
    }

}

module.exports = {
    getUserFromRequest
}