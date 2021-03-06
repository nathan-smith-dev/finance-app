import * as actionTypes from '../actions/actionTypes'; 

const initialState = {
    requests: null, 
    mates: null, 
    focusedRoommate: null,
    notifications: {}, 
    mateTransactions: [], 
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
        case actionTypes.SET_ROOMMATE_NOTIFICATIONS: 
            return {
                ...state,
                notifications: action.notifications,
            }; 
        case actionTypes.GET_ROOMATE_TRANS_TO_AND_FROM: 
            return {
                ...state,
                focusedRoommate: {
                    ...state.focusedRoommate, 
                    // transactionsTo: [...state.focusedRoommate.transactionsTo], 
                    transactionsToAndFrom: action.transactions
                },
            }; 
        case actionTypes.GET_ROOMATES_TRANSACTIONS: 
            return {
                ...state,
                mateTransactions: action.transactions,
            }; 
        default: 
            return {
                ...state
            }; 
    }
}; 

export default reducer; 