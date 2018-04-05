import * as actionTypes from './actionTypes';
import * as transactionActions from './transactions'; 

export const getProfileSuccess = (profile) => {
    return {
        type: actionTypes.GET_PROFILE_SUCCESS, 
        userProfile: profile
    }; 
}; 

export const getProfile = (profile) => {
    return dispatch => {
        if(profile)
            dispatch(transactionActions.getTransactions(profile.uid));     

        dispatch(getProfileSuccess(profile)); 
    }
}; 