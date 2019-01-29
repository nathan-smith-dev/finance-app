const { query } = require('../../../db/postgres');
const {  addWhereCategory, addWhereMonthAndYear} = require('../../query.helper');

async function getAllExpenses(userId, month, year, categoryId) {
    const orderBy = 'date desc';
    const sql = `select *,
    cast(amount as numeric) 
    from expenses
    where 
        expenses.user_id = $1
        ${addWhereMonthAndYear('expenses', month, year)}
        ${addWhereCategory('expenses', categoryId)}
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

async function getAllIncomes(userId, month, year, categoryId) {
    const orderBy = 'date desc';
    const sql = `select *,
    cast(amount as numeric) 
    from incomes
    where 
        incomes.user_id = $1
        ${addWhereMonthAndYear('incomes', month, year)}
        ${addWhereCategory('incomes', categoryId)}
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

module.exports = {
    getAllExpenses,
    getAllIncomes
}