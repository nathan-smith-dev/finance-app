import * as actionTypes from './actionTypes';
import axios from 'axios'; 

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

export const getTransactions = (userId) => {
    return dispatch => {
        const today = new Date(); 
        const url = `${userId}/${today.getFullYear()}/${today.getMonth()}.json`; 
        axios.get(url)
            .then(response => {
                dispatch(getTransactionsSuccess(response.data))
            })
            .catch(err => {
                dispatch(getTransactionsFailed())
            }); 
    }
}; 