import React from 'react'; 
import PropTypes from 'prop-types'; 

import { Bar } from 'react-chartjs-2'; 
import { red300, green300 } from 'material-ui/styles/colors'; 


const barChart = ({ data, title, labels }) => {
    const barDataProps = {
        labels: labels,
        datasets: [{
            data: [...data, 0], // needs an added 0 because of chartjs bug
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
            text: title
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
        <Bar data={barDataProps} options={barOptionProps} />        
    ); 
}; 

barChart.propTypes = {
    title: PropTypes.string, 
    date: PropTypes.array, 
    labels: PropTypes.array
}; 

export default barChart; 