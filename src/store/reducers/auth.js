import * as actionTypes from '../actions/actionTypes'; 
import Auth from '../../Auth/Auth';



const initialState = {
    auth: new Auth(), 
    userProfile: {}
}; 

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.GET_PROFILE_SUCCESS: 
            // console.log('success', action.userProfile); 
            return {
                ...state,
                userProfile: action.userProfile
            }; 
        case actionTypes.GET_PROFILE_FAILED: 
            // console.log('failed'); 
            return {
                ...state
            }; 
        case actionTypes.SET_AUTH_PROFILE: 
            console.log('set auth profile');         
            return {
                ...state
            }; 
        default: 
            return {
                ...state
            }; 
    }
}; 

export default reducer; 