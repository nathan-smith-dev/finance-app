const sql = require('mssql'); 

sql.on('error', err => {
    console.log(err.message); 
})

const config = {
    user: 'webapp',
    password: 'Hps@051418',
    server: 'localhost\\SQLEXPRESS', // You can use 'localhost\\instance' to connect to named instance
    database: 'budget-space__test'
}

async function queryDataBase(query) {
    try {
        sql.close(); 
        const pool = await sql.connect(config); 
        const result = await pool.request()
            .query(query); 
        // console.log('[Successful Query]', result); 
        sql.close(); 
        return result; 
    }
    catch(err) {
        console.log(err); 
    }
}

module.exports = queryDataBase; 