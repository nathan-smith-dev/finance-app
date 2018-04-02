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
        showSideDrawer: false
    }; 

    toggleSideDrawer = () => {
        this.setState({
            showSideDrawer: !this.state.showSideDrawer, 
        }); 
    }

    login = () => {
        const auth = new Auth(); 
        auth.login(); 
    }

    render() {
        return(
            <Fragment>
                <AppBar 
                    title={this.props.title} 
                    onLeftIconButtonClick={this.toggleSideDrawer}
                    onRightIconButtonClick={this.toggleSideDrawer} />
                <Drawer open={this.state.showSideDrawer}>
                    <MenuItem 
                        rightIcon={<CloseIcon />}
                        onClick={this.toggleSideDrawer}></MenuItem>
                    <MenuItem 
                        leftIcon={<LockIcon />}
                        onClick={this.login}>Log In</MenuItem>
                    <MenuItem 
                        leftIcon={<AccountIcon />}
                        >User</MenuItem>
                    <Divider />
                    <MenuItem 
                        leftIcon={<HomeIcon />}
                        onClick={() => this.props.history.push('/')}>Home</MenuItem>
                    <MenuItem 
                        leftIcon={<ListIcon />}
                        onClick={() => this.props.history.push('/expenses-income')}>Expenses / Income</MenuItem>
                    <MenuItem 
                        leftIcon={<PieIcon />}
                        onClick={() => this.props.history.push('/finance-trends')}>Trends</MenuItem>
                </Drawer>
            </Fragment>
        ); 
    }
}

export default withRouter(NavBar); 