import * as actionTypes from '../actions/actionTypes'; 


const initialState = {
    userTransactions: {}
}; 

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.GET_USER_TRANSACTIONS_SUCCESS: 
            return {
                ...state,
                userTransactions: action.transactions
            }; 
        case actionTypes.GET_USER_TRANSACTIONS_FAILED: 
            // console.log('failed'); 
            return {
                ...state
            }; 
        case actionTypes.GET_USER_TRANSACTIONS: 
            console.log('get transactions');         
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