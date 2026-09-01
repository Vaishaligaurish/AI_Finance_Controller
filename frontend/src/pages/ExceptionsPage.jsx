import React, { useContext, useEffect, useState } from 'react';
import { RunContext } from '../context/RunContext';
import EmptyState from '../components/common/EmptyState';
import { getExceptions, resolveException } from '../api/exceptions';
import StatusBadge from '../components/common/StatusBadge';

const ExceptionsPage = () => {
  const { activeRunId } = useContext(RunContext);
  const [exc, setExc] = useState([]);

  const load = () => { if (activeRunId) getExceptions(activeRunId).then(res => setExc(res.data)).catch(console.error); };
  useEffect(load, [activeRunId]);

  const handleResolve = async (id, action) => {
    try {
      await resolveException(id, { action, comment: `Manually resolved as ${action}` });
      load();
    } catch (e) { console.error(e); }
  };

  if (!activeRunId) return <EmptyState message="No active run" actionText="Go to Dashboard" actionLink="/" />;

  return (
    <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b"><h2 className="text-lg font-bold">Exceptions</h2></div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-gray-700 uppercase">
            <tr>
              <th className="px-6 py-3">Txn ID</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Reasoning</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {exc.map(e => (
              <tr key={e.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">{e.transaction_id}</td>
                <td className="px-6 py-4">{e.category}</td>
                <td className="px-6 py-4 max-w-xs truncate" title={e.system_reasoning}>{e.system_reasoning}</td>
                <td className="px-6 py-4"><StatusBadge status={e.status} /></td>
                <td className="px-6 py-4">
                  {e.status === 'UNRESOLVED' && (
                    <div className="space-x-2 flex">
                      <button onClick={() => handleResolve(e.exception_id, 'approve')} className="text-green-600 hover:underline">Approve</button>
                      <button onClick={() => handleResolve(e.exception_id, 'reject')} className="text-red-600 hover:underline">Reject</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default ExceptionsPage;
