import * as actionTypes from '../actions/actionTypes'; 

const initialState = {
    notificationText: null, 
    showNotification: false
}; 

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.SHOW_NOTIFICATION: 
            return {
                ...state,
                notificationText: action.notificationText,
                showNotification: action.showNotification
            }; 
        default: 
            return {
                ...state
            }; 
    }
}; 

export default reducer; 