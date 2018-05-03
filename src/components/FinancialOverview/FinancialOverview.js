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

const financialOverview = ({ loading = true, income, expense, transactionDetails, 
    pieData, pieLabels, barData, barLabels }) => {

    let noTransactions = null; 

    if(!loading && (!transactionDetails.categorizedExpenses || transactionDetails.categorizedExpenses.length > 0)) {
        noTransactions = <h5 style={{color: red300}}>No transaction data for selected time period. </h5>; 
    }
    else if(!(transactionDetails && transactionDetails.categorizedExpenses)) {
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

financialOverview.propTypes = {
    transactionDetails: PropTypes.object,
    loading: PropTypes.bool, 
    income: PropTypes.number, 
    expense: PropTypes.number, 
    pieData: PropTypes.array, 
    pieLabels: PropTypes.array, 
    barData: PropTypes.array, 
    barLabels: PropTypes.array, 
}; 

export default financialOverview;