import React from 'react'; 
import PropTypes from 'prop-types'; 

import PieChart from '../Charts/PieChart/PieChart'; 
import BarChart from '../Charts/BarChart/BarChart'; 
import CategoryTable from '../CategoryTable/CategoryTable'; 
import IncomeExpenseTable from '../IncomeExpenseTable/IncomeExpenseTable'; 
import { Tabs, Tab } from 'material-ui/Tabs';
import MonthYearSelector from '../../containers/MonthYearSelector/MonthYearSelector'; 
import Container from '../../hoc/Grid/Container/Container'; 
import Paper from '../../hoc/Paper/Paper'; 
import CircularProgress from 'material-ui/CircularProgress';
import Row from '../../hoc/Grid/Row/Row';
import Column from '../../hoc/Grid/Column/Column'; 
import { red300 } from 'material-ui/styles/colors'; 

const financialOverview = ({ loading = true, categorizedExpenses, selector = true, title, net,   
    pieData, pieLabels, barData, barLabels }) => {

    let income = net.incomes, expense = net.expenses; 

    let noTransactions = null;

    if(!loading && categorizedExpenses.length < 1) {
        noTransactions = <h5 style={{color: red300}}>No transaction data for selected time period. </h5>; 
    }
    else if(categorizedExpenses.length < 1) {
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
                                        <PieChart data={pieData} labels={pieLabels} title={title + " Expense Breakdown"} />
                                    </div>
                                    {noTransactions}
                                    <div style={{marginTop: 20}}>
                                        <CategoryTable 
                                            incomes={income} 
                                            expenses={expense} 
                                            categorizedExpenses={categorizedExpenses} />
                                    </div>
                                    {selector && (<MonthYearSelector />)}
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
                                        <BarChart data={barData} title={title + " Income VS Spending"} labels={barLabels} />
                                    </div>
                                    {noTransactions}
                                    <div style={{marginTop: 20}}>
                                        <IncomeExpenseTable 
                                            incomeTitle="Income"
                                            expenseTitle="Expense"
                                            incomes={income} 
                                            expenses={expense} />
                                    </div>
                                    {selector && (<MonthYearSelector />)}
                                </Paper>
                            </Column>
                        </Row>
                    </Container>
                </Tab>
            </Tabs>
        </div>
    );
}

financialOverview.propTypes = {
    loading: PropTypes.bool, 
    income: PropTypes.number, 
    expense: PropTypes.number, 
    pieData: PropTypes.array, 
    pieLabels: PropTypes.array, 
    barData: PropTypes.array, 
    barLabels: PropTypes.array, 
    net: PropTypes.object
}; 

export default financialOverview;