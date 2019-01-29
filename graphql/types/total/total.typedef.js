const { transactionEnum } = require('../transaction');
const totalType = 'Total';
const categoryTotalsType = 'CategoryTotals';

const totalTypeDef = `
    type ${totalType} {
        total: Float
        categoryTotals(transactionType: ${transactionEnum}!, month: Int, year: Int): [${categoryTotalsType}]
    }
`;

const categoryTotalsTypeDef = `
    type ${categoryTotalsType} {
        name: String
        total: Float
    }
`;

module.exports = {
    totalType, 
    totalTypeDef, 
    categoryTotalsType,
    categoryTotalsTypeDef
};