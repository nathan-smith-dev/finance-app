import * as actionTypes from '../actions/actionTypes'; 

const initialState = {
    requests: null, 
    mates: null
}; 

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.GET_ROOMATE_REQUESTS: 
            return {
                ...state,
                roommateRequests: action.roommateRequests,
            }; 
        default: 
            return {
                ...state
            }; 
    }
}; 

export default reducer; 