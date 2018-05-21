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

export const filterUniqueArray = (array) => {
    return array.filter((value, index, self) => self.indexOf(value) === index)
}

export const formatDate = (date) => {
    const adjustedDate = calcTimezoneOffset(date); 
    return `${adjustedDate.getMonth() + 1}-${adjustedDate.getDate()}`; // add one to month because 0 index 
}

export const calcTimezoneOffset = (date) => {
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() + userTimezoneOffset); 
}