function addWhereMonthAndYear(type, month, year) {
    if(!month && !year) return '';

    else if(year && !month) {
        const sql = `
        AND 
            ${type}.date >= '${year}-01-01'::date 
        AND 
            ${type}.date < '${year+1}-01-01'::date
        `;
        return sql;
    }

    else {
        const belowMonthAndYear = nextMonthAndYear(month, year);
        const sql = `
        AND 
            ${type}.date >= '${year}-${month}-01'::date 
        AND 
            ${type}.date < '${belowMonthAndYear.year}-${belowMonthAndYear.month}-01'::date
        `;
    
        return sql;
    }
}

function addWhereCategory(type, categoryId) {
    if(!categoryId) return '';

    const sql = `
    AND 
        ${type}.category_id = '${categoryId}'::uuid 
    `;

    return sql;
}

function nextMonthAndYear(month, year) {
    let nextMonth = month + 1;
    let adjustedYear = year
    if(nextMonth > 12) {
        nextMonth = 1;
        adjustedYear++;
    }

    return { month: nextMonth, year: adjustedYear };
}

function getTransactionTypeFromTransactionTypeEnum(enumType) {
    switch(enumType) {
        case 'EXPENSE':
        case 'expenses':
            return 'Expense';
        case 'INCOME':
        case 'incomes':
            return 'Income';
        default:
            throw Error('Transaction enum type not defined');
    }
}

module.exports = {
    addWhereCategory,
    addWhereMonthAndYear,
    getTransactionTypeFromTransactionTypeEnum
}