import * as actionTypes from '../actions/actionTypes'; 

const initialState = {
    userProfile: {}, 
    allUsers: {}
}; 

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.GET_PROFILE_SUCCESS: 
            // console.log('success', action.userProfile); 
            // if(action.userProfile) {
            //     return; 
            // }
            return {
                ...state,
                userProfile: action.userProfile
            }; 
        case actionTypes.GET_ALL_USERS: 
            return {
                ...state, 
                allUsers: action.allUsers
            }; 
        default: 
            return {
                ...state
            }; 
    }
}; 

export default reducer; 