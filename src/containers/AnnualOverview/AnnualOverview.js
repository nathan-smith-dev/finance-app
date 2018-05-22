import React, { Component } from 'react'; 

import { connect } from 'react-redux'; 
import { toFixedNumber } from '../../utlities/utilities'; 

import FinancialOverview from '../../components/FinancialOverview/FinancialOverview'; 


class Annual extends Component { 
    static propTypes = {

    }

    render() {
        const { 
            annualData, 
            loading
        } = this.props; 

        let pieLabels = [], pieData = [], barData = [], barLabels = ['Income', 'Expense']; 
        const net = { incomes: annualData.netIncomes, expenses: annualData.netExpenses }; 

        if(annualData && annualData.categorizedExpenses) {
            pieLabels = annualData.categorizedExpenses.map(cat => cat.category); 
            pieData = annualData.categorizedExpenses.map(cat => cat.total);
            barData = [toFixedNumber(annualData.netIncomes, 2), toFixedNumber(annualData.netExpenses, 2)]; 
        }
    
        return(
            <FinancialOverview 
                categorizedExpenses={annualData.categorizedExpenses}
                net={net}
                title="Annual"
                loading={loading}
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
        annualData: state.transactions.annualData, 
    }; 
}; 

export default connect(mapStateToProps)(Annual); 