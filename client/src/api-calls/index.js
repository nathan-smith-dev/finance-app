import axios from 'axios'; 
import { withAuth } from '../firebase/auth'; 


const instance = axios.create({ baseURL: '/api/', timeout: 1000 }); 

export const getIncomes = (month, year, callback) => {
    withAuth(authToken => {
        instance.get(`/incomes?month=${month}&year=${year}`, { headers: { 'x-auth-token': authToken } })
            .then(res => {
                // console.log(res.data); 
                callback(res.data); 
            })
            .catch(err => {
                console.log(err.message); 
                console.log(`/incomes?month=${month}&year=${year}`);
                // setTimeout(() => getIncomes(month, year, callback), 125);
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
                console.log(`/expenses?month=${month}&year=${year}`);
                // setTimeout(() => getExpenses(month, year, callback), 125); 
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
                console.log(`/transactions?month=${month}&year=${year}`); 
                // setTimeout(() => getIncomeAndExpenses(month, year, categoryName, callback), 125); 
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
                console.log(`/categories/totals?month=${month}&year=${year}`);
                // setTimeout(() => getCategorizedExpenses(month, year, callback), 125); 
            }); 
    }); 
}; 

export const getAnnualCategorizedExpenses = (year, callback) => {
    withAuth(authToken => {
        instance.get(`/categories/totals?annual=${year}`, { headers: { 'x-auth-token': authToken } })
            .then(res => {
                // console.log(res.data); 
                callback(res.data); 
            })
            .catch(err => {
                console.log(err.message); 
                console.log(`/categories/totals?annual=${year}`);
                // setTimeout(() => getAnnualCategorizedExpenses(year, callback), 125); 
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
                console.log(`/transactions/dates?month=${month}&year=${year}`);
                // setTimeout(() => getCountOfIncomeAndExpenses(month, year, callback), 125); 
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
                // setTimeout(() => getCountOfIncomeAndExpenseCategories(month, year, callback), 125); 
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
                // setTimeout(() => getNetIncomeAndExpense(month, year, callback), 125); 
            }); 
    }); 
}

export const getAnnualNetIncomeAndExpense = (year, callback) => {
    withAuth(authToken => {
        instance.get(`/expenses/totals?annual=${year}`, { headers: { 'x-auth-token': authToken } })
            .then(res => {
                // console.log(res.data); 
                callback(res.data); 
            })
            .catch(err => {
                console.log(err.message); 
                // setTimeout(() => getAnnualNetIncomeAndExpense(year, callback), 125); 
            }); 
    }); 
}

export const getUserCategories = (callback) => {
    withAuth(authToken => {
        instance.get(`/categories`, { headers: { 'x-auth-token': authToken } })
            .then(res => {
                // console.log(res.data); 
                callback(res.data); 
            })
            .catch(err => {
                console.log(err.message); 
                // setTimeout(() => getUserCategories(callback), 125); 
            }); 
    }); 
}

export const getAllCategories = (callback) => {
    withAuth(authToken => {
        instance.get(`/categories/all`, { headers: { 'x-auth-token': authToken } })
            .then(res => {
                // console.log(res.data); 
                callback(res.data); 
            })
            .catch(err => {
                console.log(err.message); 
                // setTimeout(() => getAllCategories(callback), 125); 
            }); 
    }); 
}

export const getAllUsers = (callback) => {
    withAuth(authToken => {
        instance.get(`/users`, { headers: { 'x-auth-token': authToken } })
            .then(res => {
                // console.log(res.data); 
                callback(res.data); 
            })
            .catch(err => {
                console.log(err.message); 
                // setTimeout(() => getAllUsers(callback), 125); 
            }); 
    }); 
}

export const getUser = (id, callback) => {
    withAuth(authToken => {
        instance.get(`/users/${id}`, { headers: { 'x-auth-token': authToken } })
            .then(res => {
                // console.log(res.data); 
                callback(res.data); 
            })
            .catch(err => {
                console.log(err.message); 
                // setTimeout(() => getUser(id, callback), 125); 
            }); 
    }); 
}

export const getRoommates = (callback) => {
    withAuth(authToken => {
        instance.get(`/roommates`, { headers: { 'x-auth-token': authToken } })
            .then(res => {
                // console.log(res.data); 
                callback(res.data); 
            })
            .catch(err => {
                console.log(err.message); 
                // setTimeout(() => getRoommates(callback), 125); 
            }); 
    }); 
}

export const getRoommateNotifications = (callback) => {
    withAuth(authToken => {
        instance.get(`/roommates/expenses/notifications`, { headers: { 'x-auth-token': authToken } })
            .then(res => {
                // console.log(res.data); 
                callback(res.data); 
            })
            .catch(err => {
                console.log(err.message); 
                // setTimeout(() => getRoommateNotifications(callback), 125); 
            }); 
    }); 
}

export const getRoommateRequests = (callback) => {
    withAuth(authToken => {
        instance.get(`/roommates/requests`, { headers: { 'x-auth-token': authToken } })
            .then(res => {
                // console.log(res.data); 
                callback(res.data); 
            })
            .catch(err => {
                console.log(err.message); 
                // setTimeout(() => getRoommateRequests(callback), 125); 
            }); 
    }); 
}

export const getRoommateIncomesAndExpenses = (roommatesArr, callback) => {
    withAuth(authToken => {
        const roommateIds = roommatesArr.map(r => r.id); 
        let promises = []; 
        for(let id of roommateIds) {
            promises.push(instance.get(`/roommates/expenses/user/${id}`, { headers: { 'x-auth-token': authToken } })); 
        }
        axios.all(promises)
            .then(results => {
                let data = {}; 
                results.map(incomesAndExpenses => {
                    if(incomesAndExpenses.data && incomesAndExpenses.data.length > 0) {
                        data[incomesAndExpenses.data[0].roommateId] = incomesAndExpenses.data.map(ie => { return {...ie, date: new Date(ie.date) }});
                    }
                    return 0; // stops webpack compiler warning
                }); 
                callback(data); 
            })
            .catch(err => {
                console.log(err.message); 
                // setTimeout(() => getRoommateIncomesAndExpenses(roommatesArr, callback), 125); 
            }); 
    }); 
}


export const updateRoommateExpense = (expenseObj, callback) => {
    withAuth(authToken => {
        instance.put(`/roommates/expenses/${expenseObj.id}`, expenseObj, { headers: { 'x-auth-token': authToken } })
            .then(res => {
                // console.log(res.data); 
                callback(res.data); 
            })
            .catch(err => {
                console.log(err.message); 
                // setTimeout(() => updateRoommateExpense(expenseObj, callback), 125); 
            }); 
    }); 
}

export const createRoommateExpense = (expenseObj, callback) => {
    withAuth(authToken => {
        instance.post(`/roommates/expenses`, expenseObj, { headers: { 'x-auth-token': authToken } })
            .then(res => {
                // console.log(res.data); 
                callback(res.data); 
            })
            .catch(err => {
                console.log(err.message); 
                // setTimeout(() => createRoommateExpense(expenseObj, callback), 125); 
            }); 
    }); 
}

export const acceptRoommateRequests = (id, accept, callback) => {
    withAuth(authToken => {
        instance.put(`/roommates/requests/${id}`, { accept: accept }, { headers: { 'x-auth-token': authToken } })
            .then(res => {
                // console.log(res.data); 
                callback(res.data); 
            })
            .catch(err => {
                console.log(err.message); 
                // setTimeout(() => acceptRoommateRequests(id, accept, callback), 125); 
            }); 
    }); 
}

export const createRoommateRequests = (recipientId, callback) => {
    withAuth(authToken => {
        instance.post(`/roommates/requests`, { recipientId: recipientId }, { headers: { 'x-auth-token': authToken } })
            .then(res => {
                // console.log(res.data); 
                callback(res.data); 
            })
            .catch(err => {
                console.log(err.message); 
                // setTimeout(() => createRoommateRequests(recipientId, callback), 125); 
            }); 
    }); 
}

export const addUser = (userObj, callback) => {
    withAuth(authToken => {
        instance.post(`/users`, userObj, { headers: { 'x-auth-token': authToken } })
            .then(res => {
                // console.log(res.data); 
                callback(res.data); 
            })
            .catch(err => {
                console.log(err.message); 
                // setTimeout(() => addUser(userObj, callback), 125); 
            }); 
    }); 
}

export const createUserCategory = (categoryObj, callback) => {
    withAuth(authToken => {
        instance.post(`/categories`, categoryObj, { headers: { 'x-auth-token': authToken } })
            .then(res => {
                // console.log(res.data); 
                callback(res.data); 
            })
            .catch(err => {
                console.log(err.message); 
                // setTimeout(() => createUserCategory(categoryObj, callback), 125); 
            }); 
    }); 
}

export const createTransaction = (transObj, callback) => {
    const url = transObj.type === 'Income' ? `/incomes` : `/expenses`; 

    withAuth(authToken => {
        instance.post(url, transObj, { headers: { 'x-auth-token': authToken } })
            .then(res => {
                // console.log(res.data); 
                callback(res.data); 
            })
            .catch(err => {
                console.log(err.message); 
                // setTimeout(() => createTransaction(transObj, callback), 125); 
            }); 
    }); 
}

export const updateTransaction = (transObj, callback) => {
    const { transId, type } = transObj; 
    const url = type === 'Income' ? `/incomes/${transId}` : `/expenses/${transId}`; 

    withAuth(authToken => {
        instance.put(url, transObj, { headers: { 'x-auth-token': authToken } })
            .then(res => {
                // console.log(res.data); 
                callback(res.data); 
            })
            .catch(err => {
                console.log(err.message); 
                // setTimeout(() => updateTransaction(transObj, callback), 125); 
            }); 
    }); 
}

export const deleteUserCategory = (id, callback) => {
    withAuth(authToken => {
        instance.delete(`/categories/${id}`, { headers: { 'x-auth-token': authToken } })
            .then(res => {
                // console.log(res.data); 
                callback(res.data); 
            })
            .catch(err => {
                console.log(err.message); 
                // setTimeout(() => deleteUserCategory(id, callback), 125); 
            }); 
    }); 
}

export const deleteTransaction = (id, type, callback) => {
    const url = type === 'Income' ? `/incomes/${id}` : `/expenses/${id}`; 

    withAuth(authToken => {
        instance.delete(url, { headers: { 'x-auth-token': authToken } })
            .then(res => {
                // console.log(res.data); 
                callback(res.data); 
            })
            .catch(err => {
                console.log(err.message); 
                // setTimeout(() => deleteTransaction(id, type, callback), 125); 
            }); 
    }); 
}