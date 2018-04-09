import React, { Component, Fragment } from 'react'; 

import { connect } from 'react-redux';

import { Pie, Bar } from 'react-chartjs-2'; 
import { Tabs, Tab } from 'material-ui/Tabs';
import MonthYearSelector from '../MonthYearSelector/MonthYearSelector'; 
import Container from '../../hoc/Grid/Container/Container'; 
import Paper from '../../hoc/Paper/Paper'; 

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
                    backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                    'rgba(255, 99, 132, 0.6)'
                    ]
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
                }
            }, 
            // maintainAspectRatio: false
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
            }
        }; 

        return (
            <Fragment>
                <Tabs>
                    <Tab label="Pie">
                        <Container style={{marginTop: '2rem'}} >
                            <Paper>
                                <Pie data={pieDataProps} options={pieOptionsProps} width={100} height={50} />
                                <MonthYearSelector />
                            </Paper>
                        </Container>
                    </Tab>
                    <Tab label="bar">
                        <Container style={{marginTop: '2rem'}} >
                            <Paper>
                                <Bar data={barDataProps} options={barOptionProps} />
                                <MonthYearSelector />
                            </Paper>
                        </Container>
                    </Tab>
                </Tabs>
                <Container>
                </Container>
            </Fragment>
        ); 
    }
}

const mapStateToProps = state => {
    return {
        transactionDetails: state.transactions.transactionDetails
    }
}; 

export default connect(mapStateToProps)(Chart);