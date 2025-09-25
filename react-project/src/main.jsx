// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import QuickLogout from "./components/quickLogout.jsx";
import "./index.css";

import App from "./pages/App.jsx";       // Login page
import Home from "./pages/Home.jsx";     // Protected Home page
import Details from "./pages/details.jsx"; // New Details page
import PrivateRoute from "./AuthRoutes/PrivateRoute.jsx"; // Auth guard

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <QuickLogout/>
      <Routes>
        {/* Public route */}
        <Route path="/" element={<App />} />

        {/* Protected Home route */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        {/* Protected Details route */}
        <Route
          path="/details/:id"
          element={
            <PrivateRoute>
              <Details />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
