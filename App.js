import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import OTPVerification from "./pages/OTPVerification";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
      <div style={{ maxWidth: "400px", margin: "auto", textAlign: "center" }}>
        <h2>Multi-Factor Authentication System</h2>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/verify-otp" element={<OTPVerification />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
