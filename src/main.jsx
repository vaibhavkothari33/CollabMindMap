import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react';
import './index.css'
import App from './App.jsx'

const clientId = import.meta.env.VITE_clientId;
const Domain = import.meta.env.VITE_domain;
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Auth0Provider
      domain={Domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
      >
      <App />
    </Auth0Provider>,
  </StrictMode>,
)
