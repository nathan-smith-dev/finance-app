import React, { Component } from 'react'; 

import classes from './RoommateTransactionTable.css'; 
import { connect } from 'react-redux'; 

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

class RoommateTransactionTable extends Component {
    state = {
        showNewTransaction: false
    }; 

    toggleShowNewTransaction = () => {
        this.setState({
            showNewTransaction: !this.state.showNewTransaction
        }); 
    }

    render() {
        const transArray = []; 
        const url = this.props.userProfile && this.props.focusedRoommate
            ? `${this.props.focusedRoommate.uid}/roommates/mates/${this.props.userProfile.uid}/transactions`
            : null; 
        return(
            <div>
                <Table onCellClick={(rownum) => transArray.length > 0 ? null : null}>
                    <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                        <TableRow>
                            <TableHeaderColumn style={{width: '25%'}} >Date</TableHeaderColumn>
                            <TableHeaderColumn style={{width: '30%'}}>Amount</TableHeaderColumn>
                            <TableHeaderColumn>Category</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                        {null}
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
                <NewTransactionDialog 
                    show={this.state.showNewTransaction} 
                    toggler={this.toggleShowNewTransaction} 
                    forceExpense={true} 
                    endPoint={url}
                    title="Expense Roommate"
                    type="Expense" />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        userProfile: state.auth.userProfile, 
        focusedRoommate: state.roommates.focusedRoommate
    }; 
}; 

const mapDispatchToProps = dispatch => {
    return {

    }; 
}

export default connect(mapStateToProps, mapDispatchToProps)(RoommateTransactionTable); 