import * as actionTypes from '../actions/auth'; 
import Auth from '../../Auth/Auth';



const initialState = {
    auth: new Auth()
}; 

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.AUTH: 
            return {
                type: action.type, 
                auth: action.auth
            }; 
        default: 
            return {
                ...state
            }; 
    }
}; 

export default reducer; 