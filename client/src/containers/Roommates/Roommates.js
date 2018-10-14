import React, { Component } from 'react'; 

import { connect } from 'react-redux'; 
import * as roommateActions from '../../store/actions/roommates'; 
import { withRouter } from 'react-router-dom'; 
import * as apiCalls from '../../api-calls'; 

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
import ViewRoommateRequest from '../../components/ViewRoommateRequest/ViewRoommateRequest'; 
import Popover from 'material-ui/Popover';


class Roommates extends Component {
    state = {
        newRoommate: null, 
        showNewRoomate: false, 
        showRoommateRequest: false, 
        showPopover: false, 
        anchorEl: null, 
        currentRoommateRequest: null
    }; 

    handleRoommateChange = (roommate) => {
        this.setState({
            newRoommate: roommate
        }); 
    }; 

    handleDeleteRoommateRequest = () => {
        apiCalls.acceptRoommateRequests(this.state.currentRoommateRequest.id, false, data => {
            this.toggleRoommateRequest(); 
            this.props.getRoommateRequests(this.props.userProfile.uid); 
            this.props.getRoommates(this.props.userProfile.uid); 
        });
    }

    handleAcceptRoommate = () => {
        apiCalls.acceptRoommateRequests(this.state.currentRoommateRequest.id, true, data => {
            this.toggleRoommateRequest(); 
            this.props.getRoommateRequests(this.props.userProfile.uid); 
            this.props.getRoommates(this.props.userProfile.uid); 
        }); 
    }

    toggleNewRoomate = () => { 
        this.setState({
            showNewRoomate: !this.state.showNewRoomate
        }); 
    }

    toggleRoommateRequest = (id) => {
        this.setState({
            currentRoommateRequest: this.props.roommateRequests.find(req => req.roomateId === id), 
            showRoommateRequest: !this.state.showRoommateRequest
        }); 
    }

    togglePopover = (event) => {
        if(event) {
            this.setState({
                anchorEl: event.currentTarget // Make sure we have a target before toggling 
            }, () => {
                this.setState({
                    showPopover: !this.state.showPopover
                })
            }
            ); 
        }
        else {
            this.setState({
                showPopover: !this.state.showPopover
            })
        }
    }

    sendRoommateRequest = () => {
        const uid = this.state.newRoommate.uid; 
        apiCalls.createRoommateRequests(uid, data => this.toggleNewRoomate()); 
    }

    redirectToRoommate = (uid) => {
        if((this.props.focusedRoommate && this.props.focusedRoommate.uid !== uid))
            this.props.setFocusedRoomate(uid); 
        this.props.history.push('/roommates/'+uid); 
    }
    
    render() {
        const users = Object.keys(this.props.allUsers).length > 0 ? this.props.allUsers : null;
        const currentUser = this.props.userProfile ? this.props.userProfile : {}; 
        const currentUserMates = this.props.mates ? this.props.mates : []; 
        let filteredUsers = []; 
        if(users && currentUser) {
            filteredUsers = users.filter(user => {
                if(user.uid !== currentUser.uid) {
                    for(let mate of currentUserMates) {
                        if(mate.uid === user.uid) {
                            return false; 
                        }
                    }
                    return true; 
                }
                return false; 
            }); 
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
                                        onClick={this.togglePopover}
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
                                    this.props.mates 
                                        ? this.props.mates.map((user) => {
                                            return <MenuItem 
                                                rightIcon={this.props.roommateNotifications[user.id] ? <Badge badgeContent={this.props.roommateNotifications[user.id]} primary={true} /> : null}
                                                key={user.id} 
                                                primaryText={`${user.firstName} ${user.lastName}`} 
                                                onClick={() => this.redirectToRoommate(user.id)} />
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
                            <ViewRoommateRequest 
                                delete={this.handleDeleteRoommateRequest}
                                show={this.state.showRoommateRequest} 
                                close={this.toggleRoommateRequest}
                                onAcceptRoommate={this.handleAcceptRoommate}
                                request={this.state.currentRoommateRequest} />
                                <Popover
                                    open={this.state.showPopover}
                                    anchorEl={this.state.anchorEl}
                                    anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                                    targetOrigin={{horizontal: 'left', vertical: 'top'}}
                                    onRequestClose={this.togglePopover}
                                    >
                                    <Menu>
                                        {
                                            this.props.roommateRequests 
                                            ? this.props.roommateRequests.map(request => {
                                                    return <MenuItem 
                                                                key={request.roomateId} 
                                                                primaryText={`${request.firstName} ${request.lastName}`} 
                                                                onClick={(uid) => {
                                                                    this.toggleRoommateRequest(request.roomateId); 
                                                                    this.togglePopover(); 
                                                                }} />
                                                })
                                            : null 
                                        }
                                    </Menu>
                                </Popover>
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
        roommateRequests: state.roommates.requests, 
        roommateNotifications: state.roommates.notifications, 
        mates: state.roommates.mates,
        focusedRoommate: state.roommates.focusedRoommate,
    }; 
}; 

const mapDispatchToProps = dispatch => {
    return {
        getRoommateRequests: (uid) => dispatch(roommateActions.getRoommateRequests(uid)), 
        getRoommates: (uid) => dispatch(roommateActions.getRoommates(uid)), 
        setFocusedRoomate: (roommate) => dispatch(roommateActions.setFocusedRoomate(roommate)), 
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Roommates)); 