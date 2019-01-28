const DataLoader = require('dataloader');
const { groupBy } = require('ramda');
const { query } = require('../../../db/postgres');


async function getUsersByIds(ids) {
    const sql = `
    select * from users
    where users.id = ANY($1)
    `;

    const params = [ids];   

    try {
        const result = await query(sql, params);
        const rowsById = groupBy(user => user.id, result.rows);

        const mapped = ids.map(id => rowsById[id] ? rowsById[id][0] : null);
        return mapped;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

function getUsersByIdsLoader() {
    return new DataLoader(getUsersByIds);
}


module.exports = {
    getUsersByIdsLoader
}