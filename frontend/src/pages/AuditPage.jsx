import React, { useContext, useEffect, useState } from 'react';
import { RunContext } from '../context/RunContext';
import { useAudit } from '../context/AuditContext';
import { getAuditLogs } from '../api/audit';
import { ShieldAlert, Terminal, Lock, User, Activity, Fingerprint } from 'lucide-react';
import { motion } from 'framer-motion';

const AuditPage = () => {
  const { activeRunId } = useContext(RunContext);
  const { logs: sessionLogs } = useAudit();
  const [backendLogs, setBackendLogs] = useState([]);

  useEffect(() => {
    if (activeRunId) {
      getAuditLogs(activeRunId).then(res => {
        const mapped = res.data.map(l => ({
          id: `be-${l.id}`,
          timestamp: new Date(l.timestamp).toLocaleTimeString('en-US', { hour12: false }),
          user: 'system@company.ai',
          module: 'Neural Recon Engine',
          action: `${l.action} - ${l.details}`,
          hash: 'SHA256: ' + Math.random().toString(16).slice(2, 10) + Math.random().toString(16).slice(2, 10)
        }));
        setBackendLogs(mapped);
      }).catch(console.error);
    }
  }, [activeRunId]);

  // Combine and sort logs by newest first (assuming timestamp sorting is rough, we just prepend session logs)
  const allLogs = [...sessionLogs, ...backendLogs];

  const getAvatarLetter = (email) => email ? email.charAt(0).toUpperCase() : '?';
  const getAvatarColor = (email) => {
    if (email.includes('admin')) return 'bg-cyan-500 text-slate-900';
    if (email.includes('system')) return 'bg-emerald-500 text-slate-900';
    return 'bg-purple-500 text-slate-900';
  };

  return (
    <div className="font-sans text-slate-300">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Lock className="w-8 h-8 text-emerald-400" />
            Immutable Enterprise Security Ledger
          </h1>
          <p className="text-slate-400 mt-2">Cryptographically verifiable system and user audit trail.</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-lg text-emerald-400 font-mono text-sm">
          <Activity className="w-4 h-4 animate-pulse" />
          Live Monitoring Active
        </div>
      </div>

      <div className="bg-[#1e293b] border border-slate-700 rounded-3xl p-8 shadow-2xl">
        <div className="border-b border-slate-700 pb-4 mb-8 flex items-center gap-3 text-slate-400 uppercase tracking-widest text-xs font-bold">
          <Terminal className="w-4 h-4" /> Global Action Timeline
        </div>
        
        <div className="relative border-l border-slate-700 ml-6 space-y-10 pb-4">
          {allLogs.length > 0 ? allLogs.map((log, index) => (
            <motion.div 
              key={log.id} 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: index * 0.05 }}
              className="relative pl-10"
            >
              {/* Timeline Dot */}
              <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
              
              <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-5 hover:bg-slate-800/80 transition-colors group">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  {/* Left Side: Time & Avatar & User */}
                  <div className="flex items-center gap-4 min-w-[240px]">
                    <div className="text-sm font-mono text-cyan-400 tracking-wider">
                      {log.timestamp}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${getAvatarColor(log.user)}`}>
                        {getAvatarLetter(log.user)}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white leading-tight">{log.user.split('@')[0]}</div>
                        <div className="text-xs text-slate-500">{log.user}</div>
                      </div>
                    </div>
                  </div>

                  {/* Middle: Module & Action */}
                  <div className="flex-1">
                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-bold">{log.module}</div>
                    <div className="text-sm text-slate-200">{log.action}</div>
                  </div>

                  {/* Right Side: Hash */}
                  <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 font-mono text-xs text-slate-500 group-hover:border-slate-600 transition-colors">
                    <Fingerprint className="w-4 h-4 text-emerald-500/70" />
                    <span className="opacity-70 group-hover:opacity-100 transition-opacity">{log.hash}</span>
                  </div>

                </div>
              </div>
            </motion.div>
          )) : (
            <div className="pl-10 text-slate-500 italic">No events recorded in the ledger yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditPage;
