import React, { Component, Fragment } from 'react'; 
import PropTypes from 'prop-types'; 

import { withRouter } from 'react-router-dom'; 

import AppBar from 'material-ui/AppBar'; 
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import CloseIcon from 'material-ui/svg-icons/navigation/close'; 
import PieIcon from 'material-ui/svg-icons/editor/pie-chart'; 
import DateIcon from 'material-ui/svg-icons/action/date-range'; 
import ListIcon from 'material-ui/svg-icons/action/view-list'; 
import HomeIcon from 'material-ui/svg-icons/action/home'; 
import { pink500 } from 'material-ui/styles/colors'; 
import budgetSpaceLogo from '../../images/BudgetSpaceLogo.svg'; 
import Subheader from 'material-ui/Subheader'; 
import Media from '../../components/Media/Media'; 
import UserMenuItem from '../UserMenuItem/UserMenuItem'; 


class NavBar extends Component {
    state = { showSideDrawer: false }

    static propTypes = { title: PropTypes.string }

    toggleSideDrawer = () => {
        this.setState(prevState => ( {showSideDrawer: !prevState.showSideDrawer} )); 
    }

    routeTo(route) {
        this.props.history.push(route);
        this.toggleSideDrawer(); 
    }

    isPageActive = (pathName) => {
        return this.props.location.pathname === pathName ? pink500 : null
    }

    render() {
        const { title } = this.props; 

        return(
            <Fragment>
                <AppBar 
                    title={<Media image={budgetSpaceLogo} text={title} altText="Budget Space logo" />}
                    onLeftIconButtonClick={this.toggleSideDrawer}
                    onRightIconButtonClick={this.toggleSideDrawer} />

                <Drawer open={this.state.showSideDrawer}>
                    <MenuItem 
                        rightIcon={<CloseIcon />}
                        onClick={this.toggleSideDrawer}>
                    </MenuItem>

                    <Subheader>User</Subheader>
                    <UserMenuItem onToggle={this.toggleSideDrawer} />
                    <Divider />

                    <Subheader>Pages</Subheader>                 
                    <MenuItem 
                        style={{color: this.isPageActive('/')}}
                        leftIcon={<HomeIcon color={this.isPageActive('/')} />}
                        onClick={() => this.routeTo('/')}>Home
                    </MenuItem>
                    <MenuItem 
                        style={{color: this.isPageActive('/expenses-income')}}
                        leftIcon={<ListIcon color={this.isPageActive('/expenses-income')} />}
                        onClick={() => this.routeTo('/expenses-income')}>Expenses / Income
                    </MenuItem>
                    <MenuItem 
                        style={{color: this.isPageActive('/monthly-overview')}}
                        leftIcon={<PieIcon color={this.isPageActive('/monthly-overview')} />}
                        onClick={() => this.routeTo('/monthly-overview')}>Monthly Overview
                    </MenuItem>
                    <MenuItem 
                        style={{color: this.isPageActive('/annual-overview')}}
                        leftIcon={<DateIcon color={this.isPageActive('/annual-overview')} />}
                        onClick={() => this.routeTo('/annual-overview')}>Annual Overview
                    </MenuItem>
                </Drawer>
            </Fragment>
        ); 
    }
}

export default withRouter(NavBar); 