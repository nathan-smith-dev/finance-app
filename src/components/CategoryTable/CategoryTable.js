import React from 'react'; 
import PropTypes from 'prop-types'; 

import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
  } from 'material-ui/Table';
import { colors } from '../Charts/PieChart/PieChart'; 


const categoryTable = ({ incomes, expenses, transactionDetails }) => {
    if(transactionDetails && transactionDetails.categorizedExpenses) {
        const categories = Object.keys(transactionDetails.categorizedExpenses).map((key, index) => {
            return {
                category: key, 
                colorIndex: index, 
                total: (transactionDetails.categorizedExpenses[key]).toFixed(2), 
                percentage: Math.floor((transactionDetails.categorizedExpenses[key]/expenses)*100)
            }
        })
        categories.sort((a, b) => b.percentage - a.percentage); 
        var tableContents = categories.map(cat => {
            return (
                <TableRow key={cat.category}>
                    <TableRowColumn style={{borderLeft: '3px solid', borderColor: colors[cat.colorIndex], paddingLeft: 2}}>{cat.category}</TableRowColumn>
                    <TableRowColumn style={{paddingLeft: 0, width: '30%', textAlign: 'right'}}>{cat.total}</TableRowColumn>
                    <TableRowColumn style={{paddingLeft: 24, paddingRight: 0, width: '21%', textAlign: 'right'}}>{cat.percentage}%</TableRowColumn>       
                </TableRow>
            ); 
        })
    }

    return (
        <Table>
            <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                <TableRow>
                    <TableHeaderColumn style={{paddingLeft: 0}}>Category</TableHeaderColumn>
                    <TableHeaderColumn style={{paddingLeft: 0, width: '30%', textAlign: 'right'}}>Total</TableHeaderColumn>
                    <TableHeaderColumn style={{paddingLeft: 24, paddingRight: 0, width: '20%'}}>%</TableHeaderColumn>
                </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
                {tableContents}
            </TableBody>
        </Table>
    ); 
}; 

categoryTable.propTypes = {
    incomes: PropTypes.number, 
    expenses: PropTypes.number, 
    transactionDetails: PropTypes.object
}; 

export default categoryTable; 