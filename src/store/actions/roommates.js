import * as actionTypes from './actionTypes';
import axios from 'axios'; 
import { withAuth } from '../../firebase/auth'; 
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
    return (dispatch, getState) => {
        const currentUserUid = getState().auth.userProfile.uid; 
        withAuth(authToken => {
            const url = `profiles/${roommateUid}.json?auth=${authToken}`; 
            axios.get(url)
                .then(response => {
                    dispatch(setFocusedRoomateSuccess(response.data)); 
                    dispatch(getRoommateTransactionsToAndFrom(roommateUid, currentUserUid)); 
                })
                .catch(error => console.log(error))
        }); 
    }; 
}; 

export const getRoommateTransactionsToAndFrom = (fromUid, toUid) => {
    return dispatch => {
        withAuth(authToken => {
            const urlFrom = `${toUid}/roommates/mates/${fromUid}/transactions.json?auth=${authToken}`; 
            const urlTo = `${fromUid}/roommates/mates/${toUid}/transactions.json?auth=${authToken}`; 
            axios.all([
                axios.get(urlFrom).catch(error => console.log(error)), 
                axios.get(urlTo).catch(error => console.log(error))
            ])
            .then(axios.spread((resFrom, resTo) => {
                const data = addKeyIdsAndDirection(resFrom.data, 'from').concat(addKeyIdsAndDirection(resTo.data, 'to'));
                data.sort((a,b) => b.date.day - a.date.day); 
                dispatch(setRoomateTransactionsToAndFrom(data)); 
            }))
        }); 
    }; 
}; 

const addKeyIdsAndDirection = (obj, dir) => {
    if(obj && Object.keys(obj).length > 0) {
        return Object.keys(obj).map(key => {
            return {...obj[key], id: key, direction: dir}
        })
    }
    return []; 
}; 

export const setRoomateTransactionsToAndFrom = (transactions) => {
    return {
        type: actionTypes.GET_ROOMATE_TRANS_TO_AND_FROM, 
        transactions: transactions
    }; 
}; 

