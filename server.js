const admin = require('firebase-admin'); 
const express = require('express'); 
const helmet = require('helmet'); 

const app = express(); 

const serviceAccount = {
    "type": "service_account",
    "project_id": "react-finance-f20df",
    "private_key_id": "72e004bb4aa34dd142a61e658832b92d220570c8",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDjXbCeoHjV2Y4S\n1FNHshcSDqh9H5GEqi7Nteo0ElTZC6UMo1EeRN0HOJzCfegDX61hCCDuhiPRMkrK\nNHjiS0Mr/ItNssWSfXNzWFLjYtIiPUgu5Y6c3BSHsqOgPc5shq0Z0YMTiv5P9kib\nrtlN3gNbo5FqRKyIs+MTEnMYThB3aIcFDQSTYV2TIKZrvfPo4bLgcZWTWCi8yW8V\n5hER2YfxvpGtdd7tv40tIeaDo40QVoss5d1YG5e9WhzhUbFOvybHtj+aqMn1Tlei\nWmSgI9NTffyqCR9NfCcidyO5GQT0JQHIlePQ6Z7NdJVlIpkrsyBYeOjnwm3VXXn5\nDCuI3xErAgMBAAECggEAXx2MLCgUtN2w1ka12jnx9c9lBAcnULkDIHKYWhVLIouB\nDhLqdf+3+XPg/GpAm9y0QvHsGOzL4hGogQPHiF+U57tcKXJ+vaQ2novWDSMDpmg9\noMTOzucwvX3pfrkseHE0zCa+L3hHoHr28A4LAUy92eHJDQxSo1OhzJI8zO+natPp\nJ5pZ0D02VaMxav9GV1UhUHuSF9nXCFI2zcvlzfY7bDKzeD0rOCBp5QQGtctSQbLK\ngBeu3rNDUui72qu+JEiL2nCp2WBw9ETZA4y/5FJNcUdk23eHuGNcknq5La5vm2/T\nR7UtJI/G3uKgDNOsiEVAGwcjQ1INB6zbqdxbFgdrRQKBgQD44eA19aOjrWrpGuqH\nDhSGIRhOG7nylikPGMg0fZuGf+lCLg+KpyDitbPnnsMBUAQaDZhXPk/WRW5JnGbn\nJC96PuBkJmI9oEAvA20dLu2I1yay1HqoeLJ+bhAKaQDouRehzSIrEiHB9x45tCw/\nmMMd6xaoAWrzuk4UWs40IDoSFwKBgQDp3km51uswgfBn+XG9B5a6DyvDWj44Eqkk\nQv3UHuOODtAsYn/BZSboh0tzH6DGfjBseStZYVL8KqrVjsoXfBWt0r23neFpRwvb\n6PYDyYFPZ+EmWmy4ue63CzgyB6wCDLc/vpFRbcsMHtx9uzoLAl4xRUgpd8T6gxlW\nkZzsj0rKDQKBgAHFCWUY1AsL5qC1skk3jmnNvnB/vfi9nJkg4fuNkReJvUzdKvsf\naRpzlE3nURenTAArbJPiO4sYf0pCtHCcT0IdRFcx9qzdgNdUvOfiN4orjXjkDeM4\nyHwhqDeKu5jsCAD8hmur+1V3vl1GrLHfEjQaQdT7/ZiyEHAQnTq9p+wNAoGAHygR\nFGQQgy7cc02lHHTVXMZGo0jzfw7lX8JZBJh04mkQzMj2kjJCo7nakGTHS4pmMx1V\nbBvuLVAV4EucmtJaJQUtZzfuXtMrPknj9I803fpN4YkscNO8fMBO5UNmZAODqkde\nHsYMxfmakFmQGwVevRuoyHV/VYx/pKvThyRz50UCgYEA0S/ufEEh9/k8pl1AHRXn\n1AlbcPvHc8NewXo/gqkHTO4G8paKwOw6l0h4TmHZuHiZwof/6VjtKnKZ3KbqBMpQ\nxNARDKTNfyJb1IK3+O+PvTzMZkhTQ446h3y3wQsvghDgSSk8OilLzzl3/OhjSGN+\ndote7lJZAQ1/vqFACqdlv/U=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-vlftk@react-finance-f20df.iam.gserviceaccount.com",
    "client_id": "116866014862577966991",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://accounts.google.com/o/oauth2/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-vlftk%40react-finance-f20df.iam.gserviceaccount.com"
}; 
  
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://react-finance-f20df.firebaseio.com'
});

app.use(express.json()); 
app.use(helmet()); 

app.get('/api/temp', (req, res) => {
    const idToken = req.header('x-auth-token'); 
    if(!idToken) res.status(401).send('No auth token.'); 
    admin.auth().verifyIdToken(idToken)
        .then(function(decodedToken) {
            var uid = decodedToken.uid;
            console.log(decodedToken)
            res.send(uid); 
        }).catch(function(error) {
            // Handle error
        });
}); 

app.use('/roommates', express.static(__dirname + '/build'));
app.use(express.static(__dirname + '/build'));

const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`Listening on port: ${port}`); 
})