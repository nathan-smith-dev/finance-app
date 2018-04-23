import React, { Component } from 'react'; 
import PropTypes from 'prop-types'; 

import { connect } from 'react-redux';
import { toFixedNumber } from '../../utlities/utilities'; 

import PieChart from '../../components/Charts/PieChart/PieChart'; 
import BarChart from '../../components/Charts/BarChart/BarChart'; 
import CategoryTable from '../../components/CategoryTable/CategoryTable'; 
import IncomeExpenseTable from '../../components/IncomeExpenseTable/IncomeExpenseTable'; 
import { Tabs, Tab } from 'material-ui/Tabs';
import MonthYearSelector from '../MonthYearSelector/MonthYearSelector'; 
import Container from '../../hoc/Grid/Container/Container'; 
import Paper from '../../hoc/Paper/Paper'; 
import CircularProgress from 'material-ui/CircularProgress';
import Row from '../../hoc/Grid/Row/Row';
import Column from '../../hoc/Grid/Column/Column'; 
import { red300 } from 'material-ui/styles/colors'; 

class Chart extends Component {
    static propTypes = {
        transactionDetails: PropTypes.object,
        loading: PropTypes.bool
    }

    static defaultProps = {
        loading: true
    }

    render() {
        const { 
            transactionDetails, 
            loading
        } = this.props; 

        let noTransactions = null, pieLabels = [], pieData = [], barData = [], barLabels = ['Income', 'Expense']; 

        if(transactionDetails && transactionDetails.categorizedExpenses) {
            pieLabels = Object.keys(transactionDetails.categorizedExpenses); 
            pieData = Object.values(transactionDetails.categorizedExpenses).map(val => toFixedNumber(val, 2)); 
            barData = [toFixedNumber(transactionDetails.incomes, 2), toFixedNumber(transactionDetails.expenses, 2)]; 
        }
        else if(!loading && (!transactionDetails.categorizedExpenses || transactionDetails.categorizedExpenses.length > 0)) {
            noTransactions = <h5 style={{color: red300}}>No transaction data for selected time period. </h5>; 
        }
        else {
            noTransactions = (
                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <CircularProgress />
                </div>
            ); 
        }
    
        return(
            <div>
                <Tabs>
                    <Tab label="Pie">
                        <Container>
                            <Row>   
                                <Column style={{margin: '0 auto'}} width="xl-50 md-75">
                                    <Paper>
                                        <div style={{height: 300, width: '100%'}}>                                        
                                            <PieChart data={pieData} labels={pieLabels} title="Expense Breakdown" />
                                        </div>
                                        {noTransactions}
                                        <div style={{marginTop: 20}}>
                                            <CategoryTable 
                                                incomes={transactionDetails.incomes} 
                                                expenses={transactionDetails.expenses} 
                                                transactionDetails={transactionDetails} />
                                        </div>
                                        <MonthYearSelector />
                                    </Paper>
                                </Column>
                            </Row>
                        </Container>
                    </Tab>
                    <Tab label="bar">
                        <Container>
                            <Row>   
                                <Column style={{margin: '0 auto'}} width="xl-50 md-75">
                                    <Paper>
                                        <div style={{height: 300, width: '100%'}}>
                                            <BarChart data={barData} title="Income VS Spending" labels={barLabels} />
                                        </div>
                                        {noTransactions}
                                        <div style={{marginTop: 20}}>
                                            <IncomeExpenseTable 
                                                incomeTitle="Income"
                                                expenseTitle="Expense"
                                                incomes={transactionDetails.incomes} 
                                                expenses={transactionDetails.expenses} />
                                        </div>
                                        <MonthYearSelector />
                                    </Paper>
                                </Column>
                            </Row>
                        </Container>
                    </Tab>
                </Tabs>
            </div>
        ); 
    }
}

const mapStateToProps = state => {
    return {
        transactionDetails: state.transactions.transactionDetails, 
        loading: state.transactions.loadingTransactions
    }
}; 

export default connect(mapStateToProps)(Chart);