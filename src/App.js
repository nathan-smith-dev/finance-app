import React, { Component } from 'react';
import classes from './App.css';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'; 

import Container from './hoc/Grid/Container/Container'; 
import Row from './hoc/Grid/Row/Row'; 
import Column from './hoc/Grid/Column/Column'; 
import AppBar from './containers/AppBar/AppBar'; 
import Transactions from './containers/Transactions/Transactions'; 

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <MuiThemeProvider>
          <div className={classes.App}>
            <AppBar title="Finance App" />
            <Container>
              <Row alignItems="center">
                  <Column>
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
