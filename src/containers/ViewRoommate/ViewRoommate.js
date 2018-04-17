import React, { Component } from 'react'; 

import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux'; 
import * as roommateActions from '../../store/actions/roommates'; 

import Paper from '../../hoc/Paper/Paper'; 
import Row from  '../../hoc/Grid/Row/Row';
import Column from  '../../hoc/Grid/Column/Column';
import Container from  '../../hoc/Grid/Container/Container';
import RoommateTransactionTable from '../RoommateTransactionTable/RoommateTransactionTable'; 

class ViewRoommate extends Component {
    render() {
        if(Object.keys(this.props.userProfile).length > 0 && !this.props.focusedRoommate) {
            const urlPaths = this.props.location.pathname.split('/'); 
            const id = urlPaths[urlPaths.length - 1]; 
            this.props.setFocusedRoommate(id); 
        }
        return (
            <Container>
                <Row>
                    <Column style={{margin: '0 auto'}} width="xl-50 md-75" >
                        <Paper>
                            <h2>{this.props.focusedRoommate ? this.props.focusedRoommate.name : null}</h2>
                            <RoommateTransactionTable />
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
        focusedRoommate: state.roommates.focusedRoommate
    }; 
}; 

const mapDispatchToProps = dispatch => {
    return {
        setFocusedRoommate: (rUid) => dispatch(roommateActions.setFocusedRoomate(rUid))
    }; 
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ViewRoommate)); 