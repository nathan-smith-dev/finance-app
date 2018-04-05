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

export const getTransactions = (userId) => {
    return dispatch => {
        const today = new Date(); 
        withAuth((authToken) => {
            const url = `${userId}/${today.getFullYear()}/${today.getMonth()}.json?auth=${authToken}`; 
            axios.get(url)
                .then(response => {
                    dispatch(getTransactionsSuccess(response.data))
                })
                .catch(err => {
                    dispatch(getTransactionsFailed())
                }); 
        }); 
    }
}; 