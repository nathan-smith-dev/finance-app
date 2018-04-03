import * as actionTypes from './actionTypes';
import Auth from '../../Auth/Auth' ; 

const auth = new Auth(); 

export const getProfileStart = () => {
    return {
        type: actionTypes.GET_PROFILE_START
    }
}

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
        dispatch(getProfileStart()); 
        const { userProfile, getProfile } = auth;
        let authProfile = null; 
        if (!userProfile) {
            getProfile((err, profile) => {
                authProfile = profile; 
            });
        }
        else {
            authProfile = userProfile; 
        }

        authProfile ? dispatch(getProfileSuccess(authProfile)) : dispatch(getProfileFailed()); 
    }
}; 