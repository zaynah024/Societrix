import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./LoginPage";
import { CreateNewPassword } from "./CreateNewPassword";


function Dashboard() {
  return <h2>Admin Dashboard (To be built)</h2>;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/change-password" element={<CreateNewPassword/>} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  
  );
}
