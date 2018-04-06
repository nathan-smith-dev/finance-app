import React, { Component } from 'react'; 

import { connect } from 'react-redux';

import { Pie, Bar } from 'react-chartjs-2'; 
import { Tabs, Tab } from 'material-ui/Tabs';

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
        return (
            <Tabs>
                <Tab label="Pie">
                    <Pie data={{
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
                    }} 
                    options={{
                        title: {
                            display: true, 
                            text: 'Expense Breakdown'
                        }
                    }}
                />
                </Tab>
                <Tab label="bar">
                    <Bar data={{
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
                    }} 
                    options={{
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
                    }} />
                </Tab>
            </Tabs>
        ); 
    }
}

const mapStateToProps = state => {
    return {
        transactionDetails: state.transactions.transactionDetails
    }
}; 

export default connect(mapStateToProps)(Chart);

// {
//     "data": {
//       "labels": {},
//       "datasets": {}
//     },
//     "type": "bar",
//     "legend": {
//       "display": true,
//       "position": "bottom"
//     },
//     "height": 150,
//     "width": 300,
//     "redraw": false,
//     "options": {
//       "legend": {}
//     },
//     "datasetKeyProvider": "[function ]"
//   }