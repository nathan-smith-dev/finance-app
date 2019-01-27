const { expenseType, expenseTypeDef } = require('./types/expense');
const { categoryTypeDef } = require('./types/category');

const typeDefs = `
    scalar Date

    schema {
        query: Query
    }
    type Query {
        expenses(month: Int, year: Int, categoryId: ID): [${expenseType}]
    }
    ${expenseTypeDef}
    ${categoryTypeDef}
`;

module.exports = typeDefs;