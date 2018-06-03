const sql = require('mssql'); 
const axios = require('axios'); 

async function migrateData() { // Migrates Google Firebase data to Local SQL Database for the months 03-04 of 2018 (April and May)
    let query = ''; 
    // Users
    query += await getUserProfiles('https://react-finance-f20df.firebaseio.com/users/profiles.json'); 
    // Categories for each User
    query += await getCategoriesFromTransactions('https://react-finance-f20df.firebaseio.com/users/I0pcMkiwHDX77EIZ59lLMQaa9cp2/transactions/2018/3.json'); 
    query += await getCategoriesFromTransactions('https://react-finance-f20df.firebaseio.com/users/I0pcMkiwHDX77EIZ59lLMQaa9cp2/transactions/2018/4.json'); 
    query += await getCategoriesFromTransactions('https://react-finance-f20df.firebaseio.com/users/I0pcMkiwHDX77EIZ59lLMQaa9cp2/transactions/2018/5.json'); 
    query += await getCategoriesFromTransactions('https://react-finance-f20df.firebaseio.com/users/j8hXDqfY8KP35NsyE1q7hiIR4Ol1/transactions/2018/3.json'); 
    query += await getCategoriesFromTransactions('https://react-finance-f20df.firebaseio.com/users/j8hXDqfY8KP35NsyE1q7hiIR4Ol1/transactions/2018/4.json'); 
    query += await getCategoriesFromTransactions('https://react-finance-f20df.firebaseio.com/users/j8hXDqfY8KP35NsyE1q7hiIR4Ol1/transactions/2018/5.json'); 
    query += await getCategoriesFromTransactions('https://react-finance-f20df.firebaseio.com/users/qkyZJaB4YafgZpsua7JmN42C28t2/transactions/2018/3.json'); 
    query += await getCategoriesFromTransactions('https://react-finance-f20df.firebaseio.com/users/qkyZJaB4YafgZpsua7JmN42C28t2/transactions/2018/4.json'); 
    query += await getCategoriesFromTransactions('https://react-finance-f20df.firebaseio.com/users/qkyZJaB4YafgZpsua7JmN42C28t2/transactions/2018/5.json'); 
    query += await getCategoriesFromTransactions('https://react-finance-f20df.firebaseio.com/users/rinaXxoFn6SZBoF8F7nV00A87KD3/transactions/2018/3.json'); 
    query += await getCategoriesFromTransactions('https://react-finance-f20df.firebaseio.com/users/rinaXxoFn6SZBoF8F7nV00A87KD3/transactions/2018/4.json'); 
    query += await getCategoriesFromTransactions('https://react-finance-f20df.firebaseio.com/users/rinaXxoFn6SZBoF8F7nV00A87KD3/transactions/2018/5.json'); 
    // Roommates
    query += await getRoommates('https://react-finance-f20df.firebaseio.com/users/qkyZJaB4YafgZpsua7JmN42C28t2/roommates/mates.json', 'qkyZJaB4YafgZpsua7JmN42C28t2'); 
    query += await getRoommates('https://react-finance-f20df.firebaseio.com/users/rinaXxoFn6SZBoF8F7nV00A87KD3/roommates/mates.json', 'rinaXxoFn6SZBoF8F7nV00A87KD3'); 
    query += await getRoommates('https://react-finance-f20df.firebaseio.com/users/I0pcMkiwHDX77EIZ59lLMQaa9cp2/roommates/mates.json', 'I0pcMkiwHDX77EIZ59lLMQaa9cp2'); 
    query += await getRoommates('https://react-finance-f20df.firebaseio.com/users/j8hXDqfY8KP35NsyE1q7hiIR4Ol1/roommates/mates.json', 'j8hXDqfY8KP35NsyE1q7hiIR4Ol1'); 
    // UserCategories 
    query += await getUserCategories('https://react-finance-f20df.firebaseio.com/users/qkyZJaB4YafgZpsua7JmN42C28t2/transactions/categories.json', 'qkyZJaB4YafgZpsua7JmN42C28t2'); 
    query += await getUserCategories('https://react-finance-f20df.firebaseio.com/users/rinaXxoFn6SZBoF8F7nV00A87KD3/transactions/categories.json', 'rinaXxoFn6SZBoF8F7nV00A87KD3'); 
    query += await getUserCategories('https://react-finance-f20df.firebaseio.com/users/I0pcMkiwHDX77EIZ59lLMQaa9cp2/transactions/categories.json', 'I0pcMkiwHDX77EIZ59lLMQaa9cp2'); 
    query += await getUserCategories('https://react-finance-f20df.firebaseio.com/users/j8hXDqfY8KP35NsyE1q7hiIR4Ol1/transactions/categories.json', 'j8hXDqfY8KP35NsyE1q7hiIR4Ol1'); 
    // Expenses and Incomes for each User
    query += await getTransactions('https://react-finance-f20df.firebaseio.com/users/I0pcMkiwHDX77EIZ59lLMQaa9cp2/transactions/2018/3.json', 'I0pcMkiwHDX77EIZ59lLMQaa9cp2'); 
    query += await getTransactions('https://react-finance-f20df.firebaseio.com/users/I0pcMkiwHDX77EIZ59lLMQaa9cp2/transactions/2018/4.json', 'I0pcMkiwHDX77EIZ59lLMQaa9cp2'); 
    query += await getTransactions('https://react-finance-f20df.firebaseio.com/users/I0pcMkiwHDX77EIZ59lLMQaa9cp2/transactions/2018/5.json', 'I0pcMkiwHDX77EIZ59lLMQaa9cp2'); 
    query += await getTransactions('https://react-finance-f20df.firebaseio.com/users/qkyZJaB4YafgZpsua7JmN42C28t2/transactions/2018/3.json', 'qkyZJaB4YafgZpsua7JmN42C28t2'); 
    query += await getTransactions('https://react-finance-f20df.firebaseio.com/users/qkyZJaB4YafgZpsua7JmN42C28t2/transactions/2018/4.json', 'qkyZJaB4YafgZpsua7JmN42C28t2'); 
    query += await getTransactions('https://react-finance-f20df.firebaseio.com/users/qkyZJaB4YafgZpsua7JmN42C28t2/transactions/2018/5.json', 'qkyZJaB4YafgZpsua7JmN42C28t2'); 
    query += await getTransactions('https://react-finance-f20df.firebaseio.com/users/rinaXxoFn6SZBoF8F7nV00A87KD3/transactions/2018/3.json', 'rinaXxoFn6SZBoF8F7nV00A87KD3'); 
    query += await getTransactions('https://react-finance-f20df.firebaseio.com/users/rinaXxoFn6SZBoF8F7nV00A87KD3/transactions/2018/4.json', 'rinaXxoFn6SZBoF8F7nV00A87KD3'); 
    query += await getTransactions('https://react-finance-f20df.firebaseio.com/users/rinaXxoFn6SZBoF8F7nV00A87KD3/transactions/2018/5.json', 'rinaXxoFn6SZBoF8F7nV00A87KD3'); 
    query += await getTransactions('https://react-finance-f20df.firebaseio.com/users/j8hXDqfY8KP35NsyE1q7hiIR4Ol1/transactions/2018/3.json', 'j8hXDqfY8KP35NsyE1q7hiIR4Ol1'); 
    query += await getTransactions('https://react-finance-f20df.firebaseio.com/users/j8hXDqfY8KP35NsyE1q7hiIR4Ol1/transactions/2018/4.json', 'j8hXDqfY8KP35NsyE1q7hiIR4Ol1'); 
    query += await getTransactions('https://react-finance-f20df.firebaseio.com/users/j8hXDqfY8KP35NsyE1q7hiIR4Ol1/transactions/2018/5.json', 'j8hXDqfY8KP35NsyE1q7hiIR4Ol1'); 
    // Roommate Expenses
    query += await getRoomateExpenses('https://react-finance-f20df.firebaseio.com/users/I0pcMkiwHDX77EIZ59lLMQaa9cp2/roommates/mates/qkyZJaB4YafgZpsua7JmN42C28t2/transactions.json', 'qkyZJaB4YafgZpsua7JmN42C28t2', 'I0pcMkiwHDX77EIZ59lLMQaa9cp2');     
    query += await getRoomateExpenses('https://react-finance-f20df.firebaseio.com/users/I0pcMkiwHDX77EIZ59lLMQaa9cp2/roommates/mates/rinaXxoFn6SZBoF8F7nV00A87KD3/transactions.json', 'rinaXxoFn6SZBoF8F7nV00A87KD3', 'I0pcMkiwHDX77EIZ59lLMQaa9cp2');     
    query += await getRoomateExpenses('https://react-finance-f20df.firebaseio.com/users/I0pcMkiwHDX77EIZ59lLMQaa9cp2/roommates/mates/j8hXDqfY8KP35NsyE1q7hiIR4Ol1/transactions.json', 'j8hXDqfY8KP35NsyE1q7hiIR4Ol1', 'I0pcMkiwHDX77EIZ59lLMQaa9cp2');     
    query += await getRoomateExpenses('https://react-finance-f20df.firebaseio.com/users/rinaXxoFn6SZBoF8F7nV00A87KD3/roommates/mates/qkyZJaB4YafgZpsua7JmN42C28t2/transactions.json', 'qkyZJaB4YafgZpsua7JmN42C28t2', 'rinaXxoFn6SZBoF8F7nV00A87KD3');     
    query += await getRoomateExpenses('https://react-finance-f20df.firebaseio.com/users/rinaXxoFn6SZBoF8F7nV00A87KD3/roommates/mates/I0pcMkiwHDX77EIZ59lLMQaa9cp2/transactions.json', 'I0pcMkiwHDX77EIZ59lLMQaa9cp2', 'rinaXxoFn6SZBoF8F7nV00A87KD3');     
    query += await getRoomateExpenses('https://react-finance-f20df.firebaseio.com/users/rinaXxoFn6SZBoF8F7nV00A87KD3/roommates/mates/j8hXDqfY8KP35NsyE1q7hiIR4Ol1/transactions.json', 'j8hXDqfY8KP35NsyE1q7hiIR4Ol1', 'rinaXxoFn6SZBoF8F7nV00A87KD3');     
    query += await getRoomateExpenses('https://react-finance-f20df.firebaseio.com/users/qkyZJaB4YafgZpsua7JmN42C28t2/roommates/mates/rinaXxoFn6SZBoF8F7nV00A87KD3/transactions.json', 'rinaXxoFn6SZBoF8F7nV00A87KD3', 'qkyZJaB4YafgZpsua7JmN42C28t2');     
    query += await getRoomateExpenses('https://react-finance-f20df.firebaseio.com/users/qkyZJaB4YafgZpsua7JmN42C28t2/roommates/mates/I0pcMkiwHDX77EIZ59lLMQaa9cp2/transactions.json', 'I0pcMkiwHDX77EIZ59lLMQaa9cp2', 'qkyZJaB4YafgZpsua7JmN42C28t2');     
    query += await getRoomateExpenses('https://react-finance-f20df.firebaseio.com/users/qkyZJaB4YafgZpsua7JmN42C28t2/roommates/mates/j8hXDqfY8KP35NsyE1q7hiIR4Ol1/transactions.json', 'j8hXDqfY8KP35NsyE1q7hiIR4Ol1', 'qkyZJaB4YafgZpsua7JmN42C28t2');     
    query += await getRoomateExpenses('https://react-finance-f20df.firebaseio.com/users/j8hXDqfY8KP35NsyE1q7hiIR4Ol1/roommates/mates/rinaXxoFn6SZBoF8F7nV00A87KD3/transactions.json', 'rinaXxoFn6SZBoF8F7nV00A87KD3', 'j8hXDqfY8KP35NsyE1q7hiIR4Ol1');     
    query += await getRoomateExpenses('https://react-finance-f20df.firebaseio.com/users/j8hXDqfY8KP35NsyE1q7hiIR4Ol1/roommates/mates/I0pcMkiwHDX77EIZ59lLMQaa9cp2/transactions.json', 'I0pcMkiwHDX77EIZ59lLMQaa9cp2', 'j8hXDqfY8KP35NsyE1q7hiIR4Ol1');     
    query += await getRoomateExpenses('https://react-finance-f20df.firebaseio.com/users/j8hXDqfY8KP35NsyE1q7hiIR4Ol1/roommates/mates/qkyZJaB4YafgZpsua7JmN42C28t2/transactions.json', 'qkyZJaB4YafgZpsua7JmN42C28t2', 'j8hXDqfY8KP35NsyE1q7hiIR4Ol1');     

    // console.log(query);
    queryDataBase(query); 
}

migrateData(); 

const config = {
    user: 'webapp',
    password: 'Hps@051418',
    server: 'localhost\\SQLEXPRESS', // You can use 'localhost\\instance' to connect to named instance
    database: 'budget-space__test'
}

function queryDataBase(query) {
    sql.connect(config)
        .then(pool => {
            console.log('Connected'); 
            // Query
            return pool.request()
            .query(query)
        }).then(result => {
            console.log('Executed query successfully'); 
        }).catch(err => {
            console.log(err.message)
        })
}
 
// sql.on('error', err => console.log(err));

async function getCategoriesFromTransactions(url) {
    let transactions = (await axios.get(url)).data; 
    if(transactions)
        transactions = Object.values((await axios.get(url)).data); 
    else return '\n'; 
    let query = ''; 
    for(let trans of transactions) {
        if(trans.type === 'Income' && !trans.category)
            trans.category = 'Paycheck'; 
        query += `EXEC CreateCategory @catName = '${trans.category.trim()}'\n`; 
    }
    return query;  
}

async function getUserProfiles(url) {
    let users = (await axios.get(url)).data; 
    if(users)
        users = Object.values((await axios.get(url)).data); 
    else return '\n'; 
    let query = ''; 
    for(let user of users) {
        const names = user.name.split(' '); 
        query += `EXEC CreateUser @id = '${user.uid}', @fName = '${names[0]}', @lName = '${names[1]}', @email = '${user.email}'\n`
    }
    return query; 
}

async function getTransactions(url, uid) {
    let transactions = (await axios.get(url)).data; 
    if(transactions)
        transactions = Object.values((await axios.get(url)).data); 
    else return '\n'; 
    let query = ''; 
    for(let trans of transactions) {
        if(trans.type === 'Expense') {
            query += `EXEC CreateExpense @userId = '${uid}', @amount = ${trans.amount}, @catName = '${sqlEscapeSingleQuote(trans.category)}', @desc = '${sqlEscapeSingleQuote(trans.desc)}', @date = '${trans.date.year}-${trans.date.month+1}-${trans.date.day}'\n`; 
        }
        if(trans.type === 'Income') {
            query += `EXEC CreateIncome @userId = '${uid}', @amount = ${trans.amount}, @catName = '${sqlEscapeSingleQuote(trans.category) || 'Paycheck'}', @desc = '${sqlEscapeSingleQuote(trans.desc)}', @date = '${trans.date.year}-${trans.date.month+1}-${trans.date.day}'\n`; 
        }
    }
    return query; 
}

async function getRoommates(url, uid) {
    let roommateIds = (await axios.get(url)).data; 
    if(roommateIds)
        roommateIds = Object.keys((await axios.get(url)).data); 
    else return '\n'; 
    let query = ''; 
    for(let mateId of roommateIds) {
        query += `EXEC CreateRoommate @id1 = '${uid}', @id2 = '${mateId}'\n`; 
    }
    return query; 
}

async function getUserCategories(url, uid) {
    let categories = (await axios.get(url)).data; 
    if(categories)
        categories = Object.values((await axios.get(url)).data); 
    else return '\n'; 
    let query = '';     
    for(let category of categories) {
        const catName = Object.values(category)[0].trim(); 
        query += `EXEC CreateUserCategory @userId = '${uid}', @categoryName = '${catName}'\n`
    }
    return query;      
}

async function getRoomateExpenses(url, fromUid, toUid) {
    const data = (await axios.get(url)).data; 
    let query = '\n'; 
    if(data) {
        const transactions = Object.values(data); 
        for(let trans of transactions) {
            query += `EXEC CreateRoomateExpense @expenseTo = '${toUid}', @expenseFrom = ${fromUid}, @amount = ${trans.amount}, @catName = '${sqlEscapeSingleQuote(trans.category)}', @desc = '${sqlEscapeSingleQuote(trans.desc)}', @date = '${trans.date.year}-${trans.date.month+1}-${trans.date.day}'\n`;         
        }
    }
    return query;          
}

function sqlEscapeSingleQuote(escString) {
    if(escString) return escString.replace("'", "''"); 
    return ''; 
}