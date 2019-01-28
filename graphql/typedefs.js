const { transactionType, transactionTypeDef } = require('./types/transaction');
const { categoryType, categoryTypeDef } = require('./types/category');
const { userType, userTypeDef } = require('./types/user');

const typeDefs = `
    scalar Date

    schema {
        query: Query
    }
    type Query {
        expenses(month: Int, year: Int, categoryId: ID): [${transactionType}]
        incomes(month: Int, year: Int, categoryId: ID): [${transactionType}]
        user: ${userType}
        categories: [${categoryType}]
    }
    ${transactionTypeDef}
    ${categoryTypeDef}
    ${userTypeDef}
`;

module.exports = typeDefs;