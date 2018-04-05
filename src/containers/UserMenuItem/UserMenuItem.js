import React, { Component } from 'react'; 
import MenuItem from 'material-ui/MenuItem';
import AccountIcon from 'material-ui/svg-icons/action/account-circle'; 
import LockIcon from 'material-ui/svg-icons/action/lock'; 

import { connect } from 'react-redux'; 
import { auth } from '../../firebase'; 


class UserMenuItem extends Component {
    componentWillMount() {
        auth.authChangeListener(); 
    }

    login = () => {
        auth.signInWithRedirect(); 
        this.props.onToggle();         
    }

    logout = () => {
        auth.signOut(); 
        this.props.onToggle();         
    }

    render() {
        return (
            this.props.profile 
            ? (
                <MenuItem 
                    leftIcon={<AccountIcon />}
                    onClick={this.logout}
                    >{this.props.profile.displayName ? this.props.profile.displayName : "Profile"}
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

export default connect(mapStateToProps)(UserMenuItem); 