const { expenseType } = require('./expense.typedef');
const { getCategorById } = require('../category');

const expenseResolver = {
    [expenseType]: {
        category: (expense, args, context) => {
            const { loaders } = context;
            const { getCategoriesByIdsLoader } = loaders;

            return getCategoriesByIdsLoader.load(expense.categoryId);
        }
    }
};

module.exports = {
    expenseResolver
};