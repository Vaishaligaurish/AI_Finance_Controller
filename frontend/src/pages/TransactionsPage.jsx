import React, { useContext, useEffect, useState } from 'react';
import { RunContext } from '../context/RunContext';
import EmptyState from '../components/common/EmptyState';
import { getTransactions } from '../api/transactions';
import { formatCurrency } from '../utils/formatters';
import { Search, Filter } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const styles = {
    MATCHED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    UNRESOLVED: 'bg-coral-500/10 text-[#F14A56] border-[#F14A56]/20',
    PENDING: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
  };
  const currentStyle = styles[status] || 'bg-slate-700 text-slate-300 border-slate-600';
  return <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${currentStyle}`}>{status}</span>;
};

const TransactionsPage = () => {
  const { activeRunId } = useContext(RunContext);
  const [txns, setTxns] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => {
    if (activeRunId) {
      getTransactions(activeRunId).then(res => setTxns(res.data)).catch(console.error);
    }
  }, [activeRunId]);

  if (!activeRunId) return <EmptyState message="No active run" actionText="Go to Dashboard" actionLink="/" />;

  const filteredTxns = txns.filter(t => {
    const matchesSearch = (t.bank_vendor || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'ALL' ? true : (t.bank_amount > 0 ? 'CREDIT' : 'DEBIT') === filterType;
    const matchesStatus = filterStatus === 'ALL' ? true : t.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="bg-[#1e293b] border border-slate-700 rounded-2xl shadow-xl overflow-hidden font-sans text-slate-300">
      <div className="px-6 py-5 border-b border-slate-700 bg-[#0f172a]/50">
        <h2 className="text-xl font-bold text-white mb-4">Master Transactions Ledger</h2>
        
        {/* Interactive Filtering Row */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search by vendor name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-cyan-500 text-white placeholder-slate-500"
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Filter className="w-4 h-4 text-slate-500" />
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg text-sm px-3 py-2 focus:outline-none focus:border-cyan-500 text-slate-300"
            >
              <option value="ALL">All Types</option>
              <option value="CREDIT">Credit (+)</option>
              <option value="DEBIT">Debit (-)</option>
            </select>
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg text-sm px-3 py-2 focus:outline-none focus:border-cyan-500 text-slate-300"
            >
              <option value="ALL">All Statuses</option>
              <option value="MATCHED">Cleared</option>
              <option value="UNRESOLVED">Flagged</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-900/80 text-slate-400 uppercase text-xs tracking-wider border-b border-slate-700">
            <tr>
              <th className="px-6 py-4 font-medium">Txn ID</th>
              <th className="px-6 py-4 font-medium">Vendor / Description</th>
              <th className="px-6 py-4 font-medium">Amount</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Match Type</th>
              <th className="px-6 py-4 font-medium">AI Confidence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {filteredTxns.length > 0 ? filteredTxns.map(t => (
              <tr key={t.id} className="hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4 font-mono text-xs text-slate-500">{t.transaction_id}</td>
                <td className="px-6 py-4 text-white font-medium">{t.bank_vendor || 'Unknown Source'}</td>
                <td className={`px-6 py-4 font-mono ${t.bank_amount > 0 ? 'text-emerald-400' : 'text-slate-300'}`}>
                  {t.bank_amount > 0 ? '+' : ''}{formatCurrency(t.bank_amount)}
                </td>
                <td className="px-6 py-4"><StatusBadge status={t.status} /></td>
                <td className="px-6 py-4 text-slate-400">{t.match_type || '-'}</td>
                <td className="px-6 py-4 font-mono text-cyan-400">{t.confidence_score ? t.confidence_score.toFixed(1) + '%' : '-'}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-slate-500">No transactions match the current filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionsPage;
