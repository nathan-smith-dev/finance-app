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


const categoryTable = ({ incomes, expenses, categorizedExpenses }) => {
    if(categorizedExpenses.length > 0) {
        const categories = categorizedExpenses.map((cat, index) => {
            return {
                category: cat.category, 
                colorIndex: index, 
                total: (cat.total).toFixed(2), 
                percentage: Math.floor((cat.total/expenses)*100)
            }
        })
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
    categorizedExpenses: PropTypes.array
}; 

export default categoryTable; 