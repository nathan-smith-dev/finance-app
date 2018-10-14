import * as actionTypes from './actionTypes';
import * as apiCalls from '../../api-calls'; 

export const getRoommateRequests = (uid) => {
    return dispatch => {
        apiCalls.getRoommateRequests(requests => {
            if(requests.length > 0)
                dispatch(setRoomateRequests(requests)); 
            else 
                dispatch(setRoomateRequests(null));                 
        }); 
    }
}; 

export const setRoomateRequests = (requests) => {
    return {
        type: actionTypes.GET_ROOMATE_REQUESTS, 
        roommateRequests: requests
    }; 
}; 

export const getRoommates = (uid) => {
    return dispatch => {
        apiCalls.getRoommates(roommate => {
            dispatch(setRoommates(roommate)); 
            apiCalls.getRoommateIncomesAndExpenses(roommate, data => dispatch(setRoommatesTransactions(data)))
        }); 
        apiCalls.getRoommateNotifications(notifcations => {
            let data = {}; 
            for(let notification of notifcations)
                data[notification.roomateId] = notification.notifications;             
            dispatch(updateRoommateNotifications(data)); 
        }); 
    }
}

export const setRoommates = (roommates) => {
    return {
        type: actionTypes.GET_ROOMATES, 
        mates: roommates 
    }; 
}; 

export const setRoommatesTransactions = (trans) => {
    return {
        type: actionTypes.GET_ROOMATES_TRANSACTIONS, 
        transactions: trans
    }; 
}; 

export const updateRoommateNotifications = (notifications) => {
    return {
        type: actionTypes.SET_ROOMMATE_NOTIFICATIONS, 
        notifications: notifications
    }; 
}

export const setFocusedRoomateSuccess = (roommate) => {
    return {
        type: actionTypes.SET_FOCUSED_ROOMMATE, 
        roommate: roommate
    }; 
}; 

export const setFocusedRoomate = (roommateUid) => {
    return dispatch => {
        apiCalls.getUser(roommateUid, user => dispatch(setFocusedRoomateSuccess(user[0]))); 
    }
}; 

export const getRoommateTransactionsToAndFrom = (fromUid, toUid) => {
    return dispatch => {
    }; 
}; 

export const setRoomateTransactionsToAndFrom = (transactions) => {
    return {
        type: actionTypes.GET_ROOMATE_TRANS_TO_AND_FROM, 
        transactions: transactions
    }; 
}; 

