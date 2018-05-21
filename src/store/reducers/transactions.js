import * as actionTypes from '../actions/actionTypes'; 

const today = new Date(); 

const initialState = {
    userTransactions: {}, 
    transactionDetails: {}, 
    transactionCategories: [], 
    transactionIds: [],
    trackedDates: {
        year: today.getFullYear(), 
        month: today.getMonth() + 1
    }, 
    loadingTransactions: true, 
    incomes: [],
    expenses: [],
    transactions: [],
    categorizedExpenses: [],
    filters: {
        dates: [], 
        categories: []
    }, 
    net: {
        incomes: 0,
        expenses: 0
    },
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
        case actionTypes.GET_USER_INCOMES: 
            return {
                ...state, 
                incomes: action.incomes
            }; 
        case actionTypes.GET_USER_EXPENSES: 
            return {
                ...state, 
                expenses: action.expenses
            }; 
        case actionTypes.GET_USER_INCOMES_AND_EXPENSES: 
            return {
                ...state, 
                transactions: action.transactions
            }; 
        case actionTypes.GET_USER_CATEGORIZED_EXPENSES: 
            return {
                ...state, 
                categorizedExpenses: action.categorizedExpenses
            }; 
        case actionTypes.GET_FILTER_DATE: 
            return {
                ...state, 
                filters: {...state.filters, dates: action.date}
            }; 
        case actionTypes.GET_FILTER_CATEGORIES: 
            return {
                ...state, 
                filters: {...state.filters, categories: action.categories}
            }; 
        case actionTypes.GET_NET_TRANSACTIONS: 
            return {
                ...state, 
                net: { incomes: action.net.incomes, expenses: action.net.expenses }
            }; 
        default: 
            return {
                ...state, 
                trackedDates: {...state.trackedDates},                
            }; 
    }
}; 

export default reducer; 