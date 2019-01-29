const { totalType } = require('./total.typedef');
const { getCategoryTotals } = require('./total.queries');

const totalResolver = {
    [totalType]: {
        categoryTotals: (transaction, args, context) => {
            const { user } = context;

            const type = args.transactionType === 'INCOME' ? 'incomes' : 'expenses';
            const month = args.month ? args.month : null;
            const year = args.year ? args.year : null;

            return getCategoryTotals(user.id, type, month, year);
        }
    }
};

module.exports = {
    totalResolver
};