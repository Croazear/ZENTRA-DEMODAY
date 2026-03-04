
import React, { useState } from 'react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  PieChart, Pie, Cell, Line, ComposedChart
} from 'recharts';
import { 
  TrendingUp, Wallet, CreditCard, ArrowUpRight, ArrowDownRight, 
  Zap, AlertTriangle, Landmark, Receipt, BarChart3
} from 'lucide-react';
import { MOCK_CHART_DATA, MOCK_EXPENSE_BREAKDOWN, MOCK_COMPANY_DATA } from '../mockData';

type FinanceTab = 'overview' | 'taxes' | 'liquidity';

const FinancesView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FinanceTab>('overview');

  const kpis = {
    overview: [
      { label: "Saldo operacyjne", value: `${MOCK_COMPANY_DATA.bankBalance.toLocaleString()} PLN`, change: "+12.5%", trend: "up", icon: <Wallet size={24} /> },
      { label: "Zysk netto (mc)", value: `${(MOCK_COMPANY_DATA.currentMonthIncome - MOCK_COMPANY_DATA.currentMonthCosts).toLocaleString()} PLN`, change: "+5.2%", trend: "up", icon: <TrendingUp size={24} /> }
    ],
    taxes: [
      { label: "Estymowany VAT", value: `${MOCK_COMPANY_DATA.currentMonthVat.toLocaleString()} PLN`, change: "Termin: 25.02", trend: "neutral", icon: <Zap size={24} /> },
      { label: "Zobowiązania ZUS", value: "1 600,00 PLN", change: "Termin: 20.02", trend: "down", icon: <CreditCard size={24} /> }
    ]
  };

  const tabs = [
    { id: 'overview', label: 'Finanse', icon: BarChart3 },
    { id: 'taxes', label: 'Podatki', icon: Receipt },
    { id: 'liquidity', label: 'Płynność', icon: Landmark }
  ];

  const renderOverview = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
      <div className="lg:col-span-1 space-y-6">
        {kpis.overview.map((kpi, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm">
             <div className="flex flex-col gap-4">
                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-primary-500">
                   {kpi.icon}
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{kpi.label}</p>
                   <h3 className="text-2xl font-black dark:text-white">{kpi.value}</h3>
                   <div className="mt-2 flex items-center gap-2">
                      <ArrowUpRight size={14} className="text-emerald-500" />
                      <span className="text-[11px] font-bold text-emerald-600">{kpi.change}</span>
                   </div>
                </div>
             </div>
          </div>
        ))}

        <div className="bg-white dark:bg-slate-900 p-6 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 text-center">Trend finansowy (mini)</p>
           <div className="h-[120px]">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={MOCK_CHART_DATA}>
                    <Area type="monotone" dataKey="balance" stroke="#3b82f6" strokeWidth={2} fill="#3b82f6" fillOpacity={0.05} />
                    <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={1} strokeDasharray="3 3" dot={false} opacity={0.3} />
                    <Line type="monotone" dataKey="costs" stroke="#f43f5e" strokeWidth={1} strokeDasharray="3 3" dot={false} opacity={0.3} />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>
      </div>

      <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-10 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col">
         <div className="flex justify-between items-start mb-10">
            <div>
               <h3 className="text-xl font-black dark:text-white">Struktura Kosztów</h3>
               <p className="text-xs text-slate-400 mt-1">Gdzie trafiają Twoje środki w tym miesiącu?</p>
            </div>
         </div>
         
         <div className="flex-1 min-h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                  <Pie
                     data={MOCK_EXPENSE_BREAKDOWN}
                     cx="50%"
                     cy="50%"
                     innerRadius={70}
                     outerRadius={110}
                     paddingAngle={8}
                     dataKey="value"
                  >
                     {MOCK_EXPENSE_BREAKDOWN.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} stroke="transparent" />
                     ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
               </PieChart>
            </ResponsiveContainer>
         </div>
         
         <div className="grid grid-cols-2 gap-4 mt-8">
            {MOCK_EXPENSE_BREAKDOWN.map((exp, i) => (
               <div key={i} className="flex justify-between items-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex items-center gap-3">
                     <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: exp.fill}}></div>
                     <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">{exp.name}</span>
                  </div>
                  <span className="text-xs font-black text-slate-900 dark:text-white">{exp.value.toLocaleString()} PLN</span>
               </div>
            ))}
         </div>
      </div>
    </div>
  );

  const renderTaxes = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
      <div className="lg:col-span-1 space-y-6">
         {kpis.taxes.map((kpi, i) => (
           <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm">
             <div className="flex flex-col gap-4">
                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-primary-500">
                   {kpi.icon}
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{kpi.label}</p>
                   <h3 className="text-2xl font-black dark:text-white">{kpi.value}</h3>
                   <p className="mt-2 text-[11px] font-bold text-slate-500">{kpi.change}</p>
                </div>
             </div>
           </div>
         ))}
      </div>

      <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-10 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm">
         <h3 className="text-xl font-black dark:text-white mb-6">Plan płatności podatkowych</h3>
         <div className="space-y-4">
            {[
              { title: 'ZUS (Społeczne)', date: '20.02.2024', amount: '1 600,00 PLN', status: 'pending' },
              { title: 'Podatek VAT-7', date: '25.02.2024', amount: '3 450,50 PLN', status: 'pending' },
              { title: 'Zaliczka PIT-5', date: '20.03.2024', amount: '1 200,00 PLN', status: 'future' }
            ].map((tax, i) => (
               <div key={i} className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-800/50 rounded-3xl">
                  <div className="flex items-center gap-4">
                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tax.status === 'pending' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'}`}>
                        <Receipt size={20} />
                     </div>
                     <div>
                        <p className="font-bold text-sm dark:text-white">{tax.title}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{tax.date}</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className="font-black text-sm dark:text-white">{tax.amount}</p>
                     <button className="text-[10px] font-black text-primary-600 uppercase mt-1">Opłać teraz</button>
                  </div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );

  const renderLiquidity = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-slate-900 p-10 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm">
         <div className="flex justify-between items-center mb-10">
            <div>
               <h3 className="text-xl font-black dark:text-white">Analiza Płynności (Cashflow)</h3>
               <p className="text-xs text-slate-400 mt-1">Porównanie przychodów i wydatków w czasie rzeczywistym</p>
            </div>
            <div className="flex gap-6">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary-500"></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Saldo</span>
                </div>
                <div className="flex items-center gap-2 opacity-60">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Przychody</span>
                </div>
                <div className="flex items-center gap-2 opacity-60">
                    <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Koszty</span>
                </div>
            </div>
         </div>
         <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
               <ComposedChart data={MOCK_CHART_DATA}>
                  <defs>
                     <linearGradient id="financeIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                     </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip 
                     contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', background: '#fff' }}
                     itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                  />
                  {/* Subtle Income Line */}
                  <Line 
                    type="monotone" 
                    name="Przychody"
                    dataKey="income" 
                    stroke="#10b981" 
                    strokeWidth={2} 
                    strokeDasharray="5 5" 
                    dot={false} 
                    opacity={0.3} 
                  />
                  {/* Subtle Costs Line */}
                  <Line 
                    type="monotone" 
                    name="Koszty"
                    dataKey="costs" 
                    stroke="#f43f5e" 
                    strokeWidth={2} 
                    strokeDasharray="5 5" 
                    dot={false} 
                    opacity={0.3} 
                  />
                  {/* Main Balance Area */}
                  <Area 
                    name="Saldo (Zysk/Strata)" 
                    type="monotone" 
                    dataKey="balance" 
                    stroke="#3b82f6" 
                    strokeWidth={5} 
                    fillOpacity={1} 
                    fill="url(#financeIncome)" 
                  />
               </ComposedChart>
            </ResponsiveContainer>
         </div>
      </div>

      <div className="bg-rose-50/50 dark:bg-rose-900/10 p-8 rounded-[40px] border border-rose-100 dark:border-rose-800 flex items-start gap-6">
         <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-[25px] flex items-center justify-center text-rose-500 shadow-sm shrink-0">
            <AlertTriangle size={32} />
         </div>
         <div className="space-y-2">
            <h4 className="text-lg font-black text-rose-900 dark:text-rose-200">Analiza Ryzyka Cashflow</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-4xl">
               Zalecana uwaga: Przewidywane saldo na koniec przyszłego miesiąca może spaść poniżej bezpiecznego progu z powodu nagromadzenia płatności ZUS i VAT w tym samym tygodniu. Rekomendujemy weryfikację faktury <span className="underline font-bold">FV/2024/02/01</span> pod kątem wcześniejszej płatności.
            </p>
            <div className="flex gap-4 mt-4">
               <button className="bg-rose-600 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-rose-200">Windykacja AI</button>
               <button className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest border border-rose-100">Symulacja</button>
            </div>
         </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black dark:text-white tracking-tight">Finanse Firmy</h1>
          <div className="flex gap-1 mt-6 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-[22px] border border-slate-200 dark:border-slate-700">
             {tabs.map(tab => (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id as FinanceTab)}
                 className={`flex items-center gap-2 px-6 py-2.5 rounded-[18px] text-xs font-black uppercase tracking-widest transition-all ${
                   activeTab === tab.id 
                     ? 'bg-white dark:bg-slate-900 text-primary-600 shadow-md ring-1 ring-slate-200 dark:ring-slate-700' 
                     : 'text-slate-400 hover:text-slate-600'
                 }`}
               >
                 <tab.icon size={16} />
                 {tab.label}
               </button>
             ))}
          </div>
        </div>
        <div className="pb-2">
           <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">Ostatnia aktualizacja</p>
           <p className="text-xs font-bold text-slate-500">Dzisiaj, 09:42</p>
        </div>
      </div>

      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'taxes' && renderTaxes()}
      {activeTab === 'liquidity' && renderLiquidity()}
    </div>
  );
};

export default FinancesView;
