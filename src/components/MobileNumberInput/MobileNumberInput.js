import React from 'react'; 
import PropTypes from 'prop-types'; 

import TextField from 'material-ui/TextField'; 

const handleNumberChange = (event, originalNumber, onChangeCallback) => {
    if(!originalNumber) {
        originalNumber = ""; 
    }
    // convert state value to string, we need string to keep consecutive zeros after decimal point
    let newAmount = (originalNumber + "").split("");
    newAmount.splice(newAmount.indexOf("."), 1); // remove decimal from array 

    if(event.keyCode === 8) { // backspace
        if(newAmount.length) {
            newAmount.pop(); 
        }
    }

    const number = +event.key; 
    if(Number.isInteger(number)) {
        if(!newAmount.length) {
            newAmount = [0, 0, 0, number]; 
        }
        else {
            newAmount.push(number+""); 
        }
    }

    newAmount.splice(-2, 0, "."); 
    newAmount = +newAmount.join(""); 

    if(Number.isFinite(newAmount)) {
        onChangeCallback(newAmount); 
    }
}

const mobileNumberInput = ({ hintText, value, onChange }) => {
    if(value && value.indexOf(".") === -1) {
        value += ".00"; 
    }

    return (
        <TextField 
            style={{maxWidth: '100%'}}
            pattern="\d*"
            type="number" 
            hintText={hintText}
            step="0.01"
            value={value}
            onKeyDown={(event) => handleNumberChange(event, value, onChange)} />
    ); 
};

mobileNumberInput.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func
}; 

export default mobileNumberInput; 