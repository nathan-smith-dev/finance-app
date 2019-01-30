const { query } = require('../../../db/postgres');
const {  addWhereCategory, addWhereMonthAndYear} = require('../../query.helper');

async function getAllTransactions(userId, type, month, year, categoryId) {
    const orderBy = 'date desc';
    const sql = `select *,
    cast(amount as numeric) 
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

module.exports = {
    getAllTransactions
}