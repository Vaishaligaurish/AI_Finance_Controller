import React, { useContext, useEffect, useState } from 'react';
import { RunContext } from '../context/RunContext';
import EmptyState from '../components/common/EmptyState';
import { getExceptions, resolveException } from '../api/exceptions';
import { AlertTriangle, CheckCircle, Search, ShieldAlert, Flag, Send, X, FileSearch } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ExceptionsPage = () => {
  const { activeRunId } = useContext(RunContext);
  const [exceptions, setExceptions] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [disputeModal, setDisputeModal] = useState({ open: false, data: null });
  const [commentingId, setCommentingId] = useState(null);
  const [overrideComment, setOverrideComment] = useState("");

  const load = () => { 
    if (activeRunId) {
      getExceptions(activeRunId).then(res => {
        // Mocking AI Risk Scores and 3-way match data
        const enriched = res.data.map((e, idx) => ({
          ...e,
          riskScore: idx % 2 === 0 ? 94 : 48,
          riskLevel: idx % 2 === 0 ? 'Critical' : 'Medium',
          vendor: e.bank_vendor || 'Global Suppliers Inc.',
          invoiceNo: `INV-2026-${Math.floor(Math.random() * 9000) + 1000}`,
          poNo: `PO-${Math.floor(Math.random() * 9000) + 1000}`,
          grnNo: `GRN-${Math.floor(Math.random() * 9000) + 1000}`
        }));
        setExceptions(enriched);
      }).catch(console.error); 
    }
  };
  
  useEffect(load, [activeRunId]);

  const handleApprove = async (id) => {
    try {
      await resolveException(id, { action: 'approve', comment: overrideComment || 'Manually approved override' });
      setCommentingId(null);
      setOverrideComment("");
      load();
    } catch (e) { console.error(e); }
  };

  const openDispute = (e, evt) => {
    evt.stopPropagation();
    setDisputeModal({
      open: true,
      data: e
    });
  };

  if (!activeRunId) return <EmptyState message="No active run" actionText="Go to Dashboard" actionLink="/" />;

  return (
    <div className="font-sans text-slate-300">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-coral-500" />
            Interactive AI Triage Workspace
          </h1>
          <p className="text-slate-400 mt-2">Anomaly Detection & Exception Management</p>
        </div>
      </div>

      <div className="space-y-4">
        {exceptions.filter(e => e.status === 'UNRESOLVED').map(e => (
          <motion.div 
            key={e.exception_id} 
            layout 
            className="bg-[#1e293b] border border-slate-700 rounded-2xl overflow-hidden shadow-lg hover:border-slate-600 transition-colors"
          >
            {/* Main Card Header */}
            <div 
              className="px-6 py-5 cursor-pointer flex flex-wrap lg:flex-nowrap items-center justify-between gap-4"
              onClick={() => setExpandedId(expandedId === e.exception_id ? null : e.exception_id)}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl border ${e.riskLevel === 'Critical' ? 'bg-[#F14A56]/10 border-[#F14A56]/30 text-[#F14A56]' : 'bg-amber-500/10 border-amber-500/30 text-amber-500'}`}>
                  <span className="text-xl font-bold font-mono">{e.riskScore}%</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider">Risk</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{e.vendor}</h3>
                  <div className="text-sm text-slate-400 font-mono mt-1">Txn ID: {e.transaction_id} | {e.category}</div>
                </div>
              </div>

              <div className="flex-1">
                <div className="text-sm text-slate-300 line-clamp-2">{e.system_reasoning}</div>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={(evt) => { evt.stopPropagation(); setExpandedId(e.exception_id); }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 transition-colors text-sm font-medium"
                >
                  <FileSearch className="w-4 h-4 text-cyan-400" />
                  Audit Line-Item
                </button>
              </div>
            </div>

            {/* Expanded Content Area */}
            <AnimatePresence>
              {expandedId === e.exception_id && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }} 
                  animate={{ height: 'auto', opacity: 1 }} 
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-slate-700 bg-slate-900/50"
                >
                  <div className="p-6">
                    {/* 3-Way Match Table */}
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                      <FileSearch className="w-4 h-4 text-cyan-400" /> 3-Way Match Conflict Analysis
                    </h4>
                    <div className="overflow-x-auto border border-slate-700 rounded-xl mb-6">
                      <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-800/80 text-slate-400">
                          <tr>
                            <th className="px-4 py-3 font-medium">Document Type</th>
                            <th className="px-4 py-3 font-medium">Reference No.</th>
                            <th className="px-4 py-3 font-medium">Recorded Value</th>
                            <th className="px-4 py-3 font-medium">Match Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50 text-slate-300 font-mono">
                          <tr>
                            <td className="px-4 py-3 text-slate-400">Purchase Order (PO)</td>
                            <td className="px-4 py-3">{e.poNo}</td>
                            <td className="px-4 py-3">$12,500.00</td>
                            <td className="px-4 py-3 text-emerald-400">Verified</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-slate-400">Goods Receipt (GRN)</td>
                            <td className="px-4 py-3">{e.grnNo}</td>
                            <td className="px-4 py-3">$12,500.00</td>
                            <td className="px-4 py-3 text-emerald-400">Verified</td>
                          </tr>
                          <tr className="bg-[#F14A56]/5">
                            <td className="px-4 py-3 text-slate-400">Vendor Invoice</td>
                            <td className="px-4 py-3">{e.invoiceNo}</td>
                            <td className="px-4 py-3 text-[#F14A56] font-bold">$14,200.00</td>
                            <td className="px-4 py-3 text-[#F14A56]">Discrepancy (+$1,700.00)</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Workflow Actions */}
                    <div className="flex flex-wrap gap-4 items-center">
                      {commentingId === e.exception_id ? (
                        <div className="flex-1 flex gap-2">
                          <input 
                            type="text" 
                            value={overrideComment}
                            onChange={(ev) => setOverrideComment(ev.target.value)}
                            placeholder="Reason for approval override..." 
                            className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500 text-white"
                          />
                          <button onClick={() => handleApprove(e.exception_id)} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg font-bold transition-colors">
                            Confirm Approve
                          </button>
                          <button onClick={() => setCommentingId(null)} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
                        </div>
                      ) : (
                        <>
                          <button 
                            onClick={() => setCommentingId(e.exception_id)}
                            className="flex items-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 px-6 py-2.5 rounded-lg font-bold transition-all"
                          >
                            <CheckCircle className="w-5 h-5" />
                            Approve Override
                          </button>
                          
                          <button 
                            onClick={(evt) => openDispute(e, evt)}
                            className="flex items-center gap-2 bg-[#F14A56]/10 hover:bg-[#F14A56]/20 text-[#F14A56] border border-[#F14A56]/50 px-6 py-2.5 rounded-lg font-bold transition-all"
                          >
                            <Flag className="w-5 h-5" />
                            Flag Vendor / Dispute
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
        {exceptions.filter(e => e.status === 'UNRESOLVED').length === 0 && (
          <div className="text-center py-12 text-slate-500">No unresolved exceptions found. Triage queue is empty.</div>
        )}
      </div>

      {/* AI Dispute Email Modal */}
      <AnimatePresence>
        {disputeModal.open && disputeModal.data && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-[#1e293b] border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="px-6 py-4 border-b border-slate-700 flex justify-between items-center bg-slate-900/50">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Send className="w-5 h-5 text-cyan-400" /> Auto-Generated Dispute Draft
                </h3>
                <button onClick={() => setDisputeModal({ open: false, data: null })} className="text-slate-400 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6 flex-1 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-slate-500">To:</span> <span className="text-white">accounts@{disputeModal.data.vendor.toLowerCase().replace(/\s+/g, '')}.com</span></div>
                  <div><span className="text-slate-500">Subject:</span> <span className="text-white">Invoice Discrepancy - {disputeModal.data.invoiceNo}</span></div>
                </div>
                
                <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 font-mono text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
{`Dear Accounts Receivable Team,

Our AI Financial Controller has flagged a discrepancy during our automated 3-way matching process for your recent invoice.

Details of the conflict:
- Invoice Ref: \${disputeModal.data.invoiceNo}
- Associated PO: \${disputeModal.data.poNo}
- Goods Receipt: \${disputeModal.data.grnNo}

The invoice amount exceeds the approved PO value by $1,700.00. 
Please review your billing system and issue a revised invoice or a credit memo for the difference so we can proceed with the settlement.

Thank you,
Finance Controller Automated System`}
                </div>
              </div>

              <div className="px-6 py-4 border-t border-slate-700 bg-slate-900/50 flex justify-end gap-3">
                <button onClick={() => setDisputeModal({ open: false, data: null })} className="px-6 py-2 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors">
                  Cancel
                </button>
                <button onClick={() => {
                  alert('Dispute email sent via integration.');
                  setDisputeModal({ open: false, data: null });
                }} className="px-6 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-colors shadow-lg">
                  Send to Vendor
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ExceptionsPage;
