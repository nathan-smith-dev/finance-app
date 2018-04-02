import React, { Component } from 'react'; 
import MenuItem from 'material-ui/MenuItem';
import AccountIcon from 'material-ui/svg-icons/action/account-circle'; 


class UserMenuItem extends Component {
    state = {
        profile: {}
    }

    componentWillMount() {
        this.setState({ profile: {} });
        const { userProfile, getProfile } = this.props.auth;
        if (!userProfile) {
          getProfile((err, profile) => {
            this.setState({ profile });
          });
        } else {
          this.setState({ profile: userProfile });
        }
    }

    render() {
        return(
            <MenuItem 
                leftIcon={<AccountIcon />}
                onClick={this.props.logout}
                >{this.state.profile.name}
            </MenuItem>
        ); 
    }
}

export default UserMenuItem; 