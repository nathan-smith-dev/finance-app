import React, { Component } from 'react'; 
import { connect } from 'react-redux'; 

import axios from 'axios'; 

import DatePicker from 'material-ui/DatePicker';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { red100, green100 } from 'material-ui/styles/colors';

class Transactions extends Component {

    state = {
        newExpense: {
            date: null, 
            amount: null, 
            type: null, 
            category: null
        }
    }

    handleChange = (key, value) => {
        console.log(value);
        // this.setState({
        //     newExpense: {
        //         ...this.state.newExpense, 
        //         [key]: value
        //     }
        // }); 
    }

    render() {
        return (
            <div>
                <h1>Hello {this.props.userProfile.name} I am the Transactions Component</h1>
                <DatePicker 
                    intText="Date" 
                    value={this.state.newExpense.date} 
                    onChange={(event) => this.handleChange('date', event)} />
                <TextField type="number" hintText="Amount" />
                <div>
                    <SelectField
                        floatingLabelText="Type"
                        value={this.state.newExpense.type} >
                        <MenuItem style={{backgroundColor: red100}} value="expense" primaryText="Expense" />
                        <MenuItem style={{backgroundColor: green100}} value="income" primaryText="Income" />
                    </SelectField>
                </div>
                <div>
                    <SelectField
                        floatingLabelText="Category"
                        value={this.state.newExpense.category} >
                        <MenuItem value="entertainment" primaryText="Entertainment" />
                        <MenuItem value="education" primaryText="Education" />
                        <MenuItem value="gas" primaryText="Gas" />
                        <MenuItem value="food" primaryText="Food" />
                    </SelectField>
                </div>
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