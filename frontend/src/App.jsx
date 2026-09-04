import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import DashboardPage from './pages/DashboardPage';
import ReconcilePage from './pages/ReconcilePage';
import TransactionsPage from './pages/TransactionsPage';
import ExceptionsPage from './pages/ExceptionsPage';
import AuditPage from './pages/AuditPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import WhatIfSimulationPage from './pages/WhatIfSimulationPage';
import LoginPage from './pages/LoginPage';
import { RunProvider } from './context/RunContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuditProvider } from './context/AuditContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (user) {
      setTimeout(() => setLoading(false), 1500);
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user) return <Navigate to="/login" replace />;
  if (loading) return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#0f172a] text-[#06B6D4] space-y-4">
      <div className="w-12 h-12 border-4 border-[#06B6D4] border-t-transparent rounded-full animate-spin"></div>
      <div className="text-xl font-mono animate-pulse tracking-widest">Initializing Secure Session...</div>
    </div>
  );

  return children;
};

function App() {
  return (
    <AuthProvider>
      <AuditProvider>
        <RunProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="*" element={
                <ProtectedRoute>
                  <AppLayout>
                    <Routes>
                      <Route path="/" element={<DashboardPage />} />
                      <Route path="/reconcile" element={<ReconcilePage />} />
                      <Route path="/transactions" element={<TransactionsPage />} />
                      <Route path="/exceptions" element={<ExceptionsPage />} />
                      <Route path="/audit" element={<AuditPage />} />
                      <Route path="/reports" element={<ReportsPage />} />
                      <Route path="/what-if" element={<WhatIfSimulationPage />} />
                      <Route path="/settings" element={<SettingsPage />} />
                    </Routes>
                  </AppLayout>
                </ProtectedRoute>
              } />
            </Routes>
          </Router>
        </RunProvider>
      </AuditProvider>
    </AuthProvider>
  );
}

export default App;
