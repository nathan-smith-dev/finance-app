import React, { Component } from 'react'; 

import { connect } from 'react-redux'; 

import Paper from '../../hoc/Paper/Paper'; 
import Row from  '../../hoc/Grid/Row/Row';
import Column from  '../../hoc/Grid/Column/Column';
import Container from  '../../hoc/Grid/Container/Container';
import {List, ListItem} from 'material-ui/List';
import AutoComplete from 'material-ui/AutoComplete'; 
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';


class Roommates extends Component {
    state = {
        newRoommate: ""
    }; 

    handleRoommateChange = (value) => {
        console.log(value); 
        this.setState({
            newRoommate: value
        })
    }; 
    
    render() {
        const users = Object.keys(this.props.allUsers).length > 0 ? this.props.allUsers : null;
        const currentUser = this.props.userProfile ? this.props.userProfile : {}; 
        let filteredUsers = []; 
        if(users && currentUser) {
            filteredUsers = users.filter(user => user.uid !== currentUser.uid).map(user => user.name); 
        }
        return (
            <Container>
                <Row>
                    <Column style={{margin: '0 auto'}} width="xl-50 md-75" >
                        <Paper>
                            <h1 style={{fontSize: 16}}>{`${this.props.userProfile.displayName ? this.props.userProfile.displayName : 'User' }'s Roommates`}</h1>
                            <div style={{display: 'flex', alignItems: 'center'}} >
                                <AutoComplete
                                    style={{maxWidth: '80%'}}
                                    floatingLabelText="Add Roommate"
                                    filter={AutoComplete.caseInsensitiveFilter}
                                    dataSource={filteredUsers}
                                    onUpdateInput={this.handleRoommateChange}
                                />
                                <FloatingActionButton mini={true} onClick={this.toggleNewCategory} >
                                    <ContentAdd />
                                </FloatingActionButton>
                            </div>
                            <List>
                                {/* {
                                    users 
                                        ? users.map((user) => {
                                            return <ListItem 
                                                key={user.uid} 
                                                primaryText={user.name} />
                                        })
                                        : null
                                } */}
                            </List>
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
        allUsers: state.auth.allUsers
    }; 
}; 

export default connect(mapStateToProps)(Roommates); 