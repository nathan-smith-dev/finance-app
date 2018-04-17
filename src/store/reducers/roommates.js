import * as actionTypes from '../actions/actionTypes'; 

const initialState = {
    requests: null, 
    mates: null, 
    focusedRoommate: null
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
        case actionTypes.SET_FOCUSED_ROOMMATE: 
            return {
                ...state,
                focusedRoommate: action.roommate,
            }; 
        default: 
            return {
                ...state
            }; 
    }
}; 

export default reducer; 