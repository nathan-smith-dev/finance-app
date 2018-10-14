import React, { Component } from 'react'; 

import classes from './RoommateTransactionTable.css'; 
import { connect } from 'react-redux'; 
import * as notificationActions from '../../store/actions/notifications';  
import * as apiCalls from '../../api-calls'; 
import * as roommateActions from '../../store/actions/roommates'; 
import { formatDate } from '../../utlities/utilities'; 

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
import TransactionDialog from '../TransactionDialog/TransactionDialog'; 
import ViewTransactionDialog from '../../components/ViewTransactionDialog/ViewTransactionDialog';
import CircularProgress from 'material-ui/CircularProgress';  
import { green500, red500  } from 'material-ui/styles/colors'; 

class RoommateTransactionTable extends Component {
    state = {
        showNewTransaction: false, 
        showEditTransaction: false, 
        openExpense: false, 
        selectedExpense: {
            date: new Date(), 
            amount: "0.00"
        }, 
        userUid: null, 
        filterBy: 0, 
        subFilter: 0, 
        openEdit: false
    }; 

    selectExpense = (expense) => {
        this.setState({
            selectedExpense: {
                ...expense,
                amount: expense.amount + "",
            }, 
            userUid: this.props.userProfile.uid
        }, () => {
            this.toggleSelectExpense()
        }); 
    }

    toggleSelectExpense = () => {
        this.setState({
            openExpense: !this.state.openExpense
        }); 
        const { selectedExpense } = this.state; 
        if(!selectedExpense.acknowledged && selectedExpense.direction === 'From') {
            console.log('PUT to updated acknowldeged')
            const updatedExpense = { ...selectedExpense, acknowledged: true, resolved: false }; 
            apiCalls.updateRoommateExpense(updatedExpense, data => {
                this.props.getRoommates(this.props.userProfile.uid); 
            }); 
        }
    }; 

    canToggleExpense = () => {
        return this.state.selectedExpense && this.state.selectedExpense.direction !== 'From'; 
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
    
    toggleShowEditTransaction = () => {
        this.setState({
            showEditTransaction: !this.state.showEditTransaction
        }); 
    }

    deleteRoommateExpense = () => {
        const { selectedExpense } = this.state; 
        const updatedExpense = { ...selectedExpense, resolved: true, acknowledged: true };         
        apiCalls.updateRoommateExpense(updatedExpense, data => {
            this.props.getRoommates(this.props.userProfile.uid); 
            this.props.showNotification("Deleted transaction"); 
            this.toggleSelectExpense(); 
        }); 
    }; 

    sendTransaction = (obj) => {
        const postObj = { ...obj, roommateId: this.props.focusedRoommate.uid }; 
        console.log(postObj);
        apiCalls.createRoommateExpense(postObj, data => {
            this.props.getRoommates(this.props.userProfile.uid);             
            this.toggleShowNewTransaction(); 
            this.toggleEdit(); 
        }); 
    }
    
    updateTransaction = (obj) => {
        const updatedExpense = { ...obj, acknowledged: false, resolved: false, id: obj.transId };   
        console.log(updatedExpense);  
        apiCalls.updateRoommateExpense(updatedExpense, data => {
            this.props.getRoommates(this.props.userProfile.uid); 
            this.props.showNotification("Updated transaction"); 
            this.toggleSelectExpense(); 
            this.toggleShowEditTransaction();             
        }); 
    }

    render() {
        const { focusedRoommate, mateTransactions } = this.props; 
        const transArray = focusedRoommate && mateTransactions[focusedRoommate.uid]
            ? mateTransactions[focusedRoommate.uid]
            : []; 
            
        let transactions = transArray.map((trans, index) => {
            const color = trans.direction === "To" ? 'green' : 'red'; 
            const newStyle = !trans.acknowledged && trans.direction !== 'To' ? {backgroundColor: '#C0D1E5'} : null;
            return (
                <TableRow style={newStyle} key={index}>
                    <TableRowColumn style={{width: '25%', paddingRight: 0}} >{formatDate(trans.date)}</TableRowColumn>
                    <TableRowColumn style={{color: color, width: '30%'}}>
                        <div style={{width: 50, textAlign: 'right'}} >
                            {parseFloat(trans.amount).toFixed(2)}
                        </div>
                    </TableRowColumn>
                    <TableRowColumn>{trans.category}</TableRowColumn>
                </TableRow>
            ); 
        }); 

        if(!focusedRoommate || !mateTransactions) {
            transactions = (
                <TableRow>
                    <TableRowColumn>
                        <CircularProgress />
                    </TableRowColumn>
                </TableRow>
            );
        }

        const totalTo = transArray.filter(trans => trans.direction === 'To').map(trans => trans.amount).reduce((a, b) => a + b, 0); 
        const totalFrom = transArray.filter(trans => trans.direction === 'From').map(trans => trans.amount).reduce((a, b) => a + b, 0); 
        const netTotal = totalTo - totalFrom; 

        return(
            <div>
                <Table 
                    onCellClick={(rownum) => transArray.length > this.selectExpense(transArray[rownum]) ? null : null}>
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
                <div style={{marginTop: 20}}>
                    <h3 style={{marginBottom: 2, marginTop: 20}}>Overview</h3>                                            
                    <Table>
                        <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                            <TableRow>
                                <TableHeaderColumn style={{paddingLeft: 0}}>Owed From</TableHeaderColumn>
                                <TableHeaderColumn style={{paddingLeft: 0}}>Owe To</TableHeaderColumn>
                                <TableHeaderColumn style={{paddingLeft: 0}}>Total</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody displayRowCheckbox={false}>
                            <TableRow>
                                <TableRowColumn style={{color: green500, paddingLeft: 0}}>{(Math.round(totalTo*100)/100).toFixed(2)}</TableRowColumn>
                                <TableRowColumn style={{color: red500, paddingLeft: 0}}>{(Math.round(totalFrom*100)/100).toFixed(2)}</TableRowColumn>
                                <TableRowColumn style={netTotal >= 0 ? {color: green500, paddingLeft: 0} : {color: red500,paddingLeft: 0}}>{(Math.round(netTotal*100)/100).toFixed(2)}</TableRowColumn>
                        </TableRow>
                        </TableBody>
                    </Table>
                </div>

                <ViewTransactionDialog 
                    canEdit={this.canToggleExpense()}
                    deleteRequest={this.deleteRoommateExpense}
                    show={this.state.openExpense} 
                    notification={(text) => this.props.showNotification(text)}
                    expense={this.state.selectedExpense}
                    close={this.toggleSelectExpense}
                    userUid={this.state.userUid} 
                    editToggle={this.toggleShowEditTransaction} />
                <TransactionDialog 
                    onSubmit={this.updateTransaction}
                    show={this.state.showEditTransaction} 
                    toggler={this.toggleShowEditTransaction} 
                    forceExpense={true} 
                    title="Edit Roommate Expense"
                    type="Expense"
                    date={this.state.selectedExpense.date}                    
                    amount={this.state.selectedExpense.amount}
                    categoryId={this.state.selectedExpense.categoryId}
                    desc={this.state.selectedExpense.desc}
                    transId={this.state.selectedExpense.id} />
                <TransactionDialog 
                    onSubmit={this.sendTransaction}
                    show={this.state.showNewTransaction} 
                    toggler={this.toggleShowNewTransaction} 
                    forceExpense={true} 
                    title="Expense Roommate" />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        userProfile: state.auth.userProfile, 
        focusedRoommate: state.roommates.focusedRoommate, 
        mateTransactions: state.roommates.mateTransactions, 
        roommateNotifications: state.roommates.notifications,         
    }; 
}; 

const mapDispatchToProps = dispatch => {
    return {
        showNotification: (text) => dispatch(notificationActions.showNotification(true, text)), 
        getRoommateTransactions: (rUid, cUid) => dispatch(roommateActions.getRoommateTransactionsToAndFrom(rUid, cUid)),
        updateRoommateNotifications: (notifications) => dispatch(roommateActions.updateRoommateNotifications(notifications)),       
        getRoommates: (uid) => dispatch(roommateActions.getRoommates(uid)),       
    }; 
}; 

export default connect(mapStateToProps, mapDispatchToProps)(RoommateTransactionTable); 