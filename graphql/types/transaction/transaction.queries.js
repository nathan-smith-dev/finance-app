const { query } = require('../../../db/postgres');
const {  addWhereCategory, addWhereMonthAndYear, getTransactionTypeFromTransactionTypeEnum} = require('../../query.helper');

async function getAllTransactionsByType(userId, type, month, year, categoryId) {
    const orderBy = 'date desc';
    const transType = getTransactionTypeFromTransactionTypeEnum(type);
    const sql = `select 
        *,
        cast(amount as numeric) ,
        '${transType}' as "type"
    from ${type}
    where 
        ${type}.user_id = $1
        ${addWhereMonthAndYear(type, month, year)}
        ${addWhereCategory(type, categoryId)}
    order by ${orderBy}`;

    const params = [userId];

    try {
        const result = await query(sql, params);

        return result.rows;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

async function getAllTransactions(userId, month, year) {
    const sql = `
    SELECT 
        i.id,
        CAST(i.amount AS NUMERIC), 
        i.category_id AS "categoryId",
        ca.name AS "category",
        i.date, 
        i.description AS "desc",
        'Income' AS "type"
    FROM 
        incomes i 
    JOIN 
        categories ca ON i.category_id = ca.id
    WHERE 
        i.user_id = $1
        ${addWhereMonthAndYear('i', month, year)}
    UNION ALL 

    SELECT 
        e.id,
        CAST(e.amount AS NUMERIC), 
        e.category_id AS "categoryId",
        ca.name AS "category",
        e.date, 
        e.description AS "desc",
        'Expense' AS "type"
    FROM 
        expenses e 
    JOIN 
        categories ca ON e.category_id = ca.id
    WHERE 
        e.user_id = $1
        ${addWhereMonthAndYear('e', month, year)}

    ORDER BY date DESC;
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

async function createTransaction(userId, type, date, categoryId, amount, description = null) {
    const transType = getTransactionTypeFromTransactionTypeEnum(type);
    
    const sql = `
    INSERT INTO ${type}(user_id, amount, category_id, description, date)
	VALUES ($1, $2, $3, $4, $5)
        RETURNING 
            *, 
            '${transType}' as "type";
    `;

    const params = [userId, amount, categoryId, description, date];

    try {
        const result = await query(sql, params);

        return result.rows[0];
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = {
    getAllTransactionsByType,
    getAllTransactions, 
    createTransaction
}