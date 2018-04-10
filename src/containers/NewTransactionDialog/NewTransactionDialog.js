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

const TYPES = [
    'Expense', 
    'Income'
]; 

class NewTransactionDialog extends Component {

    state = {
        newExpense: {
            date: new Date(), 
            amount: "", 
            type: null, 
            category: null, 
            desc: ""
        }, 
        showNewCategory: false, 
        newCategory: "", 
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
            category: this.props.transactionCategories[this.state.newExpense.category], 
            desc: this.state.newExpense.desc
        }

        return postObj; 
    }

    sendNewTransaction = () => {
        const postObj = this.convertStateToDbValues(); 
        withAuth((authToken) => {
            axios.post(`${this.props.userProfile.uid}/transactions/${postObj.date.year}/${postObj.date.month}.json?auth=${authToken}`, postObj)
                .then(response => {
                    // console.log(response);
                    this.props.getTransactions(this.props.userProfile.uid, this.props.trackedDates.month, this.props.trackedDates.year); 
                    this.props.toggler(); 
                    this.setState({newExpense: {}})
                }) 
                .catch(err => {
                    console.log(err); 
                })
        })
    }

    sendNewCategory = () => {
        const category = this.state.newCategory;
        const postObj = {}; 
        postObj[category.toLowerCase()] = category; 
        withAuth((authToken) => {
            axios.post(`${this.props.userProfile.uid}/transactions/categories.json?auth=${authToken}`, postObj)
                .then(response => {
                    // console.log(response);
                    this.props.getCategories(this.props.userProfile.uid); 
                    this.toggleNewCategory(); 
                    this.setState({newCategory: ""}); 
                    this.setState({
                        newExpense: {
                            ...this.state.newExpense, 
                            category: this.props.transactionCategories.length
                        }
                    })
                }) 
                .catch(err => {
                    console.log(err); 
                })
        })
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
                onClick={this.sendNewCategory} />, 
            <RaisedButton 
                label="Cancel" 
                onClick={this.toggleNewCategory} />
        ]; 
        return (
                <Dialog
                    autoScrollBodyContent={true}
                    title="New Income or Expense"
                    titleClassName={classes.Title}
                    modal={false}
                    open={this.props.show}
                    onRequestClose={this.props.toggler}
                    actions={actions}
                    contentClassName={classes.PaperWrapper}
                    paperClassName={classes.Paper}
                    >
                    <div className={classes.Inputs} style={{margin: '0 auto'}}>
                        <DatePicker 
                            textFieldStyle={{maxWidth: '100%'}}                            
                            hintText="Date" 
                            locale="en-US"
                            value={this.state.newExpense.date} 
                            onChange={(event, date) => this.handleChange('date', date)}
                            
                        />
                        <TextField 
                            style={{maxWidth: '100%'}}
                            type="number" 
                            hintText="Amount"
                            step="0.01"
                            value={this.state.newExpense.amount}
                            onChange={(event) => this.handleChange('amount', event.target.value)} />
                        <div>
                            <SelectField
                                style={{maxWidth: '100%'}}                            
                                floatingLabelText="Type"
                                value={this.state.newExpense.type}
                                onChange={(event, key) => this.handleChange('type', key)} >
                                <MenuItem value={0} primaryText="Expense" />
                                <MenuItem value={1} primaryText="Income" />
                            </SelectField>
                        </div>
                        <div style={{display: 'flex', alignItems: 'center'}} >
                            <SelectField
                                disabled={this.state.newExpense.type === 1}
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
                        <TextField 
                            style={{maxWidth: '100%'}}                        
                            type="text" 
                            hintText="Description"
                            value={this.state.newExpense.desc}
                            onChange={(event) => this.handleChange('desc', event.target.value)} />
                    </div>
                </Dialog>
        ); 
    }
}

const mapStateToProps = state => {
    return {
        userProfile: state.auth.userProfile, 
        transactionCategories: state.transactions.transactionCategories, 
        trackedDates: state.transactions.trackedDates
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getTransactions: (id, month, year) => dispatch(transactionActionCreators.getTransactions(id, month, year)),
        getCategories: (id) => dispatch(transactionActionCreators.getTransactionCategories(id))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewTransactionDialog); 