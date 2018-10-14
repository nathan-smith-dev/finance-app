import { firebaseAuth, provider } from './firebase';
import { store } from '../index';
import * as authActions from '../store/actions/auth'; 


// SignIn with Google
export const signInWithRedirect = () => firebaseAuth.signInWithRedirect(provider);

// SignOut
export const signOut = () => firebaseAuth.signOut(); 

// Get Redirect Results
export const getRedirectResults = () => firebaseAuth.getRedirectResult();

// Listen for SignIn and SignOut
export const authChangeListener = () => firebaseAuth.onAuthStateChanged(authUser => {
    store.dispatch(authActions.getProfile(authUser)); 
}); 

export const withAuth = (func) => {
    firebaseAuth.currentUser.getIdToken(/* forceRefresh */ true)
        .then(idToken => {
            func(idToken); 
        }).catch(error => {
            console.log(error); 
        });
}; 
