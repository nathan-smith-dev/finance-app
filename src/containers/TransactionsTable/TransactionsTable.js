import React, { Component } from 'react'; 

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

class TransactionsTable extends Component {

    render() {
        let transactions = (
            <TableRow>
                <TableRowColumn><CircularProgress /></TableRowColumn>
            </TableRow>
        ); 
        if(Object.keys(this.props.transactions).length > 0) {
            transactions = Object.keys(this.props.transactions).map((transKey) => {
                const trans = this.props.transactions[transKey]; 
                return (
                    <TableRow key={transKey}>
                        <TableRowColumn>{`${trans.date.month + 1}-${trans.date.day}`}</TableRowColumn>
                        <TableRowColumn>$ <div style={{display: 'inline-block'}}>{parseFloat(trans.amount).toFixed(2)}</div></TableRowColumn>
                        <TableRowColumn>{trans.type}</TableRowColumn>
                        <TableRowColumn>{trans.category}</TableRowColumn>
                    </TableRow>
                ); 
            }); 
        }
        return (
            <Table>
                <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                    <TableRow>
                        <TableHeaderColumn>Date</TableHeaderColumn>
                        <TableHeaderColumn>Amount</TableHeaderColumn>
                        <TableHeaderColumn>Type</TableHeaderColumn>
                        <TableHeaderColumn>Category</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false}>
                    {transactions}
                </TableBody>
            </Table>
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