import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './pages/App';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import { Provider } from 'react-redux'
import store from './store'
import Login from './pages/Login';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter([
  {
    path: "/app",
    element: <App />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <Login />,
  }
]);

root.render(
  <Auth0Provider
    domain="notes158694.us.auth0.com"
    clientId="JTgCuc1CydAfp31fjwR0Lr9WEX6WWdGV"
    authorizationParams={{
      redirect_uri: "http://localhost:3000/app"
    }}>
      <RouterProvider router={router} />
  </Auth0Provider>
);

