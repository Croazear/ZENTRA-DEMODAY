
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Sparkles, User, Paperclip, FileText, Download, Share2 } from 'lucide-react';
import { getGeminiResponse } from '../services/geminiService';
import { Message } from '../types';

const AIAssistantView: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Witaj w pełnym trybie konsultacji AI. Jestem Twoim wirtualnym dyrektorem finansowym i doradcą podatkowym. \n\nW czym mogę Ci dzisiaj pomóc? Możemy przeanalizować Twoją płynność finansową, sprawdzić nadchodzące zmiany w prawie podatkowym lub przygotować dokumentację.', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userInput = input;
    const userMsg: Message = { role: 'user', text: userInput, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Mock document generation logic
    if (userInput.toLowerCase().includes('wygeneruj umowę')) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: 'Twoja umowa B2B została wygenerowana poprawnie. Dokument jest gotowy do pobrania w formacie PDF.', 
        timestamp: new Date(),
        action: { label: 'Pobierz gotową umowę', type: 'download' }
      }]);
      setIsLoading(false);
      return;
    }

    const history = messages.map(m => ({ role: m.role, text: m.text }));
    const aiResponse = await getGeminiResponse(userInput, history);
    
    setMessages(prev => [...prev, { role: 'model', text: aiResponse, timestamp: new Date() }]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden animate-in fade-in duration-500">
      <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-200">
            <Bot size={28} />
          </div>
          <div>
            <h2 className="text-xl font-bold dark:text-white">Ekspert Zentra AI</h2>
            <p className="text-xs text-slate-500 font-medium">Analiza danych w czasie rzeczywistym (KSeF, e-Doręczenia)</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 transition-colors">
            <Share2 size={16} />
            Udostępnij czat
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-8" ref={scrollRef}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-5 max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-sm ${
                msg.role === 'user' ? 'bg-primary-50 text-primary-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}>
                {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className={`p-6 rounded-[32px] text-sm leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-primary-600 text-white rounded-tr-none shadow-primary-500/10' 
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-100 dark:border-slate-700'
              }`}>
                {msg.text.split('\n').map((line, idx) => (
                  <p key={idx} className={idx > 0 ? 'mt-3' : ''}>{line}</p>
                ))}

                {msg.action && msg.action.type === 'download' && (
                  <button className="mt-6 w-full flex items-center justify-center gap-3 py-4 bg-primary-50 dark:bg-slate-900 text-primary-600 dark:text-primary-400 font-black text-xs uppercase tracking-[0.2em] rounded-2xl border border-primary-100 dark:border-slate-700 hover:bg-primary-100 transition-all group">
                    <Download size={20} className="group-hover:translate-y-0.5 transition-transform" />
                    {msg.action.label}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-4 items-center">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <Bot size={20} className="text-slate-400 animate-pulse" />
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-primary-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Generowanie dokumentu...</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-50 dark:border-slate-800">
        <div className="max-w-4xl mx-auto flex items-center gap-4 bg-slate-50 dark:bg-slate-800 p-2 rounded-[24px] border border-slate-100 dark:border-slate-700 shadow-inner">
          <button className="p-3 text-slate-400 hover:text-primary-600 transition-colors">
            <Paperclip size={20} />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Opisz problem podatkowy lub poproś o dokument..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 dark:text-white font-medium"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading}
            className="bg-primary-600 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-primary-700 transition-all flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-primary-500/20"
          >
            Wyślij
            <Send size={16} />
          </button>
        </div>
        <div className="flex justify-center gap-8 mt-4">
          <button onClick={() => setInput("Jakie zmiany w VAT od 2024?")} className="text-[10px] font-black text-slate-400 hover:text-primary-600 uppercase tracking-widest transition-colors">Zmiany prawne 2024</button>
          <button onClick={() => setInput("Wygeneruj wezwanie do zapłaty")} className="text-[10px] font-black text-slate-400 hover:text-primary-600 uppercase tracking-widest transition-colors">Windykacja</button>
          <button onClick={() => setInput("Analiza kosztów stałych")} className="text-[10px] font-black text-slate-400 hover:text-primary-600 uppercase tracking-widest transition-colors">Optymalizacja</button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantView;
