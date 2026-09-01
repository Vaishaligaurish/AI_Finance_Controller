import React, { useContext, useEffect, useState } from 'react';
import { RunContext } from '../context/RunContext';
import EmptyState from '../components/common/EmptyState';
import { getAuditLogs } from '../api/audit';

const AuditPage = () => {
  const { activeRunId } = useContext(RunContext);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (activeRunId) getAuditLogs(activeRunId).then(res => setLogs(res.data)).catch(console.error);
  }, [activeRunId]);

  if (!activeRunId) return <EmptyState message="No active run" />;

  return (
    <div className="bg-white border rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b"><h2 className="text-lg font-bold">Audit Logs</h2></div>
      <div className="p-6 space-y-4">
        {logs.map(l => (
          <div key={l.id} className="border-b pb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium text-gray-900">{l.action}</span>
              <span className="text-xs text-gray-500">{new Date(l.timestamp).toLocaleString()}</span>
            </div>
            <p className="text-sm text-gray-600">{l.details}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AuditPage;
