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
    red300, purple300, blue300, teal300, lime300, amber300, deepOrange300, 
    deepPurple300, lightBlue300, green300, yellow300, orange300, 
    indigo300, cyan300, lightGreen300, pink300
]

class Chart extends Component {
    render() {
        let pieLabels = []; 
        let pieData = []; 
        let barLabels = ['Income', 'Expense']; 
        let barData = []; 
        if(this.props.transactionDetails.categorizedExpenses) {
            pieLabels = Object.keys(this.props.transactionDetails.categorizedExpenses); 
            pieData = Object.values(this.props.transactionDetails.categorizedExpenses); 
            barData = [this.props.transactionDetails.incomes, this.props.transactionDetails.expenses]; 
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
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255,99,132,1)',
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

        if(this.props.transactionDetails.incomes) {
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
        transactionDetails: state.transactions.transactionDetails
    }
}; 

export default connect(mapStateToProps)(Chart);