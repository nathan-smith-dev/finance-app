import React, { Component, Fragment } from 'react'; 

import { connect } from 'react-redux'; 

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import CircularProgress from 'material-ui/CircularProgress';
import { green500, red500 } from 'material-ui/styles/colors'; 
import ViewTransactionDialog from '../../components/ViewTransactionDialog/ViewTransactionDialog'; 

class TransactionsTable extends Component {
    state = {
        openExpense: false, 
        selectedExpense: {}
    }; 

    selectExpense = (expense) => {
        console.log("expense selected")
        this.setState({
            selectedExpense: {
                amount: expense.amount,
                date: expense.date, 
                category: expense.category, 
                id: expense.id, 
                type: expense.type, 
                desc: expense.desc
            }, 
            openExpense: !this.state.openExpense
        }); 
    }

    toggleSelectExpense = () => {
        this.setState({
            openExpense: !this.state.openExpense
        }); 
    }; 
    
    render() {
        let transactions = (
            <TableRow>
                <TableRowColumn><CircularProgress /></TableRowColumn>
            </TableRow>
        ); 
        let  transArray = []; 
        if(this.props.transactions && Object.keys(this.props.transactions).length > 0) {
            transArray = [...this.props.transactions]; 
            transArray.sort((a, b) => a.date.day - b.date.day); 
            transactions = transArray.map((trans) => {
                const color = trans.type === "Income" ? green500 : red500; 
                return (
                    <TableRow key={trans.id}>
                        <TableRowColumn style={{width: '25%', paddingRight: 0}} >{`${trans.date.month + 1}-${trans.date.day}`}</TableRowColumn>
                        <TableRowColumn style={{color: color, width: '30%'}}>
                            <div style={{width: 50, textAlign: 'right'}} >
                                {parseFloat(trans.amount).toFixed(2)}
                            </div>
                        </TableRowColumn>
                        <TableRowColumn>{trans.category}</TableRowColumn>
                    </TableRow>
                ); 
            }); 
        }
        else if(this.props.transactions && this.props.transactions === -1) {
            transactions = (
                <TableRow>
                    <TableRowColumn>No Transactions For Selected Time Period</TableRowColumn>
                </TableRow>
            ); 
        }
        return (
            <Fragment>
                <Table onCellClick={(rownum) => this.selectExpense(transArray[rownum])}>
                    <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                        <TableRow>
                            <TableHeaderColumn style={{width: '25%'}} >Date</TableHeaderColumn>
                            <TableHeaderColumn style={{width: '30%'}}>Amount</TableHeaderColumn>
                            <TableHeaderColumn>Category</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                        {transactions}
                    </TableBody>
                </Table>
                <ViewTransactionDialog 
                    show={this.state.openExpense} 
                    expense={this.state.selectedExpense}
                    close={this.toggleSelectExpense} />
            </Fragment>
        ); 
    }
}

const mapStateToProps = state => {
    return {
        transactions: state.transactions.userTransactions, 
        userProfile: state.auth.userProfile
    }; 
}; 

export default connect(mapStateToProps)(TransactionsTable); 