import React, { useState } from 'react';
import { Download, FileText, Calendar, Filter, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ReportsPage = () => {
  const [reports, setReports] = useState([
    { id: 1, name: 'Q3 Financial Reconciliation Summary', date: '2026-09-01', size: '2.4 MB', type: 'PDF' },
    { id: 2, name: 'August Exception Audit Log', date: '2026-08-31', size: '1.1 MB', type: 'CSV' },
    { id: 3, name: 'Bank vs Ledger Discrepancy Analysis', date: '2026-08-15', size: '3.5 MB', type: 'PDF' },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [reportType, setReportType] = useState('P&L');
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [progress, setProgress] = useState(0);

  const handleGenerate = () => {
    setGenerating(true);
    setProgress(0);
    
    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          finishGeneration();
          return 100;
        }
        return prev + 15;
      });
    }, 200);
  };

  const finishGeneration = () => {
    setTimeout(() => {
      const newReport = {
        id: Date.now(),
        name: `${reportType} - ${dateRange.replace(' ', '')}`,
        date: new Date().toISOString().split('T')[0],
        size: (Math.random() * 4 + 0.5).toFixed(1) + ' MB',
        type: reportType === 'Expense Audit' ? 'CSV' : 'PDF'
      };
      setReports(prev => [newReport, ...prev]);
      setGenerating(false);
      setModalOpen(false);
    }, 500);
  };

  const handleDownload = (report) => {
    // Generate a real client-side blob download
    const content = `Mock report data for ${report.name}\nGenerated on ${report.date}\nType: ${report.type}\n\nConfidential Data.`;
    const blob = new Blob([content], { type: report.type === 'CSV' ? 'text/csv' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = report.name.replace(/\\s+/g, '_') + (report.type === 'CSV' ? '.csv' : '.pdf');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans text-slate-300">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <FileText className="w-8 h-8 text-cyan-400" />
            Financial Reports Archive
          </h1>
          <p className="text-slate-400 mt-2">Generate and download reconciliation and audit reports.</p>
        </div>
        <button 
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-cyan-500/25"
        >
          <FileText className="w-5 h-5" />
          Generate New Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700 shadow-lg flex items-start gap-4">
          <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl"><Calendar className="w-6 h-6" /></div>
          <div>
            <div className="font-bold text-white">Monthly Close</div>
            <div className="text-sm text-slate-400 mt-1">Standard end-of-month reconciliation summary.</div>
          </div>
        </div>
        <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700 shadow-lg flex items-start gap-4">
          <div className="p-3 bg-[#F14A56]/10 text-[#F14A56] rounded-xl"><Filter className="w-6 h-6" /></div>
          <div>
            <div className="font-bold text-white">Exceptions Only</div>
            <div className="text-sm text-slate-400 mt-1">Detailed breakdown of all unresolved anomalies.</div>
          </div>
        </div>
        <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700 shadow-lg flex items-start gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl"><FileText className="w-6 h-6" /></div>
          <div>
            <div className="font-bold text-white">Full Audit Trail</div>
            <div className="text-sm text-slate-400 mt-1">Comprehensive log of all matched and unmatched records.</div>
          </div>
        </div>
      </div>

      <div className="bg-[#1e293b] rounded-2xl shadow-xl border border-slate-700 overflow-hidden">
        <div className="px-8 py-5 border-b border-slate-700 bg-[#0f172a]/50 font-bold text-white tracking-wide">
          Recent Reports
        </div>
        <div className="divide-y divide-slate-700/50">
          <AnimatePresence>
            {reports.map(report => (
              <motion.div 
                key={report.id} 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 px-8 flex items-center justify-between hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 flex items-center justify-center rounded-xl text-xs font-black tracking-widest ${report.type === 'PDF' ? 'bg-[#F14A56]/10 text-[#F14A56] border border-[#F14A56]/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                    {report.type}
                  </div>
                  <div>
                    <div className="font-bold text-white text-lg">{report.name}</div>
                    <div className="text-sm text-slate-400 font-mono mt-1">Generated on {report.date} • {report.size}</div>
                  </div>
                </div>
                <button 
                  onClick={() => handleDownload(report)}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10 rounded-lg transition-colors border border-transparent hover:border-cyan-400/30"
                >
                  <Download className="w-5 h-5" /> Download
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Report Generation Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-[#1e293b] border border-slate-700 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="px-6 py-5 border-b border-slate-700 flex justify-between items-center bg-slate-900/50">
                <h3 className="text-xl font-bold text-white">Report Configuration</h3>
                <button onClick={() => !generating && setModalOpen(false)} className="text-slate-400 hover:text-white transition-colors" disabled={generating}>
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                {!generating ? (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">Report Type</label>
                      <select 
                        value={reportType} 
                        onChange={(e) => setReportType(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                      >
                        <option value="P&L">P&L Summary</option>
                        <option value="Balance Sheet">Balance Sheet Audit</option>
                        <option value="Expense Audit">Detailed Expense Audit</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">Date Range</label>
                      <select 
                        value={dateRange} 
                        onChange={(e) => setDateRange(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                      >
                        <option value="Last 7 Days">Last 7 Days</option>
                        <option value="Last 30 Days">Last 30 Days</option>
                        <option value="Q3 2026">Q3 2026</option>
                        <option value="YTD">Year to Date (YTD)</option>
                      </select>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mb-4" />
                    <div className="text-lg font-bold text-white mb-2">Assembling Data Analytics...</div>
                    <div className="w-full bg-slate-800 rounded-full h-2.5 mt-4 overflow-hidden border border-slate-700">
                      <div className="bg-cyan-400 h-2.5 rounded-full transition-all duration-200" style={{ width: `${progress}%` }}></div>
                    </div>
                    <div className="text-slate-400 text-sm mt-2">{progress}% Complete</div>
                  </div>
                )}
              </div>

              {!generating && (
                <div className="px-6 py-5 border-t border-slate-700 bg-slate-900/50 flex justify-end gap-3">
                  <button onClick={() => setModalOpen(false)} className="px-6 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 font-medium transition-colors">
                    Cancel
                  </button>
                  <button 
                    onClick={handleGenerate} 
                    className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-colors shadow-lg"
                  >
                    Confirm & Generate
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReportsPage;
