const { query } = require('../../../db/postgres');
const { nextMonthAndYear } = require('../../../utilities/utilities');


async function getAllExpenses(userId, month, year, categoryId) {
    const orderBy = 'date desc';
    const sql = `select * from expenses
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
    const sql = `select * from incomes
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

function addWhereMonthAndYear(type, month, year) {
    if(!month && !year) return '';

    else if(year && !month) {
        const sql = `
        AND 
            ${type}.date >= '${year}-01-01'::date 
        AND 
            ${type}.date < '${year+1}-01-01'::date
        `;
        return sql;
    }

    else {
        const belowMonthAndYear = nextMonthAndYear(month, year);
        const sql = `
        AND 
            ${type}.date >= '${year}-${month}-01'::date 
        AND 
            ${type}.date < '${belowMonthAndYear.year}-${belowMonthAndYear.month}-01'::date
        `;
    
        return sql;
    }
}

function addWhereCategory(type, categoryId) {
    if(!categoryId) return '';

    const sql = `
    AND 
        ${type}.category_id = '${categoryId}'::uuid 
    `;

    return sql;
}

module.exports = {
    getAllExpenses,
    getAllIncomes
}