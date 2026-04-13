import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import AuthSuccess from './pages/AuthSuccess';
import Telemetry from './pages/Telemetry';
import Inbox from './pages/Inbox';

function App() {
  const userId = localStorage.getItem('userId');

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={userId ? <Dashboard /> : <Navigate to="/login" />} 
        />
        <Route path="/inbox" element={userId ? <Inbox /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth-success" element={<AuthSuccess />} />
        <Route path="/telemetry" element={<Telemetry />} />
      </Routes>
    </Router>
  );
}

export default App;
