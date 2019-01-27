const { categoryType } = require('../category');

const expenseType = 'Expense';

const expenseTypeDef = `
    type ${expenseType} {
        id: ID!
        userId: ID!
        amount: String
        category: ${categoryType}
        description: String
        date: Date
    }
`;

module.exports = {
    expenseType, 
    expenseTypeDef
}