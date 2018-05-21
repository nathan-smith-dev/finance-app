import * as actionTypes from './actionTypes';
import axios from 'axios'; 
import { withAuth } from '../../firebase/auth';
import * as apiCalls from '../../api-calls' ; 
import * as utilities from '../../utlities/utilities'; 

export const getTransactionsSuccess = (transactions) => {
    // console.log(transactions); 
    return {
        type: actionTypes.GET_USER_TRANSACTIONS_SUCCESS, 
        userTransactions: transactions
    }
}

export const getTransactionCategoriesSuccess = (categories, catIds) => {
    // console.log(categories); 
    return {
        type: actionTypes.GET_USER_CATEGORIES, 
        transactionCategories: categories, 
        transactionIds: catIds
    }
}

export const getTransactionsFailed = () => {
    return {
        type: actionTypes.GET_USER_TRANSACTIONS_FAILED
    }
}

export const getTransactionsLoad = (loading) => {
    return {
        type: actionTypes.GET_USER_TRANSACTIONS, 
        loading: loading
    }; 
}; 

export const flattenTransactions = (transactions) => {
    if(!transactions) {
        return {
            type: actionTypes.FLATTEN_TRANSACTION_DATA, 
            details: {}
        }; 
    }
    // console.log(transactions);
    const data = transactionsToIncomeExpenseAndCategory(transactions); 

    return {
        type: actionTypes.FLATTEN_TRANSACTION_DATA, 
        details: data
    }
}

const transactionsToIncomeExpenseAndCategory = (transactions) => {
    let expenses = 0; 
    let incomes = 0;  
    const categories = {}; 
    for(let key in transactions) {
        const trans = transactions[key];
        if(trans.type === "Expense") {
            expenses += trans.amount; 
            categories[trans.category] = categories[trans.category] 
                ? categories[trans.category] + trans.amount 
                : trans.amount;  
        }
        else if(trans.type === "Income") 
            incomes += trans.amount; 
    }
    return {
        incomes: incomes, 
        expenses: expenses, 
        categorizedExpenses: categories
    }; 
}

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
    }
}

const setNetIncomeAndExpense = (netArray) => {
    return {
        type: actionTypes.GET_NET_TRANSACTIONS, 
        net: netArray[0]
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

export const getTransactions = (userId, month, year) => {
    return dispatch => {
        dispatch(getTransactionsLoad(true)); 
        withAuth((authToken) => {
            const url = `${userId}/transactions/${year}/${month}.json?auth=${authToken}`; 
            axios.get(url)
                .then(response => {
                    const sortedTransactions = Object.keys(response.data).map(transKey => {
                        return {...response.data[transKey], id: transKey};
                    }); 
                    dispatch(getTransactionsSuccess(sortedTransactions)); 
                    dispatch(flattenTransactions(sortedTransactions));
                    dispatch(getTransactionsLoad(false)); 
                })
                .catch(err => {
                    dispatch(getTransactionsFailed()); 
                    dispatch(flattenTransactions());  
                    dispatch(getTransactionsLoad(false));                   
                    // console.log(err);
                }); 
        }); 
    }
}; 

export const getAnnualTransactions = (userId, year) => {
    return dispatch => {
        withAuth((authToken) => {
            const url = `${userId}/transactions/${year}.json?auth=${authToken}`; 
            axios.get(url)
                .then(response => {
                    const totalTransactions = Object.values(response.data).map(month => {
                        if(month) {
                            const transactions = Object.values(month); 
                            return transactions; 
                        }
                        return []; 
                    }); 
                    const transactions = [].concat.apply([], totalTransactions); 
                    dispatch(getAnnualDetails(transactionsToIncomeExpenseAndCategory(transactions))); 
                    dispatch(getTransactionsLoad(false)); 
                })
                .catch(err => {
                    console.log(err)
                    dispatch(getTransactionsFailed()); 
                    dispatch(getTransactionsLoad(false));                   
                }); 
        }); 
    }
}

export const getAnnualDetails = (details) => {
    return {
        type: actionTypes.GET_ANNUAL_USER_TRANSACTIONS, 
        details: details
    }
}

export const getTransactionCategories = (userId) => {
    return dispatch => {
        withAuth((authToken) => {
            const url = `${userId}/transactions/categories.json?auth=${authToken}`; 
            axios.get(url)
                .then(response => {
                    if(response.data) {
                        const catIds = []; 
                        const categories = Object.keys(response.data).map(key => {
                            catIds.push(key); 
                            return Object.values(response.data[key])[0]; 
                        }); 
                        dispatch(getTransactionCategoriesSuccess(categories, catIds)); 
                    }
                    else {
                        dispatch(getTransactionCategoriesSuccess([], []));                         
                    }
                })
                .catch(err => {
                    console.log(err); 
                }); 
        }); 
    }
};

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