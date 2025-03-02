import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import './index.css';
import App from './App.jsx';

const clientId = import.meta.env.VITE_clientId;
const domainId = import.meta.env.VITE_domain;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Auth0Provider
      domain={domainId}
      clientId={clientId}
      useRefreshTokens={true}
      cacheLocation="localstorage"
      authorizationParams={{
        redirect_uri: window.location.origin, // Prevent unnecessary reloads
      }}
    >
      <App />
    </Auth0Provider>
  </StrictMode>
);
