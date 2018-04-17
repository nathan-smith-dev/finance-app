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
        withAuth(authToken => {
            const url = `profiles/${roommateUid}.json?auth=${authToken}`; 
            axios.get(url)
                .then(response => {
                    dispatch(setFocusedRoomateSuccess(response.data)); 
                    dispatch(getRoommateTransactionsFrom(roommateUid, getState().auth.userProfile.uid)); 
                })
                .catch(error => console.log(error))
        }); 
    }; 
}; 

export const getRoommateTransactionsFrom = (fromUid, toUid) => {
    return dispatch => {
        withAuth(authToken => {
            const url = `${toUid}/roommates/mates/${fromUid}/transactions.json?auth=${authToken}`; 
            axios.get(url)
                .then(response => {
                    if(response.data) {
                        console.log(Object.values(response.data)); 
                        dispatch(setRoomateTransactionsFrom(Object.values(response.data))); 
                    }
                    else if(!response.data) {
                        dispatch(setRoomateTransactionsFrom(null)); 
                    }
                })
                .catch(error => console.log(error)); 
        }); 
    }; 
}; 

export const setRoomateTransactionsFrom = (transactions) => {
    return {
        type: actionTypes.GET_ROOMATE_TRANS_FROM, 
        transactions: transactions
    }; 
}; 

