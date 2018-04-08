import React, { Component } from 'react'; 

import { connect } from 'react-redux'; 
import * as transactionActions from '../../store/actions/transactions'; 
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';


const today = new Date(); 

class MonthYearSelector extends Component {
    state = {
        year: 0, 
        month: today.getMonth()
    }

    handleChange = (value, key) => {
        this.setState({
            [key]: value
        }, 
        () => this.mapSelectValsToDb()
        );
    }

    mapSelectValsToDb = () => {
        const year = this.state.year === 0 ? today.getFullYear() : today.getFullYear() - 1; 
        const month = this.state.month; 

        this.props.changeTransactionDate(month, year); 
    }

    render() {
        return (
            <div>
                <SelectField
                    floatingLabelText="Month"
                    value={this.state.month}
                    onChange={(event, key) => this.handleChange(key, 'month')}
                    >
                    <MenuItem value={0} primaryText="January" />
                    <MenuItem value={1} primaryText="February" />
                    <MenuItem value={2} primaryText="March" />
                    <MenuItem value={3} primaryText="April" />
                    <MenuItem value={4} primaryText="May" />
                    <MenuItem value={5} primaryText="June" />
                    <MenuItem value={6} primaryText="July" />
                    <MenuItem value={7} primaryText="August" />
                    <MenuItem value={8} primaryText="September" />
                    <MenuItem value={9} primaryText="October" />
                    <MenuItem value={10} primaryText="November" />
                    <MenuItem value={11} primaryText="December" />
                </SelectField>
                <SelectField
                    floatingLabelText="Year"
                    value={this.state.year}
                    onChange={(event, key) => this.handleChange(key, 'year')}
                    >
                    <MenuItem value={0} primaryText={today.getFullYear()} />
                    <MenuItem value={1} primaryText={today.getFullYear() - 1} />
                </SelectField>
            </div>
        ); 
    }
}

const mapStateToProps = state => {
    return {
        trackedDates: state.transactions.trackedDates
    };
}; 

const mapDispatchToProps = dispatch => {
    return {
        changeTransactionDate: (month, year) => dispatch(transactionActions.changeTransactionDate(month, year))
    }; 
}; 

export default connect(mapStateToProps, mapDispatchToProps)(MonthYearSelector); 