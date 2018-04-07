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
import { pink500 } from 'material-ui/styles/colors'; 

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
                        style={this.props.location.pathname === '/' ? {color: pink500} : null}
                        leftIcon={<HomeIcon color={this.props.location.pathname === '/' ? pink500 : null} />}
                        onClick={() => this.routeTo('/')}>Home
                    </MenuItem>
                    <MenuItem 
                        style={this.props.location.pathname === '/expenses-income' ? {color: pink500} : null}
                        leftIcon={<ListIcon color={this.props.location.pathname === '/expenses-income' ? pink500 : null} />}
                        onClick={() => this.routeTo('/expenses-income')}>Expenses / Income
                    </MenuItem>
                    <MenuItem 
                        style={this.props.location.pathname === '/finance-trends' ? {color: pink500} : null}
                        leftIcon={<PieIcon color={this.props.location.pathname === '/finance-trends' ? pink500 : null} />}
                        onClick={() => this.routeTo('/finance-trends')}>Trends
                    </MenuItem>
                </Drawer>
            </Fragment>
        ); 
    }
}


export default withRouter(NavBar); 