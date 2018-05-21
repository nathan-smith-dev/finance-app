import axios from 'axios'; 
import { withAuth } from '../firebase/auth'; 

const instance = axios.create({ baseURL: 'https://nsmith.site/api/', timeout: 1000 }); 

export const getIncomes = (month, year, callback) => {
    withAuth(authToken => {
        instance.get(`/incomes?month=${month}&year=${year}`, { headers: { 'x-auth-token': authToken } })
            .then(res => {
                // console.log(res.data); 
                callback(res.data); 
            })
            .catch(err => {
                console.log(err.message); 
                setTimeout(() => getIncomes(month, year, callback), 125);
            }); 
    }); 
}; 

export const getExpenses = (month, year, callback) => {
    withAuth(authToken => {
        instance.get(`/expenses?month=${month}&year=${year}`, { headers: { 'x-auth-token': authToken } })
            .then(res => {
                // console.log(res.data); 
                callback(res.data); 
            })
            .catch(err => {
                console.log(err.message); 
                setTimeout(() => getExpenses(month, year, callback), 125); 
            }); 
    }); 
}; 

export const getIncomeAndExpenses = (month, year, categoryName, callback) => {
    let url = `/transactions?month=${month}&year=${year}`; 
    if(categoryName)
        url += `category=${categoryName}`; 

    withAuth(authToken => {
        instance.get(url, { headers: { 'x-auth-token': authToken } })
            .then(res => {
                // console.log(res.data); 
                callback(res.data); 
            })
            .catch(err => {
                console.log(err.message);    
                setTimeout(() => getIncomeAndExpenses(month, year, categoryName, callback), 125); 
            }); 
    }); 
}; 

export const getCategorizedExpenses = (month, year, callback) => {
    withAuth(authToken => {
        instance.get(`/categories/totals?month=${month}&year=${year}`, { headers: { 'x-auth-token': authToken } })
            .then(res => {
                // console.log(res.data); 
                callback(res.data); 
            })
            .catch(err => {
                console.log(err.message);                
                setTimeout(() => getCategorizedExpenses(month, year, callback), 125); 
            }); 
    }); 
}; 

export const getCountOfIncomeAndExpenses = (month, year, callback) => {
    withAuth(authToken => {
        instance.get(`/transactions/dates?month=${month}&year=${year}`, { headers: { 'x-auth-token': authToken } })
            .then(res => {
                // console.log(res.data); 
                callback(res.data); 
            })
            .catch(err => {
                console.log(err.message); 
                setTimeout(() => getCountOfIncomeAndExpenses(month, year, callback), 125); 
            }); 
    }); 
}

export const getCountOfIncomeAndExpenseCategories = (month, year, callback) => {
    withAuth(authToken => {
        instance.get(`/transactions/categories?month=${month}&year=${year}`, { headers: { 'x-auth-token': authToken } })
            .then(res => {
                // console.log(res.data); 
                callback(res.data); 
            })
            .catch(err => {
                console.log(err.message); 
                setTimeout(() => getCountOfIncomeAndExpenseCategories(month, year, callback), 125); 
            }); 
    }); 
}

export const getNetIncomeAndExpense = (month, year, callback) => {
    withAuth(authToken => {
        instance.get(`/expenses/totals?month=${month}&year=${year}`, { headers: { 'x-auth-token': authToken } })
            .then(res => {
                // console.log(res.data); 
                callback(res.data); 
            })
            .catch(err => {
                console.log(err.message); 
                setTimeout(() => getNetIncomeAndExpense(month, year, callback), 125); 
            }); 
    }); 
}