const { groupBy } = require('ramda');
const { query } = require('../../../db/postgres');
const DataLoader = require('dataloader');

async function getRoommates(userId) {
    const sql = `
    SELECT 
        u.id,
        u.first_name AS "firstName", 
        u.last_name AS "lastName", 
        u.email
    FROM roommates r
    JOIN 
        users as u ON r.roommate1_id = u.id OR 
        r.roommate2_id = u.id
    WHERE 
        (r.roommate1_id = $1 OR r.roommate2_id = $1) AND 
        u.id != $1;
    `;
    
    const params = [userId];
    
    try {
        const result = await query(sql, params);

        return result.rows;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

async function getRoomateExpenses(userId, roommateId) {
    const sql = `
    SELECT
        re.id AS id,
        re.category_id, 
        CAST(re.amount AS NUMERIC), 
        re.description, 
        re.date,
		re.acknowledge as acknowledged,
		'From' as "direction"
    FROM roommate_expenses AS re
    JOIN users AS u ON u.id = re.expense_from
    WHERE 
        re.resolved = false AND
        re.expense_to = $1 AND
        re.expense_from = $2 
	
	UNION ALL
	
	    SELECT
        re2.id AS id,
        re2.category_id, 
        CAST(re2.amount AS NUMERIC), 
        re2.description, 
        re2.date,
		re2.acknowledge as acknowledged,
		'To' as "direction"
    FROM roommate_expenses AS re2
    JOIN users AS u2 ON u2.id = re2.expense_from
    WHERE 
        re2.resolved = false AND
        re2.expense_from = $1 AND
        re2.expense_to = $2 
    ORDER BY date DESC
    `;

    const params = [userId, roommateId];
    
    try {
        const result = await query(sql, params);

        return result.rows;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

async function createRoommateExpense(userId, rommateId, amount, categoryId, description, date) {
    const sql = `
    INSERT INTO roommate_expenses(expense_from, expense_to, amount, category_id, acknowledge, resolved, description, date)
    VALUES($1, $2, $3, $4, false, false, $5, $6)
    RETURNING *,
	   CAST(amount as NUMERIC) as "amount",
	   acknowledge as "acknowledged"
    `;

    const params = [userId, rommateId, amount, categoryId, description, date];

    try {
        const result = await query(sql, params);

        return result.rows[0];
    } catch (err) {
        console.log(err);
        throw err;
    }
}

async function deleteRoommateExpense(id) {
    const sql = `
        DELETE FROM roommate_expenses
        WHERE id = $1
        RETURNING *,
            CAST(amount as NUMERIC) as "amount",
            acknowledge as "acknowledged"
    `;

    const params = [id];

    try {
        const result = await query(sql, params);

        return result.rows[0];
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = {
    getRoommates,
    getRoomateExpenses,
    createRoommateExpense,
    deleteRoommateExpense
}