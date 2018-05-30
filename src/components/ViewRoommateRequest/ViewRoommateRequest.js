import React from 'react'; 

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { formatDate } from '../../utlities/utilities';

const viewRoommateRequest = (props) => {
    const actions = [
        <FlatButton
            label="Cancel"
            primary={true}
            onClick={props.close}
        />, 
        <FlatButton
            label="Delete"
            primary={true}
            onClick={props.delete}
        />, 
        <FlatButton
            label="Accept Roomate"
            primary={true}
            onClick={props.onAcceptRoommate}
        />
    ]; 

    return(
        <Dialog 
            style={{zIndex: 10000}}
            open={props.show} 
            actions={actions} 
            onRequestClose={props.close}
        >
            {props.request && (<div>
                <h2 style={{margin: 0, fontWeight: 300, color: '#BDBDBD', fontSize: 10, textTransform: 'uppercase'}}>User</h2>
                <h3 style={{marginTop: 3, fontSize: 14}}>{`${props.request.firstName} ${props.request.lastName}`}</h3>
                <h2 style={{margin: 0, fontWeight: 300, color: '#BDBDBD', fontSize: 10, textTransform: 'uppercase'}}>Email</h2>
                <h3 style={{marginTop: 3, fontSize: 14}}>{props.request.email}</h3>
                <h2 style={{margin: 0, fontWeight: 300, color: '#BDBDBD', fontSize: 10, textTransform: 'uppercase'}}>Date</h2>
                <h3 style={{marginTop: 3, fontSize: 14}}>{formatDate(new Date(props.request.date))}</h3>
            </div>)}
        </Dialog>
    ); 
}; 

export default viewRoommateRequest; 