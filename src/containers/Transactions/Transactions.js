import React, { Component } from 'react'; 
import classes from './Transactions.css'; 

import axios from 'axios'; 
import { withAuth } from '../../firebase/auth'; 
import { connect } from 'react-redux';
import * as transactionActions from '../../store/actions/transactions';
import * as notificationsActions from '../../store/actions/notifications';
import { convertTransactionToDbValues } from '../../utlities/utilities'; 

import TransactionsTable from '../TransactionsTable/TransactionsTable'; 
import TransactionDialog from '../TransactionDialog/TransactionDialog'; 
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import MonthYearSelector from '../MonthYearSelector/MonthYearSelector'; 
import Container from '../../hoc/Grid/Container/Container'; 
import Paper from '../../hoc/Paper/Paper'; 
import Row from '../../hoc/Grid/Row/Row'; 
import Column from '../../hoc/Grid/Column/Column'; 


class Transactions extends Component {

    state = {
        showDialog: false
    }

    toggleDialog = () => {
        this.setState({showDialog: !this.state.showDialog})
    }

    sendNewTransaction = (newExpense) => {
        const postObj = convertTransactionToDbValues(newExpense); 
        withAuth((authToken) => {
            const url = `${this.props.userProfile.uid}/transactions/${postObj.date.year}/${postObj.date.month}.json?auth=${authToken}`; 
            this.toggleDialog(); 
            this.props.showNotification("Added transaction");   
            axios.post(url, postObj)
                .then(response => {
                    this.props.getTransactions(this.props.userProfile.uid, this.props.trackedDates.month, this.props.trackedDates.year); 
                }) 
                .catch(err => {
                    console.log(err); 
                    this.props.showNotification("Error adding transaction");
                })
        })
    }

    render() {
        return (
            <div className={classes.Transactions} >
                <Container>
                    <Row>
                        <Column width="xl-50 md-75" style={{margin: '0 auto'}} >
                            <Paper>
                                <h1>Expenses and Income</h1>
                                <div>
                                    <TransactionsTable />
                                    <TransactionDialog 
                                        onSubmit={this.sendNewTransaction}
                                        title="New Income or Expense"
                                        date={new Date()}
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
                        </Column>
                    </Row>
                </Container>
            </div>
        ); 
    }
}

const mapStateToProps = state => {
    return {
        userProfile: state.auth.userProfile, 
        trackedDates: state.transactions.trackedDates
    }; 
}; 

const mapDispatchToProps = dispatch => {
    return {
        showNotification: (text) => dispatch(notificationsActions.showNotification(true, text)), 
        getTransactions: (uid, month, year) => dispatch(transactionActions.getTransactions(uid, month, year))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Transactions); 