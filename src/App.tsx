import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { GlobalStyles } from "./styles/GlobalStyles";
import { theme } from "./styles/theme";
import Layout from "./components/Layout/Layout";
import Applications from "./pages/Applications";
import ApplicationEndpoints from "./pages/ApplicationEndpoints";
import ApplicationMessages from "./pages/ApplicationMessages";
import Endpoints from "./pages/Endpoints";
import Messages from "./pages/Messages";
import MessagesByEndpoint from "./pages/MessagesByEndpoint";
import AttemptsByEndpoint from "./pages/AttemptsByEndpoint";
import AttemptsByMessage from "./pages/AttemptsByMessage";
import EventTypes from "./pages/EventTypes";
import EndpointDetailView from "./pages/EndpointDetailView";

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles theme={theme} />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Applications />} />
            <Route path="/applications" element={<Applications />} />
            <Route
              path="/applications/:applicationId/endpoints"
              element={<ApplicationEndpoints />}
            />
            <Route
              path="/applications/:applicationId/endpoints/:endpointId"
              element={<EndpointDetailView />}
            />
            <Route
              path="/applications/:applicationId/endpoints/:endpointId/attempts"
              element={<AttemptsByEndpoint />}
            />
            <Route
              path="/applications/:applicationId/endpoints/:endpointId/messages"
              element={<MessagesByEndpoint />}
            />
            <Route path="/applications/:applicationId/messages" element={<ApplicationMessages />} />
            <Route
              path="/applications/:applicationId/messages/:messageId/attempts"
              element={<AttemptsByMessage />}
            />
            <Route path="/endpoints" element={<Endpoints />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/event-types" element={<EventTypes />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
};

export default App;
