import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, List, AlertCircle, ShieldAlert, BarChart, Settings, Sparkles, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  const links = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Reconcile', path: '/reconcile', icon: FileText },
    { name: 'Transactions', path: '/transactions', icon: List },
    { name: 'Exceptions', path: '/exceptions', icon: AlertCircle },
    { name: 'Audit Log', path: '/audit', icon: ShieldAlert },
    { name: 'Reports', path: '/reports', icon: BarChart },
    { name: 'What-If Scenarios', path: '/what-if', icon: Sparkles, adminOnly: true },
    { name: 'Settings', path: '/settings', icon: Settings, adminOnly: true },
  ];

  return (
    <div className="w-64 bg-[#1e293b] border-r border-slate-700 h-screen fixed top-0 left-0 flex flex-col font-sans">
      <div className="h-20 flex items-center px-6 border-b border-slate-700 font-bold text-xl text-white gap-3">
        <ShieldAlert className="w-8 h-8 text-cyan-400" />
        <span className="tracking-tight">FinControl</span>
      </div>
      <div className="flex-1 overflow-y-auto py-6 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          const isBlocked = link.adminOnly && user?.role !== 'admin';
          
          return (
            <Link 
              key={link.path} 
              to={link.path} 
              className={`flex items-center px-6 py-3 text-sm font-medium transition-all ${
                isActive 
                  ? 'bg-slate-800/80 text-cyan-400 border-r-4 border-cyan-400 shadow-[inset_0_0_15px_rgba(6,182,212,0.05)]' 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 mr-3 ${isBlocked ? 'text-slate-600' : isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
              <span className={isBlocked ? 'text-slate-600' : ''}>{link.name}</span>
              {isBlocked && <Lock className="w-4 h-4 ml-auto text-slate-600" />}
            </Link>
          );
        })}
      </div>
    </div>
  );
};
export default Sidebar;
