const { userType } = require('../user');
const { categoryType } = require('../category');

const roommatType = 'Roommate';
const roommateExpenseType = 'RoommateExpense';
const roommateExpenseInput = 'RoommateExpenseInput';
const roommateExpenseInputPartial = 'RoommateExpenseInputPartial';

const roommateTypeDef = `
    type ${roommatType} {
        user: ${userType}
        expenses: [${roommateExpenseType}]
    }
    type ${roommateExpenseType} {
        id: ID!
        amount: Float!
        category: ${categoryType}!
        acknowledged: Boolean!
        date: Date
        description: String
        direction: String
    }
    input ${roommateExpenseInput} {
        amount: Float!
        description: String
        date: Date!
        categoryId: ID!
        roommateId: ID!
    }
    input ${roommateExpenseInputPartial} {
        id: ID!
    }
`;

module.exports = {
    roommatType, 
    roommateExpenseType, 
    roommateTypeDef, 
    roommateExpenseInput,
    roommateExpenseInputPartial
}