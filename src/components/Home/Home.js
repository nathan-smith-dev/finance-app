import React from 'react'; 

import Row from '../../hoc/Grid/Row/Row'; 
import Column from '../../hoc/Grid/Column/Column'; 
import Container from '../../hoc/Grid/Container/Container'; 
import TransactionsTable from '../../containers/TransactionsTable/TransactionsTable'; 

const home = (props) => {
    return (
        <Container>
            <Row>
                <Column>
                    <h1>Welcome to the Finance App</h1>
                    <p>The finance app lets you keep track of your finances. That's pretty neat!</p>
                </Column>
            </Row>
            <hr/>
            <Row>
                <Column width="md-50">
                    <h2>Here are your expenses</h2>
                </Column>
                <Column width="md-50">
                    <TransactionsTable />
                </Column>
            </Row>
        </Container>
    ); 
};

export default home; 