const { categoryType } = require('../category');

const transactionType = 'Transaction';
const transactionEnum = 'TransactionTypeEnum';

const transactionTypeDef = `
    type ${transactionType} {
        id: ID!
        userId: ID!
        amount: Float!
        category: ${categoryType}!
        description: String
        date: Date!
        type: String!
    }
    enum ${transactionEnum} {
        INCOME
        EXPENSE
        BOTH
    }
`;

module.exports = {
    transactionType, 
    transactionTypeDef,
    transactionEnum
}