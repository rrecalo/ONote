import ReactDOM from 'react-dom/client';
import './index.css';
import App from './pages/App';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
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
  },
  {
    path: "/*",
    element: <App />,
  }
]);

root.render(
  <Auth0Provider
    domain="notes158694.us.auth0.com"
    clientId="JTgCuc1CydAfp31fjwR0Lr9WEX6WWdGV"
    authorizationParams={{
      redirect_uri: "https://onote.cloud/app"
    }}>
      <RouterProvider router={router} />
  </Auth0Provider>
);

