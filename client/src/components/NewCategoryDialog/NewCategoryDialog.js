import React from 'react'; 
import PropTypes from 'prop-types'; 

import RaisedButton from 'material-ui/RaisedButton'; 
import FloatingActionButton from 'material-ui/FloatingActionButton'; 
import Dialog from 'material-ui/Dialog'; 
import ContentAdd from 'material-ui/svg-icons/content/add'; 
import TextField from 'material-ui/TextField'; 

const newCategoryDialog = ({ show, toggler, value, onChange, onSubmit }) => {
    const newCatActions = 
    [
        <RaisedButton 
            style={{marginRight: '1rem'}} 
            label="Submit" 
            primary={true} 
            onClick={onSubmit} />, 
        <RaisedButton 
            label="Cancel" 
            onClick={toggler} />
    ]; 

    return (
        <div>
            <FloatingActionButton mini={true} onClick={toggler} >
                <ContentAdd />
            </FloatingActionButton>
            <Dialog 
                open={show}
                modal={false}
                onRequestClose={toggler}
                actions={newCatActions} >
                <TextField 
                    type="text" 
                    hintText="New Category"
                    value={value}
                    onChange={onChange} />
            </Dialog>
        </div>
    ); 
}; 

newCategoryDialog.propTypes = {
    show: PropTypes.bool.isRequired, 
    toggler: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired, 
    onChange: PropTypes.func.isRequired, 
    onSubmit: PropTypes.func.isRequired
}

export default newCategoryDialog; 