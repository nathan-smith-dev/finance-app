import React from 'react'; 

import { Pie, Bar } from 'react-chartjs-2'; 
import { Tabs, Tab } from 'material-ui/Tabs';
import Container from '../../hoc/Grid/Container/Container'; 
import Paper from '../../hoc/Paper/Paper'; 
import Row from '../../hoc/Grid/Row/Row';
import Column from '../../hoc/Grid/Column/Column'; 
import { red300, pink300, 
    purple300, deepPurple300, indigo300, 
    blue300, lightBlue300, cyan300, 
    teal300, green300, lightGreen300, 
    lime300, yellow300,
    amber300, orange300, deepOrange300, } from 'material-ui/styles/colors'; 

const colors = [
    red300, purple300, blue300, teal300, lime300, amber300, deepOrange300, 
    deepPurple300, lightBlue300, green300, yellow300, orange300, 
    indigo300, cyan300, lightGreen300, pink300
]

export const exampleCharts = (props) => {
    let pieLabels = ['Takeout', 'Rent', 'Movies', 'Grocery', 'Gas']; 
    let pieData = [20.79, 499.99, 15.21, 182.96, 41.78]; 
    let barLabels = ['Income', 'Expense']; 
    let barData = [1500, 20.79+499.99+15.21+182.96+41.78]; 

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
            text: 'Sample Expense Breakdown'
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
            text: 'Sample Income VS Spending'
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

    return (
        <div >
            <Tabs 
                tabItemContainerStyle={{backgroundColor: 'none'}}
                >
                <Tab label="Pie" style={{color: 'black'}}>
                    <Container>
                        <Row>   
                            <Column style={{margin: '0 auto'}} width="xs-50">
                                <Paper>
                                    <div style={{height: 300, width: '100%'}}>                                        
                                        <Pie data={pieDataProps} options={pieOptionsProps} />
                                    </div>
                                </Paper>
                            </Column>
                        </Row>
                    </Container>
                </Tab>
                <Tab label="bar" style={{color: 'black'}}>
                    <Container>
                        <Row>   
                            <Column style={{margin: '0 auto'}} width="xs-50">
                                <Paper>
                                    <div style={{height: 300, width: '100%'}}>
                                        <Bar data={barDataProps} options={barOptionProps} />
                                    </div>
                                </Paper>
                            </Column>
                        </Row>
                    </Container>
                </Tab>
            </Tabs>
        </div>
    ); 
}

export default exampleCharts;