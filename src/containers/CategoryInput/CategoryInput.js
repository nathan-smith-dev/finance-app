import React, { Component } from 'react'; 
import PropTypes from 'prop-types'; 

import { withAuth } from '../../firebase/auth'; 
import { connect } from 'react-redux'; 
import axios from 'axios'; 

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
        const { onChange } = this.props; 

        if(this.props.categories.length >= index) {
            console.log(this.props.categories[index])
            this.setState({
                category: this.props.categories[index].id
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
        const postObj = {}; 
        postObj[category.toLowerCase()] = category;
        console.log(notificationHandler) 
        notificationHandler("Added category."); 
        withAuth((authToken) => {
            axios.post(`${userId}/transactions/categories.json?auth=${authToken}`, postObj)
                .then(response => {
                    // console.log(response);
                    onCategoryAdded(userId); 
                    this.toggleNewCategory(); 
                    this.setState({
                        newCategory: "",
                        category: category
                    }, () => onChange(this.state.category))
                }) 
                .catch(err => {
                    console.log(err); 
                    notificationHandler("Failed to add category."); 
                })
        })
    }
    

    render() {
        const {
            userCategories,
            allCategories,
        } = this.props; 

        const categories = userCategories.map(cat => { return {...cat}}); 

        if(!userCategories.find(cat => cat.id === this.state.category)) { // Make sure the category shows even if its not a user category
            categories.push(allCategories.find(cat => cat.id === this.state.category)); 
        }

        return (
            <div style={{display: 'flex', alignItems: 'center'}} >
                <SelectField
                    value={this.state.category}
                    floatingLabelText="Category"
                    onChange={this.handleCategoryChange} >
                    {categories.map((cat, index) => {
                        return (
                            <MenuItem key={cat.id} value={cat.id} primaryText={cat.category} />
                        ); 
                    })}
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