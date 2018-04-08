import * as actionTypes from './actionTypes';
import * as transactionActions from './transactions'; 

export const getProfileSuccess = (profile) => {
    return {
        type: actionTypes.GET_PROFILE_SUCCESS, 
        userProfile: profile
    }; 
}; 

export const getProfile = (profile) => {
    return (dispatch, getState) => {
        if(profile) {
            dispatch(transactionActions.getTransactions(profile.uid, getState().transactions.trackedDates.month, getState().transactions.trackedDates.year));     
            dispatch(transactionActions.getTransactionCategories(profile.uid));     
        }

        dispatch(getProfileSuccess(profile)); 
    }
}; 