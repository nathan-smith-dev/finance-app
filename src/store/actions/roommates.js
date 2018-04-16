import * as actionTypes from './actionTypes';
import axios from 'axios'; 
import { withAuth } from '../../firebase/auth'; 

export const getRoommateRequests = (uid) => {
    return dispatch => {
        withAuth(authToken => {
            const url = `${uid}/roommmates/requests.json?auth=${authToken}`; 
            axios.get(url)
                .then(response => {
                    console.log(response.data); 
                    if(response.data) {
                        dispatch(setRoomateRequests(response.data)); 
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
            const url = `${uid}/roommmates/mates.json?auth=${authToken}`; 
            axios.get(url)
                .then(response => {
                    console.log(response.data); 
                    if(response.data) {
                        dispatch(setRoommates(response.data)); 
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