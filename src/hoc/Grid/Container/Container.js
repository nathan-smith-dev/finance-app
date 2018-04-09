import React from 'react'; 
import classes from './Container.css'; 
import Paper from 'material-ui/Paper';

const container = (props) => {
    return (
        <div className={classes.Container}>
            <Paper zDepth={2} >
                <div className={classes.Paper} >
                    {props.children}
                </div>
            </Paper>
        </div>
    ); 
}

export default container; 