import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import Expenses from "./pages/expenses";
import History from "./pages/history";
import Profile from "./pages/profile";
import Settings from "./pages/settings";
import LandingPage from "./pages/landingpage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/history" element={<History/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/settings" element={<Settings/>}/>
        <Route path="/login" element={<Login/>}/>
      </Routes>
    </Router>
  );
}

export default App;