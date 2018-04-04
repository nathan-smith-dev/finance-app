// TODO: Add authentication check, add table of transactions, link transactions to redux state, style component

import React, { Component } from 'react'; 
import { connect } from 'react-redux'; 

import axios from 'axios'; 

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

class Transactions extends Component {

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
                console.log(response);
            }) 
            .catch(err => {
                console.log(err); 
            })
    }

    render() {
        return (
            <div>
                <h1>Hello {this.props.userProfile.name} I am the Transactions Component</h1>
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
                <FloatingActionButton onClick={this.sendNewTransaction} >
                    <ContentAdd />
                </FloatingActionButton>
            </div>
        ); 
    }
}

const mapStateToProps = state => {
    return {
        userProfile: state.userProfile
    }
}

export default connect(mapStateToProps)(Transactions); 