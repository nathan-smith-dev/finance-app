import React from 'react'; 
import PropTypes from 'prop-types'; 

import { Pie } from 'react-chartjs-2'; 
import { red300, pink300, 
    purple300, deepPurple300, indigo300, 
    blue300, lightBlue300, cyan300, 
    teal300, green300, lightGreen300, 
    lime300, yellow300,
    amber300, orange300, deepOrange300 } from 'material-ui/styles/colors'; 


export const colors = [
    red300, purple300, yellow300, teal300, lime300, orange300, pink300, 
    indigo300, cyan300, blue300, lightGreen300, deepOrange300, 
    deepPurple300, lightBlue300, green300, amber300
]; 

for(let i = 0; i < 20; i++) {
    colors.push('#'+(Math.random()*0xFFFFFF<<0).toString(16)); // add 20 random colors just to be sure nothing is uncolored in annual expense
}

const pieChart = ({ data, title, labels }) => {
    const pieDataProps = {
        labels: labels,
        datasets:[
            {
                data: data,
                backgroundColor: colors
            }
        ]
    }; 
    
    const pieOptionsProps = {
        title: {
            display: true, 
            text: title
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

    return(
        <Pie data={pieDataProps} options={pieOptionsProps} />
    ); 
};

pieChart.propTypes = {
    data: PropTypes.array, 
    title: PropTypes.string, 
    labels: PropTypes.array
}; 



export default pieChart; 