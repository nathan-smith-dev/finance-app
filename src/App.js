import React, { Component } from 'react';
import classes from './App.css';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'; 
import { connect } from 'react-redux'; 
import * as notificationActions from './store/actions/notifications'; 

import AppBar from './containers/AppBar/AppBar'; 
import UserCategories from './containers/UserCategories/UserCategories'; 
import Roommates from './containers/Roommates/Roommates'; 
import Transactions from './containers/Transactions/Transactions'; 
import Chart from './containers/Chart/Chart'; 
import Home from './containers/Home/Home'; 
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Snackbar from 'material-ui/Snackbar';
import ViewRoommate from './containers/ViewRoommate/ViewRoommate';

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: "#254e7b",
  }
}); 


class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <MuiThemeProvider muiTheme={muiTheme} >
          <div className={classes.App}>
            <AppBar title="Budget Space" />
            <Switch>
              {this.props.userProfile
                ? <Route path="/expenses-income" exact component={Transactions} />
                : <Redirect from="/expenses-income" to="/must-login" />
              }
              {this.props.userProfile
                ? <Route path="/finance-trends" exact component={Chart} />
                : <Redirect from="/finance-trends" to="/must-login" />
              }
              {this.props.userProfile
                ? <Route path="/categories" exact component={UserCategories} />
                : <Redirect from="/categories" to="/must-login" />
              }
              {this.props.userProfile
                ? <Route path="/roommates" exact component={Roommates} />
                : <Redirect from="/roommates" to="/must-login" />
              }
              {this.props.userProfile
                ? <Route path="/roommates/:id" exact component={ViewRoommate} />
                : <Redirect from="/roommates/:id" to="/must-login" />
              }
              <Route path="/must-login" exact render={() => <Home showNotifcation={() => this.props.showNotifcation("Login to view page.")} />} />
              <Route path="/" exact component={Home} />
              <Redirect to="/" />
            </Switch>
            {
              this.props.showNotification && (
                  <Snackbar
                    open={this.props.showNotification}
                    message={this.props.notificationText}
                    autoHideDuration={3000}
                    onRequestClose={this.props.closeNotification}
                  />
                )  
            }
          </div>
        </MuiThemeProvider>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = state => {
  return {
    userProfile: state.auth.userProfile, 
    showNotification: state.notifications.showNotification, 
    notificationText: state.notifications.notificationText, 
  }
}

const mapDispatchToProps = dispatch => {
  return {
    closeNotification: () => dispatch(notificationActions.showNotification(false, "")),
    showNotifcation: (message) => dispatch(notificationActions.showNotification(true, message)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
