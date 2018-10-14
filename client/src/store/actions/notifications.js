import * as actionTypes from './actionTypes';

export const showNotification = (show, text) => {
    return {
        type: actionTypes.SHOW_NOTIFICATION, 
        notificationText: text, 
        showNotification: show
    }; 
}; 