import React, { useState } from 'react';
import { Save, User, Bell, Shield, Database } from 'lucide-react';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">System Settings</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 space-y-1">
          <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-sm font-medium transition ${activeTab === 'profile' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}>
            <User className="w-5 h-5" /> Profile & Account
          </button>
          <button onClick={() => setActiveTab('notifications')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-sm font-medium transition ${activeTab === 'notifications' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}>
            <Bell className="w-5 h-5" /> Notifications
          </button>
          <button onClick={() => setActiveTab('security')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-sm font-medium transition ${activeTab === 'security' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}>
            <Shield className="w-5 h-5" /> Security
          </button>
          <button onClick={() => setActiveTab('database')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-sm font-medium transition ${activeTab === 'database' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}>
            <Database className="w-5 h-5" /> Data & AI Engine
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200">
          <form onSubmit={handleSave} className="p-6">
            
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">Profile Information</h2>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input type="text" defaultValue="Executive Admin" className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input type="email" defaultValue="admin@finance.ai" className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <input type="text" defaultValue="System Administrator" disabled className="w-full bg-gray-50 border-gray-300 rounded-md shadow-sm p-2 border text-gray-500" />
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">Notification Preferences</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">Email Alerts on Anomalies</div>
                      <div className="text-sm text-gray-500">Get notified immediately when high-value exceptions occur.</div>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">Daily Reconciliation Summary</div>
                      <div className="text-sm text-gray-500">A daily automated report of all reconciliations.</div>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">Security & Compliance</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <input type="password" placeholder="••••••••" className="w-full max-w-md border-gray-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input type="password" placeholder="Leave blank to keep current" className="w-full max-w-md border-gray-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className="pt-4">
                  <button type="button" className="text-blue-600 font-medium text-sm hover:underline">Enable Two-Factor Authentication (2FA)</button>
                </div>
              </div>
            )}

            {activeTab === 'database' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">Data & AI Engine</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">AI Fuzzy Matching Threshold (%)</label>
                    <input type="number" defaultValue="85" min="50" max="100" className="w-32 border-gray-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500" />
                    <p className="text-xs text-gray-500 mt-1">Lower values increase matches but may increase false positives.</p>
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <button type="button" className="px-4 py-2 bg-gray-100 text-gray-700 rounded border hover:bg-gray-200 transition text-sm font-medium">
                      Clear System Cache
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 pt-6 border-t flex items-center justify-end gap-4">
              {isSaved && <span className="text-green-600 text-sm font-medium flex items-center gap-1">Saved successfully!</span>}
              <button type="submit" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition">
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
