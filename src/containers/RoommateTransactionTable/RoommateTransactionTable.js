import React, { Component } from 'react'; 

import classes from './RoommateTransactionTable.css'; 
import { connect } from 'react-redux'; 
import * as notificationActions from '../../store/actions/notifications';  
import { withAuth } from '../../firebase/auth'; 
import axios from 'axios'; 
import * as roommateActions from '../../store/actions/roommates'; 

import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
  } from 'material-ui/Table';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import NewTransactionDialog from '../NewTransactionDialog/NewTransactionDialog'; 
import ViewTransactionDialog from '../../components/ViewTransactionDialog/ViewTransactionDialog'; 

class RoommateTransactionTable extends Component {
    state = {
        showNewTransaction: false, 
        openExpense: false, 
        selectedExpense: {}, 
        userUid: null, 
        filterBy: 0, 
        subFilter: 0, 
        openEdit: false
    }; 

    selectExpense = (expense) => {
        this.setState({
            selectedExpense: {
                amount: expense.amount,
                date: expense.date, 
                category: expense.category, 
                id: expense.id, 
                type: expense.type, 
                desc: expense.desc, 
                direction: expense.direction
            }, 
            userUid: this.props.userProfile.uid
        }, () => {
            this.toggleSelectExpense()
        }); 
    }

    toggleSelectExpense = () => {
        if(this.canToggleExpense()) {
            this.setState({
                openExpense: !this.state.openExpense
            }); 
        }
    }; 

    canToggleExpense = () => {
        return this.state.selectedExpense && this.state.selectedExpense.direction !== 'from'; 
    }

    toggleEdit = () => {
        this.setState({
            openEdit: !this.state.openEdit
        }); 
    }; 

    toggleShowNewTransaction = () => {
        this.setState({
            showNewTransaction: !this.state.showNewTransaction
        }); 
    }

    deleteRoommateExpense = () => {
        withAuth((authToken) => {
            const url = `${this.props.focusedRoommate.uid}/roommates/mates/${this.props.userProfile.uid}/transactions/${this.state.selectedExpense.id}.json?auth=${authToken}`
            axios.delete(url)
            .then(response => {
                this.props.showNotification("Deleted transaction"); 
                this.props.getRoommateTransactions(this.props.focusedRoommate.uid, this.state.userUid); 
                this.toggleSelectExpense(); 
            })
            .catch(err => {
                console.log(err); 
            })
        });
    }; 

    render() {
        const transArray = this.props.focusedRoommate && this.props.focusedRoommate.transactionsToAndFrom
            ? this.props.focusedRoommate.transactionsToAndFrom 
            : []; 
            
        const transactions = transArray.map((trans, index) => {
            const color = trans.direction === "to" ? 'green' : 'red'; 
            return (
                <TableRow key={index}>
                    <TableRowColumn style={{width: '25%', paddingRight: 0}} >{`${trans.date.month + 1}/${trans.date.day}`}</TableRowColumn>
                    <TableRowColumn style={{color: color, width: '30%'}}>
                        <div style={{width: 50, textAlign: 'right'}} >
                            {parseFloat(trans.amount).toFixed(2)}
                        </div>
                    </TableRowColumn>
                    <TableRowColumn>{trans.category}</TableRowColumn>
                </TableRow>
            ); 
        }); 

        const url = this.props.userProfile && this.props.focusedRoommate
            ? `${this.props.focusedRoommate.uid}/roommates/mates/${this.props.userProfile.uid}/transactions`
            : null; 
        return(
            <div>
                <Table onCellClick={(rownum) => transArray.length > this.selectExpense(transArray[rownum]) ? null : null}>
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
                <div>
                    <FloatingActionButton 
                        mini={true} 
                        className={classes.AddButton} 
                        onClick={this.toggleShowNewTransaction}
                        >
                        <ContentAdd />
                    </FloatingActionButton>
                </div>
                <ViewTransactionDialog 
                    deleteRequest={this.deleteRoommateExpense}
                    show={this.state.openExpense} 
                    notification={(text) => this.props.showNotification(text)}
                    expense={this.state.selectedExpense}
                    close={this.toggleSelectExpense}
                    userUid={this.state.userUid} 
                    editToggle={this.toggleShowNewTransaction} />
                <NewTransactionDialog 
                    show={this.state.showNewTransaction} 
                    updateUrl={url+'/'+this.state.selectedExpense.id}
                    toggleView={this.toggleSelectExpense}
                    toggler={this.toggleShowNewTransaction} 
                    forceExpense={true} 
                    endPoint={url}
                    title="Expense Roommate"
                    type="Expense"
                    date={this.state.selectedExpense.date}                    
                    amount={this.state.selectedExpense.amount}
                    category={this.state.selectedExpense.category}
                    desc={this.state.selectedExpense.desc}
                    transId={this.state.selectedExpense.id} />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        userProfile: state.auth.userProfile, 
        focusedRoommate: state.roommates.focusedRoommate, 
    }; 
}; 

const mapDispatchToProps = dispatch => {
    return {
        showNotification: (text) => dispatch(notificationActions.showNotification(true, text)), 
        getRoommateTransactions: (rUid, cUid) => dispatch(roommateActions.getRoommateTransactionsToAndFrom(rUid, cUid)),
    }; 
}; 

export default connect(mapStateToProps, mapDispatchToProps)(RoommateTransactionTable); 