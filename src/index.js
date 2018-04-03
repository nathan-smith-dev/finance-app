import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import { createStore, applyMiddleware, compose } from 'redux'; 
import { Provider } from 'react-redux'; 
import thunk from 'redux-thunk'; 
import authReducer from './store/reducers/auth'; 

const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?   
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    }) : compose;

const enhancer = composeEnhancers(
  applyMiddleware(thunk)
  // other store enhancers if any
);
const store = createStore(authReducer, enhancer);

const app = (
    <Provider store={store}>
        <App />
    </Provider>
); 

ReactDOM.render(app, document.getElementById('root'));
registerServiceWorker();
