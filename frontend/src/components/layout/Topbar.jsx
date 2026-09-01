import React, { useContext, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RunContext } from '../../context/RunContext';
import { Bell, User, ChevronDown } from 'lucide-react';

const Topbar = () => {
  const { availableRuns, activeRunId, setActiveRunId } = useContext(RunContext);
  const [isOpen, setIsOpen] = useState(false);
  const nav = useNavigate();
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => { if(ref.current && !ref.current.contains(e.target)) setIsOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const activeRun = availableRuns.find(r => r.run_id === activeRunId);

  return (
    <div className="h-16 bg-white border-b flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="relative" ref={ref}>
        <button onClick={() => setIsOpen(!isOpen)} className="flex items-center px-4 py-2 border rounded-md hover:bg-gray-50 bg-white">
          <span className="font-medium text-sm mr-2 text-gray-700">
            {activeRun ? `Run: ${activeRun.run_id.substring(0,8)}` : 'Select Active Run'}
          </span>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </button>
        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-64 bg-white border shadow-lg rounded-md overflow-hidden z-20">
            <div className="max-h-60 overflow-y-auto">
              {availableRuns.map(r => (
                <div key={r.run_id} onClick={() => { setActiveRunId(r.run_id); setIsOpen(false); }} className={`p-3 cursor-pointer hover:bg-blue-50 border-b ${activeRunId === r.run_id ? 'bg-blue-50' : ''}`}>
                  <div className="text-sm font-medium text-gray-800">{r.run_id.substring(0,8)}</div>
                  <div className="text-xs text-gray-500">{new Date(r.created_at).toLocaleDateString()} - {r.status}</div>
                </div>
              ))}
            </div>
            <div className="p-2 bg-gray-50 border-t">
              <button onClick={() => { setIsOpen(false); nav('/reconcile'); }} className="w-full text-center text-sm text-blue-600 font-medium hover:underline">
                New Reconciliation
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center space-x-4">
        <button className="text-gray-500 hover:text-gray-700"><Bell className="w-5 h-5" /></button>
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white"><User className="w-4 h-4" /></div>
      </div>
    </div>
  );
};
export default Topbar;
