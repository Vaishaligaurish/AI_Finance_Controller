import React, { createContext, useState, useContext } from 'react';

export const AuditContext = createContext();

export const AuditProvider = ({ children }) => {
  const [logs, setLogs] = useState([
    { id: 1, timestamp: new Date(Date.now() - 3600000).toLocaleTimeString('en-US', { hour12: false }), user: 'system@company.ai', module: 'System', action: 'Daily Ledger Synchronization Initialized', hash: 'SHA256: 3a7b9c2f8e1d4a5b' }
  ]);

  const addLog = (userEmail, module, action) => {
    const hash = 'SHA256: ' + Math.random().toString(16).slice(2, 10) + Math.random().toString(16).slice(2, 10);
    const newLog = {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      user: userEmail,
      module,
      action,
      hash
    };
    setLogs(prev => [newLog, ...prev]);
  };

  return (
    <AuditContext.Provider value={{ logs, addLog }}>
      {children}
    </AuditContext.Provider>
  );
};

export const useAudit = () => useContext(AuditContext);
