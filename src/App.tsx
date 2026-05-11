/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Leaf, 
  ArrowRight, 
  Loader2, 
  AlertCircle,
  RefreshCcw,
  Sparkles,
  Maximize2
} from 'lucide-react';
import ImageUpload from './components/ImageUpload';
import AnalysisDashboard from './components/AnalysisDashboard';
import FarmerInterview from './components/FarmerInterview';
import { analyzeLand, askExpert } from './services/geminiService';
import { AnalysisState, FarmerInterviewData, ChatMessage } from './types';

export default function App() {
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [polygon, setPolygon] = useState<{ x: number; y: number }[]>([]);
  const [context, setContext] = useState('');
  const [isInterviewing, setIsInterviewing] = useState(false);
  const [interviewData, setInterviewData] = useState<FarmerInterviewData | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [state, setState] = useState<AnalysisState>({
    loading: false,
    error: null,
    result: null
  });

  const handleStartInterview = () => {
    setIsInterviewing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnalyze = async (data?: FarmerInterviewData) => {
    if (!imageBase64 || polygon.length < 3) return;
    
    setInterviewData(data || null);
    setState({ loading: true, error: null, result: null });
    try {
      const result = await analyzeLand(imageBase64, context, polygon, data);
      setState({ loading: false, error: null, result });
      setIsInterviewing(false);
      setChatHistory([]);
      
      // Smooth scroll to results
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      console.error(err);
      setState({ 
        loading: false, 
        error: "Terjadi kesalahan saat menganalisis lahan. Pastikan foto jelas dan coba lagi.", 
        result: null 
      });
    }
  };

  const handleSendChatMessage = async (content: string) => {
    if (!state.result || isChatLoading) return;

    const userMsg: ChatMessage = { role: 'user', content };
    setChatHistory(prev => [...prev, userMsg]);
    setIsChatLoading(true);

    try {
      const response = await askExpert(
        content,
        state.result,
        interviewData || {},
        chatHistory
      );
      
      const botMsg: ChatMessage = { role: 'assistant', content: response };
      setChatHistory(prev => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      setChatHistory(prev => [...prev, { role: 'assistant', content: "Maaf, terjadi kesalahan saat menghubungi pakar. Silakan coba lagi." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleReset = () => {
    setImageBase64(null);
    setPolygon([]);
    setContext('');
    setIsInterviewing(false);
    setInterviewData(null);
    setChatHistory([]);
    setState({ loading: false, error: null, result: null });
  };

  return (
    <div className="min-h-screen bg-[#F8FAF8]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-neutral-100 px-4 py-3 md:px-8 md:py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 md:w-12 md:h-12 bg-brand-primary rounded-xl flex items-center justify-center shadow-lg shadow-brand-primary/20">
            <Leaf className="text-white fill-white/20" size={20} md:size={28} />
          </div>
          <div>
            <h1 className="text-lg md:text-2xl font-black text-brand-primary leading-none">AgroScan</h1>
            <p className="text-[10px] md:text-xs font-bold text-neutral-400 uppercase tracking-widest hidden sm:block">MINDucation 2.0 Project</p>
          </div>
        </div>
        
        {(state.result || isInterviewing) && (
          <button 
            onClick={handleReset}
            className="px-4 py-1.5 md:px-6 md:py-2 bg-red-100 text-red-600 rounded-full font-black uppercase text-[10px] md:text-sm hover:red-600 hover:text-white transition-all transform active:scale-95"
          >
            Reset
          </button>
        )}
      </header>

      <main className="w-full max-w-5xl mx-auto px-4 md:px-6 pt-6 md:pt-10">
        <AnimatePresence mode="wait">
          {!isInterviewing && !state.result && (
            <motion.div 
              key="input"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, x: -100 }}
              className="space-y-8 md:space-y-12"
            >
              {/* Input Section */}
              <section className="space-y-8 md:space-y-10">
                <div className="text-center space-y-3 md:space-y-4">
                  <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl md:text-5xl font-black text-neutral-900 leading-tight"
                  >
                    Ubah Lahan Liar Jadi <span className="text-brand-primary underline decoration-brand-accent/30 underline-offset-4">Produktif</span>
                  </motion.h2>
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-neutral-500 text-base md:text-lg font-medium max-w-2xl mx-auto leading-relaxed"
                  >
                    Gunakan AI cerdas untuk menganalisis lahan Anda dan dapatkan panduan profesional dengan sekali foto.
                  </motion.p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 items-start">
                  <div className="lg:col-span-12 xl:col-span-6 w-full overflow-hidden">
                    <ImageUpload 
                      onImageChange={setImageBase64} 
                      onPolygonChange={setPolygon}
                      isAnalyzing={state.loading}
                    />
                  </div>
                  
                  <div className="lg:col-span-12 xl:col-span-6 space-y-6 md:space-y-8">
                    <div className="space-y-3 md:space-y-4">
                      <label className="text-lg font-bold text-neutral-800 flex items-center gap-2 md:gap-3">
                        <Sparkles size={20} md:size={22} className="text-brand-primary" />
                        CATATAN LAHAN (OPSIONAL)
                      </label>
                      <textarea
                        value={context}
                        onChange={(e) => setContext(e.target.value)}
                        placeholder="Contoh: Ini bekas rawa, baru dibersihkan bulan lalu."
                        className="input-field min-h-[120px] md:min-h-[140px] text-sm md:text-base font-medium resize-none leading-relaxed p-4 md:p-6 rounded-2xl border-2"
                      />
                    </div>

                    <div className="p-4 md:p-5 bg-brand-primary/5 rounded-2xl md:rounded-[1.5rem] border border-brand-primary/10">
                       <div className="flex items-start gap-3">
                          <div className="p-2 bg-brand-primary/10 rounded-lg text-brand-primary">
                             <Maximize2 size={16} md:size={18} />
                          </div>
                          <div>
                             <p className="text-xs md:text-sm font-bold text-brand-primary uppercase tracking-wider">Akurasi Poligon</p>
                             <p className="text-[11px] md:text-xs text-neutral-600 font-medium leading-relaxed">Tarik titik kuning ke batas lahan Anda. Klik pada foto untuk menambah titik baru.</p>
                          </div>
                       </div>
                    </div>

                    <div className="pt-2">
                      <button
                        disabled={!imageBase64 || polygon.length < 3 || state.loading}
                        onClick={handleStartInterview}
                        className="btn-primary w-full py-4 md:py-5 text-lg md:text-xl font-bold rounded-2xl uppercase tracking-wide"
                      >
                        MULAI ANALISIS SEKARANG
                        <ArrowRight size={22} md:size={26} strokeWidth={3} />
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {isInterviewing && (
            <motion.div
              key="interview"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="w-full pb-32 md:pb-20"
            >
              <FarmerInterview onSubmit={handleAnalyze} isAnalyzing={state.loading} />
            </motion.div>
          )}

          {state.result && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 md:space-y-8 pb-10"
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <h2 className="text-2xl md:text-4xl font-black flex items-center gap-3 md:gap-4 text-neutral-900 text-center md:text-left">
                  <div className="p-2 md:p-3 bg-brand-primary/10 rounded-xl md:rounded-2xl text-brand-primary">
                    <Sparkles size={24} md:size={32} />
                  </div>
                  HASIL SCAN AI
                </h2>
                <button 
                  onClick={handleReset}
                  className="w-full md:w-auto bg-brand-primary text-white px-8 py-3 rounded-2xl font-black uppercase tracking-tight flex items-center justify-center gap-2 shadow-xl shadow-brand-primary/20"
                >
                  <RefreshCcw size={20} />
                  Ambil Foto Baru
                </button>
              </div>
              <div id="results-section">
                <AnalysisDashboard 
                  data={state.result} 
                  interview={interviewData || undefined}
                  chatHistory={chatHistory}
                  onSendChatMessage={handleSendChatMessage}
                  isChatLoading={isChatLoading}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {state.error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 md:mt-8 bg-red-50 border-2 md:border-4 border-red-100 p-6 md:p-8 rounded-2xl md:rounded-[2rem] flex flex-col md:flex-row items-center gap-4 md:gap-6 text-red-600 shadow-2xl shadow-red-500/10 text-center md:text-left"
          >
            <AlertCircle size={32} md:size={40} strokeWidth={3} />
            <p className="text-lg md:text-xl font-bold">{state.error}</p>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-16 md:py-24 border-t border-neutral-100 text-center bg-white/50">
        <div className="max-w-3xl mx-auto px-6 space-y-6">
          <div className="flex justify-center gap-6 md:gap-10 opacity-40">
            <Leaf className="text-brand-primary" size={24} md:size={32} />
            <Maximize2 className="text-brand-primary" size={24} md:size={32} />
            <Sparkles className="text-brand-primary" size={24} md:size={32} />
          </div>

          <div className="space-y-2">
            <p className="text-[10px] md:text-xs font-black text-brand-primary tracking-[0.2em] uppercase">
              MIND-Project: MINDucation 2.0
            </p>
            <h3 className="text-sm md:text-base font-bold text-neutral-800 italic">
              "Inovasi Pertanian Presisi untuk Pemberdayaan Lahan Lokal"
            </h3>
          </div>

          <div className="pt-4 border-t border-neutral-200/50">
            <p className="text-[8px] md:text-[10px] text-neutral-400 font-bold uppercase tracking-widest">
              AgroScan &copy; 2026 • Hak Cipta Dilindungi
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

