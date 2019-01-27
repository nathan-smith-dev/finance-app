const { Pool } = require('pg');
const humps = require('humps');

const pool = new Pool({
    connectionString: process.env.DB_CONNECTION_STRING,
});
 
async function query(sql, params) {
    const client = await pool.connect();
    try {
        console.log(sql, params);
        const result = await client.query(sql, params);
        const rows = humps.camelizeKeys(result.rows);
        return { ...result, rows };
    } catch (err) {
        console.log(err);
    } finally {
        client.release();
    }
}

async function createUser(userId, firstName, lastName, email) {
    const sql = 'SELECT * FROM create_user($1, $2, $3, $4)';
    const params = [userId, firstName, lastName, email];

    const result = await query(sql, params);
    return result.rowCount ? result.rows : null;
}

async function createExpense(userId, amount, description, date, categoryName, categoryId) {
    const sql =  'SELECT * FROM create_expense($1, $2, $3, $4, $5, $6);';
    const params = [userId, amount, description, date, categoryName, categoryId];
    
    const result = await query(sql, params);
    return result.rowCount ? mapPgNumericToNumber(result.rows) : null;
}

async function createIncome(userId, amount, description, date, categoryName, categoryId) {
    const sql =  'SELECT * FROM create_income($1, $2, $3, $4, $5, $6);';
    const params = [userId, amount, description, date, categoryName, categoryId];
    
    const result = await query(sql, params);
    return result.rowCount ? mapPgNumericToNumber(result.rows) : null;
}

async function createRoommateRequest(requesterId, recipientId) {
    const sql =  'SELECT * FROM create_roommate_request($1, $2);';
    const params = [requesterId, recipientId];
    
    const result = await query(sql, params);
    return result.rowCount ? result.rows : null;
}

async function createUserCategory(categoryName, userId) {
    const sql =  'SELECT * FROM create_user_category($1, $2);';
    const params = [categoryName, userId];
    
    const result = await query(sql, params);
    return result.rowCount ? result.rows : null;
}

async function createRoommateExpense(expenseTo, expenseFrom, amount, description, date, categoryName, categoryId) {
    const sql =  'SELECT * FROM create_roommate_expense($1, $2, $3, $4, $5, $6, $7);';
    const params = [expenseTo, expenseFrom, amount, description, date, categoryName, categoryId];
    
    const result = await query(sql, params);
    return result.rowCount ? mapPgNumericToNumber(result.rows) : null;
}

async function getUserExpenses(userId, date, categoryName) {
    const sql =  'SELECT * FROM get_user_expenses($1, $2, $3);';
    const params = [userId, date, categoryName];
    
    const result = await query(sql, params);
    return result.rowCount ? mapPgNumericToNumber(result.rows) : null;
}

async function getExpense(expenseId) {
    const sql =  'SELECT * FROM get_expense($1);';
    const params = [expenseId];
    
    const result = await query(sql, params);
    return result.rowCount ? mapPgNumericToNumber(result.rows ): null;
}

async function getUserIncomes(userId, date, categoryName) {
    const sql =  'SELECT * FROM get_user_incomes($1, $2, $3);';
    const params = [userId, date, categoryName];
    
    const result = await query(sql, params);
    return result.rowCount ? mapPgNumericToNumber(result.rows) : null;
}

async function getIncome(incomeId) {
    const sql =  'SELECT * FROM get_income($1);';
    const params = [incomeId];
    
    const result = await query(sql, params);
    return result.rowCount ? mapPgNumericToNumber(result.rows) : null;
}

async function getUserIncomesAndExpenses(userId, date, categoryName) {
    const sql =  'SELECT * FROM get_user_incomes_and_expenses($1, $2, $3);';
    const params = [userId, date, categoryName];
    
    const result = await query(sql, params);
    return result.rowCount ? mapPgNumericToNumber(result.rows) : null;
}

async function getUserRoommates(userId) {
    const sql =  'SELECT * FROM get_user_roommates($1);';
    const params = [userId];
    
    const result = await query(sql, params);
    return result.rowCount ? result.rows : null;
}

async function getRoommateExpenseNotifications(userId, date) {
    const sql =  'SELECT * FROM get_roommate_expense_notifications($1, $2);';
    const params = [userId, date];
    
    const result = await query(sql, params);
    return result.rowCount ? mapPgNumericToNumber(result.rows) : null;
}

async function getRoommateIncomesAndExpenses(userId, roommateId) {
    const sql =  'SELECT * FROM get_roommate_incomes_and_expenses($1, $2);';
    const params = [userId, roommateId];
    
    const result = await query(sql, params);
    return result.rowCount ? mapPgNumericToNumber(result.rows) : null;
}

async function getUserCategories(userId) {
    const sql =  'SELECT * FROM get_user_categories($1);';
    const params = [userId];
    
    const result = await query(sql, params);
    return result.rowCount ? mapPgNumericToNumber(result.rows) : null;
}

async function getUserCategoryTotals(userId, date, forYear) {
    const sql =  'SELECT * FROM get_user_category_totals($1, $2, $3);';
    const params = [userId, date, forYear];
    
    const result = await query(sql, params);
    return result.rowCount ? mapPgNumericToNumber(result.rows) : null;
}

async function getTotalIncomesAndExpenes(userId, date, forYear) {
    const sql =  'SELECT * FROM get_total_incomes_and_expenses($1, $2, $3);';
    const params = [userId, date, forYear];
    
    const result = await query(sql, params);
    return result.rowCount ? mapPgNumericToNumber(result.rows) : null;
}

async function getCountOfTransactionsByDate(userId, date) {
    const sql =  'SELECT * FROM get_count_of_transactions_by_date($1, CAST($2 AS DATE));';
    const params = [userId, date];
    
    const result = await query(sql, params);
    return result.rowCount ? mapPgNumericToNumber(result.rows) : null;
}

async function getCountOfTransactionCategories(userId, date) {
    const sql =  'SELECT * FROM get_count_of_transaction_categories($1, $2);';
    const params = [userId, date];
    
    const result = await query(sql, params);
    return result.rowCount ? result.rows : null;
}

async function getAllCategories() {
    const sql =  'SELECT * FROM get_all_categories();';
    const params = [];
    
    const result = await query(sql, params);
    return result.rowCount ? result.rows : null;
}

async function getAllUsers() {
    const sql =  'SELECT * FROM get_all_users();';
    const params = [];
    
    const result = await query(sql, params);
    return result.rowCount ? result.rows : null;
}

async function getUser(userId) {
    const sql =  'SELECT * FROM get_user($1);';
    const params = [userId];
    
    const result = await query(sql, params);
    return result.rowCount ? result.rows : null;
}

async function getUserCategory(userId, categoryId) {
    const sql =  'SELECT * FROM get_user_category($1, $2);';
    const params = [userId, categoryId];
    
    const result = await query(sql, params);
    return result.rowCount ? result.rows : null;
}

async function getRoomateRequests(userId) {
    const sql =  'SELECT * FROM get_roommate_requests($1);';
    const params = [userId];
    
    const result = await query(sql, params);
    return result.rowCount ? result.rows : null;
}

async function getRoomateRequest(requestId) {
    const sql =  'SELECT * FROM get_roommate_request($1);';
    const params = [requestId];
    
    const result = await query(sql, params);
    return result.rowCount ? result.rows : null;
}

async function updateExpense(expenseId, amount, date, description, categoryId) {
    const sql =  'SELECT * FROM update_expense($1, $2, $3, $4, $5);';
    const params = [expenseId, amount, date, description, categoryId];
    
    const result = await query(sql, params);
    return result.rowCount ? result.rows : null;
}

async function updateIncome(incomeId, amount, date, description, categoryId) {
    const sql =  'SELECT * FROM update_income($1, $2, $3, $4, $5);';
    const params = [incomeId, amount, date, description, categoryId];
    
    const result = await query(sql, params);
    return result.rowCount ? result.rows : null;
}

async function acceptRoommateRequest(requestId, accept) {
    const sql =  'SELECT * FROM accept_roommate_request($1, $2);';
    const params = [requestId, accept];
    
    const result = await query(sql, params);
    return result.rowCount ? result.rows : null;
}

async function updateRoommateExpense(expenseId, amount, date, description, categoryId, resolved, acknowledge) {
    const sql =  'SELECT * FROM update_roommate_expense($1, $2, $3, $4, $5, $6, $7);';
    const params = [expenseId, amount, date, description, categoryId, resolved, acknowledge];
    
    const result = await query(sql, params);
    return result.rowCount ? result.rows : null;
}

async function deleteExpense(expenseId) {
    const sql =  'SELECT * FROM delete_expense($1);';
    const params = [expenseId];
    
    const result = await query(sql, params);
    return result.rowCount ? result.rows : null;
}

async function deleteIncome(incomeId) {
    const sql =  'SELECT * FROM delete_income($1);';
    const params = [incomeId];
    
    const result = await query(sql, params);
    return result.rowCount ? result.rows : null;
}

async function deleteRoommate(id1, id2) {
    const sql =  'SELECT * FROM delete_roommate($1, $2);';
    const params = [id1, id2];
    
    const result = await query(sql, params);
    return result.rowCount ? result.rows : null;
}

async function deleteUserCategory(userId, categoryId) {
    const sql =  'SELECT * FROM delete_user_category($1, $2);';
    const params = [userId, categoryId];
    
    const result = await query(sql, params);
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
    query,
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