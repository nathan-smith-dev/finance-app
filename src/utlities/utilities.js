export const toFixedNumber = (number, n) => {
    const scaler = 10^n; 
    return Math.round(number * scaler)/scaler; 
} 