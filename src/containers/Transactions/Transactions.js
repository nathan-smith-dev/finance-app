// TODO: Add authentication check, add table of transactions, link transactions to redux state, style component

import React, { Component } from 'react'; 

import TransactionsTable from '../TransactionsTable/TransactionsTable'; 
import NewTransactionDialog from '../NewTransactionDialog/NewTransactionDialog'; 
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import MonthYearSelector from '../MonthYearSelector/MonthYearSelector'; 


class Transactions extends Component {

    state = {
        showDialog: false
    }

    toggleDialog = () => {
        this.setState({showDialog: !this.state.showDialog})
    }

    render() {
        return (
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
        ); 
    }
}

export default Transactions; 