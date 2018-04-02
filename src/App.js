import React, { Component } from 'react';
import classes from './App.css';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { BrowserRouter, Route } from 'react-router-dom'; 

import Container from './hoc/Grid/Container/Container'; 
import Row from './hoc/Grid/Row/Row'; 
import Column from './hoc/Grid/Column/Column'; 
import AppBar from './components/AppBar/AppBar'; 

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
                    <Route path="/" exact render={() => <h1>Home Page</h1>} />
                  </Column>
                  <Column>
                    <Route path="/expenses-income" exact render={() => <h1>Expenses and Income Page</h1>} />
                  </Column>
                  <Column>
                    <Route path="/finance-trends" exact render={() => <h1>Financial Trends Page</h1>} />
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
