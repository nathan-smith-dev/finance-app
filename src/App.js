import React, { Component } from 'react';
import classes from './App.css';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'; 
import { connect } from 'react-redux'; 

import AppBar from './containers/AppBar/AppBar'; 
import Transactions from './containers/Transactions/Transactions'; 
import Chart from './containers/Chart/Chart'; 
import Home from './components/Home/Home'; 
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { lightGreen300 } from 'material-ui/styles/colors';

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: lightGreen300,
  }
}); 


class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <MuiThemeProvider muiTheme={muiTheme} >
          <div className={classes.App}>
            <AppBar title="Budget Bunny" />
            <Switch>
              {this.props.userProfile
                ? <Route path="/expenses-income" exact component={Transactions} />
                : <Redirect from="/expenses-income" to="/" />
              }
              {this.props.userProfile
                ? <Route path="/finance-trends" exact component={Chart} />
                : <Redirect from="/finance-trends" to="/" />
              }
              <Route path="/" exact component={Home} />
              <Redirect to="/" />
            </Switch>
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
    notificationText: state.notifications.notificationText
  }
}

export default connect(mapStateToProps)(App);
