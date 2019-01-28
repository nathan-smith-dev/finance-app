const { expenseType, expenseTypeDef } = require('./types/expense');
const { categoryTypeDef } = require('./types/category');
const { userType, userTypeDef } = require('./types/user');

const typeDefs = `
    scalar Date

    schema {
        query: Query
    }
    type Query {
        expenses(month: Int, year: Int, categoryId: ID): [${expenseType}]
        user: ${userType}
    }
    ${expenseTypeDef}
    ${categoryTypeDef}
    ${userTypeDef}
`;

module.exports = typeDefs;