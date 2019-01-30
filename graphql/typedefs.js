const { transactionType, transactionTypeDef, transactionEnum } = require('./types/transaction');
const { categoryType, categoryTypeDef } = require('./types/category');
const { userType, userTypeDef } = require('./types/user');
const { totalType, totalTypeDef, categoryTotalsTypeDef } = require('./types/total');

const typeDefs = `
    scalar Date

    schema {
        query: Query
    }
    type Query {
        transactions(transactionType: ${transactionEnum}!, month: Int, year: Int, categoryId: ID): [${transactionType}]
        user: ${userType}
        categories: [${categoryType}]
        totals(transactionType: ${transactionEnum}!, month: Int, year: Int): ${totalType}
    }
    ${transactionTypeDef}
    ${categoryTypeDef}
    ${userTypeDef}
    ${totalTypeDef}
    ${categoryTotalsTypeDef}
`;

module.exports = typeDefs;