import * as actionTypes from './actionTypes';
import axios from 'axios'; 
import { withAuth } from '../../firebase/auth'; 

export const getRoommateRequests = (uid) => {
    return dispatch => {
        withAuth(authToken => {
            const url = `${uid}/roommates/requests.json?auth=${authToken}`; 
            axios.get(url)
                .then(response => {
                    if(response.data) {
                        console.log(Object.values(response.data)); 
                        dispatch(setRoomateRequests(Object.values(response.data))); 
                    }
                    else if(!response.data) {
                        dispatch(setRoomateRequests(null)); 
                    }
                })
                .catch(error => console.log(error)); 
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
        withAuth(authToken => {
            const url = `${uid}/roommates/mates.json?auth=${authToken}`; 
            axios.get(url)
                .then(response => {
                    // console.log(Object.values(response.data)); 
                    if(response.data) {
                        dispatch(setRoommates(Object.values(response.data))); 
                    }
                })
                .catch(error => console.log(error)); 
        }); 
    }
}

export const setRoommates = (roommates) => {
    return {
        type: actionTypes.GET_ROOMATES, 
        mates: roommates 
    }; 
}; 

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
    return Object.keys(obj).map(key => {
        return {...obj[key], id: key, direction: dir}
    })
}; 

export const setRoomateTransactionsToAndFrom = (transactions) => {
    return {
        type: actionTypes.GET_ROOMATE_TRANS_TO_AND_FROM, 
        transactions: transactions
    }; 
}; 

