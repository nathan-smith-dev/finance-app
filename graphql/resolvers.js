const { mergeAll } = require('ramda');
const { getAllExpenses, transactionResolver, getAllIncomes } = require('./types/transaction');
const { categoryResolver, getUserCategoriesFromUserId } = require('./types/category');
const { totalResolver, getTotals } = require('./types/total');
const { GraphQLDateTime } = require('graphql-iso-date');


const rootResolver = {
    Query: {
        expenses: (root, args, context) => {
            const month = args.month ? args.month : null;
            const year = args.year ? args.year : null;
            const categoryId = args.categoryId ? args.categoryId : null;
            
            return getAllExpenses(context.user.id, month, year, categoryId);
        },
        incomes: (root, args, context) => {
            const month = args.month ? args.month : null;
            const year = args.year ? args.year : null;
            const categoryId = args.categoryId ? args.categoryId : null;
            
            return getAllIncomes(context.user.id, month, year, categoryId);
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
            
            const type = args.transactionType === 'INCOME' ? 'incomes' : 'expenses';
            const month = args.month ? args.month : null;
            const year = args.year ? args.year : null;


            return getTotals(user.id, type, month, year);
        }
    },
    Date: GraphQLDateTime
}
const resolvers = mergeAll([rootResolver, totalResolver, transactionResolver, categoryResolver]);

module.exports = resolvers;