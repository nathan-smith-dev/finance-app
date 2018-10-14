import React from 'react'; 
import classes from './Container.css'; 

const container = (props) => {
    return (
        <div className={classes.Container} style={{...props.style}} >
            {props.children}
        </div>
    ); 
}

export default container; 