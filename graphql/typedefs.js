const { transactionType, transactionTypeDef, transactionEnum, transactionInput, transactionInputPartial } = require('./types/transaction');
const { categoryType, categoryTypeDef } = require('./types/category');
const { userType, userTypeDef } = require('./types/user');
const { totalType, totalTypeDef, categoryTotalsTypeDef } = require('./types/total');
const { roommatType, roommateTypeDef, roommateExpenseInput, roommateExpenseType } = require('./types/roommate');

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
        roommates: [${roommatType}]
    }
    type Mutation {
        createTransaction(transaction: ${transactionInput}!): ${transactionType}!
        deleteTransaction(transaction: ${transactionInputPartial}!): ${transactionType}!
        createRoommateExpense(expense: ${roommateExpenseInput}!): ${roommateExpenseType}!
    }
    ${transactionTypeDef}
    ${categoryTypeDef}
    ${userTypeDef}
    ${totalTypeDef}
    ${categoryTotalsTypeDef}
    ${roommateTypeDef}
`;

module.exports = typeDefs;