
import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  Filter,
  CheckCircle2,
  AlertCircle,
  X,
  Check,
  Tag,
  AlertTriangle,
  Users,
  CreditCard,
  Briefcase,
  Landmark,
  Receipt,
  Sparkles,
  Edit3,
  Trash2,
  Bot,
  ExternalLink
} from 'lucide-react';
import { MOCK_COMPANY_DATA } from '../mockData';

interface CalendarViewProps {
  initialDay?: number | null;
}

interface CalendarEvent {
  id: string;
  title: string;
  type: 'zus' | 'tax' | 'meeting' | 'payment' | 'hr';
  time: string;
  priority: 'high' | 'medium' | 'low';
  description?: string;
  status?: 'pending' | 'completed';
}

const CATEGORIES = [
  { id: 'zus', label: 'ZUS', color: 'bg-orange-400', textColor: 'text-orange-600', bgColor: 'bg-orange-50' },
  { id: 'tax', label: 'Podatki', color: 'bg-red-400', textColor: 'text-red-600', bgColor: 'bg-red-50' },
  { id: 'meeting', label: 'Spotkania', color: 'bg-blue-400', textColor: 'text-blue-600', bgColor: 'bg-blue-50' },
  { id: 'payment', label: 'Płatności', color: 'bg-emerald-400', textColor: 'text-emerald-600', bgColor: 'bg-emerald-50' },
  { id: 'hr', label: 'Kadry', color: 'bg-purple-400', textColor: 'text-purple-600', bgColor: 'bg-purple-50' },
];

const CalendarView: React.FC<CalendarViewProps> = ({ initialDay }) => {
  const [selectedDay, setSelectedDay] = useState<number | null>(initialDay || 20);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>(['zus', 'tax', 'meeting', 'payment', 'hr']);
  const [eventToManage, setEventToManage] = useState<CalendarEvent | null>(null);
  
  const filterRef = useRef<HTMLDivElement>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialDay) setSelectedDay(initialDay);
  }, [initialDay]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsDatePickerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  const weekDays = ['Pon', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'];

  const [allEvents, setAllEvents] = useState<Record<number, CalendarEvent[]>>({
    5: [{ id: '1', title: 'Termin płatności Faktura A', type: 'payment', time: '23:59', priority: 'medium', status: 'pending' }],
    10: [{ id: '2', title: 'ZUS Adam Kowalski', type: 'zus', time: '09:00', priority: 'high', status: 'pending' }],
    12: [{ id: '3', title: 'Rozmowa kwalifikacyjna', type: 'hr', time: '11:00', priority: 'medium', status: 'pending' }],
    15: [{ id: '4', title: 'ZUS Spółki', type: 'zus', time: '09:00', priority: 'high', status: 'pending' }],
    20: [
      { id: '5', title: 'Podatek PIT-4R', type: 'tax', time: '10:00', priority: 'high', status: 'pending', description: 'Zaliczka na podatek dochodowy od wypłaconych wynagrodzeń pracowników.' },
      { id: '6', title: 'Spotkanie z księgową', type: 'meeting', time: '14:30', priority: 'medium', status: 'pending' }
    ],
    25: [{ id: '7', title: 'VAT-7 / JPK_V7M', type: 'tax', time: '12:00', priority: 'high', status: 'pending' }],
    28: [{ id: '8', title: 'Wypłaty pracowników', type: 'hr', time: '10:00', priority: 'high', status: 'pending' }],
  });

  const handleToggleFilter = (catId: string) => {
    setActiveFilters(prev => 
      prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]
    );
  };

  const getFilteredEvents = (day: number) => {
    return (allEvents[day] || []).filter(ev => activeFilters.includes(ev.type));
  };

  const openManageModal = (ev: CalendarEvent) => {
    setEventToManage(ev);
    setIsManageModalOpen(true);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] gap-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black dark:text-white tracking-tight">Kalendarz Biznesowy</h1>
        <div className="flex gap-3 relative" ref={filterRef}>
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border ${
              isFilterOpen 
                ? 'bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-200' 
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-primary-400'
            }`}
          >
            <Filter size={16} />
            Filtruj ({activeFilters.length})
          </button>
          
          {isFilterOpen && (
            <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[30px] shadow-2xl z-50 p-6 animate-in slide-in-from-top-2 duration-200">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Kategorie</h4>
               <div className="space-y-2">
                 {CATEGORIES.map(cat => (
                   <button 
                    key={cat.id}
                    onClick={() => handleToggleFilter(cat.id)}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                   >
                     <div className="flex items-center gap-3">
                       <div className={`w-3 h-3 rounded-full ${cat.color}`}></div>
                       <span className={`text-xs font-bold ${activeFilters.includes(cat.id) ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>{cat.label}</span>
                     </div>
                     {activeFilters.includes(cat.id) && <Check size={14} className="text-primary-600" />}
                   </button>
                 ))}
               </div>
               <button 
                onClick={() => setActiveFilters(CATEGORIES.map(c => c.id))}
                className="w-full mt-4 pt-4 border-t border-slate-50 dark:border-slate-800 text-[10px] font-black text-primary-600 uppercase tracking-widest text-center"
               >
                 Włącz wszystkie
               </button>
            </div>
          )}

          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-primary-600 text-white px-6 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-primary-200 dark:shadow-none hover:bg-primary-700 transition-all"
          >
            <Plus size={18} />
            Dodaj przypomnienie
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-8 overflow-hidden">
        {/* Large Calendar Grid */}
        <div className="flex-1 bg-white dark:bg-slate-900 rounded-[45px] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden">
          <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
             <div className="flex items-center gap-6">
                <h2 className="text-2xl font-black dark:text-white">Maj 2024</h2>
                <div className="flex gap-2 bg-slate-50 dark:bg-slate-800 p-1 rounded-xl border border-slate-100 dark:border-slate-700">
                   <button className="p-1.5 hover:bg-white dark:hover:bg-slate-900 rounded-lg transition-all shadow-sm"><ChevronLeft size={20} /></button>
                   <button className="p-1.5 hover:bg-white dark:hover:bg-slate-900 rounded-lg transition-all shadow-sm"><ChevronRight size={20} /></button>
                </div>
             </div>
             
             <div className="flex flex-wrap gap-4">
                {CATEGORIES.map(cat => (
                  <div key={cat.id} className="flex items-center gap-2">
                     <div className={`w-2 h-2 rounded-full ${cat.color}`}></div>
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{cat.label}</span>
                  </div>
                ))}
             </div>
          </div>

          <div className="flex-1 grid grid-cols-7 border-collapse">
            {weekDays.map(d => (
              <div key={d} className="p-4 text-center text-[10px] font-black text-slate-300 uppercase border-b border-slate-50 dark:border-slate-800">{d}</div>
            ))}
            <div className="border-r border-b border-slate-50 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-800/10"></div>
            <div className="border-r border-b border-slate-50 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-800/10"></div>

            {daysInMonth.map(day => {
              const dayEvents = getFilteredEvents(day);
              const isSelected = selectedDay === day;
              return (
                <div 
                  key={day} 
                  onClick={() => setSelectedDay(day)}
                  className={`p-3 border-r border-b border-slate-50 dark:border-slate-800 min-h-[110px] cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 group ${isSelected ? 'bg-primary-50/20 dark:bg-primary-900/10 ring-2 ring-inset ring-primary-500/20' : ''}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-xs font-black ${isSelected ? 'text-primary-600' : 'text-slate-400'}`}>{day}</span>
                    {dayEvents.length > 0 && <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"></div>}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.map((ev) => {
                      const cat = CATEGORIES.find(c => c.id === ev.type);
                      return (
                        <div 
                          key={ev.id} 
                          className={`text-[9px] p-1.5 rounded-lg font-black truncate shadow-sm border border-transparent group-hover:border-current transition-all ${
                            ev.status === 'completed' ? 'bg-slate-100 text-slate-400 line-through' : `${cat?.bgColor} ${cat?.textColor}`
                          }`}
                        >
                          {ev.title}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Day Details Panel */}
        <div className="w-[400px] flex flex-col gap-6 overflow-y-auto pr-2">
           <div className="bg-white dark:bg-slate-900 p-8 rounded-[45px] border border-slate-100 dark:border-slate-800 shadow-sm flex-1 flex flex-col">
              <div className="mb-10 text-center">
                <p className="text-[10px] font-black text-primary-600 uppercase tracking-[0.3em] mb-2">Szczegóły Dnia</p>
                <h3 className="text-3xl font-black dark:text-white">{selectedDay} Maja 2024</h3>
              </div>

              <div className="flex-1 space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Zaplanowane</h4>
                  <span className="text-[10px] font-bold bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-md text-slate-500">
                    {getFilteredEvents(selectedDay || 0).length} wydarzeń
                  </span>
                </div>

                <div className="space-y-4">
                {getFilteredEvents(selectedDay || 0).length > 0 ? (
                  getFilteredEvents(selectedDay || 0).map((ev) => {
                    const cat = CATEGORIES.find(c => c.id === ev.type);
                    return (
                      <div key={ev.id} className="group relative bg-slate-50 dark:bg-slate-800/40 p-5 rounded-[28px] border border-transparent hover:border-primary-100 dark:hover:border-primary-900 transition-all hover:shadow-md">
                         <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-xl ${cat?.bgColor} ${cat?.textColor}`}>
                                {ev.type === 'zus' && <CreditCard size={16} />}
                                {ev.type === 'tax' && <Landmark size={16} />}
                                {ev.type === 'meeting' && <Users size={16} />}
                                {ev.type === 'payment' && <Receipt size={16} />}
                                {ev.type === 'hr' && <Briefcase size={16} />}
                              </div>
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{ev.time}</span>
                            </div>
                            {ev.priority === 'high' && (
                              <div className="flex items-center gap-1 text-[9px] font-black text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full uppercase">
                                <AlertTriangle size={10} />
                                Pilne
                              </div>
                            )}
                         </div>
                         <p className={`font-black text-slate-800 dark:text-slate-100 leading-tight ${ev.status === 'completed' ? 'line-through opacity-50' : ''}`}>{ev.title}</p>
                         <p className="text-[10px] text-slate-500 mt-2 font-medium">Kategoria: <span className="font-bold">{cat?.label}</span></p>
                         
                         <button 
                          onClick={() => openManageModal(ev)}
                          className="mt-4 w-full py-2 bg-white dark:bg-slate-800 rounded-xl text-[10px] font-black text-primary-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity border border-primary-50 shadow-sm"
                         >
                            Zarządzaj wydarzeniem
                         </button>
                      </div>
                    )
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                    <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-[35px] flex items-center justify-center text-slate-300">
                      <CalendarIcon size={32} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-400 tracking-tight">Dzień wolny od zadań</p>
                      <p className="text-[10px] text-slate-300 mt-1 uppercase tracking-widest font-black">Ciesz się spokojem</p>
                    </div>
                  </div>
                )}
                </div>
              </div>

              <div className="mt-10 pt-10 border-t border-slate-50 dark:border-slate-800">
                 <div className="bg-primary-600 p-6 rounded-[32px] text-white shadow-xl shadow-primary-100 dark:shadow-none relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform"></div>
                    <div className="flex gap-3 mb-3 items-center">
                       <Sparkles size={18} className="text-primary-200" />
                       <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-100">Analiza Kalendarza</p>
                    </div>
                    <p className="text-xs leading-relaxed font-medium">
                      W tym miesiącu Twoje obciążenie zadaniami rośnie o 15% w okolicach 20-go dnia. AI sugeruje przygotowanie dokumentów do VAT z 2-dniowym wyprzedzeniem.
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* ADD REMINDER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-[45px] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col animate-in zoom-in-95">
            <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center shadow-sm">
                    <Plus size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black dark:text-white tracking-tight leading-none mb-1">Nowe przypomnienie</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Dodaj do harmonogramu</p>
                  </div>
               </div>
               <button onClick={() => setIsAddModalOpen(false)} className="p-3 hover:bg-white dark:hover:bg-slate-800 rounded-2xl text-slate-400 transition-all border border-transparent hover:border-slate-100">
                 <X size={24} />
               </button>
            </div>

            <div className="p-10 space-y-8">
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tytuł wydarzenia</label>
                  <input 
                    type="text" 
                    placeholder="np. Zapłata faktury za leasing"
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none focus:ring-2 focus:ring-primary-500 text-sm font-bold dark:text-white"
                  />
               </div>

               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1.5 relative" ref={datePickerRef}>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Data</label>
                    <button 
                      onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                      className={`w-full flex items-center gap-4 px-5 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm font-bold dark:text-white transition-all border-2 ${isDatePickerOpen ? 'border-primary-500 ring-4 ring-primary-500/10' : 'border-transparent'}`}
                    >
                      <CalendarIcon className="text-slate-400" size={18} />
                      {selectedDay ? `${selectedDay} Maja 2024` : 'Wybierz datę'}
                    </button>
                    
                    {isDatePickerOpen && (
                      <div className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[30px] shadow-2xl z-50 p-4 animate-in slide-in-from-top-2">
                        <div className="grid grid-cols-7 gap-1">
                          {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                            <button 
                              key={d}
                              onClick={() => { setSelectedDay(d); setIsDatePickerOpen(false); }}
                              className={`w-full aspect-square rounded-xl text-xs font-bold transition-all ${selectedDay === d ? 'bg-primary-600 text-white shadow-lg' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
                            >
                              {d}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Godzina</label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-4.5 text-slate-400" size={18} />
                      <input 
                        type="time" 
                        defaultValue="09:00"
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none focus:ring-2 focus:ring-primary-500 text-sm font-bold dark:text-white"
                      />
                    </div>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kategoria</label>
                    <select className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none focus:ring-2 focus:ring-primary-500 text-sm font-bold dark:text-white appearance-none">
                      {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Priorytet</label>
                    <select className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none focus:ring-2 focus:ring-primary-500 text-sm font-bold dark:text-white appearance-none">
                      <option value="low">Niski</option>
                      <option value="medium">Średni</option>
                      <option value="high">Wysoki / PILNE</option>
                    </select>
                  </div>
               </div>

               <div className="pt-4 flex gap-4">
                  <button 
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
                  >
                    Anuluj
                  </button>
                  <button 
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-[2] py-4 bg-primary-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary-100 hover:bg-primary-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Check size={18} />
                    Zapamiętaj
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* MANAGE EVENT MODAL */}
      {isManageModalOpen && eventToManage && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[50px] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-300">
             <div className="p-10 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
               <div className="flex items-center gap-6">
                  <div className={`p-5 rounded-[24px] shadow-xl ${CATEGORIES.find(c => c.id === eventToManage.type)?.bgColor} ${CATEGORIES.find(c => c.id === eventToManage.type)?.textColor}`}>
                    {eventToManage.type === 'zus' && <CreditCard size={32} />}
                    {eventToManage.type === 'tax' && <Landmark size={32} />}
                    {eventToManage.type === 'meeting' && <Users size={32} />}
                    {eventToManage.type === 'payment' && <Receipt size={32} />}
                    {eventToManage.type === 'hr' && <Briefcase size={32} />}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black dark:text-white tracking-tight leading-none mb-2">{eventToManage.title}</h3>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
                        <Clock size={12} className="text-slate-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{eventToManage.time}</span>
                      </div>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                      <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${eventToManage.priority === 'high' ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-500'}`}>
                        {eventToManage.priority} Priority
                      </span>
                    </div>
                  </div>
               </div>
               <button onClick={() => setIsManageModalOpen(false)} className="p-4 hover:bg-white dark:hover:bg-slate-800 rounded-3xl text-slate-400 transition-all border border-transparent hover:border-slate-100 shadow-sm">
                 <X size={28} />
               </button>
             </div>

             <div className="p-12 space-y-10">
               <div className="bg-primary-50 dark:bg-primary-900/10 p-8 rounded-[40px] border border-primary-100 dark:border-primary-800 relative group overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/40 rounded-full blur-3xl"></div>
                  <div className="flex items-center gap-3 mb-4">
                    <Bot size={20} className="text-primary-600" />
                    <h4 className="font-black text-xs uppercase tracking-[0.2em] text-primary-900 dark:text-primary-100">Inteligentny Przewodnik AI</h4>
                  </div>
                  <p className="text-sm font-medium leading-relaxed italic text-slate-700 dark:text-slate-300">
                    "{eventToManage.type === 'tax' ? 'Pamiętaj o pobraniu potwierdzenia nadania przelewu. Urząd Skarbowy wymaga go w przypadku opóźnień systemowych.' : 'AI zaleca wysłanie agendy spotkania na 2h przed godziną rozpoczęcia.'}"
                  </p>
               </div>

               <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Szczegóły i opis</h4>
                  <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[30px] border border-slate-100 dark:border-slate-700">
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {eventToManage.description || 'Brak dodatkowego opisu dla tego wydarzenia. Kliknij edytuj, aby dodać notatki.'}
                    </p>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-50 dark:border-slate-800">
                  <button className="flex items-center justify-center gap-3 py-5 bg-emerald-600 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all">
                    <Check size={20} />
                    Oznacz jako ukończone
                  </button>
                  <div className="grid grid-cols-2 gap-4">
                    <button className="flex items-center justify-center gap-2 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-200 rounded-[24px] font-bold text-xs uppercase tracking-widest border border-slate-100 dark:border-slate-700 hover:bg-slate-100 transition-all">
                      <Edit3 size={18} />
                      Edytuj
                    </button>
                    <button className="flex items-center justify-center gap-2 bg-rose-50 text-rose-600 dark:bg-rose-900/20 rounded-[24px] font-bold text-xs uppercase tracking-widest border border-rose-100 dark:border-rose-900/50 hover:bg-rose-100 transition-all">
                      <Trash2 size={18} />
                      Usuń
                    </button>
                  </div>
               </div>
               
               <button className="w-full flex items-center justify-center gap-2 py-4 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-primary-600 transition-colors">
                  Pobierz do kalendarza (ICS)
                  <ExternalLink size={14} />
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
