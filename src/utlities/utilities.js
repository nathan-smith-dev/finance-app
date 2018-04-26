export const toFixedNumber = (number, n) => {
    const scaler = 10^n; 
    return Math.round(number * scaler)/scaler; 
} 

export const convertTransactionToDbValues = (obj) => {
    const postObj = {
        date: {
            month: obj.date.getMonth(), 
            day: obj.date.getDate(), 
            year: obj.date.getFullYear()
        }, 
        amount: +obj.amount, 
        type: obj.type, 
        category: obj.category, 
        desc: obj.desc
    }

    return postObj; 
}