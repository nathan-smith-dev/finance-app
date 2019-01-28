const { categoryType } = require('../category');

const transactionType = 'Transaction';

const transactionTypeDef = `
    type ${transactionType} {
        id: ID!
        userId: ID!
        amount: String
        category: ${categoryType}
        description: String
        date: Date
    }
`;

module.exports = {
    transactionType, 
    transactionTypeDef
}