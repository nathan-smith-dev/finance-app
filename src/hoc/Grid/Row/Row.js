import React from 'react'; 
import classes from './Row.css'; 

const row = (props) => {
    const classNames = [classes.Row]; 
    if(props.alignItems){
       classNames.push(classes[props.alignItems]); 
    }

    return(
        <div className={classNames.join(' ')}>
            {props.children}
        </div>
    ); 
}

export default row; 