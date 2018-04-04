import * as actionTypes from './actionTypes';
import Auth from '../../Auth/Auth' ; 

const auth = new Auth(); 

export const getProfileSuccess = (profile) => {
    return {
        type: actionTypes.GET_PROFILE_SUCCESS, 
        userProfile: profile
    }
}

export const getProfileFailed = () => {
    return {
        type: actionTypes.GET_PROFILE_FAILED
    }
}

export const getAuthProfile = () => {
    return dispatch => {
        const { userProfile, getProfile } = auth;
        let authProfile = null; 
        if (!userProfile) {
            getProfile((err, profile) => {
                authProfile = profile; 
                dispatch(getProfileSuccess(authProfile));
            });
        }
        else {
            authProfile = userProfile; 
            auth.isAuthenticated() ? dispatch(getProfileSuccess(authProfile)) : dispatch(getProfileFailed()); 
        }
    }
}; 