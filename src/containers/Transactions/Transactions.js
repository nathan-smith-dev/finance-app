import React, { Component } from 'react'; 
import classes from './Transactions.css'; 

import TransactionsTable from '../TransactionsTable/TransactionsTable'; 
import NewTransactionDialog from '../NewTransactionDialog/NewTransactionDialog'; 
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import MonthYearSelector from '../MonthYearSelector/MonthYearSelector'; 
import Container from '../../hoc/Grid/Container/Container'; 
import Paper from '../../hoc/Paper/Paper'; 


class Transactions extends Component {

    state = {
        showDialog: false
    }

    toggleDialog = () => {
        this.setState({showDialog: !this.state.showDialog})
    }

    render() {
        return (
            <div className={classes.Transactions} >
                <Container>
                    <Paper>
                        <h1>Expenses and Income</h1>
                        <div>
                            <TransactionsTable />
                            <NewTransactionDialog 
                                show={this.state.showDialog} 
                                toggler={this.toggleDialog} />
                            <FloatingActionButton 
                                mini={true} 
                                className={classes.AddButton} 
                                onClick={this.toggleDialog}
                                >
                                <ContentAdd />
                            </FloatingActionButton>
                            <MonthYearSelector />
                        </div>
                    </Paper>
                </Container>
            </div>
        ); 
    }
}

export default Transactions; 