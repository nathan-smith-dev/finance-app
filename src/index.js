import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import { createStore } from 'redux'; 
import { Provider } from 'react-redux'; 
import authReducer from './store/reducers/auth'; 

const store = createStore(authReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()); 

const app = (
    <Provider store={store}>
        <App />
    </Provider>
); 

ReactDOM.render(app, document.getElementById('root'));
registerServiceWorker();
