const { query } = require('../../../db/postgres');
const { addWhereMonthAndYear } = require('../../query.helper');


async function getCategoryTotals(userId, type, month, year) {
    const sql = `
    select 
        c.name,
        sum(cast(${type}.amount as numeric)) as total
    from ${type} 
    join categories c 
    on c.id = ${type}.category_id
    where ${type}.user_id = $1
    ${addWhereMonthAndYear(type, month, year)}
    group by c.name
    order by total desc
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

async function getTotals(userId, type, month, year) {
    const sql = `
    select
        sum(cast(${type}.amount as numeric)) as total
    from ${type}
    where ${type}.user_id = $1
    ${addWhereMonthAndYear(type, month, year)}
    `;

    const params = [userId];

    try {
        const result = await query(sql, params);

        return result.rows[0];
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = {
    getCategoryTotals,
    getTotals
}