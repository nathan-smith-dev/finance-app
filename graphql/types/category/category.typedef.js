const categoryType = 'Category';

const categoryTypeDef = `
    type ${categoryType} {
        id: ID!
        name: String!
    }
`;

module.exports = {
    categoryType, 
    categoryTypeDef
}