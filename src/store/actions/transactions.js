import * as actionTypes from './actionTypes';
import axios from 'axios'; 
import { withAuth } from '../../firebase/auth'; 

export const getTransactionsSuccess = (transactions) => {
    // console.log(transactions); 
    return {
        type: actionTypes.GET_USER_TRANSACTIONS_SUCCESS, 
        userTransactions: transactions
    }
}

export const getTransactionCategoriesSuccess = (categories) => {
    // console.log(categories); 
    return {
        type: actionTypes.GET_USER_CATEGORIES, 
        transactionCategories: categories
    }
}

export const getTransactionsFailed = () => {
    return {
        type: actionTypes.GET_USER_TRANSACTIONS_FAILED
    }
}

export const flattenTransactions = (transactions) => {
    // console.log(transactions);
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
    const data = {
        incomes: incomes, 
        expenses: expenses, 
        categorizedExpenses: categories
    }; 

    return {
        type: actionTypes.FLATTEN_TRANSACTION_DATA, 
        details: data
    }
}

export const getTransactions = (userId, month, year) => {
    return dispatch => {
        withAuth((authToken) => {
            const url = `${userId}/transactions/${year}/${month}.json?auth=${authToken}`; 
            axios.get(url)
                .then(response => {
                    const sortedTransactions = Object.keys(response.data).map(transKey => {
                        return {...response.data[transKey], id: transKey};
                    }); 
                    dispatch(getTransactionsSuccess(sortedTransactions)); 
                    dispatch(flattenTransactions(response.data));
                })
                .catch(err => {
                    dispatch(getTransactionsFailed())
                }); 
        }); 
    }
}; 

export const getTransactionCategories = (userId) => {
    return dispatch => {
        withAuth((authToken) => {
            const url = `${userId}/transactions/categories.json?auth=${authToken}`; 
            axios.get(url)
                .then(response => {
                    const categories = Object.keys(response.data).map(key => {
                        return Object.values(response.data[key])[0]; 
                    }); 
                    dispatch(getTransactionCategoriesSuccess(categories)); 
                })
                .catch(err => {
                    console.log(err); 
                }); 
        }); 
    }
};

export const changeTransactionDate = (uid, month, year) => {
    return dispatch => {
        dispatch(getTransactions(uid, month, year)); 
    }
}; 