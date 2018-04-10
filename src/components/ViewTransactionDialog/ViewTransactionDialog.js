import React from 'react'; 
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

const dialog = (props) => {
    const actions = [
        <FlatButton
            label="Delete"
            primary={false}
            onClick={this.handleClose}
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
                <h3 style={{marginTop: 3}}>{props.expense.date.month}-{props.expense.date.day}-{props.expense.date.year}</h3>
                <h2 style={{margin: 0, fontWeight: 300, color: '#BDBDBD', fontSize: 10, textTransform: 'uppercase'}}>Amount</h2>
                <h3 style={{marginTop: 3}}>${props.expense.amount}</h3>
                <h2 style={{margin: 0, fontWeight: 300, color: '#BDBDBD', fontSize: 10, textTransform: 'uppercase'}}>Type</h2>
                <h3 style={{marginTop: 3}}>{props.expense.type}</h3>
                <h2 style={{margin: 0, fontWeight: 300, color: '#BDBDBD', fontSize: 10, textTransform: 'uppercase'}}>Description</h2>
                <h3 style={{marginTop: 3}}>This is where the description will go.</h3>
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