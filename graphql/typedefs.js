const { expenseType, expenseTypeDef } = require('./types/expense');
const { categoryType, categoryTypeDef } = require('./types/category');
const { userType, userTypeDef } = require('./types/user');

const typeDefs = `
    scalar Date

    schema {
        query: Query
    }
    type Query {
        expenses(month: Int, year: Int, categoryId: ID): [${expenseType}]
        user: ${userType}
        categories: [${categoryType}]
    }
    ${expenseTypeDef}
    ${categoryTypeDef}
    ${userTypeDef}
`;

module.exports = typeDefs;