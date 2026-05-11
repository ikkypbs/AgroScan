import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Bot, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage } from '../types';

interface AnalysisChatProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export default function AnalysisChat({ messages, onSendMessage, isLoading }: AnalysisChatProps) {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    "Berapa modal yang saya butuhkan?",
    "Apa merk pupuk yang paling cocok?",
    "Kapan waktu terbaik untuk menanam?"
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] border-2 border-neutral-100 shadow-xl overflow-hidden flex flex-col h-[500px] md:h-[600px]">
      <div className="p-4 md:p-6 bg-brand-primary text-white flex items-center gap-3">
        <div className="p-2 bg-white/20 rounded-xl">
          <Sparkles size={20} md:size={24} />
        </div>
        <div>
          <h3 className="text-lg md:text-xl font-bold leading-tight">Tanya Pakar AgroScan</h3>
          <p className="text-xs md:text-sm text-brand-accent/80 font-medium">Konsultasi cerdas lahan Bapak/Ibu</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6 bg-neutral-50/50">
        <AnimatePresence>
          {messages.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex flex-col items-center justify-center text-center space-y-4 px-4"
            >
              <div className="w-12 h-12 md:w-16 md:h-16 bg-brand-primary/5 rounded-full flex items-center justify-center text-brand-primary">
                <Bot size={24} md:size={32} />
              </div>
              <p className="text-sm md:text-base text-neutral-500 font-medium">Ada yang ingin Bapak/Ibu tanyakan lagi? Kami siap membantu.</p>
            </motion.div>
          )}

          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-2 md:gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                msg.role === 'user' ? 'bg-brand-primary text-white' : 'bg-white text-brand-primary border border-neutral-200'
              }`}>
                {msg.role === 'user' ? <User size={16} md:size={20} /> : <Bot size={16} md:size={20} />}
              </div>
              <div className={`max-w-[85%] p-3 md:p-4 rounded-xl md:rounded-2xl shadow-sm border ${
                msg.role === 'user' 
                  ? 'bg-brand-primary text-white border-brand-primary' 
                  : 'bg-white text-neutral-800 border-neutral-200'
              }`}>
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-2 md:gap-3 flex-row"
            >
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-white text-brand-primary border border-neutral-200 flex items-center justify-center shrink-0">
                <Bot size={16} md:size={20} />
              </div>
              <div className="bg-white p-3 md:p-4 rounded-xl md:rounded-2xl border border-neutral-200 shadow-sm flex items-center gap-2">
                <Loader2 size={14} md:size={16} className="animate-spin text-brand-primary" />
                <span className="text-xs md:text-sm font-medium text-neutral-500">Mengetik...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-4 md:p-6 bg-white border-t border-neutral-100 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {quickQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => onSendMessage(q)}
                className="whitespace-nowrap px-3 py-1.5 bg-neutral-100 hover:bg-brand-primary hover:text-white transition-colors rounded-lg text-[10px] md:text-xs font-bold text-neutral-700 border border-neutral-200"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex gap-2 md:gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tanyakan di sini..."
            className="flex-1 bg-neutral-50 border-2 border-neutral-100 rounded-xl px-4 py-2.5 md:px-5 md:py-3 text-sm font-medium focus:outline-none focus:border-brand-primary"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2.5 md:p-3 bg-brand-primary text-white rounded-xl shadow-lg shadow-brand-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
          >
            <Send size={18} md:size={20} strokeWidth={3} />
          </button>
        </form>
      </div>
    </div>
  );
}
