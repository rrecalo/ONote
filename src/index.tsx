import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';
import { Provider } from 'react-redux'
import store from './store'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <Auth0Provider
    domain="notes158694.us.auth0.com"
    clientId="JTgCuc1CydAfp31fjwR0Lr9WEX6WWdGV"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}>
    <Provider store={store}>
      <App />
    </Provider>
  </Auth0Provider>
);

