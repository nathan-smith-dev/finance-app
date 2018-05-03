import * as actionTypes from '../actions/actionTypes'; 

const today = new Date(); 

const initialState = {
    userTransactions: {}, 
    transactionDetails: {}, 
    transactionCategories: [], 
    transactionIds: [],
    trackedDates: {
        year: today.getFullYear(), 
        month: today.getMonth()
    }, 
    loadingTransactions: true
}; 

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.CHANGE_TRANSACTION_DATES: 
            return {
                ...state,
                trackedDates: {
                    year: action.year, 
                    month: action.month
                }
            }; 
        case actionTypes.GET_USER_TRANSACTIONS_SUCCESS: 
            return {
                ...state,
                trackedDates: {...state.trackedDates},
                userTransactions: action.userTransactions
            }; 
        case actionTypes.GET_USER_CATEGORIES: 
            return {
                ...state,
                trackedDates: {...state.trackedDates},                
                transactionCategories: action.transactionCategories, 
                transactionIds: action.transactionIds
            }; 
        case actionTypes.GET_USER_TRANSACTIONS_FAILED: 
            // console.log('failed'); 
            return {
                ...state,
                userTransactions: -1, 
                trackedDates: {...state.trackedDates},                
            }; 
        case actionTypes.GET_USER_TRANSACTIONS: 
            // console.log('get transactions');         
            return {
                ...state, 
                trackedDates: {...state.trackedDates},
                loadingTransactions: action.loading                
            }; 
        case actionTypes.FLATTEN_TRANSACTION_DATA: 
            return {
                ...state, 
                trackedDates: {...state.trackedDates},                
                transactionDetails: action.details
            }; 
        case actionTypes.GET_ANNUAL_USER_TRANSACTIONS: 
            return {
                ...state, 
                annualDetails: action.details
            }; 
        default: 
            return {
                ...state, 
                trackedDates: {...state.trackedDates},                
            }; 
    }
}; 

export default reducer; 