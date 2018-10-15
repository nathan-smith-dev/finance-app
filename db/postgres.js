const pg = require('pg');


const client = new pg.Pool({
    connectionString: process.env.DB_CONNECTION_STRING,
});

function connect() {
    client.connect();
}

async function createUser(userId, firstName, lastName, email) {
    const query = {
        text: 'SELECT * FROM create_user($1, $2, $3, $4);',
        values: [userId, firstName, lastName, email],
    };
    const result = await client.query(query);
    return result.rowCount ? result.rows : null;
}

async function createExpense(userId, amount, description, date, categoryName, categoryId) {
    const query = {
        text: 'SELECT * FROM create_expense($1, $2, $3, $4, $5, $6);',
        values: [userId, amount, description, date, categoryName, categoryId],
    };
    const result = await client.query(query);
    return result.rowCount ? mapPgNumericToNumber(result.rows) : null;
}

async function createIncome(userId, amount, description, date, categoryName, categoryId) {
    const query = {
        text: 'SELECT * FROM create_income($1, $2, $3, $4, $5, $6);',
        values: [userId, amount, description, date, categoryName, categoryId],
    };
    const result = await client.query(query);
    return result.rowCount ? mapPgNumericToNumber(result.rows) : null;
}

async function createRoommateRequest(requesterId, recipientId) {
    const query = {
        text: 'SELECT * FROM create_roommate_request($1, $2);',
        values: [requesterId, recipientId],
    };
    const result = await client.query(query);
    return result.rowCount ? result.rows : null;
}

async function createUserCategory(categoryName, userId) {
    const query = {
        text: 'SELECT * FROM create_user_category($1, $2);',
        values: [categoryName, userId],
    };
    const result = await client.query(query);
    return result.rowCount ? result.rows : null;
}

async function createRoommateExpense(expenseTo, expenseFrom, amount, description, date, categoryName, categoryId) {
    const query = {
        text: 'SELECT * FROM create_roommate_expense($1, $2, $3, $4, $5, $6, $7);',
        values: [expenseTo, expenseFrom, amount, description, date, categoryName, categoryId],
    };
    const result = await client.query(query);
    return result.rowCount ? mapPgNumericToNumber(result.rows) : null;
}

async function getUserExpenses(userId, date, categoryName) {
    const query = {
        text: 'SELECT * FROM get_user_expenses($1, $2, $3);',
        values: [userId, date, categoryName],
    };
    const result = await client.query(query);
    return result.rowCount ? mapPgNumericToNumber(result.rows) : null;
}

async function getExpense(expenseId) {
    const query = {
        text: 'SELECT * FROM get_expense($1);',
        values: [expenseId],
    };
    const result = await client.query(query);
    return result.rowCount ? mapPgNumericToNumber(result.rows ): null;
}

async function getUserIncomes(userId, date, categoryName) {
    const query = {
        text: 'SELECT * FROM get_user_incomes($1, $2, $3);',
        values: [userId, date, categoryName],
    };
    const result = await client.query(query);
    return result.rowCount ? mapPgNumericToNumber(result.rows) : null;
}

async function getIncome(incomeId) {
    const query = {
        text: 'SELECT * FROM get_income($1);',
        values: [incomeId],
    };
    const result = await client.query(query);
    return result.rowCount ? mapPgNumericToNumber(result.rows) : null;
}

async function getUserIncomesAndExpenses(userId, date, categoryName) {
    const query = {
        text: 'SELECT * FROM get_user_incomes_and_expenses($1, $2, $3);',
        values: [userId, date, categoryName],
    };
    const result = await client.query(query);
    return result.rowCount ? mapPgNumericToNumber(result.rows) : null;
}

async function getUserRoommates(userId) {
    const query = {
        text: 'SELECT * FROM get_user_roommates($1);',
        values: [userId],
    };
    const result = await client.query(query);
    return result.rowCount ? result.rows : null;
}

async function getRoommateExpenseNotifications(userId, date) {
    const query = {
        text: 'SELECT * FROM get_roommate_expense_notifications($1, $2);',
        values: [userId, date],
    };
    const result = await client.query(query);
    return result.rowCount ? mapPgNumericToNumber(result.rows) : null;
}

async function getRoommateIncomesAndExpenses(userId, roommateId) {
    const query = {
        text: 'SELECT * FROM get_roommate_incomes_and_expenses($1, $2);',
        values: [userId, roommateId],
    };
    const result = await client.query(query);
    return result.rowCount ? mapPgNumericToNumber(result.rows) : null;
}

async function getUserCategories(userId) {
    const query = {
        text: 'SELECT * FROM get_user_categories($1);',
        values: [userId],
    };
    const result = await client.query(query);
    return result.rowCount ? mapPgNumericToNumber(result.rows) : null;
}

async function getUserCategoryTotals(userId, date, forYear) {
    const query = {
        text: 'SELECT * FROM get_user_category_totals($1, $2, $3);',
        values: [userId, date, forYear],
    };
    const result = await client.query(query);
    return result.rowCount ? mapPgNumericToNumber(result.rows) : null;
}

async function getTotalIncomesAndExpenes(userId, date, forYear) {
    const query = {
        text: 'SELECT * FROM get_total_incomes_and_expenses($1, $2, $3);',
        values: [userId, date, forYear],
    };
    const result = await client.query(query);
    return result.rowCount ? mapPgNumericToNumber(result.rows) : null;
}

async function getCountOfTransactionsByDate(userId, date) {
    const query = {
        text: 'SELECT * FROM get_count_of_transactions_by_date($1, CAST($2 AS DATE));',
        values: [userId, date],
    };
    const result = await client.query(query);
    return result.rowCount ? mapPgNumericToNumber(result.rows) : null;
}

async function getCountOfTransactionCategories(userId, date) {
    const query = {
        text: 'SELECT * FROM get_count_of_transaction_categories($1, $2);',
        values: [userId, date],
    };
    const result = await client.query(query);
    return result.rowCount ? result.rows : null;
}

async function getAllCategories() {
    const query = {
        text: 'SELECT * FROM get_all_categories();',
        values: [],
    };
    const result = await client.query(query);
    return result.rowCount ? result.rows : null;
}

async function getAllUsers() {
    const query = {
        text: 'SELECT * FROM get_all_users();',
        values: [],
    };
    const result = await client.query(query);
    return result.rowCount ? result.rows : null;
}

async function getUser(userId) {
    const query = {
        text: 'SELECT * FROM get_user($1);',
        values: [userId],
    };
    const result = await client.query(query);
    return result.rowCount ? result.rows : null;
}

async function getUserCategory(userId, categoryId) {
    const query = {
        text: 'SELECT * FROM get_user_category($1, $2);',
        values: [userId, categoryId],
    };
    const result = await client.query(query);
    return result.rowCount ? result.rows : null;
}

async function getRoomateRequests(userId) {
    const query = {
        text: 'SELECT * FROM get_roommate_requests($1);',
        values: [userId],
    };
    const result = await client.query(query);
    return result.rowCount ? result.rows : null;
}

async function getRoomateRequest(requestId) {
    const query = {
        text: 'SELECT * FROM get_roommate_request($1);',
        values: [requestId],
    };
    const result = await client.query(query);
    return result.rowCount ? result.rows : null;
}

async function updateExpense(expenseId, amount, date, description, categoryId) {
    const query = {
        text: 'SELECT * FROM update_expense($1, $2, $3, $4, $5);',
        values: [expenseId, amount, date, description, categoryId],
    };
    const result = await client.query(query);
    return result.rowCount ? result.rows : null;
}

async function updateIncome(incomeId, amount, date, description, categoryId) {
    const query = {
        text: 'SELECT * FROM update_income($1, $2, $3, $4, $5);',
        values: [incomeId, amount, date, description, categoryId],
    };
    const result = await client.query(query);
    return result.rowCount ? result.rows : null;
}

async function acceptRoommateRequest(requestId, accept) {
    const query = {
        text: 'SELECT * FROM accept_roommate_request($1, $2);',
        values: [requestId, accept],
    };
    const result = await client.query(query);
    return result.rowCount ? result.rows : null;
}

async function updateRoommateExpense(expenseId, amount, date, description, categoryId, resolved, acknowledge) {
    const query = {
        text: 'SELECT * FROM update_roommate_expense($1, $2, $3, $4, $5, $6, $7);',
        values: [expenseId, amount, date, description, categoryId, resolved, acknowledge],
    };
    const result = await client.query(query);
    return result.rowCount ? result.rows : null;
}

async function deleteExpense(expenseId) {
    const query = {
        text: 'SELECT * FROM delete_expense($1);',
        values: [expenseId],
    };
    const result = await client.query(query);
    return result.rowCount ? result.rows : null;
}

async function deleteIncome(incomeId) {
    const query = {
        text: 'SELECT * FROM delete_income($1);',
        values: [incomeId],
    };
    const result = await client.query(query);
    return result.rowCount ? result.rows : null;
}

async function deleteRoommate(id1, id2) {
    const query = {
        text: 'SELECT * FROM delete_roommate($1, $2);',
        values: [id1, id2],
    };
    const result = await client.query(query);
    return result.rowCount ? result.rows : null;
}

async function deleteUserCategory(userId, categoryId) {
    const query = {
        text: 'SELECT * FROM delete_user_category($1, $2);',
        values: [userId, categoryId],
    };
    const result = await client.query(query);
    return result.rowCount ? result.rows : null;
}


function mapPgNumericToNumber(arr) {
    return arr.map(r => {
        if(r.amount && r.total)
            return { ...r, amount: +r.amount, total: +r.total };
        else if(r.incomes || r.expenses)
            return { ...r, incomes: +r.incomes, expenses: +r.expenses };
        else if(r.amount)
            return { ...r, amount: +r.amount };
        else if(r.notifications)
            return { ...r, notifications: +r.notifications };
        else if(r.total)
            return { ...r, total: +r.total };
        else return r;
    });
}

module.exports = {
    connect,
    createUser,
    createExpense,
    createIncome,
    createRoommateRequest,
    createUserCategory,
    createRoommateExpense,
    getUserExpenses,
    getExpense,
    getUserIncomes,
    getIncome,
    getUserIncomesAndExpenses,
    getUserRoommates,
    getRoommateExpenseNotifications,
    getRoommateIncomesAndExpenses,
    getUserCategories,
    getUserCategoryTotals,
    getTotalIncomesAndExpenes,
    getCountOfTransactionsByDate,
    getCountOfTransactionCategories,
    getAllCategories,
    getAllUsers,
    getUser,
    getUserCategory,
    getRoomateRequests,
    getRoomateRequest,
    updateExpense,
    updateIncome,
    acceptRoommateRequest,
    updateRoommateExpense,
    deleteExpense,
    deleteIncome,
    deleteRoommate,
    deleteUserCategory
}