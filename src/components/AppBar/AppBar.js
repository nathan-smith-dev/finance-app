import React, { Component, Fragment } from 'react'; 

import Auth from '../../Auth/Auth';

import { withRouter } from 'react-router-dom'; 

import AppBar from 'material-ui/AppBar'; 
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';

import CloseIcon from 'material-ui/svg-icons/navigation/close'; 
import PieIcon from 'material-ui/svg-icons/editor/pie-chart'; 
import ListIcon from 'material-ui/svg-icons/action/view-list'; 
import LockIcon from 'material-ui/svg-icons/action/lock'; 
import AccountIcon from 'material-ui/svg-icons/action/account-circle'; 
import HomeIcon from 'material-ui/svg-icons/action/home'; 

class NavBar extends Component {
    state = {
        showSideDrawer: false, 
        profile: {}
    }; 

    componentWillMount() {
        this.setState({ profile: {} });
        const { userProfile, getProfile } = this.auth;
        if (!userProfile) {
          getProfile((err, profile) => {
            this.setState({ profile });
          });
        } else {
          this.setState({ profile: userProfile });
        }
    }

    auth = new Auth(); 

    toggleSideDrawer = () => {
        this.setState({
            showSideDrawer: !this.state.showSideDrawer, 
        }); 
    }

    login = () => {
        this.auth.login(); 
        this.toggleSideDrawer();
    }

    logout = () => {
        this.auth.logout(); 
        this.toggleSideDrawer(); 
    }

    routeTo(route) {
        this.props.history.push(route);
        this.toggleSideDrawer(); 
    }

    render() {
        let userMenuItem = (
            <MenuItem 
                leftIcon={<LockIcon />}
                onClick={this.login}>Log In
            </MenuItem>
        ); 
        if(this.auth.isAuthenticated()) {
            console.log(this.state.profile); 
            userMenuItem = (
                <MenuItem 
                    leftIcon={<AccountIcon />}
                    onClick={this.logout}
                    >{this.state.profile.name}
                </MenuItem>
            )
        }
        return(
            <Fragment>
                <AppBar 
                    title={this.props.title} 
                    onLeftIconButtonClick={this.toggleSideDrawer}
                    onRightIconButtonClick={this.toggleSideDrawer} />
                <Drawer open={this.state.showSideDrawer}>
                    <MenuItem 
                        rightIcon={<CloseIcon />}
                        onClick={this.toggleSideDrawer}>
                    </MenuItem>
                    {userMenuItem}
                    <Divider />
                    <MenuItem 
                        leftIcon={<HomeIcon />}
                        onClick={() => this.routeTo('/')}>Home
                    </MenuItem>
                    <MenuItem 
                        leftIcon={<ListIcon />}
                        onClick={() => this.routeTo('/expenses-income')}>Expenses / Income
                    </MenuItem>
                    <MenuItem 
                        leftIcon={<PieIcon />}
                        onClick={() => this.routeTo('/finance-trends')}>Trends
                    </MenuItem>
                </Drawer>
            </Fragment>
        ); 
    }
}

export default withRouter(NavBar); 