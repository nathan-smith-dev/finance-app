import React, { Component } from 'react'; 

import TransactionsTable from '../TransactionsTable/TransactionsTable'; 
import NewTransactionDialog from '../NewTransactionDialog/NewTransactionDialog'; 
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import MonthYearSelector from '../MonthYearSelector/MonthYearSelector'; 
import Container from '../../hoc/Grid/Container/Container'; 



class Transactions extends Component {

    state = {
        showDialog: false
    }

    toggleDialog = () => {
        this.setState({showDialog: !this.state.showDialog})
    }

    render() {
        return (
            <Container>
                <div style={{marginTop: '4rem'}}>
                    <TransactionsTable />
                    <NewTransactionDialog 
                        show={this.state.showDialog} 
                        toggler={this.toggleDialog} />
                    <FloatingActionButton 
                        mini={true} 
                        style={{float: 'right'}} 
                        onClick={this.toggleDialog}
                        >
                        <ContentAdd />
                    </FloatingActionButton>
                    <MonthYearSelector />
                </div>
            </Container>
        ); 
    }
}

export default Transactions; 