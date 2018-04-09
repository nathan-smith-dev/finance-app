import React from 'react'; 
import Paper from 'material-ui/Paper';
import classes from './Paper.css'; 


const paper = (props) => {
    return (
        <Paper zDepth={2} >
            <div className={classes.Paper}>
                {props.children}
            </div>
        </Paper>
    ); 
}; 

export default paper; 