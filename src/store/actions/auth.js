import * as actionTypes from './actionTypes';
import * as transactionActions from './transactions'; 
import * as roommateActions from './roommates'; 
import * as apiCalls from '../../api-calls'; 

export const getProfileSuccess = (profile) => {
    return {
        type: actionTypes.GET_PROFILE_SUCCESS, 
        userProfile: profile
    }; 
}; 

export const getProfile = (profile) => {
    return (dispatch, getState) => {
        if(profile) {
            dispatch(transactionActions.getIncomes(profile.uid, getState().transactions.trackedDates.month, getState().transactions.trackedDates.year));     
            dispatch(transactionActions.getIncomeAndExpenses(profile.uid, getState().transactions.trackedDates.month, getState().transactions.trackedDates.year));     
            dispatch(transactionActions.getExpenses(profile.uid, getState().transactions.trackedDates.month, getState().transactions.trackedDates.year));     
            dispatch(addProfileToDb(profile)); 
            dispatch(getAllUsers()); 
            dispatch(roommateActions.getRoommateRequests(profile.uid)); 
            dispatch(roommateActions.getRoommates(profile.uid)); 
        }
        
        dispatch(getProfileSuccess(profile)); 
    }
};

export const addProfileToDb = (profile) => {
    const names = profile.displayName.split(' '); 
    const filteredProfile = { id: profile.uid, email: profile.email, firstName: names[0], lastName: names[1] }; 
    return dispatch => {
        apiCalls.addUser(filteredProfile, user => {
            // console.log(user)
        }); 
        return; 
    }; 
};

export const setAllUsers = (users) => {
    return {
        type: actionTypes.GET_ALL_USERS, 
        allUsers: users
    }
}; 

export const getAllUsers = () => {
    return dispatch => {
        apiCalls.getAllUsers(users => {
            dispatch(setAllUsers(users)); 
        }); 
    }
}