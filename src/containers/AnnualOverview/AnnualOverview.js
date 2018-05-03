import React, { Component } from 'react'; 

import { connect } from 'react-redux'; 
import { toFixedNumber } from '../../utlities/utilities'; 

import FinancialOverview from '../../components/FinancialOverview/FinancialOverview'; 


class Annual extends Component { 
    static propTypes = {

    }

    render() {
        const { 
            annualDetails, 
            loading
        } = this.props; 

        let pieLabels = [], pieData = [], barData = [], barLabels = ['Income', 'Expense']; 

        if(annualDetails && annualDetails.categorizedExpenses) {
            pieLabels = Object.keys(annualDetails.categorizedExpenses); 
            pieData = Object.values(annualDetails.categorizedExpenses).map(val => toFixedNumber(val, 2)); 
            barData = [toFixedNumber(annualDetails.incomes, 2), toFixedNumber(annualDetails.expenses, 2)]; 
        }
    
        return(
            <FinancialOverview 
                title="Annual"
                loading={loading}
                transactionDetails={annualDetails}
                pieData={pieData}
                pieLabels={pieLabels}
                barData={barData}
                barLabels={barLabels}
                selector={false} />
        ); 
    }
}

const mapStateToProps = state => {
    return {
        annualDetails: state.transactions.annualDetails, 
    }; 
}; 

export default connect(mapStateToProps)(Annual); 