import * as actionTypes from './actionTypes';
import * as apiCalls from '../../api-calls' ; 
import * as utilities from '../../utlities/utilities'; 

export const getTransactionsLoad = (loading) => {
    return {
        type: actionTypes.GET_USER_TRANSACTIONS, 
        loading: loading
    }; 
}; 

export const getIncomes = (userId, month, year) => {
    return dispatch => {
        apiCalls.getIncomes(month, year, incomes => dispatch(setIncomes(incomes))); 
    }
}

const setIncomes = (incomes) => {
    return {
        type: actionTypes.GET_USER_INCOMES, 
        incomes: incomes
    }
}

export const getExpenses = (userId, month, year) => {
    return dispatch => {
        apiCalls.getExpenses(month, year, expenses => dispatch(setExpenses(expenses))); 
        apiCalls.getCategorizedExpenses(month, year, expenses => dispatch(setCategorizedExpenses(expenses))); 
    }
}

const setExpenses = expenes => {
    return {
        type: actionTypes.GET_USER_EXPENSES, 
        expenses: expenes
    }
}

export const getIncomeAndExpenses = (userId, month, year, categoryName = null) => {
    return dispatch => {
        apiCalls.getIncomeAndExpenses(month, year, categoryName, transactions => dispatch(setIncomeAndExpenses(transactions))); 
        apiCalls.getCountOfIncomeAndExpenses(month, year, countObj => dispatch(setDateFilter(countObj))); 
        apiCalls.getCountOfIncomeAndExpenseCategories(month, year, countObj => dispatch(setCategoryFilter(countObj))); 
        apiCalls.getNetIncomeAndExpense(month, year, netArray => dispatch(setNetIncomeAndExpense(netArray))); 
        apiCalls.getUserCategories(categoriesArray => dispatch(setUserCategories(categoriesArray))); 
        apiCalls.getAllCategories(categoriesArray => dispatch(setAllCategories(categoriesArray))); 
        // Annual Calls
        apiCalls.getAnnualCategorizedExpenses(year, expenses => dispatch(setAnnualCategorizedExpenses(expenses)));
        apiCalls.getAnnualNetIncomeAndExpense(year, nets => dispatch(setAnnualNets(nets))); 
    }
}

export const getUserCategories = () => {
    return dispatch => {
        apiCalls.getUserCategories(categoriesArray => dispatch(setUserCategories(categoriesArray)));     
    }; 
}; 

const setAnnualCategorizedExpenses = (expenses) => {
    return {
        type: actionTypes.GET_ANNUAL_USER_EXPENSES, 
        expenses: expenses
    }; 
}

const setAnnualNets = (nets) => {
    return {
        type: actionTypes.GET_ANNUAL_USER_NETS, 
        netIncomes: nets[0].incomes,
        netExpenses: nets[0].expenses,
    }; 
}

const setNetIncomeAndExpense = (netArray) => {
    return {
        type: actionTypes.GET_NET_TRANSACTIONS, 
        net: netArray[0]
    }
}

const setAllCategories = (categoryArray) => {
    return {
        type: actionTypes.GET_ALL_CATEGORIES, 
        allCategories: categoryArray
    }
}

const setUserCategories = (categories) => {
    return {
        type: actionTypes.GET_USER_CATEGORIES, 
        categories: categories
    }
}

const setIncomeAndExpenses = (transactions) => {
    const estDateConversion = transactions.map(trans => {
        return {...trans, date: utilities.calcTimezoneOffset(new Date(trans.date))}
    })
    return {
        type: actionTypes.GET_USER_INCOMES_AND_EXPENSES, 
        transactions: estDateConversion
    }
}

const setDateFilter = (objArray) => {
    const dates = objArray.map(obj => utilities.calcTimezoneOffset(new Date(obj.date))); 
    return {
        type: actionTypes.GET_FILTER_DATE, 
        date: dates
    }
}

const setCategoryFilter = (objArray) => {
    const categories = objArray.map(obj => obj.category); 
    return {
        type: actionTypes.GET_FILTER_CATEGORIES, 
        categories: categories
    }
}

const setCategorizedExpenses = categories => {
    return {
        type: actionTypes.GET_USER_CATEGORIZED_EXPENSES, 
        categorizedExpenses: categories
    }
}

export const newTransactionDate = (uid, month, year) => {
    return {
        type: actionTypes.CHANGE_TRANSACTION_DATES, 
        month: month, 
        year: year
    }
}

export const changeTransactionDate = (uid, month, year) => {
    return dispatch => {
        dispatch(newTransactionDate(uid, month, year)); 
        dispatch(getIncomeAndExpenses(uid, month, year)); 
        dispatch(getExpenses(uid, month, year)); 
    }
}; 