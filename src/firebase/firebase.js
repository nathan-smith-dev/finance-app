import * as firebase from 'firebase'; 

const config = {
    apiKey: "AIzaSyBHg0EROkE4LBvIavGbe9qa5KIj3AAtoMw",
    authDomain: "react-finance-f20df.firebaseapp.com",
    databaseURL: "https://react-finance-f20df.firebaseio.com",
    projectId: "react-finance-f20df",
    storageBucket: "react-finance-f20df.appspot.com",
    messagingSenderId: "201170765759"
};

if(!firebase.apps.length) {
    firebase.initializeApp(config); 
}

const firebaseAuth = firebase.auth(); 
const provider = new firebase.auth.GoogleAuthProvider(); 
provider.setCustomParameters({
    prompt: 'select_account'
}); 

export {
    firebaseAuth,
    provider
}; 