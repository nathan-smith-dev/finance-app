import React, { Component } from 'react'; 
import classes from './NewTransactionDialog.css'; 

import axios from 'axios'; 
import * as transactionActionCreators from '../../store/actions/transactions'; 
import { connect } from 'react-redux'; 
import { withAuth } from '../../firebase/auth'; 

import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

const CATEGORIES = [
    'Entertainment', 
    'Education', 
    'Gas', 
    'Food'
]; 

const TYPES = [
    'Expense', 
    'Income'
]; 

class NewTransactionDialog extends Component {

    state = {
        newExpense: {
            date: null, 
            amount: "", 
            type: null, 
            category: null
        }, 
        showNewCategory: false, 
        newCategory: "", 
        categories: []
    }

    handleChange = (key, value) => {
        this.setState({
            newExpense: {
                ...this.state.newExpense, 
                [key]: value
            }
        }); 
    }

    convertStateToDbValues() {
        const postObj = {
            date: {
                month: this.state.newExpense.date.getMonth(), 
                day: this.state.newExpense.date.getDate(), 
                year: this.state.newExpense.date.getFullYear()
            }, 
            amount: +this.state.newExpense.amount, 
            type: TYPES[this.state.newExpense.type], 
            category: CATEGORIES[this.state.newExpense.category]
        }

        return postObj; 
    }

    sendNewTransaction = () => {
        const postObj = this.convertStateToDbValues(); 
        withAuth((authToken) => {
            axios.post(`${this.props.userProfile.uid}/${postObj.date.year}/${postObj.date.month}.json?auth=${authToken}`, postObj)
                .then(response => {
                    // console.log(response);
                    this.getTransactions(this.props.userProfile.uid); 
                    this.props.toggler(); 
                    this.setState({newExpense: {}})
                }) 
                .catch(err => {
                    console.log(err); 
                })
        })
    }

    // getCategories = () => {
    //     withAuth(authToken => {
    //         axios.get(`${this.props.userProfile.uid}/categories.json?auth=${authToken}`)
    //             .then(response => {
    //                 console.log(response.data); 
    //                 this.setState({
    //                     categories: response.data
    //                 })
    //             }) 
    //             .catch(err => {
    //                 console.log(err); 
    //             })
    //     }) 
    // }

    getTransactions(id) {
        this.props.getTransactions(id); 
    }

    toggleNewCategory = () => {
        this.setState({
            showNewCategory: !this.state.showNewCategory
        }); 
    }

    render() {
        const actions = 
        [
            <RaisedButton 
                style={{marginRight: '1rem'}} 
                label="Submit" 
                primary={true} 
                onClick={this.sendNewTransaction} />, 
            <RaisedButton 
                label="Cancel" 
                onClick={this.props.toggler} />
        ]; 
        const newCatActions = 
        [
            <RaisedButton 
                style={{marginRight: '1rem'}} 
                label="Submit" 
                primary={true} 
                onClick={this.sendNewTransaction} />, 
            <RaisedButton 
                label="Cancel" 
                onClick={this.toggleNewCategory} />
        ]; 
        return (
                <Dialog
                    title="New Income or Expense"
                    modal={false}
                    open={this.props.show}
                    onRequestClose={this.props.toggler}
                    actions={actions}
                    contentClassName={classes.PaperWrapper}
                    paperClassName={classes.Paper}
                    >
                    <div>
                        <DatePicker 
                        hintText="Date" 
                        locale="en-US"
                        value={this.state.newExpense.date} 
                        onChange={(event, date) => this.handleChange('date', date)}
                            
                        />
                        <TextField 
                            type="number" 
                            hintText="Amount"
                            step="0.01"
                            value={this.state.newExpense.amount}
                            onChange={(event) => this.handleChange('amount', event.target.value)} />
                        <div>
                            <SelectField
                                floatingLabelText="Type"
                                value={this.state.newExpense.type}
                                onChange={(event, key) => this.handleChange('type', key)} >
                                <MenuItem value={0} primaryText="Expense" />
                                <MenuItem value={1} primaryText="Income" />
                            </SelectField>
                        </div>
                        <div style={{display: 'flex', alignItems: 'center'}} >
                            <SelectField
                                floatingLabelText="Category"
                                value={this.state.newExpense.category}
                                onChange={(event, key) => this.handleChange('category', key)} >
                                {
                                    this.props.transactionCategories 
                                    ? this.props.transactionCategories.map((cat, index) => {
                                        return (
                                            <MenuItem key={index} value={index} primaryText={cat} />
                                        ); 
                                    })
                                    : null
                                }
                            </SelectField>
                            <div>
                                <FloatingActionButton mini={true} onClick={this.toggleNewCategory} >
                                    <ContentAdd />
                                </FloatingActionButton>
                                <Dialog 
                                    open={this.state.showNewCategory}
                                    modal={false}
                                    onRequestClose={this.toggleNewCategory}
                                    actions={newCatActions}
                                    contentClassName={classes.PaperWrapper}
                                    paperClassName={classes.Paper} >
                                    <TextField 
                                        type="text" 
                                        hintText="New Category"
                                        value={this.state.newCategory}
                                        onChange={(event) => this.setState({newCategory: event.target.value})} />
                                </Dialog>
                            </div>
                        </div>
                    </div>
                </Dialog>
        ); 
    }
}

const mapStateToProps = state => {
    return {
        userProfile: state.auth.userProfile, 
        transactionCategories: state.transactions.transactionCategories
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getTransactions: (id) => dispatch(transactionActionCreators.getTransactions(id))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewTransactionDialog); 