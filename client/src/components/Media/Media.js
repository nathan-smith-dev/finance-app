import React from 'react'; 
import PropTypes from 'prop-types'; 
import classes from './Media.css'; 


const media = ({ image, text, altText }) => {
    return (
        <div className={classes.Media}>
            <img className={classes.Image} src={image} alt={altText} />
            {text}
        </div>
    ); 
};

media.propTypes = {
    image: PropTypes.string, 
    text: PropTypes.string, 
    altText: PropTypes.string
}; 

export default media; 