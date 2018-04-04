import React, { Component, Fragment } from 'react'; 

import { withRouter } from 'react-router-dom'; 
import { connect } from 'react-redux'; 

import AppBar from 'material-ui/AppBar'; 
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import CloseIcon from 'material-ui/svg-icons/navigation/close'; 
import PieIcon from 'material-ui/svg-icons/editor/pie-chart'; 
import ListIcon from 'material-ui/svg-icons/action/view-list'; 
import LockIcon from 'material-ui/svg-icons/action/lock'; 
import HomeIcon from 'material-ui/svg-icons/action/home'; 

import UserMenuItem from '../UserMenuItem/UserMenuItem'; 

class NavBar extends Component {
    state = {
        showSideDrawer: false
    }; 

    toggleSideDrawer = () => {
        this.setState({
            showSideDrawer: !this.state.showSideDrawer, 
        }); 
    }

    login = () => {
        this.props.auth.login(); 
        this.toggleSideDrawer();
    }

    logout = () => {
        this.props.auth.logout(); 
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
        if(this.props.auth.isAuthenticated()) {
            userMenuItem = (
                <UserMenuItem auth={this.props.auth} logout={this.logout} />
            ); 
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

const mapStateToProps = (state) => {
    return {
        auth: state.auth.auth
    };
};

export default connect(mapStateToProps)(withRouter(NavBar)); 