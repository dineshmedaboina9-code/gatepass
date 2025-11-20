import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import HoDDashboard from './pages/HoDDashboard';
import AdminDashboard from './pages/AdminDashboard';
import GateKeeperPage from './pages/GateKeeperPage';

// Styles
import './styles/auth.css';
import './styles/dashboard.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/student-dashboard"
            element={
              <PrivateRoute allowedRoles={['student']}>
                <StudentDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/hod-dashboard"
            element={
              <PrivateRoute allowedRoles={['hod']}>
                <HoDDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin-dashboard"
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/gatekeeper-page"
            element={
              <PrivateRoute allowedRoles={['gatekeeper']}>
                <GateKeeperPage />
              </PrivateRoute>
            }
          />

          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
