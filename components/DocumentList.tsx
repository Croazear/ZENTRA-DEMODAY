
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, Download, FileText, Eye, UserPlus, X, Sparkles, Share2, 
  ExternalLink, ArrowUpRight, ArrowDownRight, Landmark, CreditCard, 
  Receipt, FileSearch, Copy, ChevronDown, Check, Building2, Mail, 
  Zap, ShieldCheck, FileCheck, Briefcase, User, Send, CheckCircle2,
  UploadCloud, Loader2, Calendar, File, Clock
} from 'lucide-react';
import { MOCK_DOCUMENTS } from '../mockData';
import { Document } from '../types';

interface DocumentListProps {
  initialSelectedId?: string | null;
}

interface ShareUser {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

const MOCK_SHARE_USERS: ShareUser[] = [
  { id: '1', name: 'Anna Księgowa', role: 'Księgowość zewnętrzna', avatar: 'https://picsum.photos/100/100?seed=anna' },
  { id: '2', name: 'Marek Wspólnik', role: 'Zarząd', avatar: 'https://picsum.photos/100/100?seed=marek' },
  { id: '3', name: 'Jan Prawnik', role: 'Obsługa prawna', avatar: 'https://picsum.photos/100/100?seed=jan' },
  { id: '4', name: 'Biuro Bilans', role: 'Biuro Rachunkowe', avatar: 'https://picsum.photos/100/100?seed=bilans' },
  { id: '5', name: 'Krzysztof Nowak', role: 'Doradca Podatkowy', avatar: 'https://picsum.photos/100/100?seed=krzysztof' },
];

const DocumentList: React.FC<DocumentListProps> = ({ initialSelectedId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [selectedContractor, setSelectedContractor] = useState<string>('all');
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  // Share Modal State
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [sharedUsers, setSharedUsers] = useState<string[]>([]);

  // Upload Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [newDocData, setNewDocData] = useState<Partial<Document>>({
    id: '',
    contractor: '',
    amountGross: 0,
    amountNet: 0,
    date: '',
    dueDate: '',
    type: 'Faktura',
    category: 'Koszt',
    source: 'Email'
  });

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialSelectedId) {
      const doc = MOCK_DOCUMENTS.find(d => d.id === initialSelectedId);
      if (doc) setSelectedDoc(doc);
    }
  }, [initialSelectedId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const uniqueContractors = useMemo(() => {
    const contractors = MOCK_DOCUMENTS.map(d => d.contractor);
    return Array.from(new Set(contractors)).sort();
  }, []);

  const filteredDocs = useMemo(() => {
    return MOCK_DOCUMENTS.filter(doc => {
      const matchesSearch = doc.contractor.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           doc.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'all' || doc.type === selectedType;
      const matchesSource = selectedSource === 'all' || doc.source === selectedSource;
      const matchesContractor = selectedContractor === 'all' || doc.contractor === selectedContractor;

      return matchesSearch && matchesType && matchesSource && matchesContractor;
    });
  }, [searchTerm, selectedType, selectedSource, selectedContractor]);

  const filteredUsers = useMemo(() => {
    return MOCK_SHARE_USERS.filter(user => 
      user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(userSearchTerm.toLowerCase())
    );
  }, [userSearchTerm]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedType('all');
    setSelectedSource('all');
    setSelectedContractor('all');
    setActiveDropdown(null);
  };

  const handleShareWithUser = (userId: string) => {
    if (!sharedUsers.includes(userId)) {
      setSharedUsers([...sharedUsers, userId]);
    } else {
      setSharedUsers(sharedUsers.filter(id => id !== userId));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      simulateAIAnalysis();
    }
  };

  const simulateAIAnalysis = () => {
    setIsAnalyzing(true);
    // Simulate AI processing time
    setTimeout(() => {
      setNewDocData({
        id: 'FV/2024/05/123',
        contractor: 'Google Cloud Poland',
        amountGross: 524.30,
        amountNet: 426.26,
        date: '2024-05-15',
        dueDate: '2024-05-29',
        type: 'Faktura',
        category: 'Koszt',
        source: 'Email'
      });
      setIsAnalyzing(false);
    }, 2500);
  };

  const typeOptions = [
    { id: 'all', label: 'Wszystkie rodzaje', icon: <FileSearch size={16} /> },
    { id: 'Faktura', label: 'Faktura', icon: <FileText size={16} /> },
    { id: 'Rachunek', label: 'Rachunek', icon: <CreditCard size={16} /> },
    { id: 'Pismo urzędowe', label: 'Pismo urzędowe', icon: <Landmark size={16} /> },
  ];

  const sourceOptions = [
    { id: 'all', label: 'Wszystkie źródła', icon: <Share2 size={16} /> },
    { id: 'KSeF', label: 'KSeF (Krajowy System)', icon: <Zap size={16} className="text-amber-500" /> },
    { id: 'e-Doręczenia', label: 'e-Doręczenia', icon: <ShieldCheck size={16} className="text-emerald-500" /> },
    { id: 'Email', label: 'Email / Outlook', icon: <Mail size={16} className="text-blue-500" /> },
  ];

  const CustomDropdown = ({ label, value, options, onSelect, isOpen, onToggle }: any) => {
    const selectedOption = options.find((o: any) => o.id === value) || options[0];
    
    return (
      <div className="relative w-full">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">{label}</label>
        <button
          onClick={onToggle}
          className={`w-full flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 transition-all text-sm font-bold ${
            isOpen ? 'border-primary-500 ring-4 ring-primary-500/5 bg-white dark:bg-slate-900' : 'border-transparent hover:bg-slate-100 dark:hover:bg-slate-700/50'
          }`}
        >
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
            {selectedOption.icon}
            <span className="truncate">{selectedOption.label}</span>
          </div>
          <ChevronDown size={18} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[28px] shadow-2xl z-[50] overflow-hidden py-2 animate-in fade-in zoom-in-95 duration-200">
            {options.map((option: any) => (
              <button
                key={option.id}
                onClick={() => {
                  onSelect(option.id);
                  onToggle();
                }}
                className={`w-full flex items-center justify-between px-5 py-3.5 text-sm font-bold transition-colors ${
                  value === option.id 
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${value === option.id ? 'bg-primary-100 text-primary-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                    {option.icon}
                  </div>
                  <span>{option.label}</span>
                </div>
                {value === option.id && <Check size={16} />}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Opłacone': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'Nieopłacone': return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400';
      case 'Oczekuje': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6" ref={dropdownRef}>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black dark:text-white tracking-tight">Twoje Dokumenty</h1>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsUploadModalOpen(true)}
            className="bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 px-6 py-2.5 rounded-2xl font-bold text-sm border border-slate-100 dark:border-slate-800 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
          >
            <FileCheck size={18} />
            Wgraj nowy
          </button>
          <button className="bg-primary-600 text-white px-6 py-2.5 rounded-2xl font-bold text-sm shadow-lg shadow-primary-200 dark:shadow-none hover:bg-primary-700 transition-all flex items-center gap-2">
            <Download size={18} />
            Eksportuj (.xlsx)
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm space-y-8">
        <div className="flex flex-col md:flex-row gap-6 items-end">
          <div className="flex-1 w-full space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Wyszukaj szybko</label>
            <div className="relative">
              <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="NIP, numer faktury lub nazwa firmy..." 
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none focus:ring-2 focus:ring-primary-500 transition-all text-sm dark:text-white font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <button 
            onClick={resetFilters}
            className="h-12 px-6 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 transition-colors border border-transparent hover:border-rose-100 shrink-0"
          >
            Reset filtrów
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CustomDropdown 
            label="Rodzaj dokumentu"
            value={selectedType}
            options={typeOptions}
            onSelect={setSelectedType}
            isOpen={activeDropdown === 'type'}
            onToggle={() => setActiveDropdown(activeDropdown === 'type' ? null : 'type')}
          />

          <CustomDropdown 
            label="Źródło dokumentu"
            value={selectedSource}
            options={sourceOptions}
            onSelect={setSelectedSource}
            isOpen={activeDropdown === 'source'}
            onToggle={() => setActiveDropdown(activeDropdown === 'source' ? null : 'source')}
          />

          <CustomDropdown 
            label="Kontrahent"
            value={selectedContractor}
            options={[
              { id: 'all', label: 'Wszyscy kontrahenci', icon: <Briefcase size={16} /> },
              ...uniqueContractors.map(name => ({ id: name, label: name, icon: <Building2 size={16} /> }))
            ]}
            onSelect={setSelectedContractor}
            isOpen={activeDropdown === 'contractor'}
            onToggle={() => setActiveDropdown(activeDropdown === 'contractor' ? null : 'contractor')}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden min-h-[400px]">
        {filteredDocs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  <th className="px-10 py-6">Podmiot / ID</th>
                  <th className="px-6 py-6 text-center">Źródło</th>
                  <th className="px-6 py-6">Data</th>
                  <th className="px-6 py-6">Status płatności</th>
                  <th className="px-6 py-6">Brutto</th>
                  <th className="px-10 py-6 text-right">Akcja</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredDocs.map(doc => (
                  <tr 
                    key={doc.id} 
                    onClick={() => setSelectedDoc(doc)}
                    className="cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 group"
                  >
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-5">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                          doc.category === 'Koszt' ? 'bg-rose-50 text-rose-500' : 
                          doc.category === 'Przychód' ? 'bg-emerald-50 text-emerald-500' : 
                          'bg-blue-50 text-blue-500'
                        }`}>
                          {doc.category === 'Koszt' ? <ArrowDownRight size={22} /> : doc.category === 'Przychód' ? <ArrowUpRight size={22} /> : <Landmark size={22} />}
                        </div>
                        <div>
                          <p className="font-black text-slate-800 dark:text-slate-100 group-hover:text-primary-600 transition-colors">{doc.contractor}</p>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5 tracking-wider uppercase">{doc.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-center">
                       <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-widest ${
                        doc.source === 'KSeF' ? 'border-purple-200 text-purple-700 bg-purple-50' : 
                        doc.source === 'Email' ? 'border-blue-200 text-blue-700 bg-blue-50' : 
                        'border-green-200 text-green-700 bg-green-50'
                      }`}>
                         {doc.source === 'KSeF' && <Zap size={10} />}
                         {doc.source === 'Email' && <Mail size={10} />}
                         {doc.source === 'e-Doręczenia' && <ShieldCheck size={10} />}
                         {doc.source}
                       </div>
                    </td>
                    <td className="px-6 py-6">
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-black">{doc.date}</p>
                    </td>
                    <td className="px-6 py-6">
                      <span className={`text-[10px] font-black uppercase tracking-[0.1em] px-4 py-2 rounded-xl whitespace-nowrap shadow-sm ${getStatusStyle(doc.status)}`}>
                        {doc.status}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <p className="text-sm font-black text-slate-900 dark:text-white">
                        {doc.amountGross > 0 ? `${doc.amountGross.toFixed(2)} PLN` : '---'}
                      </p>
                    </td>
                    <td className="px-10 py-6 text-right">
                       <div className="flex justify-end gap-2">
                          <button className="p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-400 hover:text-primary-600 rounded-xl transition-all shadow-sm">
                            <Eye size={18} />
                          </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[500px] text-center p-8">
            <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-[40px] flex items-center justify-center text-slate-300 mb-8 animate-pulse">
              <FileSearch size={48} />
            </div>
            <h3 className="text-2xl font-black dark:text-white mb-3 tracking-tight">Cisza w archiwum...</h3>
            <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">Wygląda na to, że żadne dokumenty nie pasują do Twoich filtrów. Spróbuj poszerzyć zakres poszukiwań.</p>
            <button 
              onClick={resetFilters}
              className="mt-8 bg-primary-600 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary-700 transition-all shadow-lg shadow-primary-100"
            >
              Resetuj wszystko
            </button>
          </div>
        )}
      </div>

      {/* DOCUMENT MODAL */}
      {selectedDoc && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-5xl rounded-[50px] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95">
            <div className="p-10 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
               <div className="flex items-center gap-6">
                  <div className={`p-5 rounded-[24px] shadow-xl ${
                    selectedDoc.category === 'Koszt' ? 'bg-rose-100 text-rose-600' :
                    selectedDoc.category === 'Przychód' ? 'bg-emerald-100 text-emerald-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {selectedDoc.category === 'Koszt' ? <ArrowDownRight size={32} /> : selectedDoc.category === 'Przychód' ? <ArrowUpRight size={32} /> : <Landmark size={32} />}
                  </div>
                  <div>
                    <h3 className="font-black text-3xl dark:text-white tracking-tight leading-none mb-2">{selectedDoc.contractor}</h3>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-slate-400 tracking-wider font-bold">{selectedDoc.id}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                      <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-lg ${getStatusStyle(selectedDoc.status)}`}>
                        {selectedDoc.status}
                      </span>
                    </div>
                  </div>
               </div>
               <button onClick={() => setSelectedDoc(null)} className="p-4 hover:bg-white dark:hover:bg-slate-800 rounded-3xl text-slate-400 transition-all border border-transparent hover:border-slate-100 shadow-sm">
                 <X size={28} />
               </button>
            </div>

            <div className="flex-1 overflow-y-auto p-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-7 space-y-10">
                <div className="bg-primary-600 p-8 rounded-[40px] text-white relative overflow-hidden shadow-2xl shadow-primary-200 dark:shadow-none">
                   <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                   <div className="flex items-center gap-3 mb-4">
                      <Sparkles size={20} className="text-primary-200" />
                      <h4 className="font-black text-xs uppercase tracking-[0.2em] text-primary-100">Inteligentna Analiza AI</h4>
                   </div>
                   <p className="text-lg font-medium leading-relaxed italic">
                     "{selectedDoc.aiSummary || "Przetwarzanie dokumentu przez silnik Gemini..."}"
                   </p>
                </div>

                <div className="grid grid-cols-2 gap-8">
                   <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[30px] border border-slate-100 dark:border-slate-700">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Kwota Brutto</p>
                      <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{selectedDoc.amountGross.toFixed(2)} PLN</p>
                   </div>
                   <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[30px] border border-slate-100 dark:border-slate-700">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Termin płatności</p>
                      <p className={`text-3xl font-black tracking-tight ${selectedDoc.status === 'Nieopłacone' ? 'text-rose-600' : 'text-slate-900 dark:text-white'}`}>
                        {selectedDoc.dueDate}
                      </p>
                   </div>
                </div>

                <div className="space-y-4">
                   <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Historia dokumentu</h4>
                   <div className="space-y-3">
                      <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl">
                         <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center"><Check size={20} /></div>
                         <div>
                            <p className="text-sm font-bold dark:text-white">Dokument pobrany z {selectedDoc.source}</p>
                            <p className="text-[10px] text-slate-400">{selectedDoc.date}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl opacity-50">
                         <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center"><Mail size={20} /></div>
                         <div>
                            <p className="text-sm font-bold dark:text-white">Wysłano potwierdzenie do kontrahenta</p>
                            <p className="text-[10px] text-slate-400">---</p>
                         </div>
                      </div>
                   </div>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-8">
                 <div className="aspect-[3/4] bg-slate-100 dark:bg-slate-800 rounded-[40px] flex items-center justify-center relative border-4 border-white dark:border-slate-700 shadow-2xl overflow-hidden group">
                    <FileText size={100} className="text-slate-300 transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-8 gap-4">
                       <button className="bg-white text-slate-950 px-10 py-4 rounded-[20px] font-black text-xs uppercase tracking-widest shadow-2xl flex items-center gap-3 hover:scale-105 transition-transform">
                         Pełny podgląd
                         <ExternalLink size={20} />
                       </button>
                    </div>
                 </div>

                 <div className="flex flex-col gap-4">
                    <button className="w-full py-5 bg-slate-950 text-white dark:bg-white dark:text-slate-950 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-3 transition-transform hover:scale-[1.02]">
                       <Download size={20} />
                       Pobierz Oryginał
                    </button>
                    <div className="grid grid-cols-2 gap-4">
                       <button 
                        onClick={() => setIsShareModalOpen(true)}
                        className="py-4 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-200 rounded-[24px] font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 border border-slate-100 dark:border-slate-700 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-100 transition-all"
                       >
                          <Share2 size={16} />
                          Udostępnij
                       </button>
                       <button className="py-4 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-200 rounded-[24px] font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 border border-slate-100 dark:border-slate-700 hover:bg-slate-100 transition-all">
                          <Copy size={16} />
                          Kopiuj
                       </button>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SHARE MODAL */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[40px] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col animate-in zoom-in-95">
            <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center shadow-sm">
                    <UserPlus size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black dark:text-white tracking-tight leading-none mb-1">Udostępnij</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Wybierz odbiorców dokumentu</p>
                  </div>
               </div>
               <button onClick={() => setIsShareModalOpen(false)} className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-xl text-slate-400 transition-all">
                 <X size={20} />
               </button>
            </div>

            <div className="p-8 space-y-6">
               <div className="relative">
                 <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
                 <input 
                   type="text" 
                   placeholder="Szukaj użytkownika lub roli..." 
                   className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none focus:ring-2 focus:ring-primary-500 transition-all text-sm dark:text-white font-medium shadow-inner"
                   value={userSearchTerm}
                   onChange={(e) => setUserSearchTerm(e.target.value)}
                 />
               </div>

               <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map(user => (
                      <div 
                        key={user.id} 
                        className="flex items-center justify-between p-3 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-50 dark:border-slate-800 hover:border-primary-100 transition-all group"
                      >
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-white dark:border-slate-700 shadow-sm">
                               <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                               <p className="text-sm font-black text-slate-800 dark:text-slate-100">{user.name}</p>
                               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{user.role}</p>
                            </div>
                         </div>
                         
                         <button 
                           onClick={() => handleShareWithUser(user.id)}
                           className={`p-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
                             sharedUsers.includes(user.id) 
                              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' 
                              : 'bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-primary-600 hover:bg-primary-50'
                           }`}
                         >
                            {sharedUsers.includes(user.id) ? (
                              <CheckCircle2 size={18} />
                            ) : (
                              <Send size={18} />
                            )}
                         </button>
                      </div>
                    ))
                  ) : (
                    <div className="py-10 text-center">
                       <User size={32} className="mx-auto text-slate-200 mb-2" />
                       <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nie znaleziono użytkownika</p>
                    </div>
                  )}
               </div>

               <div className="pt-4 border-t border-slate-50 dark:border-slate-800 flex gap-4">
                  <button 
                    onClick={() => setIsShareModalOpen(false)}
                    className="flex-1 py-3.5 bg-slate-50 dark:bg-slate-800 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all"
                  >
                    Zamknij
                  </button>
                  <button 
                    onClick={() => {
                      // Mock successful share action
                      setIsShareModalOpen(false);
                      setUserSearchTerm('');
                    }}
                    className="flex-[2] py-3.5 bg-primary-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary-100 hover:bg-primary-700 transition-all flex items-center justify-center gap-2"
                  >
                    Gotowe
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD MODAL */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-[50px] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col animate-in zoom-in-95">
            <div className="p-10 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
               <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-primary-600 text-white rounded-[24px] flex items-center justify-center shadow-xl shadow-primary-100">
                    <UploadCloud size={32} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black dark:text-white tracking-tight leading-none mb-2">Dodaj Dokument</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Wgraj plik PDF/IMG, a asystent AI go przeanalizuje</p>
                  </div>
               </div>
               <button onClick={() => setIsUploadModalOpen(false)} className="p-4 hover:bg-white dark:hover:bg-slate-800 rounded-3xl text-slate-400 transition-all border border-transparent hover:border-slate-100 shadow-sm">
                 <X size={28} />
               </button>
            </div>

            <div className="p-12 space-y-10 overflow-y-auto max-h-[70vh]">
               {!uploadedFile ? (
                 <div className="relative group">
                    <input 
                      type="file" 
                      accept=".pdf,.png,.jpg,.jpeg" 
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-[40px] p-20 flex flex-col items-center justify-center gap-6 group-hover:bg-primary-50/30 dark:group-hover:bg-primary-900/5 group-hover:border-primary-200 transition-all">
                       <div className="w-24 h-24 bg-primary-50 dark:bg-primary-900/20 text-primary-500 rounded-full flex items-center justify-center animate-bounce">
                          <File size={48} />
                       </div>
                       <div className="text-center">
                          <p className="text-xl font-black text-slate-800 dark:text-slate-100">Przeciągnij dokument tutaj</p>
                          <p className="text-sm text-slate-400 font-medium mt-1">lub kliknij aby wybrać plik z komputera</p>
                       </div>
                       <div className="mt-4 flex gap-3">
                          <span className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400">PDF</span>
                          <span className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400">JPG / PNG</span>
                       </div>
                    </div>
                 </div>
               ) : (
                 <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4">
                    {isAnalyzing ? (
                      <div className="bg-primary-50 dark:bg-primary-900/10 p-12 rounded-[40px] flex flex-col items-center justify-center text-center gap-6 border border-primary-100 dark:border-primary-800 overflow-hidden relative">
                         <div className="absolute inset-0 overflow-hidden">
                            <div className="w-full h-1 bg-primary-100/50 relative">
                               <div className="absolute h-full bg-primary-500 animate-[loading_2s_infinite]"></div>
                            </div>
                         </div>
                         <Loader2 size={64} className="text-primary-600 animate-spin" />
                         <div>
                            <h4 className="text-2xl font-black text-primary-900 dark:text-primary-100">Analizowanie dokumentu...</h4>
                            <p className="text-sm text-primary-600/70 font-medium mt-2">Silnik FirmaAI OCR ekstrahuje dane o kontrahencie i kwotach</p>
                         </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-8">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kontrahent</label>
                              <div className="relative">
                                 <Building2 className="absolute left-4 top-4 text-primary-500" size={18} />
                                 <input 
                                   type="text" 
                                   value={newDocData.contractor}
                                   onChange={(e) => setNewDocData({...newDocData, contractor: e.target.value})}
                                   className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none focus:ring-2 focus:ring-primary-500 text-sm font-bold dark:text-white"
                                 />
                              </div>
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Numer Dokumentu</label>
                              <div className="relative">
                                 <FileText className="absolute left-4 top-4 text-slate-400" size={18} />
                                 <input 
                                   type="text" 
                                   value={newDocData.id}
                                   onChange={(e) => setNewDocData({...newDocData, id: e.target.value})}
                                   className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none focus:ring-2 focus:ring-primary-500 text-sm font-bold dark:text-white"
                                 />
                              </div>
                           </div>
                           <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kwota Netto</label>
                                 <div className="relative">
                                    <span className="absolute left-4 top-4 text-slate-400 font-bold text-sm">PLN</span>
                                    <input 
                                      type="number" 
                                      value={newDocData.amountNet}
                                      onChange={(e) => setNewDocData({...newDocData, amountNet: parseFloat(e.target.value)})}
                                      className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none focus:ring-2 focus:ring-primary-500 text-sm font-bold dark:text-white"
                                    />
                                 </div>
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kwota Brutto</label>
                                 <div className="relative">
                                    <span className="absolute left-4 top-4 text-primary-500 font-bold text-sm">PLN</span>
                                    <input 
                                      type="number" 
                                      value={newDocData.amountGross}
                                      onChange={(e) => setNewDocData({...newDocData, amountGross: parseFloat(e.target.value)})}
                                      className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none focus:ring-2 focus:ring-primary-500 text-sm font-bold dark:text-white"
                                    />
                                 </div>
                              </div>
                           </div>
                        </div>

                        <div className="space-y-8">
                           <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Data Wystawienia</label>
                                 <div className="relative">
                                    <Calendar className="absolute left-4 top-4 text-slate-400" size={18} />
                                    <input 
                                      type="date" 
                                      value={newDocData.date}
                                      onChange={(e) => setNewDocData({...newDocData, date: e.target.value})}
                                      className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none focus:ring-2 focus:ring-primary-500 text-sm font-bold dark:text-white"
                                    />
                                 </div>
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Termin Płatności</label>
                                 <div className="relative">
                                    <Clock className="absolute left-4 top-4 text-slate-400" size={18} />
                                    <input 
                                      type="date" 
                                      value={newDocData.dueDate}
                                      onChange={(e) => setNewDocData({...newDocData, dueDate: e.target.value})}
                                      className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none focus:ring-2 focus:ring-primary-500 text-sm font-bold dark:text-white"
                                    />
                                 </div>
                              </div>
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Rodzaj i Źródło</label>
                              <div className="grid grid-cols-2 gap-4">
                                 <select 
                                   value={newDocData.type}
                                   onChange={(e) => setNewDocData({...newDocData, type: e.target.value as any})}
                                   className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none focus:ring-2 focus:ring-primary-500 text-sm font-bold dark:text-white appearance-none"
                                 >
                                    <option value="Faktura">Faktura</option>
                                    <option value="Rachunek">Rachunek</option>
                                    <option value="Pismo urzędowe">Pismo urzędowe</option>
                                 </select>
                                 <select 
                                   value={newDocData.source}
                                   onChange={(e) => setNewDocData({...newDocData, source: e.target.value as any})}
                                   className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none focus:ring-2 focus:ring-primary-500 text-sm font-bold dark:text-white appearance-none"
                                 >
                                    <option value="Email">Email</option>
                                    <option value="KSeF">KSeF</option>
                                    <option value="e-Doręczenia">e-Doręczenia</option>
                                 </select>
                              </div>
                           </div>
                           <div className="p-6 bg-primary-600 rounded-[30px] text-white flex items-center gap-4 shadow-xl">
                              <Sparkles size={24} className="text-primary-200 shrink-0" />
                              <p className="text-xs font-medium leading-relaxed">
                                Dane zostały poprawnie rozpoznane przez AI. Możesz je teraz zweryfikować i zapisać w systemie.
                              </p>
                           </div>
                        </div>
                      </div>
                    )}
                 </div>
               )}

               <div className="pt-8 border-t border-slate-50 dark:border-slate-800 flex gap-6">
                  <button 
                    onClick={() => {
                      setIsUploadModalOpen(false);
                      setUploadedFile(null);
                    }}
                    className="flex-1 py-5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-[24px] font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
                  >
                    Anuluj
                  </button>
                  <button 
                    disabled={!uploadedFile || isAnalyzing}
                    onClick={() => {
                      // Mock save action
                      setIsUploadModalOpen(false);
                      setUploadedFile(null);
                    }}
                    className="flex-[2] py-5 bg-primary-600 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary-200 hover:bg-primary-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    <CheckCircle2 size={24} />
                    Zatwierdź i Dodaj
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes loading {
          0% { left: -100%; width: 100%; }
          100% { left: 100%; width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default DocumentList;
