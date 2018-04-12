import React, { Component } from 'react'; 

import { connect } from 'react-redux'; 
import axios from 'axios'; 
import { withAuth } from '../../firebase/auth'; 
import * as transactionActions from '../../store/actions/transactions'; 
import * as notificationActions from '../../store/actions/notifications'; 

import Row from '../../hoc/Grid/Row/Row'; 
import Column from '../../hoc/Grid/Column/Column'; 
import Container from '../../hoc/Grid/Container/Container'; 
import Paper from '../../hoc/Paper/Paper'; 
import {List, ListItem} from 'material-ui/List';

class UserCategories extends Component {
    deleteCategory = (category) => {
        const index = this.props.categories.indexOf(category); 
        withAuth(authToken => {
            const url = `${this.props.userProfile.uid}/transactions/categories/${this.props.catIds[index]}.json?auth=${authToken}`
            axios.delete(url)
                .then(response => {
                    // console.log(response); 
                    this.props.getTransactionCategories(this.props.userProfile.uid); 
                    this.props.notify("Category deleted."); 
                })
                .catch(error => {
                    console.log(error); 
                }); 
        })
    }

    render() {
        return (
            <Container>
                <Row>
                    <Column style={{margin: '0 auto'}} width="xl-50 md-75" >
                        <Paper>
                            <h3>Remove Category</h3>
                            <List>
                                {
                                    this.props.categories 
                                        ? this.props.categories.map((cat, index) => {
                                            return <ListItem 
                                                key={index} 
                                                primaryText={cat} 
                                                onClick={() => this.deleteCategory(cat)} />
                                        })
                                        : null
                                }
                            </List>
                        </Paper>
                    </Column>
                </Row>
            </Container>
        ); 
    }
}

const mapStateToProps = state => {
    return {
        categories: state.transactions.transactionCategories, 
        catIds: state.transactions.transactionIds, 
        userProfile: state.auth.userProfile
    }; 
}; 

const mapDispatchToProps = dispatch => {
    return {
        getTransactionCategories: (uid) => dispatch(transactionActions.getTransactionCategories(uid)),
        notify: (message) => dispatch(notificationActions.showNotification(true, message)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserCategories); 