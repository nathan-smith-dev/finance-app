const { groupBy } = require('ramda');
const { query } = require('../../../db/postgres');
const DataLoader = require('dataloader');


async function getCategorById(id) {
    const sql = `select * from categories
    where categories.id = $1`;

    const params = [id];

    try {
        const result = await query(sql, params);

        return result.rows[0];
    } catch (err) {
        console.log(err);
        throw err;
    }
}

function getCategoriesByIdsLoader() {
    return new DataLoader(getCategoriesByIds);
}

async function getCategoriesByIds(ids) {
    const sql = `select * from categories
    where categories.id = ANY($1::uuid[])`;

    const params = [ids];

    try {
        const result = await query(sql, params);
        const rowsById = groupBy(category => category.id, result.rows);

        const mapped = ids.map(id => rowsById[id] ? rowsById[id][0] : null);
        return mapped;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

async function getUserCategoriesFromUserId(userId) {
    const sql = `select c.* 
    from user_categories as uc
    join categories as c on uc.category_id = c.id
    where uc.user_id = $1
    order by c.name asc`;
    
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
    getCategorById,
    getCategoriesByIdsLoader,
    getUserCategoriesFromUserId
}