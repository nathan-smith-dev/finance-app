import * as actionTypes from '../actions/actionTypes'; 

const today = new Date(); 

const initialState = {
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
    userCategories: [],
    allCategories: [], 
    annualData: {
        categorizedExpenses: [],
        netIncomes: 0, 
        netExpenses: 0, 
    }
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
        case actionTypes.GET_USER_CATEGORIES: 
            return {
                ...state,
                userCategories: action.categories
            }; 
        case actionTypes.GET_USER_TRANSACTIONS: 
            return {
                ...state, 
                trackedDates: {...state.trackedDates},
                loadingTransactions: action.loading                
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
            if(!action.net.incomes)
                action.net.incomes = 0; 
            if(!action.net.expenses)
                action.net.expenses = 0; 
            return {
                ...state, 
                net: { incomes: action.net.incomes, expenses: action.net.expenses }
            }; 
        case actionTypes.GET_ALL_CATEGORIES: 
            return {
                ...state, 
                allCategories: action.allCategories
            }; 
        case actionTypes.GET_ANNUAL_USER_NETS: 
            return {
                ...state, 
                annualData: { ...state.annualData, netIncomes: action.netIncomes, netExpenses: action.netExpenses }
            }; 
        case actionTypes.GET_ANNUAL_USER_EXPENSES: 
            return {
                ...state, 
                annualData: { ...state.annualData, categorizedExpenses: action.expenses }
            }; 
        default: 
            return {
                ...state, 
                trackedDates: {...state.trackedDates},                
            }; 
    }
}; 

export default reducer; 