import React, { Component } from 'react'; 

import Row from '../../hoc/Grid/Row/Row'; 
import Column from '../../hoc/Grid/Column/Column'; 
import Container from '../../hoc/Grid/Container/Container'; 
import Paper from '../../hoc/Paper/Paper'; 

class Home extends Component {
    componentWillMount() {
        if(this.props.showNotifcation) {
            this.props.showNotifcation(); 
        }
    }
    render() {
        return (
            <Container>
                <Row>
                    <Column style={{margin: '0 auto'}} width="xl-50 md-75" >
                        <Paper>
                            <h1>Welcome to the alpha testing of the Budget Bunny App. </h1>
                            <h5>The shitty name was made by Brett Smith&trade;</h5>
                            <p>While testing write down or text me the issues you come across. Thanks for testing!</p>
                        </Paper>
                    </Column>
                </Row>
            </Container>
        ); 
    }
};

export default Home; 