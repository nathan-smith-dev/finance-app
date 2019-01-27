
function nextMonthAndYear(month, year) {
    let nextMonth = month + 1;
    let adjustedYear = year
    if(nextMonth > 12) {
        nextMonth = 1;
        adjustedYear++;
    }

    return { month: nextMonth, year: adjustedYear };
}

module.exports = {
    nextMonthAndYear
};