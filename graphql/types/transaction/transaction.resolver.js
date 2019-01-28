const { transactionType } = require('./transaction.typedef');

const transactionResolver = {
    [transactionType]: {
        category: (transaction, args, context) => {
            const { loaders } = context;
            const { getCategoriesByIdsLoader } = loaders;

            return getCategoriesByIdsLoader.load(transaction.categoryId);
        }
    }
};

module.exports = {
    transactionResolver
};