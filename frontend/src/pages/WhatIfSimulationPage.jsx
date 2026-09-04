import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  AreaChart, Area 
} from 'recharts';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Download, Zap, TrendingUp, TrendingDown, AlertTriangle, Sparkles, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAudit } from '../context/AuditContext';

// Theme Constants
const COLORS = {
  emerald: '#10B981',
  coral: '#F14A56',
  cyan: '#06B6D4',
  slateDark: '#0f172a',
  slateCard: '#1e293b',
  slateBorder: '#334155'
};

const BASE_MONTHS = 12;

const generateBaseline = () => {
  const data = [];
  let currentCash = 1000000; // Starting cash $1M
  
  for (let i = 1; i <= BASE_MONTHS; i++) {
    const revenue = 250000 + (i * 10000); 
    const cogs = revenue * 0.35; 
    const opex = 120000; 
    
    const netProfit = revenue - cogs - opex;
    currentCash += netProfit;
    
    data.push({
      month: `M${i}`,
      revenue,
      cogs,
      opex,
      netProfit,
      cashBalance: currentCash
    });
  }
  return data;
};

const INITIAL_BASELINE = generateBaseline();

const WhatIfSimulationPage = () => {
  const [simulatedData, setSimulatedData] = useState(INITIAL_BASELINE);
  const [scenarioName, setScenarioName] = useState('Baseline Scenario');
  const [promptInput, setPromptInput] = useState('');
  const reportRef = useRef(null);

  const { user } = useAuth();
  const { addLog } = useAudit();
  
  const applyScenario = (name, changes) => {
    setScenarioName(name);
    let currentCash = INITIAL_BASELINE[0].cashBalance - INITIAL_BASELINE[0].netProfit;
    
    const newSimData = INITIAL_BASELINE.map((month) => {
      const revenue = month.revenue * (1 + (changes.revenue || 0));
      const baseCogsRatio = month.cogs / month.revenue;
      const cogs = revenue * baseCogsRatio * (1 + (changes.cogs || 0));
      const opex = month.opex * (1 + (changes.opex || 0));
      
      const netProfit = revenue - cogs - opex;
      currentCash += netProfit;

      return {
        ...month,
        revenue,
        cogs,
        opex,
        netProfit,
        cashBalance: currentCash
      };
    });
    
    setSimulatedData(newSimData);
    addLog(user?.email || 'unknown', 'What-If Simulator', `Triggered Scenario: ${name}`);
  };

  const handleCustomPrompt = (e) => {
    e.preventDefault();
    if (!promptInput.trim()) return;
    
    let changes = { revenue: 0, cogs: 0, opex: 0 };
    const text = promptInput.toLowerCase();
    let name = `Custom: ${promptInput}`;
    
    if (text.includes('revenue +') || text.includes('revenue up')) changes.revenue = 0.2;
    if (text.includes('cogs +') || text.includes('supply chain')) changes.cogs = 0.25;
    if (text.includes('inflation') || text.includes('opex +')) changes.opex = 0.15;
    if (text.includes('crash')) changes.revenue = -0.3;
    
    if(changes.revenue === 0 && changes.cogs === 0 && changes.opex === 0) {
      changes.revenue = 0.05;
      changes.opex = -0.05;
    }
    
    applyScenario(name, changes);
  };

  const generatePDF = async () => {
    if (!reportRef.current) return;
    addLog(user?.email || 'unknown', 'What-If Simulator', `Generated PDF Report for ${scenarioName}`);
    const element = reportRef.current;
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#0f172a',
        useCORS: true,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`AI_Finance_Executive_Report_${new Date().getTime()}.pdf`);
    } catch (err) {
      console.error('PDF generation failed', err);
    }
  };

  const totalBaseNetProfit = INITIAL_BASELINE.reduce((sum, m) => sum + m.netProfit, 0);
  const totalSimNetProfit = simulatedData.reduce((sum, m) => sum + m.netProfit, 0);
  const netIncomeDelta = totalSimNetProfit - totalBaseNetProfit;
  const netIncomeDeltaPct = (netIncomeDelta / totalBaseNetProfit) * 100;
  
  const totalSimRevenue = simulatedData.reduce((sum, m) => sum + m.revenue, 0);
  const simProfitMargin = (totalSimNetProfit / totalSimRevenue) * 100;

  let runwayMonths = 12;
  const negativeCashMonth = simulatedData.findIndex(m => m.cashBalance <= 0);
  if (negativeCashMonth !== -1) runwayMonths = negativeCashMonth;
  else {
    const lastMonthCash = simulatedData[11].cashBalance;
    const avgBurn = simulatedData.reduce((sum, m) => m.netProfit < 0 ? sum + Math.abs(m.netProfit) : sum, 0) / 12;
    if (avgBurn > 0 && lastMonthCash > 0) {
      runwayMonths = 12 + Math.floor(lastMonthCash / avgBurn);
    } else if (avgBurn === 0) {
      runwayMonths = '> 24';
    }
  }

  const chartData = INITIAL_BASELINE.map((base, idx) => ({
    month: base.month,
    baselineProfit: base.netProfit,
    simulatedProfit: simulatedData[idx].netProfit,
    simulatedCash: simulatedData[idx].cashBalance
  }));

  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#0f172a] text-slate-200 flex items-center justify-center p-8">
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700/50 p-12 rounded-3xl text-center max-w-lg shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-coral-500 to-red-600"></div>
          <AlertTriangle className="w-20 h-20 text-[#F14A56] mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-2">Unauthorized Access Level</h2>
          <p className="text-slate-400">Your current security clearance ({user?.role}) does not permit access to the Executive Simulator. Contact CFO for privileges.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-8 font-sans overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-8" ref={reportRef}>
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-700/50 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-[#06B6D4]" />
              Scenario Simulation Studio
            </h1>
            <p className="text-slate-400 mt-2">Executive AI Financial Risk Analysis & Modeling</p>
            <p className="text-xs text-slate-500 mt-1 hidden print:block">Generated: {new Date().toLocaleString()}</p>
          </div>
          <button 
            onClick={generatePDF}
            className="mt-4 md:mt-0 flex items-center gap-2 bg-[#06B6D4]/10 hover:bg-[#06B6D4]/20 text-[#06B6D4] border border-[#06B6D4]/50 px-6 py-3 rounded-xl font-medium transition-all shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:shadow-[0_0_25px_rgba(6,182,212,0.3)]"
          >
            <Download className="w-5 h-5" />
            Generate Executive Risk Summary (PDF)
          </button>
        </div>

        {/* AI Prompt Box & Macros (Hide in PDF for cleaner report) */}
        <div className="print:hidden space-y-4">
          <form onSubmit={handleCustomPrompt} className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#06B6D4] to-[#10B981] rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-[#1e293b]/80 backdrop-blur-xl border border-slate-700 rounded-2xl p-2 flex items-center shadow-2xl">
              <Sparkles className="w-6 h-6 text-[#06B6D4] ml-4 opacity-70" />
              <input 
                type="text" 
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder="Ask AI to simulate a scenario... (e.g. 'What if supply chain issues increase COGS by 30%?')"
                className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-slate-400 px-4 py-3 text-lg"
              />
              <button type="submit" className="bg-[#06B6D4] hover:bg-cyan-400 text-slate-900 font-bold px-6 py-2 rounded-xl transition-colors">
                Simulate
              </button>
            </div>
          </form>

          <div className="flex flex-wrap gap-3 mt-4">
            <button onClick={() => applyScenario('Supply Chain Crisis', { cogs: 0.25 })}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-700 bg-slate-800/50 hover:border-[#F14A56]/50 hover:bg-[#F14A56]/10 text-slate-300 transition-colors text-sm">
              <span className="w-2 h-2 rounded-full bg-[#F14A56]"></span> Supply Chain Crisis: COGS +25%
            </button>
            <button onClick={() => applyScenario('Expansion Surge', { revenue: 0.15, opex: 0.10 })}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-700 bg-slate-800/50 hover:border-[#10B981]/50 hover:bg-[#10B981]/10 text-slate-300 transition-colors text-sm">
              <span className="w-2 h-2 rounded-full bg-[#10B981]"></span> Expansion Surge: Rev +15%, OpEx +10%
            </button>
            <button onClick={() => applyScenario('Global Inflation', { opex: 0.12 })}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-700 bg-slate-800/50 hover:border-yellow-500/50 hover:bg-yellow-500/10 text-slate-300 transition-colors text-sm">
              <span className="w-2 h-2 rounded-full bg-yellow-500"></span> Global Inflation Phase: OpEx +12%
            </button>
            <button onClick={() => applyScenario('Q4 Revenue Sprint', { revenue: 0.22 })}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-700 bg-slate-800/50 hover:border-[#06B6D4]/50 hover:bg-[#06B6D4]/10 text-slate-300 transition-colors text-sm">
              <span className="w-2 h-2 rounded-full bg-[#06B6D4]"></span> Q4 Revenue Sprint: Rev +22%
            </button>
            <button onClick={() => { setScenarioName('Baseline Scenario'); setSimulatedData(INITIAL_BASELINE); setPromptInput(''); }}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-700 bg-slate-800/50 hover:border-slate-400 hover:bg-slate-700 text-slate-300 transition-colors text-sm ml-auto">
              Reset to Baseline
            </button>
          </div>
        </div>

        {/* PDF Executive Summary Section (Visible clearly in PDF) */}
        <div className="bg-[#1e293b]/60 border border-slate-700 rounded-2xl p-6 print:bg-[#1e293b]">
          <h2 className="text-xl font-semibold text-white mb-2">Section 1: Executive Summary</h2>
          <p className="text-slate-300 mb-6">
            This report details the financial impact of the triggered scenario: <strong className="text-white">"{scenarioName}"</strong>. 
            The simulation analyzes projected changes to Revenue, COGS, and OpEx over a 12-month horizon, 
            providing a comparative baseline analysis to determine potential risk exposure and cash runway deterioration.
          </p>

          <h2 className="text-xl font-semibold text-white mb-4">Section 2: Fiscal Comparison</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
              <div className="text-sm text-slate-400">Total Annual Baseline Rev</div>
              <div className="text-lg font-mono font-medium">{formatCurrency(INITIAL_BASELINE.reduce((s,m)=>s+m.revenue,0))}</div>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
              <div className="text-sm text-slate-400">Total Simulated Rev</div>
              <div className="text-lg font-mono font-medium">{formatCurrency(totalSimRevenue)}</div>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
              <div className="text-sm text-slate-400">Total Baseline Net Income</div>
              <div className="text-lg font-mono font-medium">{formatCurrency(totalBaseNetProfit)}</div>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
              <div className="text-sm text-slate-400">Total Simulated Net Income</div>
              <div className="text-lg font-mono font-medium">{formatCurrency(totalSimNetProfit)}</div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-700 text-sm text-slate-500 flex justify-between items-center hidden print:flex">
            <span>Automated Recommendation Engine</span>
            <span className="px-3 py-1 bg-slate-800 rounded-full border border-slate-700 font-mono text-xs">Auth: {user?.email}</span>
          </div>
        </div>

        {/* Action Required Box for PDF / Warnings */}
        {simProfitMargin < 5 && (
          <div className="bg-[#F14A56]/10 border-l-4 border-[#F14A56] p-4 rounded-r-xl flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-[#F14A56] mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-[#F14A56] text-lg">Section 3: Action Required - Critical Profit Margin Drop</h3>
              <p className="text-[#F14A56]/80 mt-1">
                The simulated scenario drives the adjusted profit margin below 5% (Currently {simProfitMargin.toFixed(1)}%). Immediate mitigation of OpEx overhead or renegotiation of supplier contracts is highly recommended to sustain operations.
              </p>
            </div>
          </div>
        )}

        {/* 3 Giant Executive Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            key={`delta-${netIncomeDelta}`}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
            className="bg-[#1e293b]/60 backdrop-blur-md border border-slate-700/50 rounded-3xl p-8 relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${netIncomeDelta >= 0 ? 'from-[#10B981]/20' : 'from-[#F14A56]/20'} to-transparent rounded-bl-full`}></div>
            <p className="text-slate-400 font-medium mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4" /> Net Income Delta
            </p>
            <div className="text-4xl font-bold font-mono tracking-tight text-white mb-2">
              {netIncomeDelta > 0 ? '+' : ''}{formatCurrency(netIncomeDelta)}
            </div>
            <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${netIncomeDelta >= 0 ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-[#F14A56]/10 text-[#F14A56]'}`}>
              {netIncomeDelta >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {Math.abs(netIncomeDeltaPct).toFixed(1)}% from Baseline
            </div>
          </motion.div>

          <motion.div 
            key={`margin-${simProfitMargin}`}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-[#1e293b]/60 backdrop-blur-md border border-slate-700/50 rounded-3xl p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#06B6D4]/20 to-transparent rounded-bl-full"></div>
            <p className="text-slate-400 font-medium mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Adjusted Profit Margin
            </p>
            <div className="text-4xl font-bold font-mono tracking-tight text-white mb-2">
              {simProfitMargin.toFixed(2)}%
            </div>
            <div className="text-slate-400 text-sm mt-3">
              Baseline was {((totalBaseNetProfit / INITIAL_BASELINE.reduce((s,m)=>s+m.revenue,0))*100).toFixed(2)}%
            </div>
          </motion.div>

          <motion.div 
            key={`runway-${runwayMonths}`}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-[#1e293b]/60 backdrop-blur-md border border-slate-700/50 rounded-3xl p-8 relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${runwayMonths < 6 ? 'from-[#F14A56]/20' : 'from-[#10B981]/20'} to-transparent rounded-bl-full`}></div>
            <p className="text-slate-400 font-medium mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Cash Runway Horizon
            </p>
            <div className="text-4xl font-bold font-mono tracking-tight text-white mb-2">
              {runwayMonths} Months
            </div>
            <div className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${runwayMonths < 6 ? 'bg-[#F14A56]/10 text-[#F14A56]' : 'bg-[#10B981]/10 text-[#10B981]'}`}>
              {runwayMonths < 6 ? 'High Risk Horizon' : 'Healthy Reserves'}
            </div>
          </motion.div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          
          {/* Bar Chart: Profit Comparison */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="bg-[#1e293b]/60 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-6">Net Profit Comparison (Monthly)</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="month" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} tickFormatter={(val) => `$${val / 1000}k`} axisLine={false} tickLine={false} />
                  <RechartsTooltip 
                    cursor={{ fill: '#334155', opacity: 0.4 }}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '0.5rem' }}
                    formatter={(value) => [formatCurrency(value)]}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="baselineProfit" name="Baseline Profit" fill="#334155" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="simulatedProfit" name="Simulated Profit" fill="#06B6D4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Area Chart: Cash Runway */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="bg-[#1e293b]/60 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-6">Simulated Cash Balance Trajectory</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                  <defs>
                    <linearGradient id="colorCash" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={netIncomeDelta >= 0 ? "#10B981" : "#F14A56"} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={netIncomeDelta >= 0 ? "#10B981" : "#F14A56"} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="month" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} tickFormatter={(val) => `$${(val / 1000000).toFixed(1)}M`} axisLine={false} tickLine={false} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '0.5rem' }}
                    formatter={(value) => [formatCurrency(value), 'Total Cash']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="simulatedCash" 
                    name="Projected Cash Balance"
                    stroke={netIncomeDelta >= 0 ? "#10B981" : "#F14A56"} 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorCash)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
          
        </div>
      </div>
    </div>
  );
};

export default WhatIfSimulationPage;
