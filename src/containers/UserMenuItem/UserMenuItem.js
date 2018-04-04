import React, { Component } from 'react'; 
import MenuItem from 'material-ui/MenuItem';
import AccountIcon from 'material-ui/svg-icons/action/account-circle'; 

import * as authActions from '../../store/actions/auth'; 
import { connect } from 'react-redux'; 


class UserMenuItem extends Component {

    componentWillMount() {
        this.props.getUserProfile(); 
    }

    render() {
        return(
            <MenuItem 
                leftIcon={<AccountIcon />}
                onClick={this.props.logout}
                >{this.props.profile.name}
            </MenuItem>
        ); 
    }
}

const mapStateToProps = state => {
    return {
        profile: state.userProfile
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getUserProfile: () => dispatch(authActions.getAuthProfile())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserMenuItem); 