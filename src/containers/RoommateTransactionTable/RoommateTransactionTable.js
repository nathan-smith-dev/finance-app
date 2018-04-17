import React, { Component } from 'react'; 
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
  } from 'material-ui/Table';

class RoommateTransactionTable extends Component {
    render() {
        const transArray = []; 
        return(
            <Table onCellClick={(rownum) => transArray.length > 0 ? null : null}>
                <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                    <TableRow>
                        <TableHeaderColumn style={{width: '25%'}} >Date</TableHeaderColumn>
                        <TableHeaderColumn style={{width: '30%'}}>Amount</TableHeaderColumn>
                        <TableHeaderColumn>Category</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false}>
                    {null}
                </TableBody>
            </Table>
        );
    }
}

export default RoommateTransactionTable; 