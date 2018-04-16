import React, { Component } from 'react'; 

import { connect } from 'react-redux'; 
import axios from 'axios'; 
import { withAuth } from '../../firebase/auth'; 

import Paper from '../../hoc/Paper/Paper'; 
import Row from  '../../hoc/Grid/Row/Row';
import Column from  '../../hoc/Grid/Column/Column';
import Container from  '../../hoc/Grid/Container/Container';
import ContentAdd from 'material-ui/svg-icons/content/add';
import MessageIcon from 'material-ui/svg-icons/communication/message';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Subheader from 'material-ui/Subheader'; 
import Divider from 'material-ui/Divider'; 
import NewRoomate from '../../components/NewRoommate/NewRoommate'; 
import Badge from 'material-ui/Badge';


class Roommates extends Component {
    state = {
        newRoommate: null, 
        showNewRoomate: false
    }; 

    handleRoommateChange = (roommate) => {
        this.setState({
            newRoommate: roommate
        }); 
    }; 

    toggleNewRoomate = () => { 
        this.setState({
            showNewRoomate: !this.state.showNewRoomate
        }); 
    }

    sendRoommateRequest = () => {
        const newRoomate = {...this.state.newRoommate}; 
        const user = this.props.userProfile; 
        const thisUser = {
            uid: user.uid, 
            date: new Date(), 
            name: user.displayName, 
            email: user.email
        }; 
        withAuth(authToken => {
            this.toggleNewRoomate(); 
            const url = `${newRoomate.uid}/roommates/requests/${thisUser.uid}.json?auth=${authToken}`; 
            axios.put(url, thisUser)
                .then(response => {
                    console.log(response); 
                })
                .catch(error => {
                    console.log(error); 
                })
        })
    }
    
    render() {
        const users = Object.keys(this.props.allUsers).length > 0 ? this.props.allUsers : null;
        const currentUser = this.props.userProfile ? this.props.userProfile : {}; 
        let filteredUsers = []; 
        if(users && currentUser) {
            filteredUsers = users.filter(user => user.uid !== currentUser.uid); 
        }
        return (
            <Container>
                <Row>
                    <Column style={{margin: '0 auto'}} width="xl-50 md-75" >
                        <Paper>
                            <h1 style={{fontSize: 16}}>{`${this.props.userProfile.displayName ? this.props.userProfile.displayName : 'User' }'s Roommates`}</h1>
                            <Menu>
                                <Subheader>User Actions</Subheader>
                                {this.props.roommateRequests && (
                                    <MenuItem 
                                        primaryText="Roommate Requests" 
                                        leftIcon={<MessageIcon />} 
                                        rightIcon={<Badge badgeContent={this.props.roommateRequests.length} primary={true}></Badge>} />
                                )}
                                <MenuItem 
                                    primaryText="New Roommate" 
                                    leftIcon={<ContentAdd />} 
                                    onClick={this.toggleNewRoomate} />
                                <Divider />
                                <Subheader>Current Roommates</Subheader>   
                                {
                                    users 
                                        ? users.map((user) => {
                                            return <MenuItem 
                                                key={user.uid} 
                                                primaryText={user.name} />
                                        })
                                        : <MenuItem primaryText="No current roommates" />
                                }                             
                            </Menu>
                            <NewRoomate 
                                show={this.state.showNewRoomate} 
                                close={this.toggleNewRoomate} 
                                filteredUsers={filteredUsers}
                                onNewRequest={this.handleRoommateChange} 
                                onAddRoommate={this.sendRoommateRequest} />
                        </Paper>
                    </Column>
                </Row>
            </Container>
        ); 
    }
}

const mapStateToProps = state => {
    return {
        userProfile: state.auth.userProfile, 
        allUsers: state.auth.allUsers, 
        roommateRequests: state.roommates.requests 
    }; 
}; 

export default connect(mapStateToProps)(Roommates); 