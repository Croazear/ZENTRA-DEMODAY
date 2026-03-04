
import React, { useState } from 'react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Clock, AlertCircle, FileText, CheckCircle2, Circle,
  ArrowUpRight, ArrowDownRight, Sparkles, ChevronRight, Lightbulb, Mail, X, Check, HelpCircle
} from 'lucide-react';
import { MOCK_CHART_DATA, MOCK_DOCUMENTS, MOCK_TASKS, MOCK_COMPANY_DATA } from '../mockData';
import { Document, Task } from '../types';

interface DashboardProps {
  onNavigateToDocument: (docId: string) => void;
  onNavigateToFinances: () => void;
  onNavigateToCalendar: (day: number) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigateToDocument, onNavigateToFinances, onNavigateToCalendar }) => {
  const [tasks, setTasks] = useState(MOCK_TASKS);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedAIHint, setSelectedAIHint] = useState<any | null>(null);

  const toggleTaskStatus = (id: string, completed: boolean) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed } : t));
    setSelectedTask(null);
  };

  const getStatusLabel = (doc: Document) => {
    switch (doc.status) {
      case 'Opłacone': return doc.type === 'Pismo urzędowe' ? 'Zrealizowano' : 'Zapłacono';
      case 'Nieopłacone': return 'Do opłacenia';
      case 'Oczekuje': return 'Do rozpatrzenia';
      default: return doc.status;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Opłacone': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'Nieopłacone': return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400';
      case 'Oczekuje': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const aiSuggestions = [
    {
      id: 'vat-alert',
      title: "VAT do zapłaty za 6 dni",
      desc: "Masz 2 340 zł VAT do zapłaty. Termin mija 25 lutego.",
      details: "Twoje rozliczenie VAT za styczeń 2024 wynosi 2 340,50 PLN. Analiza przepływów wskazuje, że posiadasz wystarczające środki na koncie VAT. Rekomendujemy zlecenie przelewu już teraz, aby uniknąć kolejek w systemach bankowych 25-go dnia miesiąca.",
      actions: ["Zapłać teraz", "Ustaw przypomnienie na 24.02", "Pobierz JPK_V7M"],
      color: "bg-rose-50 border-rose-100",
      btnColor: "bg-[#e11d48] hover:bg-rose-700",
      iconColor: "bg-[#e11d48]",
      icon: <AlertCircle size={20} className="text-white" />
    },
    {
      id: 'unpaid-inv',
      title: "Nieopłacona faktura – Klient XYZ",
      desc: "Faktura FV/2024/02/01 na kwotę 1 200 zł jest 14 dni po terminie.",
      details: "Klient XYZ spóźnia się z płatnością o 2 tygodnie. To trzecia taka sytuacja w ciągu ostatnich 6 miesięcy. AI wygenerowało już gotowy projekt wezwania do zapłaty z odsetkami ustawowymi.",
      actions: ["Wyślij wezwanie (Email)", "Zadzwoń do klienta", "Uruchom windykację polubowną"],
      color: "bg-amber-50 border-amber-100",
      btnColor: "bg-amber-500 hover:bg-amber-600",
      iconColor: "bg-amber-500",
      icon: <FileText size={20} className="text-white" />
    },
    {
      id: 'zus-reduction',
      title: "Możesz obniżyć ZUS",
      desc: "Dostępna nowa ulga na start dla Twojej branży. Oszczędność ok. 400 zł/mc.",
      details: "Zgodnie z najnowszą nowelizacją przepisów dla sektora IT, Twoja firma kwalifikuje się do rozszerzonej ulgi na start. Możesz płacić obniżoną składkę przez kolejne 6 miesięcy. Wymaga to złożenia deklaracji ZUS ZZA z nowym kodem tytułu ubezpieczenia.",
      actions: ["Złóż wniosek przez PUE ZUS", "Skonsultuj z księgową", "Więcej o uldze"],
      color: "bg-emerald-50 border-emerald-100",
      btnColor: "bg-[#059669] hover:bg-emerald-700",
      iconColor: "bg-[#059669]",
      icon: <Lightbulb size={20} className="text-white" />
    }
  ];

  const upcomingDeadlines = [
    { date: "20", month: "LUT", title: "ZUS (Składka społeczna)", detail: "Przelew 1 600,00 PLN", color: "text-blue-600 bg-blue-50", dayValue: 20 },
    { date: "25", month: "LUT", title: "Podatek VAT", detail: "Deklaracja JPK_V7M", color: "text-rose-600 bg-rose-50", dayValue: 25 }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb size={24} className="text-primary-600" />
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">Sugestie Asystenta AI</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {aiSuggestions.map((s, i) => (
            <div key={i} className={`${s.color} border p-6 rounded-[24px] flex flex-col justify-between dark:bg-slate-900/40 dark:border-slate-800 transition-all hover:shadow-md`}>
              <div>
                <div className="flex items-start gap-4 mb-4">
                  <div className={`${s.iconColor} p-2 rounded-xl shrink-0 shadow-sm`}>
                    {s.icon}
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white leading-tight">{s.title}</h3>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                  {s.desc}
                </p>
              </div>
              <button 
                onClick={() => setSelectedAIHint(s)}
                className={`${s.btnColor} w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors text-white`}
              >
                Sprawdź szczegóły
                <ChevronRight size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          <div 
            onClick={onNavigateToFinances}
            className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm cursor-pointer transition-all group"
          >
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-bold dark:text-white flex items-center gap-2">
                  Wyniki Finansowe
                  <ArrowUpRight size={20} className="text-slate-300 group-hover:text-primary-500 transition-colors" />
                </h3>
                <p className="text-xs text-slate-400 mt-1">Podsumowanie przychodów i wydatków Twojej firmy</p>
              </div>
              <div className="flex gap-2">
                <div className="flex items-center gap-2 text-xs bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700">
                  <span className="w-2 h-2 rounded-full bg-primary-500"></span>
                  <span className="font-medium">Przychód</span>
                </div>
                <div className="flex items-center gap-2 text-xs bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  <span className="font-medium">Koszty</span>
                </div>
              </div>
            </div>
            
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_CHART_DATA}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorCosts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', background: '#fff' }}
                    itemStyle={{ fontWeight: 'bold' }}
                  />
                  <Area name="Przychody operacyjne" type="monotone" dataKey="income" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorIncome)" />
                  <Area name="Koszty prowadzenia działalności" type="monotone" dataKey="costs" stroke="#f43f5e" strokeWidth={4} fillOpacity={1} fill="url(#colorCosts)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-xl font-bold dark:text-white">Najnowsze dokumenty</h3>
              <button 
                onClick={() => onNavigateToDocument('')}
                className="text-primary-600 text-sm font-bold hover:text-primary-700 flex items-center gap-1 group"
              >
                Wszystkie dokumenty
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-800/30 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                    <th className="px-8 py-4">Kontrahent / ID</th>
                    <th className="px-8 py-4">Metoda</th>
                    <th className="px-8 py-4">Status</th>
                    <th className="px-8 py-4">Kwota Brutto</th>
                    <th className="px-8 py-4 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {MOCK_DOCUMENTS.slice(0, 4).map(doc => (
                    <tr 
                      key={doc.id} 
                      onClick={() => onNavigateToDocument(doc.id)}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                    >
                      <td className="px-8 py-5">
                        <p className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-primary-600 transition-colors">{doc.contractor}</p>
                        <p className="text-[10px] font-mono text-slate-400 mt-0.5">{doc.id}</p>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`text-[10px] font-black px-2 py-1 rounded-lg border ${
                          doc.source === 'KSeF' ? 'border-purple-200 text-purple-600 bg-purple-50' : 
                          doc.source === 'Email' ? 'border-blue-200 text-blue-600 bg-blue-50' : 
                          'border-green-200 text-green-600 bg-green-50'
                        }`}>
                          {doc.source}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap ${getStatusStyle(doc.status)}`}>
                          {getStatusLabel(doc)}
                        </span>
                      </td>
                      <td className="px-8 py-5 font-bold text-slate-800 dark:text-slate-200">
                        {doc.amountGross.toFixed(2)} PLN
                      </td>
                      <td className="px-8 py-5 text-right">
                        <ChevronRight size={18} className="text-slate-300 group-hover:text-primary-500 transition-colors inline-block" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm">
             <h3 className="font-bold mb-6 flex items-center gap-2 dark:text-white">
                Nadchodzące terminy
             </h3>
             <div className="space-y-4">
               {upcomingDeadlines.map((d, i) => (
                 <div 
                  key={i} 
                  onClick={() => onNavigateToCalendar(d.dayValue)}
                  className="flex items-center gap-4 group cursor-pointer"
                 >
                    <div className={`w-12 h-12 ${d.color} rounded-xl flex flex-col items-center justify-center shrink-0 transition-transform group-hover:scale-105`}>
                       <span className="text-[9px] font-black opacity-70 leading-none mb-0.5 uppercase">{d.month}</span>
                       <span className="text-lg font-black leading-none">{d.date}</span>
                    </div>
                    <div className="overflow-hidden">
                       <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{d.title}</p>
                       <p className="text-[11px] text-slate-400 font-medium">{d.detail}</p>
                    </div>
                 </div>
               ))}
             </div>
             <button 
              onClick={() => onNavigateToCalendar(20)}
              className="w-full mt-8 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-[10px] font-black text-slate-400 hover:text-primary-600 uppercase tracking-widest transition-all"
             >
               Pełny kalendarz
             </button>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold mb-6 dark:text-white">Zadania na dziś</h3>
            <div className="space-y-3">
              {tasks.slice(0, 4).map(task => (
                <div 
                  key={task.id} 
                  onClick={() => setSelectedTask(task)}
                  className="flex items-start gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-all cursor-pointer group"
                >
                  <div className="mt-0.5">
                    {task.completed ? (
                      <CheckCircle2 size={20} className="text-primary-500" />
                    ) : (
                      <Circle size={20} className="text-slate-200 group-hover:text-primary-300 transition-colors" />
                    )}
                  </div>
                  <span className={`text-sm font-medium leading-tight ${task.completed ? 'text-slate-300 line-through italic' : 'text-slate-700 dark:text-slate-300'}`}>
                    {task.title}
                  </span>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3 border-2 border-dashed border-slate-100 dark:border-slate-800 text-slate-400 rounded-2xl text-xs font-bold hover:border-primary-200 hover:text-primary-500 transition-all">
              + Nowe zadanie
            </button>
          </div>
        </div>
      </div>

      {/* AI HINT MODAL */}
      {selectedAIHint && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[40px] shadow-2xl border border-slate-100 dark:border-slate-800 p-8 flex flex-col gap-6">
            <div className="flex justify-between items-start">
               <div className={`${selectedAIHint.iconColor} p-3 rounded-2xl shadow-lg`}>
                  {selectedAIHint.icon}
               </div>
               <button onClick={() => setSelectedAIHint(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all text-slate-400">
                  <X size={20} />
               </button>
            </div>
            <div>
               <h3 className="text-2xl font-black dark:text-white mb-2">{selectedAIHint.title}</h3>
               <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {selectedAIHint.details}
               </p>
            </div>
            <div className="space-y-3 pt-4 border-t border-slate-50 dark:border-slate-800">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Rekomendowane akcje</p>
               {selectedAIHint.actions.map((action: string, idx: number) => (
                  <button key={idx} className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 hover:bg-primary-600 hover:text-white rounded-2xl text-sm font-bold transition-all group">
                     {action}
                     <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
               ))}
            </div>
          </div>
        </div>
      )}

      {/* TASK MODAL */}
      {selectedTask && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[40px] shadow-2xl border border-slate-100 dark:border-slate-800 p-10 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center text-primary-600 mb-6">
               <HelpCircle size={48} />
            </div>
            <h3 className="text-xl font-black dark:text-white mb-2">{selectedTask.title}</h3>
            <p className="text-slate-500 mb-8">Czy to zadanie zostało pomyślnie wykonane?</p>
            
            <div className="grid grid-cols-2 gap-4 w-full">
               <button 
                onClick={() => toggleTaskStatus(selectedTask.id, true)}
                className="flex items-center justify-center gap-2 p-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
               >
                 <Check size={20} />
                 Tak, gotowe
               </button>
               <button 
                onClick={() => toggleTaskStatus(selectedTask.id, false)}
                className="flex items-center justify-center gap-2 p-4 bg-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-700 transition-all shadow-lg shadow-rose-100"
               >
                 <X size={20} />
                 Nie, nadal trwa
               </button>
            </div>
            <button 
              onClick={() => setSelectedTask(null)}
              className="mt-6 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-600"
            >
              Anuluj
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
