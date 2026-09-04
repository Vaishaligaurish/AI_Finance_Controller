import React, { useState, useContext } from 'react';
import { uploadFiles, startReconciliation } from '../api/reconciliation';
import { RunContext } from '../context/RunContext';
import { useNavigate } from 'react-router-dom';

const ReconcilePage = () => {
  const [bankFile, setBankFile] = useState(null);
  const [ledgerFile, setLedgerFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { refreshRuns, setActiveRunId } = useContext(RunContext);
  const nav = useNavigate();

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!bankFile || !ledgerFile) return alert('Select both files');
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('bank_file', bankFile);
      fd.append('ledger_file', ledgerFile);
      const res = await uploadFiles(fd);
      await startReconciliation(res.data.run_id);
      await refreshRuns();
      setActiveRunId(res.data.run_id);
      nav('/');
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    }
    setLoading(false);
  };

  return (
    <div 
      className="min-h-screen -m-8 p-8 flex items-center justify-center bg-[#0f172a] bg-cover bg-center bg-no-repeat relative overflow-hidden"
      style={{ backgroundImage: `url('https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2000&auto=format&fit=crop')` }}
    >
      {/* Dark overlay mesh */}
      <div className="absolute inset-0 bg-slate-950/70 z-0"></div>

      <div className="max-w-xl w-full relative z-10 backdrop-blur-xl bg-slate-900/60 p-10 rounded-3xl shadow-2xl border border-slate-700/50">
        <h2 className="text-3xl font-bold mb-2 text-white">Initialize Ledger Sync</h2>
        <p className="text-slate-400 mb-8 text-sm">Upload Bank and Ledger statements to trigger the AI-driven reconciliation engine.</p>
        
        <form onSubmit={handleUpload} className="space-y-8">
          <div className="relative group p-4 border-2 border-dashed border-slate-600 rounded-2xl hover:border-cyan-500 transition-colors bg-slate-800/30">
            <label className="block text-sm font-semibold text-slate-300 mb-3">Bank Transactions Source (CSV)</label>
            <input 
              type="file" 
              accept=".csv" 
              onChange={e => setBankFile(e.target.files[0])} 
              className="block w-full text-sm text-slate-400 file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-cyan-500/10 file:text-cyan-400 hover:file:bg-cyan-500/20 file:transition-colors cursor-pointer" 
            />
          </div>
          
          <div className="relative group p-4 border-2 border-dashed border-slate-600 rounded-2xl hover:border-emerald-500 transition-colors bg-slate-800/30">
            <label className="block text-sm font-semibold text-slate-300 mb-3">Internal Ledger Source (CSV)</label>
            <input 
              type="file" 
              accept=".csv" 
              onChange={e => setLedgerFile(e.target.files[0])} 
              className="block w-full text-sm text-slate-400 file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-emerald-500/10 file:text-emerald-400 hover:file:bg-emerald-500/20 file:transition-colors cursor-pointer" 
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-slate-900 bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 transition-all transform hover:-translate-y-1"
          >
            {loading ? 'Processing Neural Matching...' : 'Initialize AI Reconciliation'}
          </button>
        </form>
      </div>
    </div>
  );
};
export default ReconcilePage;
