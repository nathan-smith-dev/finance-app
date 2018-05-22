import React, { Component, Fragment } from 'react'; 

import { connect } from 'react-redux';
import * as notificationActions from '../../store/actions/notifications';  
import { withAuth } from '../../firebase/auth'; 
import axios from 'axios'; 
import * as transactionActions from '../../store/actions/transactions'; 
import { convertTransactionToDbValues, formatDate } from '../../utlities/utilities'; 

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import CircularProgress from 'material-ui/CircularProgress';
import { green500, red500, red300 } from 'material-ui/styles/colors'; 
import ViewTransactionDialog from '../../components/ViewTransactionDialog/ViewTransactionDialog'; 
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Row from '../../hoc/Grid/Row/Row';
import Column from '../../hoc/Grid/Column/Column';
import TransactionDialog from '../TransactionDialog/TransactionDialog'; 


class TransactionsTable extends Component {
    state = {
        openExpense: false, 
        selectedExpense: {
            date: new Date()
        }, 
        userUid: null, 
        filterBy: "None", 
        subFilter: 0, 
        openEdit: false
    }; 

    deletePost = () => {
        withAuth((authToken) => {
            const url = `${this.state.userUid}/transactions/${this.state.selectedExpense.date.year}/${this.state.selectedExpense.date.month}/${this.state.selectedExpense.id}.json?auth=${authToken}`
            axios.delete(url)
            .then(response => {
                this.props.showNotification("Deleted transaction"); 
                this.props.getTransactions(this.state.userUid, this.state.selectedExpense.date.month, this.state.selectedExpense.date.year); 
                this.toggleSelectExpense(); 
            })
            .catch(err => {
                console.log(err); 
            })
        });
    }; 

    updateTransaction = (obj) => {
        const postObj = convertTransactionToDbValues(obj); 
        withAuth((authToken) => {
            this.props.showNotification("Updated transaction");      
            const url = `${this.props.userProfile.uid}/transactions/${postObj.date.year}/${postObj.date.month}/${this.state.selectedExpense.id}.json?auth=${authToken}`; 
            axios.patch(url, postObj)
                .then(response => {
                    this.props.getTransactions(this.props.userProfile.uid, this.props.trackedDates.month, this.props.trackedDates.year); 
                    if(this.props.focusedRoommate) {
                        this.props.getRoommateTransactions(this.props.focusedRoommate.uid, this.props.userProfile.uid); 
                    }
                    this.toggleEdit(); 
                    this.toggleSelectExpense(); 
                }) 
                .catch(err => {
                    console.log(err); 
                    this.props.showNotification("Error updating transaction");
                })
        })
    }

    selectExpense = (expense) => {
        this.setState({
            selectedExpense: {
                amount: expense.amount,
                date: expense.date, 
                category: expense.category, 
                categoryId: expense.categoryId,
                id: expense.id, 
                type: expense.type, 
                desc: expense.desc
            }, 
            openExpense: !this.state.openExpense, 
            userUid: this.props.userProfile.uid
        }); 
    }

    toggleSelectExpense = () => {
        this.setState({
            openExpense: !this.state.openExpense
        }); 
    }; 

    toggleEdit = () => {
        this.setState({
            openEdit: !this.state.openEdit
        }); 
    }; 

    handleFilter = (value, isSubfilter = false) => {
        if(!isSubfilter && value !== "None") {
            this.setState({ 
                filterBy: value, 
                subFilter: value === "Category" ? this.props.fitlerCategories[0] : this.props.fitlerDates[0] 
            }); 
        }
        else if(isSubfilter) {
            this.setState({
                subFilter: value
            })
        }
        if(value === "None") {
            this.setState({ 
                filterBy: value, 
                subFilter: "" 
            }); 
        }
    }
    
    render() {
        let transactions = (
            <TableRow>
                <TableRowColumn><CircularProgress /></TableRowColumn>
            </TableRow>
        ); 
        let transArray = []; 
        if(this.props.transactions.length > 0) {
            transArray = [...this.props.transactions]; 
            if(this.state.filterBy === "Category") {
                transArray = transArray.filter(trans => trans.category === this.state.subFilter);
            }
            else if(this.state.filterBy === "Date") {
                transArray = transArray.filter(trans => trans.date.getDate() === this.state.subFilter.getDate());
            }
            transactions = transArray.map((trans) => {
                const color = trans.type === "Income" ? green500 : red500;                 
                return (
                    <TableRow key={trans.id}>
                        <TableRowColumn style={{width: '25%', paddingRight: 0}} >{`${formatDate(new Date(trans.date))}`}</TableRowColumn>
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
        else if(!this.props.expenses.length && !this.props.loading) {
            transactions = (
                <TableRow>
                    <TableRowColumn style={{color: red300}}>No Transactions For Selected Time Period</TableRowColumn>
                </TableRow>
            ); 
        }
        return (
            <Fragment>
                <Table onCellClick={(rownum) => transArray.length > 0 ? this.selectExpense(transArray[rownum]) : null}>
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

                <Row>
                    <Column width="xs-50">
                        <SelectField
                            style={{width: '100%'}}
                            floatingLabelText="Filter"
                            value={this.state.filterBy}
                            onChange={(event, index, value) => this.handleFilter(value)}
                            >
                            <MenuItem value={"None"} primaryText="None" />
                            <MenuItem value={"Category"} primaryText="Category" />
                            <MenuItem value={"Date"} primaryText="Date" />
                        </SelectField>
                    </Column>
                    <Column style={{overflow: 'hidden'}} width="xs-50">
                        <SelectField
                            disabled={this.state.filterBy === "None"}
                            style={{width: '100%'}}
                            floatingLabelText="Subfilter"
                            value={this.state.subFilter}
                            onChange={(event, key, value) => this.handleFilter(value, true)}
                            >
                            {
                                (() => {
                                    if(this.state.filterBy === 'Category')
                                        return this.props.fitlerCategories.map((cat, index) => {
                                            return <MenuItem key={index} value={cat} primaryText={cat} />
                                        })
                                    else if(this.state.filterBy === "Date")
                                        return this.props.fitlerDates.map((date, index) => {
                                            const stringDate = `${date.getMonth() + 1}-${date.getDate()}`;
                                            return <MenuItem key={index} value={date} primaryText={stringDate} />
                                        })
                                })()
                            }
                        </SelectField>
                    </Column>
                </Row>

                <ViewTransactionDialog 
                    canEdit={true}
                    deleteRequest={this.deletePost}
                    show={this.state.openExpense} 
                    notification={(text) => this.props.showNotification(text)}
                    expense={this.state.selectedExpense}
                    close={this.toggleSelectExpense}
                    userUid={this.state.userUid} 
                    editToggle={this.toggleEdit} />
                <TransactionDialog 
                    onSubmit={this.updateTransaction}
                    toggler={this.toggleEdit}
                    toggleView={this.toggleSelectExpense}
                    show={this.state.openEdit}
                    date={this.state.selectedExpense.date}
                    title="Edit Income or Expense"
                    amount={this.state.selectedExpense.amount + ""}
                    type={this.state.selectedExpense.type}
                    category={this.state.selectedExpense.category}
                    categoryId={this.state.selectedExpense.categoryId}
                    desc={this.state.selectedExpense.desc}
                    transId={this.state.selectedExpense.id} />
            </Fragment>
        ); 
    }
}

const mapStateToProps = state => {
    return {
        expenses: state.transactions.expenses, 
        incomes: state.transactions.incomes, 
        transactions: state.transactions.transactions, 
        loading: state.transactions.loadingTransactions, 
        fitlerCategories: state.transactions.filters.categories, 
        fitlerDates: state.transactions.filters.dates, 
        // transactions: state.transactions.userTransactions, 
        trackedDates: state.transactions.trackedDates,
        userProfile: state.auth.userProfile,
        transactionCategories: state.transactions.transactionCategories
    }; 
}; 

const mapDispatchToProps = dispatch => {
    return {
        showNotification: (text) => dispatch(notificationActions.showNotification(true, text)), 
        getTransactions: (cUid, month, year) => dispatch(transactionActions.getTransactions(cUid, month, year))
    }; 
}; 

export default connect(mapStateToProps, mapDispatchToProps)(TransactionsTable); 