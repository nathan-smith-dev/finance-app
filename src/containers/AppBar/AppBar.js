import React, { Component, Fragment } from 'react'; 

import { withRouter } from 'react-router-dom'; 

import AppBar from 'material-ui/AppBar'; 
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import CloseIcon from 'material-ui/svg-icons/navigation/close'; 
import PieIcon from 'material-ui/svg-icons/editor/pie-chart'; 
import ListIcon from 'material-ui/svg-icons/action/view-list'; 
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


    routeTo(route) {
        this.props.history.push(route);
        this.toggleSideDrawer(); 
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
                        onClick={this.toggleSideDrawer}>
                    </MenuItem>
                    <UserMenuItem onToggle={this.toggleSideDrawer} />
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