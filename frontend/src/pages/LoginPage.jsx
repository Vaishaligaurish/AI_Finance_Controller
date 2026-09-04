import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ShieldAlert } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showRoleOptions, setShowRoleOptions] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === 'admin@company.ai' && password === 'admin123') {
      login(email, 'admin');
      navigate('/');
    } else if (email === 'staff@company.ai' && password === 'staff123') {
      login(email, 'staff');
      navigate('/');
    } else {
      setError('Invalid corporate credentials.');
    }
  };

  const selectRole = (role) => {
    setEmail(`${role}@company.ai`);
    setShowRoleOptions(false);
  };

  return (
    <div className="flex h-screen bg-[#0f172a] text-slate-200 overflow-hidden font-sans">
      
      {/* Left Side - Animated Visual Matrix */}
      <div className="hidden lg:flex w-1/2 relative bg-[#1e293b]/50 items-center justify-center border-r border-slate-700 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <div className="w-[800px] h-[800px] absolute -top-40 -left-40 bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="w-[600px] h-[600px] absolute bottom-0 right-0 bg-gradient-to-l from-indigo-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        <div className="z-10 flex flex-col items-center text-center space-y-6 backdrop-blur-md bg-slate-900/40 p-12 rounded-3xl border border-slate-700 shadow-2xl">
          <ShieldAlert className="w-24 h-24 text-cyan-400 mb-4" />
          <h1 className="text-4xl font-bold text-white tracking-tight">FinSentry</h1>
          <p className="text-xl text-slate-400 tracking-widest uppercase font-mono">Secure Enterprise Ledger Access</p>
          <div className="flex items-center gap-2 mt-8 text-emerald-400 font-mono text-sm bg-emerald-400/10 px-4 py-2 rounded-full border border-emerald-400/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            System Online - Encryption Active
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#0f172a] relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        
        <div className="w-full max-w-md p-8 relative z-10">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-white mb-2">Corporate Gateway</h2>
            <p className="text-slate-400 text-sm">Please authenticate to access the ledger.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-coral-500/10 border-l-4 border-[#F14A56] text-[#F14A56] rounded-r-lg text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Mail className="w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
              </div>
              <input 
                type="email" 
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setShowRoleOptions(true)}
                onBlur={() => setTimeout(() => setShowRoleOptions(false), 150)}
                className="block w-full pl-12 pr-4 pt-6 pb-2 text-white bg-slate-800 border border-slate-700 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent peer transition-all"
                placeholder=" "
                required
              />
              <label htmlFor="email" className="absolute text-sm text-slate-500 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-12 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-cyan-400">
                Corporate Email
              </label>
              {showRoleOptions && (
                <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-xl border border-slate-700 bg-slate-800 shadow-xl">
                  <p className="px-4 py-2 text-xs uppercase tracking-widest text-slate-500">Choose role</p>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => selectRole('admin')}
                    className="block w-full px-4 py-3 text-left text-sm text-slate-200 transition-colors hover:bg-slate-700 hover:text-cyan-300"
                  >
                    Admin
                  </button>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => selectRole('staff')}
                    className="block w-full px-4 py-3 text-left text-sm text-slate-200 transition-colors hover:bg-slate-700 hover:text-cyan-300"
                  >
                    Staff
                  </button>
                </div>
              )}
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Lock className="w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
              </div>
              <input 
                type="password" 
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-12 pr-4 pt-6 pb-2 text-white bg-slate-800 border border-slate-700 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent peer transition-all"
                placeholder=" "
                required
              />
              <label htmlFor="password" className="absolute text-sm text-slate-500 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-12 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-cyan-400">
                Password
              </label>
            </div>

            <button 
              type="submit" 
              className="w-full py-4 px-4 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5"
            >
              Authenticate Session
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;
