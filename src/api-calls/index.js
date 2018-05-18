import axios from 'axios'; 
import { withAuth } from '../firebase/auth'; 

const instance = axios.create({ baseURL: 'https://nsmith.site/api/', timeout: 1000 }); 

export const getIncomes = (month, year, callback) => {
    withAuth(authToken => {
        instance.get(`/incomes?month=${month}&year=${year}`, { headers: { 'x-auth-token': authToken } })
            .then(res => {
                console.log(res.data); 
                callback(res.data); 
            })
            .catch(err => getIncomes(month, year, callback))
    }); 
}; 

export const getExpenses = (month, year, callback) => {
    withAuth(authToken => {
        instance.get(`/expenses?month=${month}&year=${year}`, { headers: { 'x-auth-token': authToken } })
            .then(res => {
                console.log(res.data); 
                callback(res.data); 
            })
            .catch(err => getExpenses(month, year, callback))
    }); 
}; 

export const getCategorizedExpenses = (month, year, callback) => {
    withAuth(authToken => {
        instance.get(`/categories/totals?month=${month}&year=${year}`, { headers: { 'x-auth-token': authToken } })
            .then(res => {
                console.log(res.data); 
                callback(res.data); 
            })
            .catch(err => getCategorizedExpenses(month, year, callback))
    }); 
}; 