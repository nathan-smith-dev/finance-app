import * as actionTypes from '../actions/actionTypes'; 


const initialState = {
    userTransactions: {}, 
    transactionDetails: {}, 
    transactionCategories: []
}; 

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.GET_USER_TRANSACTIONS_SUCCESS: 
            return {
                ...state,
                userTransactions: action.userTransactions
            }; 
        case actionTypes.GET_USER_CATEGORIES: 
            return {
                ...state,
                transactionCategories: action.transactionCategories
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
        case actionTypes.FLATTEN_TRANSACTION_DATA: 
            return {
                ...state, 
                transactionDetails: action.details
            }; 
        default: 
            return {
                ...state
            }; 
    }
}; 

export default reducer; 