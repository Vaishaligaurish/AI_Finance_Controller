import React, { useContext, useEffect, useState } from 'react';
import { RunContext } from '../context/RunContext';
import EmptyState from '../components/common/EmptyState';
import { getRunSummary } from '../api/reconciliation';
import { formatCurrency } from '../utils/formatters';

const DashboardPage = () => {
  const { activeRunId } = useContext(RunContext);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    if (activeRunId) {
      getRunSummary(activeRunId).then(res => setSummary(res.data)).catch(console.error);
    }
  }, [activeRunId]);

  if (!activeRunId) return <EmptyState message="No active reconciliation run" actionText="Start Reconciliation" actionLink="/reconcile" />;
  if (!summary) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Metric title="Total Transactions" value={summary.total_records} />
        <Metric title="Match Rate" value={`${summary.match_rate.toFixed(1)}%`} />
        <Metric title="Exceptions" value={summary.unresolved_records} color="text-red-600" />
        <Metric title="Reconciled Value" value={formatCurrency(summary.reconciled_value)} />
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Run Details</h2>
        <p><strong>Run ID:</strong> {summary.run_id}</p>
        <p><strong>Status:</strong> {summary.status}</p>
        <p><strong>Bank File:</strong> {summary.bank_filename}</p>
        <p><strong>Ledger File:</strong> {summary.ledger_filename}</p>
      </div>
    </div>
  );
};

const Metric = ({ title, value, color='text-gray-900' }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
    <div className="text-sm font-medium text-gray-500 truncate">{title}</div>
    <div className={`mt-2 text-3xl font-semibold ${color}`}>{value}</div>
  </div>
);

export default DashboardPage;
