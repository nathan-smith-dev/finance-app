import React from 'react'; 
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import AutoComplete from 'material-ui/AutoComplete'; 

const newRoommate = (props) => {
    const actions = [
        <FlatButton
        label="Cancel"
        primary={true}
        onClick={props.close}
        />, 
        <FlatButton
            label="Add Roomate"
            primary={true}
            onClick={props.onAddRoommate}
        />
    ]; 

    return (
        <Dialog 
            open={props.show} 
            actions={actions} 
            onRequestClose={props.close}
            >
            <AutoComplete
                style={{maxWidth: '80%'}}
                floatingLabelText="Roommate Email"
                filter={autoCompleteFilter}
                onNewRequest={props.onNewRequest}
                dataSource={props.filteredUsers}
                dataSourceConfig={{text: 'email', value: 'value'}}
                onUpdateInput={props.onUpdateInput}
            />
        </Dialog>
    ); 
}; 

const autoCompleteFilter = (searchText, key) => {
    return key.toLowerCase().includes(searchText.toLowerCase()) && searchText.length > 3; 
}; 

export default newRoommate; 