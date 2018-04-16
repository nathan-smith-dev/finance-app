import React, { Component } from 'react'; 

import { connect } from 'react-redux'; 

import Paper from '../../hoc/Paper/Paper'; 
import Row from  '../../hoc/Grid/Row/Row';
import Column from  '../../hoc/Grid/Column/Column';
import Container from  '../../hoc/Grid/Container/Container';

class Roommates extends Component {
    render() {
        return (
            <Container>
                <Row>
                    <Column style={{margin: '0 auto'}} width="xl-50 md-75" >
                        <Paper>
                            <h1>Roommates Component</h1>
                        </Paper>
                    </Column>
                </Row>
            </Container>
        ); 
    }
}

const mapStateToProps = state => {
    return {
        userProfile: state.auth.userProfile
    }; 
}; 

export default connect(mapStateToProps)(Roommates); 