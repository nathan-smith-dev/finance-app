const { roommatType, roommateExpenseType } = require('./roommate.typedef');
const { getRoomateExpenses } = require('./roommate.queries');
const { transactionResolver, transactionType } = require('../transaction');

const roommateResolver = {
    [roommatType]: {
        user: (roommate, args, context) => {
            return roommate;
        },
        expenses: (roommate, args, context) => {
            const { user } = context;

            return getRoomateExpenses(user.id, roommate.id);
        }
    }
};

const roommateExpenseResolver = {
    [roommateExpenseType]: {
        category: transactionResolver[transactionType].category
    }
}

module.exports = {
    roommateResolver,
    roommateExpenseResolver
};