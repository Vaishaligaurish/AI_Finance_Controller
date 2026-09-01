import React, { createContext, useState, useEffect } from 'react';
import { getRuns } from '../api/reconciliation';

export const RunContext = createContext();

export const RunProvider = ({ children }) => {
  const [activeRunId, setActiveRunId] = useState(localStorage.getItem('activeRunId'));
  const [availableRuns, setAvailableRuns] = useState([]);

  const refreshRuns = async () => {
    try {
      const res = await getRuns();
      setAvailableRuns(res.data);
      if (activeRunId && !res.data.find(r => r.run_id === activeRunId)) {
        setActiveRunId(null);
        localStorage.removeItem('activeRunId');
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { refreshRuns(); }, []);

  const setRun = (id) => {
    setActiveRunId(id);
    if(id) localStorage.setItem('activeRunId', id);
    else localStorage.removeItem('activeRunId');
  };

  return (
    <RunContext.Provider value={{ activeRunId, setActiveRunId: setRun, availableRuns, refreshRuns }}>
      {children}
    </RunContext.Provider>
  );
};
