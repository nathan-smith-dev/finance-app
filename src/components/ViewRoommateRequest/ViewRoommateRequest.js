import React from 'react'; 

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

const viewRoommateRequest = (props) => {
    const actions = [
        <FlatButton
            label="Cancel"
            primary={true}
            onClick={props.close}
        />, 
        <FlatButton
            label="Accept Roomate"
            primary={true}
            onClick={props.onAcceptRoommate}
        />
    ]; 

    return(
        <Dialog 
            open={props.show} 
            actions={actions} 
            onRequestClose={props.close}
        >
            {props.requests ? props.requests.map(request => {
                return (
                    <div key={request.uid}>
                        <h2 style={{margin: 0, fontWeight: 300, color: '#BDBDBD', fontSize: 10, textTransform: 'uppercase'}}>User</h2>
                        <h3 style={{marginTop: 3, fontSize: 14}}>{request.name}</h3>
                        <h2 style={{margin: 0, fontWeight: 300, color: '#BDBDBD', fontSize: 10, textTransform: 'uppercase'}}>Email</h2>
                        <h3 style={{marginTop: 3, fontSize: 14}}>{request.email}</h3>
                        <h2 style={{margin: 0, fontWeight: 300, color: '#BDBDBD', fontSize: 10, textTransform: 'uppercase'}}>Date</h2>
                        <h3 style={{marginTop: 3, fontSize: 14}}>{new Date(request.date).toLocaleDateString("en-US")}</h3>
                    </div>
                ); 
            }) : null}
        </Dialog>
    ); 
}; 

export default viewRoommateRequest; 