import React, { Component } from 'react'; 

import { connect } from 'react-redux'; 
import axios from 'axios'; 
import { withAuth } from '../../firebase/auth'; 
import * as roommateActions from '../../store/actions/roommates'; 
import { withRouter } from 'react-router-dom'; 

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
        withAuth(authToken => {
            const roommate = this.state.currentRoommateRequest;  
            const url = `${this.props.userProfile.uid}/roommates/requests/${roommate.uid}.json?auth=${authToken}`; 
            axios.delete(url)
                .then(response => {
                    this.toggleRoommateRequest(); 
                    this.props.getRoommateRequests(this.props.userProfile.uid); 
                })
                .catch(error => {
                    console.log(error); 
                }); 
        }); 
    }

    handleAcceptRoommate = () => {
        withAuth(authToken => {
            const roommate = this.state.currentRoommateRequest;  
            const url = `${this.props.userProfile.uid}/roommates/requests/${roommate.uid}.json?auth=${authToken}`; 
            axios.delete(url)
                .then(response => {
                    this.toggleRoommateRequest(); 
                    this.props.getRoommateRequests(this.props.userProfile.uid); 
                })
                .catch(error => {
                    console.log(error); 
                }); 
            const putURL = `${this.props.userProfile.uid}/roommates/mates/${roommate.uid}.json?auth=${authToken}`; 
            axios.put(putURL, roommate)
                .then(response => {
                    // console.log(response);
                })
                .catch(error => {
                    console.log(error); 
                }); 
            const oppositePutUrl = `${roommate.uid}/roommates/mates/${this.props.userProfile.uid}.json?auth=${authToken}`;
            const currentUser = {
                date: new Date(), 
                name: this.props.userProfile.displayName, 
                email: this.props.userProfile.email, 
                uid: this.props.userProfile.uid
            }; 
            axios.put(oppositePutUrl, currentUser)
                .then(response => {
                    // console.log(response);
                })
                .catch(error => {
                    console.log(error); 
                }); 
        }) 
    }

    toggleNewRoomate = () => { 
        this.setState({
            showNewRoomate: !this.state.showNewRoomate
        }); 
    }

    toggleRoommateRequest = (id) => {
        this.setState({
            currentRoommateRequest: this.props.roommateRequests.find(req => req.uid === id), 
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

    redirectToRoommate = (uid) => {
        this.props.setFocusedRoomate(uid); 
        this.props.history.push('/roommates/'+uid); 
    }
    
    render() {
        const users = Object.keys(this.props.allUsers).length > 0 ? this.props.allUsers : null;
        const currentUser = this.props.userProfile ? this.props.userProfile : {}; 
        const currentUserMates = this.props.mates ? this.props.mates : {}; 
        let filteredUsers = []; 
        if(users && currentUser) {
            filteredUsers = users.filter(user => {
                if(user.uid !== currentUser.uid && currentUserMates.length) {
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
                                                key={user.uid} 
                                                primaryText={user.name} 
                                                onClick={() => this.redirectToRoommate(user.uid)} />
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
                                                                key={request.uid} 
                                                                primaryText={request.name} 
                                                                onClick={(uid) => {
                                                                    this.toggleRoommateRequest(request.uid); 
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
        mates: state.roommates.mates
    }; 
}; 

const mapDispatchToProps = dispatch => {
    return {
        getRoommateRequests: (uid) => dispatch(roommateActions.getRoommateRequests(uid)), 
        setFocusedRoomate: (roommate) => dispatch(roommateActions.setFocusedRoomate(roommate))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Roommates)); 