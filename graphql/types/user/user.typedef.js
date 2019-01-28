const userType = 'User';

const userTypeDef = `
    type ${userType} {
        id: ID!
        firstName: String
        lastName: String
        email: String
    }
`;

module.exports = {
    userType, 
    userTypeDef
}