require('dotenv').config();
const { connect, getTotalIncomesAndExpenes } = require('./db/postgres');

connect();

setTimeout(async () => {
    console.log('start');
    const resutl = await getTotalIncomesAndExpenes('I0pcMkiwHDX77EIZ59lLMQaa9cp2', '2018-10-01', false );
    console.log(resutl);
}, 2000);