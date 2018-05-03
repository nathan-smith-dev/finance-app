import React, { Component } from 'react'; 
import PropTypes from 'prop-types'; 

import { connect } from 'react-redux';
import { toFixedNumber } from '../../utlities/utilities'; 

import FinancialOverview from '../../components/FinancialOverview/FinancialOverview'; 

class Chart extends Component {
    static propTypes = {
        transactionDetails: PropTypes.object,
        loading: PropTypes.bool
    }

    static defaultProps = {
        loading: true
    }

    render() {
        const { 
            transactionDetails, 
            loading
        } = this.props; 

        let pieLabels = [], pieData = [], barData = [], barLabels = ['Income', 'Expense']; 

        if(transactionDetails && transactionDetails.categorizedExpenses) {
            pieLabels = Object.keys(transactionDetails.categorizedExpenses); 
            pieData = Object.values(transactionDetails.categorizedExpenses).map(val => toFixedNumber(val, 2)); 
            barData = [toFixedNumber(transactionDetails.incomes, 2), toFixedNumber(transactionDetails.expenses, 2)]; 
        }
    
        return(
            <FinancialOverview 
                loading={loading}
                transactionDetails={transactionDetails}
                pieData={pieData}
                pieLabels={pieLabels}
                barData={barData}
                barLabels={barLabels} />
        ); 
    }
}

const mapStateToProps = state => {
    return {
        transactionDetails: state.transactions.transactionDetails, 
        loading: state.transactions.loadingTransactions
    }
}; 

export default connect(mapStateToProps)(Chart);