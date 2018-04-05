import React, { Component } from 'react'; 
import classes from './NewTransactionDialog.css'; 

import axios from 'axios'; 
import * as transactionActionCreators from '../../store/actions/transactions'; 
import { connect } from 'react-redux'; 

import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

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
        }
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
        axios.post(`${this.props.userProfile.sub}/${postObj.date.year}/${postObj.date.month}.json`, postObj)
            .then(response => {
                // console.log(response);
                this.getTransactions(this.props.userProfile.sub); 
                this.props.toggler(); 
            }) 
            .catch(err => {
                console.log(err); 
            })
    }

    getTransactions(id) {
        this.props.getTransactions(id); 
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
                        <div>
                            <SelectField
                                floatingLabelText="Category"
                                value={this.state.newExpense.category}
                                onChange={(event, key) => this.handleChange('category', key)} >
                                <MenuItem value={0} primaryText="Entertainment" />
                                <MenuItem value={1} primaryText="Education" />
                                <MenuItem value={2} primaryText="Gas" />
                                <MenuItem value={3} primaryText="Food" />
                            </SelectField>
                        </div>
                    </div>
                </Dialog>
        ); 
    }
}

const mapStateToProps = state => {
    return {
        userProfile: state.auth.userProfile
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getTransactions: (id) => dispatch(transactionActionCreators.getTransactions(id))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewTransactionDialog); 