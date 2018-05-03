import React, { Component } from 'react'; 
import PropTypes from 'prop-types'; 

import { connect } from 'react-redux'; 

class Annual extends Component { 
    static propTypes = {

    }

    render() {
        return (
            <div>Annual Component</div>
        ); 
    }
}

const mapStateToProps = state => {
    return {
        userProfile: state.auth.userProfile, 
    }; 
}; 

export default connect(mapStateToProps)(Annual); 