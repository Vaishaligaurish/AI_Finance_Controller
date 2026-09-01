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
    <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-200 mt-10">
      <h2 className="text-2xl font-bold mb-6">New Reconciliation Run</h2>
      <form onSubmit={handleUpload} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Bank Transactions (CSV)</label>
          <input type="file" accept=".csv" onChange={e => setBankFile(e.target.files[0])} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ledger Transactions (CSV)</label>
          <input type="file" accept=".csv" onChange={e => setLedgerFile(e.target.files[0])} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
        </div>
        <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
          {loading ? 'Processing...' : 'Start Reconciliation'}
        </button>
      </form>
    </div>
  );
};
export default ReconcilePage;
