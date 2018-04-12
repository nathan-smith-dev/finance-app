import React, { Component } from 'react'; 
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import DatePicker from 'material-ui/DatePicker';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import axios from 'axios'; 
import { withAuth } from '../../firebase/auth'; 
import { store } from '../../index';
import * as transactionActions from '../../store/actions/transactions'; 

class EditTransactionDialog extends Component {
    state = {
        date: this.props.date, 
        amount: this.props.amount, 
        type: this.props.type, 
        category: this.props.category, 
        desc: this.props.desc, 
        userId: this.props.userId
    }; 

    handleChange = (key, value) => {
        this.setState({
            newExpense: {
                ...this.state.newExpense, 
                [key]: value
            }
        }); 
    }

    handleNumberChange = (event) => {
        // convert state value to string
        let newAmount = (this.state.newExpense.amount + "").split("");
        newAmount.splice(newAmount.indexOf("."), 1); // remove decimal from array 

        if(event.keyCode === 8) { // backspace
            if(newAmount.length) {
                newAmount.pop(); 
            }
        }

        const number = +event.key; 
        if(Number.isInteger(number)) {
            if(!newAmount.length) {
                newAmount = [0, 0, 0, number]; 
            }
            else {
                newAmount.push(number+""); 
            }
        }

        newAmount.splice(-2, 0, "."); 
        newAmount = +newAmount.join(""); 

        if(Number.isFinite(newAmount)) {
            this.setState({
                newExpense: {
                    ...this.state.newExpense, 
                    amount: newAmount.toFixed(2)
                }
            }); 
        }


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
                    this.props.showNotification("Added transaction");                     
                    // console.log(response);
                    this.props.getTransactions(this.props.userProfile.uid, this.props.trackedDates.month, this.props.trackedDates.year); 
                    this.props.toggler(); 
                    this.setState({newExpense: {
                        date: new Date(), 
                        amount: "", 
                        type: null, 
                        category: null, 
                        desc: ""
                    }})
                }) 
                .catch(err => {
                    console.log(err); 
                    this.props.showNotification("Error adding transaction");
                })
        })
    }

    toggleNewCategory = () => {
        this.setState({
            showNewCategory: !this.state.showNewCategory
        }); 
    }

    
    editTransaction = (transaction) => {
        withAuth((authToken) => {
            const url = `${this.state.userUid}/transactions/${this.state.expense.date.year}/${this.state.expense.date.month}/${this.state.expense.id}.json?auth=${authToken}`
            axios.delete(url)
            .then(response => {
                this.state.notification("Deleted transaction"); 
                store.dispatch(transactionActions.getTransactions(this.state.userUid, this.state.expense.date.month, this.state.expense.date.year)); 
                this.state.close(); 
            })
            .catch(err => {
                console.log(err); 
            })
        });
    }; 
    
    
    render() {
        let expenseInfo = null; 
        const actions = [
            <FlatButton
                label="Delete"
                primary={false}
                onClick={this.editTransaction}
            />, 
            <FlatButton
                label="Cancel"
                primary={true}
                onClick={this.state.close}
            />
        ]; 
        if(this.state.date) {
            expenseInfo = (
                <div>
                    <h2 style={{margin: 0, fontWeight: 300, color: '#BDBDBD', fontSize: 10, textTransform: 'uppercase'}}>Date</h2>
                    <h3 style={{marginTop: 3}}>{this.state.date.month + 1}/{this.state.date.day}/{this.state.date.year}</h3>
                    <h2 style={{margin: 0, fontWeight: 300, color: '#BDBDBD', fontSize: 10, textTransform: 'uppercase'}}>Amount</h2>
                    <h3 style={{marginTop: 3}}>${this.state.amount}</h3>
                    <h2 style={{margin: 0, fontWeight: 300, color: '#BDBDBD', fontSize: 10, textTransform: 'uppercase'}}>Type</h2>
                    <h3 style={{marginTop: 3}}>{this.state.type}</h3>
                    <h2 style={{margin: 0, fontWeight: 300, color: '#BDBDBD', fontSize: 10, textTransform: 'uppercase'}}>Description</h2>
                    <h3 style={{marginTop: 3}}>{this.state.desc}</h3>
                </div>
            ); 
            
        }
        return (
            <Dialog
                autoScrollBodyContent={true}
                title="Edit Income or Expense"
                modal={false}
                open={this.props.show}
                onRequestClose={this.props.toggler}
                actions={actions}
                >
                <div style={{margin: '0 auto'}}>
                    <DatePicker 
                        textFieldStyle={{maxWidth: '100%'}}                            
                        hintText="Date" 
                        locale="en-US"
                        value={this.state.date} 
                        onChange={(event, date) => this.handleChange('date', date)}
                        
                    />
                    <TextField 
                        style={{maxWidth: '100%'}}
                        pattern="\d*"
                        type="number" 
                        hintText="Amount"
                        step="0.01"
                        value={this.state.amount}
                        onKeyDown={(event) => this.handleNumberChange(event)} />
                    <div>
                        <SelectField
                            style={{maxWidth: '100%'}}                            
                            floatingLabelText="Type"
                            value={this.state.type}
                            onChange={(event, key) => this.handleChange('type', key)} >
                            <MenuItem value={0} primaryText="Expense" />
                            <MenuItem value={1} primaryText="Income" />
                        </SelectField>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center'}} >
                        <SelectField
                            disabled={this.state.type === 1}
                            floatingLabelText="Category"
                            value={this.state.category}
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
                                actions={actions}
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
                        value={this.state.desc}
                        onChange={(event) => this.handleChange('desc', event.target.value)} />
                </div>
            </Dialog>
        ); 
    }

}; 

export default EditTransactionDialog; 