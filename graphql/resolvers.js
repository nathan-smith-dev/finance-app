const { merge } = require('ramda');
const { getAllExpenses, expenseResolver } = require('./types/expense');
const { categoryResolver } = require('./types/category');
const { GraphQLDateTime } = require('graphql-iso-date');


const rootResolver = {
    Query: {
        expenses: (root, args, context) => {
            const month = args.month ? args.month : null;
            const year = args.year ? args.year : null;
            const categoryId = args.categoryId ? args.categoryId : null;
            
            return getAllExpenses(context.user.id, month, year, categoryId);
        },
        user: (root, args, context) => {
            const { loaders, user } = context;
            console.log('user', user);
            const { getUsersByIdsLoader } = loaders;

            return getUsersByIdsLoader.load([user.id]);
        }
    },
    Date: GraphQLDateTime
}
const resolvers = merge(rootResolver, expenseResolver, categoryResolver);

module.exports = resolvers;