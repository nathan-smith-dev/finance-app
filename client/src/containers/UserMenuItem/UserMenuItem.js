import React, { Component, Fragment } from 'react'; 
import MenuItem from 'material-ui/MenuItem';
import AccountIcon from 'material-ui/svg-icons/action/account-circle'; 
import LockIcon from 'material-ui/svg-icons/action/lock'; 
import WrenchIcon from 'material-ui/svg-icons/action/build'; 
import UsersIcon from 'material-ui/svg-icons/action/supervisor-account'; 
import CircularProgress from 'material-ui/CircularProgress';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Badge from 'material-ui/Badge'; 

import { connect } from 'react-redux'; 
import { auth } from '../../firebase'; 
import * as authActions from '../../store/actions/auth'; 
import { withRouter } from 'react-router-dom';


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

    state = {
        showWarning: false
    }; 

    toggleWarning = () => {
        this.setState({
            showWarning: !this.state.showWarning
        }); 
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

    openTab = (url) => {
        this.props.history.push(url); 
        this.props.onToggle(); 
    }

    getRoommateNotifications = () => {
        let notifications = 0; 
        if(this.props.roommateNotifications && Object.values(this.props.roommateNotifications).length > 0) {
            for(let notificationAmount of Object.values(this.props.roommateNotifications)) {
                notifications += notificationAmount; 
            }
        }
        return notifications; 
    }

    render() {
        const actions = [
            <FlatButton
              label="Cancel"
              primary={true}
              onClick={this.toggleWarning}
            />,
            <FlatButton
              label="Logout"
              primary={true}
              onClick={this.logout}
            />,
        ];

        let icon  = null; 
        const notifications = this.getRoommateNotifications(); 
        if(notifications > 0) {
            icon = (
                <Badge badgeContent={notifications} primary={true} />
            ); 
        }

        return (
            this.props.profile 
            ? (
                <Fragment>
                    <MenuItem 
                        leftIcon={<AccountIcon />}
                        onClick={this.toggleWarning}
                        >{this.props.profile.uid !== "temp_user" ? this.props.profile.displayName : <CircularProgress />}
                    </MenuItem>
                    <MenuItem 
                        leftIcon={<WrenchIcon />}
                        onClick={() => this.openTab('/categories')}
                        >User Categories
                    </MenuItem>
                    <MenuItem 
                        rightIcon={icon}
                        leftIcon={<UsersIcon />}
                        onClick={() => this.openTab('/roommates')}
                        >Roommates
                    </MenuItem>
                    <Dialog
                        actions={actions}
                        modal={false}
                        open={this.state.showWarning}
                        onRequestClose={this.toggleWarning}
                    >
                    <h4>Logout?</h4>
                    </Dialog>
                </Fragment>
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
        profile: state.auth.userProfile, 
        roommates: state.roommates.mates, 
        roommateNotifications: state.roommates.notifications
    }
}

const mapDispatchToPRops = dispatch => {
    return {
        updateUser: () => dispatch(authActions.getProfileSuccess({ displayName: "Profile", uid: "temp_user" }))
    }
}

export default connect(mapStateToProps, mapDispatchToPRops)(withRouter(UserMenuItem)); 