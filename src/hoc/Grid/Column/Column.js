import React from 'react'; 
import classes from './Column.css'; 

const column = (props) => {
    const classNames = [classes.Column]; 
    if(props.width) {
        const splitWidths = props.width.split(' '); 
        for(let w of splitWidths) {
            classNames.push(classes[w]);
        }
    }

    return(
        <div className={classNames.join(' ')}>
            {props.children}
        </div>
    );
}

export default column; 