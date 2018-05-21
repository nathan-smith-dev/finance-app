import React, { Component } from 'react'; 
import PropTypes from 'prop-types'; 

import { connect } from 'react-redux'; 
import * as transactionActions from '../../store/actions/transactions'; 
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Row from '../../hoc/Grid/Row/Row';
import Column from '../../hoc/Grid/Column/Column';


class MonthYearSelector extends Component {
    static propTypes = {
        trackedDates: PropTypes.object.isRequired, 
        user: PropTypes.object.isRequired
    }

    changeMonth = (event, index, value) => {
        this.props.changeTransactionDate(this.props.user.uid, value, this.props.trackedDates.year); 
    }
   
    changeYear = (event, index, value) => {
        this.props.changeTransactionDate(this.props.user.uid, this.props.trackedDates.month, value); 
    }

    render() {
        const { trackedDates } = this.props; 
        const today = new Date(); 

        return (
            <Row>
                <Column width="xs-50">
                    <SelectField
                        style={{width: '100%'}}
                        floatingLabelText="Month"
                        value={trackedDates.month}
                        onChange={this.changeMonth}>
                        <MenuItem value={1} primaryText="January" />
                        <MenuItem value={2} primaryText="February" />
                        <MenuItem value={3} primaryText="March" />
                        <MenuItem value={4} primaryText="April" />
                        <MenuItem value={5} primaryText="May" />
                        <MenuItem value={6} primaryText="June" />
                        <MenuItem value={7} primaryText="July" />
                        <MenuItem value={8} primaryText="August" />
                        <MenuItem value={9} primaryText="September" />
                        <MenuItem value={10} primaryText="October" />
                        <MenuItem value={11} primaryText="November" />
                        <MenuItem value={12} primaryText="December" />
                    </SelectField>
                </Column>
                <Column width="xs-50">
                    <SelectField
                        style={{width: '100%'}}
                        floatingLabelText="Year"
                        value={trackedDates.year}
                        onChange={this.changeYear}
                        >
                        <MenuItem value={today.getFullYear()} primaryText={today.getFullYear()} />
                        <MenuItem value={today.getFullYear() - 1} primaryText={today.getFullYear() - 1} />
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