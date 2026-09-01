import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import DashboardPage from './pages/DashboardPage';
import ReconcilePage from './pages/ReconcilePage';
import TransactionsPage from './pages/TransactionsPage';
import ExceptionsPage from './pages/ExceptionsPage';
import AuditPage from './pages/AuditPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import { RunProvider } from './context/RunContext';

function App() {
  return (
    <Router>
      <RunProvider>
        <AppLayout>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/reconcile" element={<ReconcilePage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/exceptions" element={<ExceptionsPage />} />
            <Route path="/audit" element={<AuditPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </AppLayout>
      </RunProvider>
    </Router>
  );
}
export default App;
