const { mergeAll } = require('ramda');
const { getAllTransactionsByType, getAllTransactions, transactionResolver } = require('./types/transaction');
const { categoryResolver, getUserCategoriesFromUserId } = require('./types/category');
const { totalResolver, getTotals } = require('./types/total');
const { GraphQLDateTime } = require('graphql-iso-date');


const rootResolver = {
    Query: {
        transactions: (root, args, context) => {
            const { month, year, categoryId, transactionType } = args; 
            const { user } = context;
            
            if(transactionType === 'BOTH') {
                return getAllTransactions(user.id, month, year);
            }

            const type = transactionType === 'INCOME' ? 'incomes' : 'expenses';
            return getAllTransactionsByType(user.id, type, month, year, categoryId);
        },
        user: (root, args, context) => {
            const { loaders, user } = context;
            const { getUsersByIdsLoader } = loaders;

            return getUsersByIdsLoader.load([user.id]);
        },
        categories: (root, args, context) => {
            const { user } = context;

            return getUserCategoriesFromUserId(user.id);

        },
        totals: (root, args, context) => {
            const { user } = context;
            
            const { month, year, transactionType } = args; 
            const type = transactionType === 'INCOME' ? 'incomes' : 'expenses';


            return getTotals(user.id, type, month, year);
        }
    },
    Date: GraphQLDateTime
}
const resolvers = mergeAll([rootResolver, totalResolver, transactionResolver, categoryResolver]);

module.exports = resolvers;