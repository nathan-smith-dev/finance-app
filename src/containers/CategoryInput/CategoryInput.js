import React, { Component } from 'react'; 
import PropTypes from 'prop-types'; 

import { withAuth } from '../../firebase/auth'; 
import axios from 'axios'; 

import SelectField from 'material-ui/SelectField'; 
import NewCategoryDialog from '../../components/NewCategoryDialog/NewCategoryDialog'; 
import MenuItem from 'material-ui/MenuItem'; 

class CategoryInput extends Component {
    static propTypes = {
        categories: PropTypes.array.isRequired, 
        notificationHandler: PropTypes.func, 
        userId: PropTypes.string, 
        onChange: PropTypes.func,
        onCategoryAdded: PropTypes.func
    }

    state = { 
        category: "", 
        showNewCategory: false, 
        newCategory: ""
    }

    handleCategoryChange = (event, index) => {
        const { onChange } = this.props; 

        if(this.props.categories.length >= index) {
            this.setState({
                category: this.props.categories[index]
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
            categories,
        } = this.props; 
        
        return (
            <div style={{display: 'flex', alignItems: 'center'}} >
                <SelectField
                    floatingLabelText="Category"
                    value={this.state.category}
                    onChange={this.handleCategoryChange} >
                    {categories.map((cat, index) => {
                        return (
                            <MenuItem key={index} value={cat} primaryText={cat} />
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

export default CategoryInput; 