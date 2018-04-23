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
import { red300, green300 } from 'material-ui/styles/colors'; 

const incomeExpenseTable = ({ incomes, expenses, incomeTitle, expenseTitle }) => {
    const netTotal = incomes - expenses; 
    if(!netTotal)
        return null; 

    return (
        <div>
            <h3 style={{marginBottom: 2, marginTop: 20}}>Overview</h3>                                            
            <Table>
                <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                    <TableRow>
                        <TableHeaderColumn style={{paddingLeft: 0}}>{incomeTitle}</TableHeaderColumn>
                        <TableHeaderColumn style={{paddingLeft: 0}}>{expenseTitle}</TableHeaderColumn>
                        <TableHeaderColumn style={{paddingLeft: 0}}>Net</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false}>
                    <TableRow>
                        <TableRowColumn style={{color: green300, paddingLeft: 0}}>{incomes.toFixed(2)}</TableRowColumn>
                        <TableRowColumn style={{color: red300, paddingLeft: 0}}>{expenses.toFixed(2)}</TableRowColumn>
                        <TableRowColumn 
                            style={+netTotal >= 0 ? {color: green300, paddingLeft: 0} : {color: red300,paddingLeft: 0}}>
                            {netTotal.toFixed(2)}
                        </TableRowColumn>
                </TableRow>
                </TableBody>
            </Table>
        </div>
    ); 
}; 

incomeExpenseTable.propTypes = {
    incomes: PropTypes.number, 
    expenses: PropTypes.number, 
    incomeTitle: PropTypes.string.isRequired, 
    expenseTitle: PropTypes.string.isRequired
}; 

export default incomeExpenseTable; 