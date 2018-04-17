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
                requests: action.roommateRequests,
            }; 
        case actionTypes.GET_ROOMATES: 
            return {
                ...state,
                mates: action.mates,
            }; 
        default: 
            return {
                ...state
            }; 
    }
}; 

export default reducer; 