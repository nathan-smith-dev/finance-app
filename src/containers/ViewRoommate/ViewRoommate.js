import React, { Component } from 'react'; 

import { withRouter } from 'react-router-dom';
import { withAuth } from '../../firebase/auth'; 
import { connect } from 'react-redux'; 
import axios from 'axios'; 

class ViewRoommate extends Component {
    state = {
        roommate: null
    }; 

    shouldComponentUpdate(nextProps, nextState) {
        return this.state.roommate && nextState.roommate.uid === this.state.roommate.uid ? false : true; 
    }

    componentDidUpdate() {
        if(this.props.userProfile) {
            const urlPaths = this.props.location.pathname.split('/'); 
            const id = urlPaths[urlPaths.length - 1]; 
            console.log(id)
            withAuth(authToken => {
                const url = `profiles/${id}.json?auth=${authToken}`; 
                axios.get(url)
                    .then(response => {
                        this.setState({
                            roommate: response.data
                        })
                    })
                    .catch(error => console.log(error))
            })
        }
    }

    render() {
        if(this.state.roommate) {
            console.log(this.state.roommate)
        }
        return (
            <h4>View Roommate {this.state.roommate ? this.state.roommate.name : null}</h4>
        ); 
    }
}

const mapStateToProps = state => {
    return {
        userProfile: state.auth.userProfile
    }
}

export default connect(mapStateToProps)(withRouter(ViewRoommate)); 