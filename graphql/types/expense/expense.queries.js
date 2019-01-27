const { query } = require('../../../db/postgres');
const { nextMonthAndYear } = require('../../../utilities/utilities');


async function getAllExpenses(userId, month, year, categoryId) {
    // const orderBy = ORDER_BY[args.orderBy];
    console.log(month, year);
    const orderBy = 'date desc';
    const sql = `select * from expenses
    where 
        expenses.user_id = $1
        ${addWhereMonthAndYear(month, year)}
        ${addWhereCategory(categoryId)}
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

function addWhereMonthAndYear(month, year) {
    if(!month && !year) return '';

    else if(year && !month) {
        const sql = `
        AND 
            expenses.date >= '${year}-01-01'::date 
        AND 
            expenses.date < '${year+1}-01-01'::date
        `;
        return sql;
    }

    else {
        const belowMonthAndYear = nextMonthAndYear(month, year);
        const sql = `
        AND 
            expenses.date >= '${year}-${month}-01'::date 
        AND 
            expenses.date < '${belowMonthAndYear.year}-${belowMonthAndYear.month}-01'::date
        `;
    
        return sql;
    }
}

function addWhereCategory(categoryId) {
    if(!categoryId) return '';

    const sql = `
    AND 
        expenses.category_id = '${categoryId}'::uuid 
    `;

    return sql;
}

module.exports = {
    getAllExpenses
}