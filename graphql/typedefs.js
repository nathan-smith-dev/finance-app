const { transactionType, transactionTypeDef, transactionEnum, transactionInput, transactionInputPartial } = require('./types/transaction');
const { categoryType, categoryTypeDef } = require('./types/category');
const { userType, userTypeDef } = require('./types/user');
const { totalType, totalTypeDef, categoryTotalsTypeDef } = require('./types/total');

const typeDefs = `
    scalar Date

    schema {
        query: Query
        mutation: Mutation
    }
    type Query {
        transactions(transactionType: ${transactionEnum}!, month: Int, year: Int, categoryId: ID): [${transactionType}]
        user: ${userType}
        categories: [${categoryType}]
        totals(transactionType: ${transactionEnum}!, month: Int, year: Int): ${totalType}
    }
    type Mutation {
        createTransaction(transaction: ${transactionInput}!): ${transactionType}!
        deleteTransaction(transaction: ${transactionInputPartial}!): ${transactionType}!
    }
    ${transactionTypeDef}
    ${categoryTypeDef}
    ${userTypeDef}
    ${totalTypeDef}
    ${categoryTotalsTypeDef}
`;

module.exports = typeDefs;