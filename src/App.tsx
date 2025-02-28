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

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles theme={theme} />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Applications />} />
            <Route path="/applications" element={<Applications />} />
            <Route path="/applications/:id/endpoints" element={<ApplicationEndpoints />} />
            <Route path="/applications/:id/messages" element={<ApplicationMessages />} />
            <Route path="/endpoints" element={<Endpoints />} />
            <Route path="/messages" element={<Messages />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
};

export default App;
