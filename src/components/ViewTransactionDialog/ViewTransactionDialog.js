import React from 'react'; 
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import axios from 'axios'; 
import { withAuth } from '../../firebase/auth'; 
import { store } from '../../index';
import * as transactionActions from '../../store/actions/transactions'; 

const dialog = (props) => {
    
    const deletePost = () => {
        withAuth((authToken) => {
            const url = `${props.userUid}/transactions/${props.expense.date.year}/${props.expense.date.month}/${props.expense.id}.json?auth=${authToken}`
            axios.delete(url)
            .then(response => {
                props.notification("Deleted transaction"); 
                store.dispatch(transactionActions.getTransactions(props.userUid, props.expense.date.month, props.expense.date.year)); 
                props.close(); 
            })
            .catch(err => {
                console.log(err); 
            })
        });
    }; 
    
    const actions = [
        <FlatButton
            label="Delete"
            primary={false}
            onClick={deletePost}
        />, 
        <FlatButton
            label="Cancel"
            primary={true}
            onClick={props.close}
        />
    ]; 

    let expenseInfo = null; 
    if(props.expense.date) {
        expenseInfo = (
            <div>
                <h2 style={{margin: 0, fontWeight: 300, color: '#BDBDBD', fontSize: 10, textTransform: 'uppercase'}}>Date</h2>
                <h3 style={{marginTop: 3}}>{props.expense.date.month + 1}/{props.expense.date.day}/{props.expense.date.year}</h3>
                <h2 style={{margin: 0, fontWeight: 300, color: '#BDBDBD', fontSize: 10, textTransform: 'uppercase'}}>Amount</h2>
                <h3 style={{marginTop: 3}}>${props.expense.amount}</h3>
                <h2 style={{margin: 0, fontWeight: 300, color: '#BDBDBD', fontSize: 10, textTransform: 'uppercase'}}>Type</h2>
                <h3 style={{marginTop: 3}}>{props.expense.type}</h3>
                <h2 style={{margin: 0, fontWeight: 300, color: '#BDBDBD', fontSize: 10, textTransform: 'uppercase'}}>Description</h2>
                <h3 style={{marginTop: 3}}>{props.expense.desc}</h3>
            </div>
        ); 
        
    }
    return (
        <Dialog 
            open={props.show} 
            actions={actions} 
            onRequestClose={props.close}
            >
            {expenseInfo}
        </Dialog>
    ); 
}; 

export default dialog; 