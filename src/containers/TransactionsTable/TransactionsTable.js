import React, { Component, Fragment } from 'react'; 

import { connect } from 'react-redux';
import * as notificationActions from '../../store/actions/notifications';  

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


Array.prototype.unique = function() {
    return this.filter(function (value, index, self) { 
      return self.indexOf(value) === index;
    });
}

class TransactionsTable extends Component {
    state = {
        openExpense: false, 
        selectedExpense: {}, 
        userUid: null, 
        filterBy: 0, 
        subFilter: 0, 
    }; 

    selectExpense = (expense) => {
        this.setState({
            selectedExpense: {
                amount: expense.amount,
                date: expense.date, 
                category: expense.category, 
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

    handleFilter = (value, isSub = false) => {
        !isSub
            ? this.setState({
                filterBy: value,
                subFilter: 0
            })
            : this.setState({
                subFilter: value
            })
    }
    
    render() {
        let transactions = (
            <TableRow>
                <TableRowColumn><CircularProgress /></TableRowColumn>
            </TableRow>
        ); 
        let  transArray = []; 
        if(this.props.transactions && Object.keys(this.props.transactions).length > 0) {
            transArray = [...this.props.transactions]; 
            var subFilters = [
                [this.props.transactionCategories], 
                [(transArray.map(trans => trans.date.day).unique())]
            ]; 
            transArray.sort((a, b) => a.date.day - b.date.day); 
            if(this.state.filterBy === 1) {
                transArray = transArray.filter(trans => trans.category === subFilters[this.state.filterBy-1][0][this.state.subFilter])
            }
            if(this.state.filterBy === 2) {
                transArray = transArray.filter(trans => trans.date.day === subFilters[this.state.filterBy-1][0][this.state.subFilter])
            }
            transactions = transArray.map((trans) => {
                const color = trans.type === "Income" ? green500 : red500; 
                return (
                    <TableRow key={trans.id}>
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
        }
        else if(this.props.transactions && this.props.transactions === -1) {
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
                            onChange={(event, key) => this.handleFilter(key)}
                            >
                            <MenuItem value={0} primaryText="None" />
                            <MenuItem value={1} primaryText="Category" />
                            <MenuItem value={2} primaryText="Date" />
                        </SelectField>
                    </Column>
                    <Column style={{overflow: 'hidden'}} width="xs-50">
                        <SelectField
                            disabled={!this.state.filterBy}
                            style={{width: '100%'}}
                            floatingLabelText=" "
                            value={this.state.subFilter}
                            onChange={(event, key) => this.handleFilter(key, true)}
                            >
                            {
                                this.state.filterBy > 0
                                    ? subFilters[this.state.filterBy-1][0].map((filter,index) => {
                                        return <MenuItem key={index} value={index} primaryText={filter} />
                                    })
                                    : null
                            }
                        </SelectField>
                    </Column>
                </Row>

                <ViewTransactionDialog 
                    show={this.state.openExpense} 
                    notification={(text) => this.props.showNotification(text)}
                    expense={this.state.selectedExpense}
                    close={this.toggleSelectExpense}
                    userUid={this.state.userUid} />
            </Fragment>
        ); 
    }
}

const mapStateToProps = state => {
    return {
        transactions: state.transactions.userTransactions, 
        userProfile: state.auth.userProfile,
        transactionCategories: state.transactions.transactionCategories
    }; 
}; 

const mapDispatchToProps = dispatch => {
    return {
        showNotification: (text) => dispatch(notificationActions.showNotification(true, text))
    }; 
}; 

export default connect(mapStateToProps, mapDispatchToProps)(TransactionsTable); 