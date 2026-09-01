import React, { useContext, useEffect, useState } from 'react';
import { RunContext } from '../context/RunContext';
import EmptyState from '../components/common/EmptyState';
import { getTransactions } from '../api/transactions';
import StatusBadge from '../components/common/StatusBadge';
import { formatCurrency } from '../utils/formatters';

const TransactionsPage = () => {
  const { activeRunId } = useContext(RunContext);
  const [txns, setTxns] = useState([]);

  useEffect(() => {
    if (activeRunId) {
      getTransactions(activeRunId).then(res => setTxns(res.data)).catch(console.error);
    }
  }, [activeRunId]);

  if (!activeRunId) return <EmptyState message="No active run" actionText="Go to Dashboard" actionLink="/" />;

  return (
    <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b"><h2 className="text-lg font-bold">Transactions</h2></div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-gray-700 uppercase">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Vendor</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Match Type</th>
              <th className="px-6 py-3">Confidence</th>
            </tr>
          </thead>
          <tbody>
            {txns.map(t => (
              <tr key={t.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">{t.transaction_id}</td>
                <td className="px-6 py-4">{t.bank_vendor}</td>
                <td className="px-6 py-4">{formatCurrency(t.bank_amount)}</td>
                <td className="px-6 py-4"><StatusBadge status={t.status} /></td>
                <td className="px-6 py-4">{t.match_type}</td>
                <td className="px-6 py-4">{t.confidence_score ? t.confidence_score.toFixed(1) + '%' : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default TransactionsPage;
