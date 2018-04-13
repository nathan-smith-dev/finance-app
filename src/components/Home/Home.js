import React, { Component } from 'react'; 

import Row from '../../hoc/Grid/Row/Row'; 
import Column from '../../hoc/Grid/Column/Column'; 
import Container from '../../hoc/Grid/Container/Container'; 
import Paper from '../../hoc/Paper/Paper'; 
import ExampleCharts from '../ExampleCharts/ExampleCharts'; 

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
                            <h3 style={{marginBottom: 0}}>Welcome to Budget Space! </h3>
                            <p style={{fontSize: 14, marginTop: 8}}>Budget Space is a simple web application meant to make tracking your spending easy and fun. </p>
                            <ExampleCharts />
                            <h4 style={{marginBottom: 0}}>Tracking Your Spending Easily</h4>
                            <p style={{fontSize: 14, marginTop: 8}}>Simply sign in with your Google account and enter your expenses and incomes for the selected month and year.</p>
                            <h4 style={{marginBottom: 0}}>Analyze Your Spending</h4>
                            <p style={{fontSize: 14, marginTop: 8}}>After entering transactions, take a look at the <em>Expenses / Income</em> or <em>Trends</em> page and see where your money has gone. </p>
                        </Paper>
                    </Column>
                </Row>
            </Container>
        ); 
    }
};

export default Home; 