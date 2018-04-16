import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import { createStore, applyMiddleware, compose, combineReducers } from 'redux'; 
import { Provider } from 'react-redux'; 
import thunk from 'redux-thunk'; 
import authReducer from './store/reducers/auth'; 
import transactionsReducer from './store/reducers/transactions'; 
import notificationsReducer from './store/reducers/notifcations'; 
import roomatesReducer from './store/reducers/roommates'; 

import axios from 'axios'; 

axios.defaults.baseURL = 'https://react-finance-f20df.firebaseio.com/users/'; 

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

const rootReducers = combineReducers({
  auth: authReducer, 
  transactions: transactionsReducer, 
  notifications: notificationsReducer,
  roommates: roomatesReducer,
}); 

export const store = createStore(rootReducers, enhancer);

const app = (
    <Provider store={store}>
        <App />
    </Provider>
); 

ReactDOM.render(app, document.getElementById('root'));
registerServiceWorker();
