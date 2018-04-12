import React, { Component } from 'react'; 

import { connect } from 'react-redux'; 
import * as transactionActions from '../../store/actions/transactions'; 
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Row from '../../hoc/Grid/Row/Row';
import Column from '../../hoc/Grid/Column/Column';


const today = new Date(); 
const YEARS = [
    today.getFullYear(), 
    today.getFullYear() - 1
]; 

class MonthYearSelector extends Component {
    handleChange = (value, key) => {
        if(key === "year") {
            this.props.changeTransactionDate(this.props.user.uid, this.props.trackedDates.month, YEARS[value]); 
        }
        
        if(key === "month") {
            this.props.changeTransactionDate(this.props.user.uid, value, this.props.trackedDates.year); 
        }
    }

    render() {
        const yearVal = this.props.trackedDates ? (today.getFullYear() - this.props.trackedDates.year) : 0; 
        const monthVal = this.props.trackedDates ? this.props.trackedDates.month : today.getMonth(); 
        return (
            <Row>
                <Column width="xs-50">
                    <SelectField
                        style={{width: '100%'}}
                        floatingLabelText="Month"
                        value={monthVal}
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
                </Column>
                <Column width="xs-50">
                    <SelectField
                        style={{width: '100%'}}
                        floatingLabelText="Year"
                        value={yearVal}
                        onChange={(event, key) => this.handleChange(key, 'year')}
                        >
                        <MenuItem value={0} primaryText={today.getFullYear()} />
                        <MenuItem value={1} primaryText={today.getFullYear() - 1} />
                    </SelectField>
                </Column>
            </Row>
        ); 
    }
}

const mapStateToProps = state => {
    return {
        trackedDates: state.transactions.trackedDates, 
        user: state.auth.userProfile
    };
}; 

const mapDispatchToProps = dispatch => {
    return {
        changeTransactionDate: (uid, month, year) => dispatch(transactionActions.changeTransactionDate(uid, month, year))
    }; 
}; 

export default connect(mapStateToProps, mapDispatchToProps)(MonthYearSelector); 