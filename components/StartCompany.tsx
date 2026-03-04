
import React, { useState, useRef, useEffect } from 'react';
import { Bot, CheckCircle2, ChevronRight, Send, HelpCircle, FilePlus, Sparkles } from 'lucide-react';
import { getGeminiResponse } from '../services/geminiService';
import { Message } from '../types';

const StartCompany: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Cześć! Planujesz założyć firmę w Polsce? To świetna decyzja! \n\nPowiedz mi proszę: \n1. Czym będziesz się zajmować? \n2. Jakich przychodów spodziewasz się w pierwszym roku? \n3. Czy będziesz mieć dużo kosztów (np. auto, biuro)? \n\nPomogę Ci wybrać między Ryczałtem, Podatkiem Liniowym a Skalą.', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const steps = [
    { title: 'Wniosek CEIDG-1', desc: 'Rejestracja nazwy i PKD firmy', status: 'ready' },
    { title: 'Wybór formy opodatkowania', desc: 'Analiza Twoich przychodów przez AI', status: 'ai' },
    { title: 'Rejestracja VAT-R', desc: 'Zalecane dla usług B2B', status: 'todo' },
    { title: 'Konto firmowe', desc: 'Osobny rachunek dla płatności ZUS/US', status: 'todo' },
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg: Message = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    const aiResponse = await getGeminiResponse(`W kontekście ZAKŁADANIA FIRMY: ${input}`, messages.map(m => ({ role: m.role, text: m.text })));
    setMessages(prev => [...prev, { role: 'model', text: aiResponse, timestamp: new Date() }]);
    setIsLoading(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="text-center space-y-2 mb-10">
        <h1 className="text-3xl font-black dark:text-white">Twoja droga do biznesu z FirmaAI 🚀</h1>
        <p className="text-slate-500 max-w-2xl mx-auto">Zamiast wypełniać skomplikowane formularze, porozmawiaj z naszym ekspertem. Doradzimy Ci najlepszą formę prawną i podatkową.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col h-[600px] bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden">
          <div className="p-4 border-b border-slate-50 dark:border-slate-800 bg-primary-50/50 dark:bg-primary-900/10 flex items-center gap-3">
             <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white">
               <Sparkles size={18} />
             </div>
             <span className="font-bold text-sm dark:text-white">Konsultacja AI: Start Biznesu</span>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4" ref={scrollRef}>
             {messages.map((msg, i) => (
               <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                 <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${
                   msg.role === 'user' ? 'bg-primary-600 text-white rounded-tr-none' : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-100 dark:border-slate-700'
                 }`}>
                   {msg.text.split('\n').map((line, idx) => <p key={idx} className={idx > 0 ? 'mt-2' : ''}>{line}</p>)}
                 </div>
               </div>
             ))}
             {isLoading && <div className="animate-pulse flex gap-2"><div className="w-2 h-2 bg-primary-400 rounded-full"></div><div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></div></div>}
          </div>

          <div className="p-4 border-t border-slate-50 dark:border-slate-800">
            <div className="flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Napisz co planujesz..."
                className="flex-1 bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 text-sm dark:text-white focus:ring-2 focus:ring-primary-500"
              />
              <button onClick={handleSend} className="bg-primary-600 text-white p-3 rounded-xl hover:bg-primary-700 transition-colors">
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-xl font-bold mb-6 dark:text-white">Lista kroków</h3>
            <div className="space-y-4">
              {steps.map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step.status === 'ready' ? 'bg-green-500 text-white' : step.status === 'ai' ? 'bg-primary-600 text-white animate-pulse' : 'bg-slate-100 dark:bg-slate-800 text-slate-300'}`}>
                      {step.status === 'ready' ? <CheckCircle2 size={16} /> : <span className="text-xs font-bold">{i+1}</span>}
                    </div>
                    {i < steps.length - 1 && <div className="w-0.5 h-full bg-slate-100 dark:bg-slate-800 my-1"></div>}
                  </div>
                  <div>
                    <h4 className="font-bold dark:text-white text-sm">{step.title}</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-primary-50 dark:bg-primary-900/10 p-6 rounded-[30px] border border-primary-100 dark:border-primary-800">
            <h4 className="font-bold text-primary-600 mb-2 flex items-center gap-2">
              <FilePlus size={18} />
              Generator dokumentów
            </h4>
            <p className="text-[10px] text-slate-500 mb-4">Po rozmowie z AI wygenerujemy dla Ciebie gotowy plik PDF z wnioskiem CEIDG do podpisu Profilem Zaufanym.</p>
            <button className="w-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 py-3 rounded-xl text-xs font-bold shadow-sm hover:shadow-md transition-all">
              Pobierz paczkę startową
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartCompany;
