import React, { Component } from 'react'; 

import { connect } from 'react-redux';

import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
  } from 'material-ui/Table';
import { Pie, Bar } from 'react-chartjs-2'; 
import { Tabs, Tab } from 'material-ui/Tabs';
import MonthYearSelector from '../MonthYearSelector/MonthYearSelector'; 
import Container from '../../hoc/Grid/Container/Container'; 
import Paper from '../../hoc/Paper/Paper'; 
import CircularProgress from 'material-ui/CircularProgress';
import Row from '../../hoc/Grid/Row/Row';
import Column from '../../hoc/Grid/Column/Column'; 
import { red300, pink300, 
    purple300, deepPurple300, indigo300, 
    blue300, lightBlue300, cyan300, 
    teal300, green300, lightGreen300, 
    lime300, yellow300,
    amber300, orange300, deepOrange300, 
    green500, red500 } from 'material-ui/styles/colors'; 

const colors = [
    red300, purple300, yellow300, teal300, lime300, orange300, pink300, 
    indigo300, cyan300, blue300, lightGreen300, deepOrange300, 
    deepPurple300, lightBlue300, green300, amber300
]

class Chart extends Component {
    addAndFilterTableRows = (totalExpenses) => {
        if(this.props.transactionDetails.categorizedExpenses) {
            const categories = Object.keys(this.props.transactionDetails.categorizedExpenses).map((key, index) => {
                return {
                    category: key, 
                    colorIndex: index, 
                    total: (this.props.transactionDetails.categorizedExpenses[key]).toFixed(2), 
                    percentage: Math.floor((this.props.transactionDetails.categorizedExpenses[key]/totalExpenses)*100)
                }
            })
            categories.sort((a, b) => b.percentage - a.percentage); 
            const jsx = categories.map(cat => {
                return (
                    <TableRow key={cat.category}>
                        <TableRowColumn style={{borderLeft: '3px solid', borderColor: colors[cat.colorIndex], paddingLeft: 2}}>{cat.category}</TableRowColumn>
                        <TableRowColumn style={{paddingLeft: 0, width: '30%', textAlign: 'right'}}>{cat.total}</TableRowColumn>
                        <TableRowColumn style={{paddingLeft: 24, paddingRight: 0, width: '21%', textAlign: 'right'}}>{cat.percentage}%</TableRowColumn>       
                    </TableRow>
                ); 
            })
            return jsx; 
        }
        return null; 
    }

    render() {
        let pieLabels = []; 
        let pieData = []; 
        let barLabels = ['Income', 'Expense']; 
        let barData = []; 
        if(this.props.transactionDetails.categorizedExpenses) {
            pieLabels = Object.keys(this.props.transactionDetails.categorizedExpenses); 
            pieData = Object.values(this.props.transactionDetails.categorizedExpenses).map(val => Math.round(val * 100)/100); 
            barData = [Math.round(this.props.transactionDetails.incomes*100)/100, Math.round(this.props.transactionDetails.expenses*100)/100]; 
        }

        const pieDataProps = {
            labels: pieLabels,
            datasets:[
                {
                    label: 'Expenses',
                    data: pieData,
                    backgroundColor: colors
                }
            ]
        }; 

        const pieOptionsProps = {
            title: {
                display: true, 
                text: 'Expense Breakdown'
            }, 
            legend: {
                display: true,
                position: 'bottom', 
                labels: {
                    boxWidth: 10
                }, 

            }, 
            maintainAspectRatio: false
        }; 

        const barDataProps = {
            labels: barLabels,
            datasets: [{
                data: [...barData, 0], // needs an added 0 because of chartjs bug
                backgroundColor: [
                    green300,
                    red300,
                ],
                borderWidth: 1
            }], 
            }; 
        
        const barOptionProps = {
            title: {
                display: true, 
                text: 'Income VS Spending'
            }, 
            legend: {
                display: false
            },
            tooltips: {
                callbacks: {
                label: function(tooltipItem) {
                        return tooltipItem.yLabel;
                }
                }
            }, 
            maintainAspectRatio: false
        }; 

        let totalIncome = null, totalExpenses = null, netTotal = null; 

        if(this.props.transactionDetails.incomes || this.props.transactionDetails.expenses) {
            totalIncome = (this.props.transactionDetails.incomes).toFixed(2); 
            totalExpenses = (this.props.transactionDetails.expenses).toFixed(2); 
            netTotal = (this.props.transactionDetails.incomes - this.props.transactionDetails.expenses).toFixed(2); 
        }

        return (
            <div >
                <Tabs>
                    <Tab label="Pie">
                        <Container>
                            <Row>   
                                <Column style={{margin: '0 auto'}} width="xl-50 md-75">
                                    <Paper>
                                        <div style={{height: 300, width: '100%'}}>                                        
                                            <Pie data={pieDataProps} options={pieOptionsProps} />
                                        </div>
                                        {
                                            !this.props.transactionDetails.categorizedExpenses && !this.props.loadingTransactions && (
                                                <h5 style={{color: red300}}>No transaction data for selected time period. </h5>
                                            )
                                        }
                                        {                                
                                            this.props.loadingTransactions && (
                                                <div style={{display: 'flex', justifyContent: 'center'}}>
                                                    <CircularProgress />
                                                </div>
                                            )
                                        }
                                        <div style={{marginTop: 20}}>
                                            <h3 style={{marginBottom: 2, marginTop: 20}}>Overview</h3>                                            
                                            <Table>
                                                <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                                                    <TableRow>
                                                        <TableHeaderColumn style={{paddingLeft: 0}}>Category</TableHeaderColumn>
                                                        <TableHeaderColumn style={{paddingLeft: 0, width: '30%', textAlign: 'right'}}>Total</TableHeaderColumn>
                                                        <TableHeaderColumn style={{paddingLeft: 24, paddingRight: 0, width: '20%'}}>%</TableHeaderColumn>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody displayRowCheckbox={false}>
                                                    {this.addAndFilterTableRows(totalExpenses)}
                                                </TableBody>
                                            </Table>
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
                                            <Bar data={barDataProps} options={barOptionProps} />
                                        </div>
                                        {
                                            !this.props.transactionDetails.categorizedExpenses && !this.props.loadingTransactions && (
                                                <h5 style={{color: red300}}>No transaction data for selected time period. </h5>
                                            )
                                        }
                                        {                                
                                            this.props.loadingTransactions && (
                                                <div style={{display: 'flex', justifyContent: 'center'}}>
                                                    <CircularProgress />
                                                </div>
                                            )
                                        }
                                        <div style={{marginTop: 20}}>
                                            <h3 style={{marginBottom: 2, marginTop: 20}}>Overview</h3>                                            
                                            <Table>
                                                <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                                                    <TableRow>
                                                        <TableHeaderColumn style={{paddingLeft: 0}}>Incomes</TableHeaderColumn>
                                                        <TableHeaderColumn style={{paddingLeft: 0}}>Expenses</TableHeaderColumn>
                                                        <TableHeaderColumn style={{paddingLeft: 0}}>Net</TableHeaderColumn>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody displayRowCheckbox={false}>
                                                    <TableRow>
                                                        <TableRowColumn style={{color: green500, paddingLeft: 0}}>{totalIncome}</TableRowColumn>
                                                        <TableRowColumn style={{color: red500, paddingLeft: 0}}>{totalExpenses}</TableRowColumn>
                                                        <TableRowColumn style={+netTotal >= 0 ? {color: green500, paddingLeft: 0} : {color: red500,paddingLeft: 0}}>{netTotal}</TableRowColumn>
                                                </TableRow>
                                                </TableBody>
                                            </Table>
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
        loadingTransactions: state.transactions.loadingTransactions
    }
}; 

export default connect(mapStateToProps)(Chart);