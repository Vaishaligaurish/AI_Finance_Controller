import React, { useContext, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RunContext } from '../../context/RunContext';
import { useAuth } from '../../context/AuthContext';
import { Bell, User, ChevronDown, Zap } from 'lucide-react';

const Topbar = () => {
  const { availableRuns, activeRunId, setActiveRunId } = useContext(RunContext);
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const nav = useNavigate();
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => { if(ref.current && !ref.current.contains(e.target)) setIsOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const activeRun = availableRuns.find(r => r.run_id === activeRunId);

  return (
    <div className="h-20 bg-[#1e293b]/80 backdrop-blur-md border-b border-slate-700 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm font-sans">
      <div className="relative" ref={ref}>
        <button onClick={() => setIsOpen(!isOpen)} className="flex items-center px-4 py-2.5 border border-slate-700 rounded-xl hover:bg-slate-800 bg-slate-900/50 transition-colors shadow-sm">
          <Zap className="w-4 h-4 text-cyan-400 mr-2" />
          <span className="font-medium text-sm mr-2 text-slate-200">
            {activeRun ? `Active Sync: ${activeRun.run_id.substring(0,8)}` : 'Select Active Run'}
          </span>
          <ChevronDown className="w-4 h-4 text-slate-500" />
        </button>
        {isOpen && (
          <div className="absolute top-full left-0 mt-2 w-72 bg-slate-800 border border-slate-700 shadow-2xl rounded-xl overflow-hidden z-20">
            <div className="max-h-60 overflow-y-auto">
              {availableRuns.map(r => (
                <div key={r.run_id} onClick={() => { setActiveRunId(r.run_id); setIsOpen(false); }} className={`p-4 cursor-pointer hover:bg-slate-700/50 border-b border-slate-700 transition-colors ${activeRunId === r.run_id ? 'bg-slate-700/80 border-l-2 border-l-cyan-400' : ''}`}>
                  <div className="text-sm font-semibold text-slate-200">{r.run_id.substring(0,8)}</div>
                  <div className="text-xs text-slate-400 mt-1">{new Date(r.created_at).toLocaleDateString()} - <span className="text-emerald-400">{r.status}</span></div>
                </div>
              ))}
            </div>
            <div className="p-3 bg-slate-900 border-t border-slate-700">
              <button onClick={() => { setIsOpen(false); nav('/reconcile'); }} className="w-full text-center text-sm text-cyan-400 font-bold hover:text-cyan-300 transition-colors">
                + New Ledger Sync
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-6">
        {/* Notifications */}
        <div className="relative">
          <button onClick={() => setNotifOpen(!notifOpen)} className="text-slate-400 hover:text-cyan-400 relative transition-colors p-2">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-coral-500 rounded-full border-2 border-[#1e293b]"></span>
          </button>
          {notifOpen && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-slate-800 border border-slate-700 shadow-2xl rounded-xl overflow-hidden z-20">
              <div className="p-4 border-b border-slate-700 font-semibold text-white">Security & System Alerts</div>
              <div className="p-4 text-sm text-slate-300 border-b border-slate-700 hover:bg-slate-700/50 cursor-pointer transition-colors">
                <strong className="text-coral-500">New Anomaly Detected</strong><br/>
                <span className="text-slate-400">High value discrepancy in Ledger vs Bank.</span>
              </div>
              <div className="p-4 text-sm text-slate-300 hover:bg-slate-700/50 cursor-pointer transition-colors">
                <strong className="text-emerald-400">Reconciliation Complete</strong><br/>
                <span className="text-slate-400">Run #a1b2c3d4 finished successfully.</span>
              </div>
              <div className="p-3 bg-slate-900 text-center text-sm text-cyan-400 cursor-pointer hover:text-cyan-300 transition-colors font-medium">
                Acknowledge All
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative">
          <button onClick={() => setUserOpen(!userOpen)} className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-600 to-cyan-500 flex items-center justify-center text-white hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all">
            <User className="w-5 h-5" />
          </button>
          {userOpen && (
            <div className="absolute top-full right-0 mt-2 w-56 bg-slate-800 border border-slate-700 shadow-2xl rounded-xl overflow-hidden z-20">
              <div className="p-4 border-b border-slate-700 bg-slate-900/50">
                <div className="font-bold text-white">{user?.role === 'admin' ? 'Executive CFO' : 'Staff Auditor'}</div>
                <div className="text-xs text-slate-400 font-mono mt-1">{user?.email}</div>
              </div>
              <div className="py-2">
                <button onClick={() => { setUserOpen(false); nav('/settings'); }} className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
                  System Settings
                </button>
                <button onClick={() => { logout(); nav('/login'); }} className="w-full text-left px-4 py-2 text-sm text-coral-500 hover:bg-slate-700 transition-colors">
                  Terminate Session
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Topbar;
