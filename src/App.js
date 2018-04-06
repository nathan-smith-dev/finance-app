import React, { Component } from 'react';
import classes from './App.css';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'; 
import { connect } from 'react-redux'; 

import Container from './hoc/Grid/Container/Container'; 
import Row from './hoc/Grid/Row/Row'; 
import Column from './hoc/Grid/Column/Column'; 
import AppBar from './containers/AppBar/AppBar'; 
import Transactions from './containers/Transactions/Transactions'; 
import Chart from './containers/Chart/Chart'; 

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
                      {this.props.userProfile
                        ? <Route path="/expenses-income" exact component={Transactions} />
                        : <Redirect from="/expenses-income" to="/" />
                      }
                      {this.props.userProfile
                        ? <Route path="/finance-trends" exact component={Chart} />
                        : <Redirect from="/finance-trends" to="/" />
                      }
                      <Route path="/" exact component={() => <h1>Home Page</h1>} />
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

const mapStateToProps = state => {
  return {
    userProfile: state.auth.userProfile
  }
}

export default connect(mapStateToProps)(App);
