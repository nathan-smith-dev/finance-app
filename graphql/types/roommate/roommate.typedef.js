const { userType } = require('../user');
const { categoryType } = require('../category');

const roommatType = 'Roommate';
const roommateExpenseType = 'RoommateExpense';

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
`;

module.exports = {
    roommatType, 
    roommateExpenseType, 
    roommateTypeDef
}