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
import { green500, red500 } from 'material-ui/styles/colors'; 

class TransactionsTable extends Component {

    render() {
        let transactions = (
            <TableRow>
                <TableRowColumn><CircularProgress /></TableRowColumn>
            </TableRow>
        ); 
        if(this.props.transactions && Object.keys(this.props.transactions).length > 0) {
            let  transArray = [...this.props.transactions]; 
            transArray.sort((a, b) => a.date.day - b.date.day); 
            transactions = transArray.map((trans) => {
                const color = trans.type === "Income" ? green500 : red500; 
                return (
                    <TableRow key={trans.id}>
                        <TableRowColumn>{`${trans.date.month + 1}-${trans.date.day}`}</TableRowColumn>
                        <TableRowColumn style={{color: color}}>$ <div style={{display: 'inline-block'}}>{parseFloat(trans.amount).toFixed(2)}</div></TableRowColumn>
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
            <Table>
                <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                    <TableRow>
                        <TableHeaderColumn>Date</TableHeaderColumn>
                        <TableHeaderColumn>Amount</TableHeaderColumn>
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