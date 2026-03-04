
import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, Sparkles, AlertCircle, Download, FileCheck } from 'lucide-react';
import { getGeminiResponse } from '../services/geminiService';
import { Message } from '../types';

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Cześć! Jestem Twoim asystentem Zentra AI. W czym mogę Ci dzisiaj pomóc? Mogę przeanalizować Twoje faktury, sprawdzić podatki lub wygenerować umowę.', timestamp: new Date() }
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

    // Mock document generation logic for demo purposes
    if (userInput.toLowerCase().includes('wygeneruj umowę')) {
      await new Promise(resolve => setTimeout(resolve, 2000)); // AI "thinking" time
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: 'Projekt umowy B2B został przygotowany na podstawie Twoich danych profilowych. Dokument jest gotowy.', 
        timestamp: new Date(),
        action: { label: 'Pobierz umowę (PDF)', type: 'download' }
      }]);
      setIsLoading(false);
      return;
    }

    const history = messages.map(m => ({ role: m.role, text: m.text }));
    const aiResponse = await getGeminiResponse(userInput, history);
    
    setMessages(prev => [...prev, { role: 'model', text: aiResponse, timestamp: new Date() }]);
    setIsLoading(false);
  };

  const quickActions = [
    "Ile mam VAT do zapłaty?",
    "Wygeneruj umowę B2B",
    "Podsumuj koszty z maja",
    "Analiza cashflow"
  ];

  return (
    <div className={`fixed inset-y-0 right-0 w-96 bg-white dark:bg-slate-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-slate-200 dark:border-slate-800 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-primary-50/50 dark:bg-primary-900/10">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg text-primary-600 dark:text-primary-400">
              <Bot size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-white">Asystent Zentra</h3>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">Online</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Chat Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${
                msg.role === 'user' 
                  ? 'bg-primary-600 text-white rounded-br-none shadow-lg shadow-primary-500/10' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-50 dark:border-slate-700'
              }`}>
                {msg.text.split('\n').map((line, idx) => (
                  <p key={idx} className={idx > 0 ? 'mt-2' : ''}>{line}</p>
                ))}
                
                {msg.action && msg.action.type === 'download' && (
                  <button className="mt-4 w-full flex items-center justify-center gap-3 py-3 bg-white dark:bg-slate-900 text-primary-600 dark:text-primary-400 font-black text-xs uppercase tracking-widest rounded-xl shadow-sm hover:bg-primary-50 dark:hover:bg-slate-700 transition-all border border-primary-100 dark:border-slate-700 group">
                    <Download size={18} className="group-hover:translate-y-0.5 transition-transform" />
                    {msg.action.label}
                  </button>
                )}

                <span className="text-[10px] mt-2 opacity-60 block text-right font-medium">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl rounded-bl-none flex flex-col gap-2">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-primary-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Generowanie...</p>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar">
          {quickActions.map(action => (
            <button 
              key={action}
              onClick={() => setInput(action)}
              className="whitespace-nowrap px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-xs text-slate-600 dark:text-slate-400 hover:border-primary-400 transition-colors font-medium"
            >
              {action}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Zadaj pytanie..."
              className="w-full pl-4 pr-12 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 border border-transparent dark:text-white font-medium"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading}
              className="absolute right-2 top-2 p-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors shadow-lg shadow-primary-500/20"
            >
              <Send size={18} />
            </button>
          </div>
          <p className="text-[10px] text-center mt-2 text-slate-400 font-medium">
            Zentra AI może się mylić. Zawsze weryfikuj ważne decyzje finansowe.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
