import React, { Component } from 'react'; 

import { connect } from 'react-redux'; 
import axios from 'axios'; 
import { withAuth } from '../../firebase/auth';
import * as apiCalls from '../../api-calls'; 
import * as notificationActions from '../../store/actions/notifications'; 

import Row from '../../hoc/Grid/Row/Row'; 
import Column from '../../hoc/Grid/Column/Column'; 
import Container from '../../hoc/Grid/Container/Container'; 
import Paper from '../../hoc/Paper/Paper'; 
import {List, ListItem} from 'material-ui/List';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

class UserCategories extends Component {
    state = {
        showWarning: false, 
        category: null,
        categoryId: null
    }

    deleteCategory = () => {
        apiCalls.deleteUserCategory(this.state.categoryId, (data) => console.log(data)); 
    }

    toggleWarning = (categoryName = null, categoryId = null) => {
        if(categoryName && categoryId) {
            this.setState({
                showWarning: !this.state.showWarning, 
                category: categoryName, 
                categoryId: categoryId
            }, () => console.log(this.state)); 
        }
        else {
            this.setState({
                showWarning: !this.state.showWarning
            }); 
        }
    }

    render() {
        const actions = [
            <FlatButton
              label="Cancel"
              primary={true}
              onClick={this.toggleWarning}
            />,
            <FlatButton
              label="Delete"
              primary={true}
              onClick={this.deleteCategory}
            />,
        ];

        return (
            <Container>
                <Row>
                    <Column style={{margin: '0 auto'}} width="xl-50 md-75" >
                        <Paper>
                            <h3>Remove Category</h3>
                            <List>
                                {
                                    this.props.categories 
                                        ? this.props.categories.map((cat) => {
                                            return <ListItem 
                                                key={cat.id} 
                                                primaryText={cat.category} 
                                                onClick={() => this.toggleWarning(cat.category, cat.id)} />
                                        })
                                        : null
                                }
                            </List>
                            <Dialog
                                actions={actions}
                                modal={false}
                                open={this.state.showWarning}
                                onRequestClose={this.toggleWarning}
                            >
                            <h4>Delete {this.state.category ? this.state.category : "category"}?</h4>
                            </Dialog>
                        </Paper>
                    </Column>
                </Row>
            </Container>
        ); 
    }
}

const mapStateToProps = state => {
    return {
        categories: state.transactions.userCategories, 
        userProfile: state.auth.userProfile
    }; 
}; 

const mapDispatchToProps = dispatch => {
    return {
        notify: (message) => dispatch(notificationActions.showNotification(true, message)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserCategories); 