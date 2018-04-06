import React, { Component } from 'react'; 
import MenuItem from 'material-ui/MenuItem';
import AccountIcon from 'material-ui/svg-icons/action/account-circle'; 
import LockIcon from 'material-ui/svg-icons/action/lock'; 
import CircularProgress from 'material-ui/CircularProgress';


import { connect } from 'react-redux'; 
import { auth } from '../../firebase'; 
import * as authActions from '../../store/actions/auth'; 


class UserMenuItem extends Component {
    componentWillMount() {
        this.authListenerUnsubscribe = auth.authChangeListener(); 
    }

    componentWillUnmount() {
        this.authListenerUnsubscribe(); 
    }

    componentDidMount() {
        if(localStorage.getItem('temp_user')) {
            this.props.updateUser();                      
            localStorage.removeItem('temp_user'); 
        }
    }

    login = () => {
        this.temporaryUser(); 
        auth.signInWithRedirect(); 
        this.props.onToggle();
    }

    logout = () => {
        auth.signOut(); 
        this.props.onToggle();         
    }

    temporaryUser = () => {
        localStorage.setItem('temp_user', "Testing"); 
    }

    render() {
        return (
            this.props.profile 
            ? (
                <MenuItem 
                    leftIcon={<AccountIcon />}
                    onClick={this.logout}
                    >{this.props.profile.uid != "temp_user" ? this.props.profile.displayName : <CircularProgress />}
                </MenuItem>
            )
            : (
                <MenuItem 
                    leftIcon={<LockIcon />}
                    onClick={this.login}
                    > Log In
                </MenuItem>
            )
        ); 
    }
}

const mapStateToProps = state => {
    return {
        profile: state.auth.userProfile
    }
}

const mapDispatchToPRops = dispatch => {
    return {
        updateUser: () => dispatch(authActions.getProfileSuccess({ displayName: "Profile", uid: "temp_user" }))
    }
}

export default connect(mapStateToProps, mapDispatchToPRops)(UserMenuItem); 