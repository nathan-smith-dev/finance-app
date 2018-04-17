import * as actionTypes from '../actions/actionTypes'; 

const initialState = {
    requests: null, 
    mates: null, 
    focusedRoommate: null, 
    transactionsTo: [],     
    transactionsFrom: [],     
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
        case actionTypes.GET_ROOMATE_TRANS_FROM: 
            return {
                ...state,
                focusedRoommate: {
                    ...state.focusedRoommate, 
                    // transactionsTo: [...state.focusedRoommate.transactionsTo], 
                    transactionsFrom: action.transactions
                },
            }; 
        case actionTypes.GET_ROOMATE_TRANS_TO: 
            return {
                ...state,
                focusedRoommate: {
                    ...state.focusedRoommate, 
                    // transactionsFrom: [...state.focusedRoommate.transactionsFrom],                     
                    transactionsTo: action.transactions
                },
            }; 
        default: 
            return {
                ...state
            }; 
    }
}; 

export default reducer; 