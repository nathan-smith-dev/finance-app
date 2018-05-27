import React, { Component } from 'react'; 
import PropTypes from 'prop-types'; 
import classes from './TransactionDialog.css'; 

import * as notificationActions from '../../store/actions/notifications'; 
import { connect } from 'react-redux'; 

import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import MobileNumberInput from '../../components/MobileNumberInput/MobileNumberInput'; 
import CategoryInput from '../CategoryInput/CategoryInput'; 


class NewTransactionDialog extends Component {
    static propTypes = {
        show: PropTypes.bool.isRequired, // shows the new transaction dialog 
        amount: PropTypes.string, 
        type: PropTypes.string, 
        category: PropTypes.string, 
        desc: PropTypes.string, 
        showNotification: PropTypes.func, 
        getCategories: PropTypes.func, 
        title: PropTypes.string,
        toggler: PropTypes.func, // toggles the new transaction dialog
        forceExpense: PropTypes.bool, 
        userProfile: PropTypes.object, 
        transactionCategories: PropTypes.array, 
    }

    static defaultProps = {
        date: new Date(), 
        amount: "",
        type: "Expense",
        category: null, 
        desc: "", 
        transactionCategories: []
    }

    state = {
        newExpense: {
            date: this.props.date, 
            amount: this.props.amount, 
            type: this.props.type, 
            category: this.props.category, 
            categoryId: this.props.categoryId, 
            desc: this.props.desc, 
        }, 
        showNewCategory: false, 
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            ...prevState, 
            newExpense: {
                date: nextProps.date && nextProps.date.year ? new Date(nextProps.date.year, nextProps.date.month, nextProps.date.day) : prevState.newExpense.date, 
                amount: nextProps.amount ? nextProps.amount : prevState.newExpense.amount, 
                type: nextProps.type ? nextProps.type : prevState.newExpense.type, 
                category: nextProps.category ? nextProps.transactionCategories.indexOf(nextProps.category) : prevState.newExpense.category, 
                categoryId: nextProps.categoryId ? nextProps.categoryId : prevState.newExpense.categoryId, 
                desc: nextProps.desc ? nextProps.desc : prevState.newExpense.desc, 
                transId: nextProps.transId ? nextProps.transId : null
            }
        }
    }

    handleChange = (key, value) => {
        console.log(value)
        this.setState({
            newExpense: {
                ...this.state.newExpense, 
                [key]: value
            }
        }); 
    }

    handleTypeChange = (event, index, value) => {
        this.setState({
            newExpense: {
                ...this.state.newExpense, 
                type: value
            }
        })
    }

    handleNumberChange = (value) => {
        this.setState({
            newExpense: {
                ...this.state.newExpense, 
                amount: value.toFixed(2)
            }
        }); 
    }

    handleCategoryChange = (cat) => {
        this.setState({
            newExpense: {
                ...this.state.newExpense, 
                category: cat
            }
        }); 
    }

    toggleNewCategory = () => {
        this.setState({
            showNewCategory: !this.state.showNewCategory, 
            newExpense: {
                ...this.state.newExpense, 
            }
        }); 
    }

    handleSubmit = () => {
        const { onSubmit } = this.props; 
        onSubmit({...this.state.newExpense}); 

        // window.setTimeout(() => { // Delay because UX feels like transaction is erased before the dialog closes
        //     this.setState({newExpense: {
        //         date: new Date(), 
        //         amount: "", 
        //         type: "Expense", 
        //         category: null, 
        //         desc: ""
        //     }}); 
        // }, 1000); 
    }

    render() {
        const {
            title, 
            show, 
            toggler, 
            forceExpense, 
        } = this.props; 

        const actions = 
        [
            <RaisedButton 
                style={{marginRight: '1rem'}} 
                label="Submit" 
                primary={true} 
                onClick={this.handleSubmit} />, 
            <RaisedButton 
                label="Cancel" 
                onClick={this.props.toggler} />, 
        ]; 
        return (
            <Dialog
                autoScrollBodyContent={true}
                title={title}
                titleClassName={classes.Title}
                modal={false}
                open={show}
                onRequestClose={toggler}
                actions={actions}
                contentClassName={classes.PaperWrapper}
                paperClassName={classes.Paper} >
                <div 
                    className={classes.Inputs} 
                    style={{margin: '0 auto'}} >
                    <DatePicker 
                        textFieldStyle={{maxWidth: '100%'}}                            
                        hintText="Date" 
                        locale="en-US"
                        value={this.state.newExpense.date} 
                        onChange={(event, date) => this.handleChange('date', date)} />
                    <MobileNumberInput
                        hintText="Amount"
                        value={this.state.newExpense.amount} 
                        onChange={this.handleNumberChange} />
                    <div>
                        <SelectField
                            style={{maxWidth: '100%'}}                            
                            floatingLabelText="Type"
                            value={this.state.newExpense.type}
                            disabled={forceExpense}
                            onChange={this.handleTypeChange} >
                            <MenuItem value={"Expense"} primaryText="Expense" />
                            <MenuItem value={"Income"} primaryText="Income" />
                        </SelectField>
                    </div>
                    <CategoryInput 
                        categoryId={this.state.newExpense.categoryId}
                        notificationHandler={this.props.showNotification}
                        userId={this.props.userProfile.uid}
                        onChange={this.handleCategoryChange}
                        onCategoryAdded={this.props.getCategories} />
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
    }
}

const mapDispatchToProps = dispatch => {
    return {
        showNotification: (text) => dispatch(notificationActions.showNotification(true, text)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewTransactionDialog); 