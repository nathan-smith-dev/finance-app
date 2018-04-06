import React, { Component } from 'react'; 

import { connect } from 'react-redux';

import { Pie } from 'react-chartjs-2'; 

class Chart extends Component {
    render() {
        let labels = []; 
        let data = []; 
        if(this.props.transactionDetails.categorizedExpenses) {
            labels = Object.keys(this.props.transactionDetails.categorizedExpenses); 
            data = Object.values(this.props.transactionDetails.categorizedExpenses)
        }
        return (
            <Pie data={{
                labels: labels,
                datasets:[
                    {
                        label: 'Expenses',
                        data: data,
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
            }} />
        ); 
    }
}

const mapStateToProps = state => {
    return {
        transactionDetails: state.transactions.transactionDetails
    }
}; 

export default connect(mapStateToProps)(Chart);