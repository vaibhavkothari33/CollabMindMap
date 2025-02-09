import { Auth0Provider } from "@auth0/auth0-react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { withAuthenticationRequired } from "@auth0/auth0-react";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import MindMap from "./Components/MindMap";
import NotFound from "./pages/NotFound";

// Protected route component
// const ProtectedMindMap = withAuthenticationRequired(MindMap, {
//   onRedirecting: () => (
//     <div className="flex items-center justify-center h-screen">
//       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
//     </div>
//   ),
// });

export default function App() {
  return (
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      redirectUri={window.location.origin}
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
    >
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/mindmap/:roomId" element={<MindMap />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </Auth0Provider>
  );
}