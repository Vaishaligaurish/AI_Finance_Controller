import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, List, AlertCircle, ShieldAlert, BarChart, Settings } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const links = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Reconcile', path: '/reconcile', icon: FileText },
    { name: 'Transactions', path: '/transactions', icon: List },
    { name: 'Exceptions', path: '/exceptions', icon: AlertCircle },
    { name: 'Audit Log', path: '/audit', icon: ShieldAlert },
    { name: 'Reports', path: '/reports', icon: BarChart },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-white border-r h-screen fixed top-0 left-0 flex flex-col">
      <div className="h-16 flex items-center px-6 border-b font-bold text-xl text-blue-800">
        Finance Controller
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link key={link.path} to={link.path} className={`flex items-center px-6 py-3 text-sm font-medium ${isActive ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}>
              <Icon className="w-5 h-5 mr-3" />
              {link.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
};
export default Sidebar;
