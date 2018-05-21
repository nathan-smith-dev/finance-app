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
            categorizedExpenses, 
            net, 
            loading
        } = this.props; 

        let pieLabels = [], pieData = [], barData = [], barLabels = ['Income', 'Expense']; 

        if(categorizedExpenses.length > 0) {
            pieLabels = categorizedExpenses.map(obj => obj.category); 
            pieData = categorizedExpenses.map(obj => obj.total); 
            barData = [toFixedNumber(net.incomes, 2), toFixedNumber(net.expenses, 2)]; 
        }
    
        return(
            <FinancialOverview 
                title={"Monthly"}
                loading={loading}
                // transactionDetails={transactionDetails}
                pieData={pieData}
                pieLabels={pieLabels}
                barData={barData}
                barLabels={barLabels} />
        ); 
    }
}

const mapStateToProps = state => {
    return {
        categorizedExpenses: state.transactions.categorizedExpenses, 
        net: state.transactions.net, 
        loading: state.transactions.loadingTransactions
    }
}; 

export default connect(mapStateToProps)(Chart);