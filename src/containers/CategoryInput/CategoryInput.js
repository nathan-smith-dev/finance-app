import React, { Component } from 'react'; 
import PropTypes from 'prop-types'; 

import { connect } from 'react-redux'; 
import * as apiCalls from '../../api-calls'; 

import SelectField from 'material-ui/SelectField'; 
import NewCategoryDialog from '../../components/NewCategoryDialog/NewCategoryDialog'; 
import MenuItem from 'material-ui/MenuItem'; 

class CategoryInput extends Component {
    static propTypes = {
        notificationHandler: PropTypes.func, 
        userId: PropTypes.string, 
        onChange: PropTypes.func,
        onCategoryAdded: PropTypes.func
    }

    static defaultProps = {
        allCategories: [], 
        userCategories: [],
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            ...prevState, 
            category: nextProps.categoryId ? nextProps.categoryId : ""
        }
    }

    state = { 
        category: "", 
        showNewCategory: false, 
        newCategory: ""
    }

    handleCategoryChange = (event, index) => {
        const { onChange, userCategories } = this.props; 

        if(userCategories && userCategories.length >= index) {
            this.setState({
                category: this.props.userCategories[index].id
            }, () => onChange(this.state.category)); 
        }
    }

    handleNewCategoryChange = (event) => {
        this.setState({
            newCategory: event.target.value
        }); 
    }

    toggleNewCategory = () => {
        this.setState(prevState => {
            return {
                showNewCategory: !prevState.showNewCategory
            }
        }); 
    }

    sendNewCategory = () => {
        const {
            notificationHandler, 
            userId, 
            onChange,
            onCategoryAdded,
        } = this.props; 
        
        const category = this.state.newCategory;
        apiCalls.createUserCategory({ category: category }, data => {
            console.log(data); 
            notificationHandler("Added category."); 
            onCategoryAdded(userId); 
            this.toggleNewCategory(); 
            this.setState({
                newCategory: "",
                category: category
            }, () => onChange(this.state.category))
        }); 
    }
    

    render() {
        const {
            userCategories,
            allCategories,
        } = this.props; 

        const categories = userCategories.map(cat => { 
            return (
                <MenuItem key={cat.id} value={cat.id} primaryText={cat.category} />
            );
        }); 

        if(this.state.category && !userCategories.find(cat => cat.id === this.state.category)) { // Make sure the category shows even if its not a user category
            const missingCat = allCategories.find(cat => cat.id === this.state.category); 
            categories.push(<MenuItem key={missingCat.id} value={missingCat.id} primaryText={missingCat.category} />); 
        }
        

        return (
            <div style={{display: 'flex', alignItems: 'center'}} >
                <SelectField
                    value={this.state.category}
                    floatingLabelText="Category"
                    onChange={this.handleCategoryChange} >
                    {categories}
                </SelectField>
                <NewCategoryDialog 
                    show={this.state.showNewCategory}
                    toggler={this.toggleNewCategory}
                    onChange={this.handleNewCategoryChange}
                    value={this.state.newCategory}
                    onSubmit={this.sendNewCategory} />
            </div>
        ); 
    }
}; 

const mapStateToProps = state => {
    return {
        userCategories: state.transactions.userCategories, 
        allCategories: state.transactions.allCategories
    }; 
}; 

export default connect(mapStateToProps)(CategoryInput); 