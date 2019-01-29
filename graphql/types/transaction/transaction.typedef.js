const { categoryType } = require('../category');

const transactionType = 'Transaction';
const transactionEnum = 'TransactionTypeEnum';

const transactionTypeDef = `
    type ${transactionType} {
        id: ID!
        userId: ID!
        amount: Float
        category: ${categoryType}
        description: String
        date: Date
    }
    enum ${transactionEnum} {
        INCOME
        EXPENSE
    }
`;

module.exports = {
    transactionType, 
    transactionTypeDef,
    transactionEnum
}