import React, { Component } from 'react'; 
import classes from './NewTransactionDialog.css'; 

import axios from 'axios'; 
import * as transactionActionCreators from '../../store/actions/transactions'; 
import * as notificationActions from '../../store/actions/notifications'; 
import * as roommateActions from '../../store/actions/roommates'; 
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
            date: this.props.date ? this.props.date : new Date(), 
            amount: this.props.amount ? this.props.amount : "", 
            type: this.props.type ? this.props.type : null, 
            category: this.props.category ? this.props.category : null, 
            desc: this.props.desc ? this.props.desc : "", 
        }, 
        showNewCategory: false, 
        newCategory: "", 
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            ...prevState, 
            newExpense: {
                date: nextProps.date ? new Date(nextProps.date.year, nextProps.date.month, nextProps.date.day) : prevState.newExpense.date, 
                amount: nextProps.amount ? nextProps.amount : prevState.newExpense.amount, 
                type: nextProps.type ? TYPES.indexOf(nextProps.type) : prevState.newExpense.type, 
                category: nextProps.category ? nextProps.transactionCategories.indexOf(nextProps.category) : prevState.newExpense.category, 
                desc: nextProps.desc ? nextProps.desc : prevState.newExpense.desc, 
                transId: nextProps.transId ? nextProps.transId : null
            }
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
            const url = this.props.endPoint ? this.props.endPoint+`.json?auth=${authToken}` : `${this.props.userProfile.uid}/transactions/${postObj.date.year}/${postObj.date.month}.json?auth=${authToken}`; 
            axios.post(url, postObj)
                .then(response => {
                    this.props.showNotification("Added transaction");   
                    // console.log(response);
                    this.props.getTransactions(this.props.userProfile.uid, this.props.trackedDates.month, this.props.trackedDates.year); 
                    if(this.props.title === "Expense Roommate") {
                        this.props.getRoommateTransactions(this.props.focusedRoommate.uid, this.props.userProfile.uid); 
                    }
                    this.props.toggler(); 
                    this.setState({newExpense: {
                        date: new Date(), 
                        amount: "", 
                        type: null, 
                        category: null, 
                        desc: ""
                    }}); 
                }) 
                .catch(err => {
                    console.log(err); 
                    this.props.showNotification("Error adding transaction");
                })
        })
    }
    
    updateTransaction = () => {
        const postObj = this.convertStateToDbValues(); 
        withAuth((authToken) => {
            this.props.showNotification("Updated transaction");      
            console.log(this.props.transId)
            const url = this.props.updateUrl ? this.props.updateUrl+`.json?auth=${authToken}` : `${this.props.userProfile.uid}/transactions/${postObj.date.year}/${postObj.date.month}/${this.props.transId}.json?auth=${authToken}`; 
            axios.patch(url, postObj)
                .then(response => {
                    this.props.getTransactions(this.props.userProfile.uid, this.props.trackedDates.month, this.props.trackedDates.year); 
                    if(this.props.focusedRoommate) {
                        this.props.getRoommateTransactions(this.props.focusedRoommate.uid, this.props.userProfile.uid); 
                    }
                    this.props.toggler(); 
                    this.props.toggleView(); 
                }) 
                .catch(err => {
                    console.log(err); 
                    this.props.showNotification("Error updating transaction");
                })
        })
    }

    sendNewCategory = () => {
        const category = this.state.newCategory;
        const postObj = {}; 
        postObj[category.toLowerCase()] = category; 
        this.props.showNotification("Added category."); 
        withAuth((authToken) => {
            axios.post(`${this.props.userProfile.uid}/transactions/categories.json?auth=${authToken}`, postObj)
                .then(response => {
                    // console.log(response);
                    this.props.getCategories(this.props.userProfile.uid); 
                    this.toggleNewCategory(); 
                    this.setState({
                        newCategory: "",
                        newExpense: {
                            ...this.state.newExpense, 
                            category: this.props.transactionCategories.length
                        }
                    })
                }) 
                .catch(err => {
                    console.log(err); 
                    this.props.showNotification("Failed to add category."); 
                })
        })
    }

    toggleNewCategory = () => {
        this.setState({
            showNewCategory: !this.state.showNewCategory, 
            newExpense: {
                ...this.state.newExpense, 
            }
        }); 
    }

    render() {
        const actions = 
        [
            <RaisedButton 
                style={{marginRight: '1rem'}} 
                label="Submit" 
                primary={true} 
                onClick={this.props.date ? this.updateTransaction : this.sendNewTransaction} />, 
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
                    title={this.props.title ? this.props.title : "New Income or Expense"}
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
                            pattern="\d*"
                            type="number" 
                            hintText="Amount"
                            step="0.01"
                            value={this.state.newExpense.amount}
                            onKeyDown={(event) => this.handleNumberChange(event)} />
                        <div>
                            <SelectField
                                style={{maxWidth: '100%'}}                            
                                floatingLabelText="Type"
                                value={this.state.newExpense.type}
                                disabled={this.props.forceExpense}
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
                                        onChange={(event) => {
                                            this.setState({
                                                newCategory: event.target.value, 
                                                newExpense: {...this.state.newExpense}
                                            }); 
                                        }} />
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
        focusedRoommate: state.roommates.focusedRoommate, 
        transactionCategories: state.transactions.transactionCategories, 
        trackedDates: state.transactions.trackedDates
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getTransactions: (id, month, year) => dispatch(transactionActionCreators.getTransactions(id, month, year)),
        getCategories: (id) => dispatch(transactionActionCreators.getTransactionCategories(id)), 
        showNotification: (text) => dispatch(notificationActions.showNotification(true, text)),
        getRoommateTransactions: (rUid, cUid) => dispatch(roommateActions.getRoommateTransactionsToAndFrom(rUid, cUid)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewTransactionDialog); 