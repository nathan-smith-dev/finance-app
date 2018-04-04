import React, { Component } from 'react';
import classes from './App.css';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'; 
import Auth from './Auth/Auth'; 

import Container from './hoc/Grid/Container/Container'; 
import Row from './hoc/Grid/Row/Row'; 
import Column from './hoc/Grid/Column/Column'; 
import AppBar from './containers/AppBar/AppBar'; 
import Callback from './components/Callback/Callback'; 
import Transactions from './containers/Transactions/Transactions'; 

class App extends Component {
  auth = new Auth();

  handleAuthentication = (nextState, replace) => {
    if (/access_token|id_token|error/.test(nextState.location.hash)) {
      this.auth.handleAuthentication();
    }
  }

  render() {
    return (
      <BrowserRouter>
        <MuiThemeProvider>
          <div className={classes.App}>
            <AppBar title="Finance App" />
            <Container>
              <Row alignItems="center">
                  <Column>
                    <Route path="/callback" render={(props) => {
                      this.handleAuthentication(props);
                      return <Callback {...props} /> 
                    }}/>
                    <Switch>
                      <Route path="/expenses-income" exact component={Transactions} />
                      <Route path="/finance-trends" exact render={() => <h1>Financial Trends Page</h1>} />
                      <Route path="/" exact render={() => <h1>Home Page</h1>} />
                      <Redirect to="/" />
                    </Switch>
                  </Column>
              </Row>
            </Container>
          </div>
        </MuiThemeProvider>
      </BrowserRouter>
    );
  }
}

export default App;
