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

export const getTransactions = (userId) => {
    return dispatch => {
        const today = new Date(); 
        withAuth((authToken) => {
            const url = `${userId}/${today.getFullYear()}/${today.getMonth()}.json?auth=${authToken}`; 
            axios.get(url)
                .then(response => {
                    dispatch(getTransactionsSuccess(response.data)); 
                    dispatch(flattenTransactions(response.data));
                })
                .catch(err => {
                    dispatch(getTransactionsFailed())
                }); 
        }); 
    }
}; 