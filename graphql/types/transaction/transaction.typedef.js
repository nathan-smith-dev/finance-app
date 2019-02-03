const { categoryType } = require('../category');

const transactionType = 'Transaction';
const transactionEnum = 'TransactionTypeEnum';
const transactionInput = 'TransactionInput';
const transactionInputPartial = 'TransactionInputPartial';

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
    input ${transactionInput} {
        amount: Float!
        description: String
        date: Date!
        categoryId: ID!
        transactionType: ${transactionEnum}!
    }
    input ${transactionInputPartial} {
        id: ID!
        transactionType: ${transactionEnum}!
    }
`;

module.exports = {
    transactionType, 
    transactionTypeDef,
    transactionEnum,
    transactionInput,
    transactionInputPartial
}