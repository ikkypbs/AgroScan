import { LandAnalysis, FarmerInterviewData, ChatMessage } from '../types';
import { motion } from 'motion/react';
import { 
  Sprout, 
  Settings2, 
  Trees, 
  Maximize, 
  Thermometer, 
  TrendingUp, 
  Hammer, 
  CheckCircle2,
  ListChecks,
  Square,
  Triangle,
  Hexagon,
  AlertTriangle,
  Ruler,
  Info,
  Sparkles
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import AnalysisChat from './AnalysisChat';

interface Props {
  data: LandAnalysis;
  interview?: FarmerInterviewData;
  chatHistory: ChatMessage[];
  onSendChatMessage: (message: string) => void;
  isChatLoading: boolean;
}

export default function AnalysisDashboard({ 
  data, 
  interview, 
  chatHistory, 
  onSendChatMessage, 
  isChatLoading 
}: Props) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const ShapeIcon = () => {
    switch (data.spatialAnalysis.landShape) {
      case 'Persegi': return <Square className="text-brand-primary" size={32} />;
      case 'Trapesium': return <Triangle className="text-brand-primary" size={32} />;
      default: return <Hexagon className="text-brand-primary" size={32} />;
    }
  };

  const isVisionFallback = interview && Object.values(interview).some(v => v === '-');

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-10 pb-20"
    >
      {/* 1. Dashboard Analisis Spasial */}
      <motion.div variants={itemVariants} className="glass-card overflow-hidden border-2 border-neutral-100">
        <div className="bg-brand-primary px-6 py-4 flex items-center justify-between">
          <h3 className="text-white text-lg font-bold flex items-center gap-2">
            <Maximize size={20} />
            Analisis Spasial Lahan
          </h3>
          <div className="flex items-center gap-2">
            {isVisionFallback && (
              <span className="text-[10px] bg-brand-neon text-brand-primary px-3 py-1 rounded-full uppercase tracking-widest font-black flex items-center gap-1">
                <Sparkles size={10} />
                AI Vision Active
              </span>
            )}
            <span className="text-[10px] bg-white/20 text-white px-3 py-1 rounded-full uppercase tracking-widest font-bold">Otomatis</span>
          </div>
        </div>

        {isVisionFallback && (
          <div className="bg-brand-neon/10 px-6 py-2 border-b border-brand-neon/20 flex items-center gap-2">
            <Info size={14} className="text-brand-primary" />
            <p className="text-[11px] font-bold text-brand-primary italic">Hasil dioptimalkan melalui Mata AI karena data manual tidak tersedia.</p>
          </div>
        )}
        
        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
          <div className="flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-neutral-100 pb-6 md:pb-0 p-4">
            <div className="mb-3 md:mb-4 p-3 md:p-4 bg-neutral-50 rounded-2xl md:rounded-[2rem] border-2 border-neutral-100 flex items-center justify-center w-20 h-20 md:w-24 md:h-24">
              <ShapeIcon />
            </div>
            <span className="text-xs md:text-sm uppercase font-black text-neutral-400 tracking-tighter mb-1">Bentuk Lahan</span>
            <p className="text-lg md:text-2xl font-black text-neutral-800">{data.spatialAnalysis.landShape}</p>
          </div>

          <div className="flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-neutral-100 pb-6 md:pb-0 p-4">
            <div className="mb-2 md:mb-3 text-5xl md:text-7xl font-black text-brand-primary flex items-baseline gap-1 md:gap-2">
              {data.spatialAnalysis.estimatedArea.replace(/[^0-9]/g, '')}
              <span className="text-xl md:text-2xl font-bold text-neutral-500">m²</span>
            </div>
            <span className="text-xs md:text-sm uppercase font-black text-neutral-400 tracking-tighter mb-1">Estimasi Luas</span>
            <p className="text-sm md:text-base text-neutral-500 text-center font-bold px-2">{data.spatialAnalysis.contourDescription}</p>
          </div>

          <div className="flex flex-col items-center justify-center p-4">
            <div className="mb-3 md:mb-4 px-6 md:py-5 py-3 md:py-5 bg-brand-accent/20 text-brand-primary rounded-xl md:rounded-[2.5rem] text-xl md:text-3xl font-black">
              {data.spatialAnalysis.slopeLevel}
            </div>
            <span className="text-xs md:text-sm uppercase font-black text-neutral-400 tracking-tighter mb-1">Kemiringan</span>
            <p className="text-sm md:text-base text-neutral-500 italic font-bold">Presisi AI</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 2. Hasil Diagnosa Visual - Botani */}
        <motion.div variants={itemVariants} className="glass-card p-8 border-l-8 border-brand-primary">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-brand-primary/10 rounded-xl text-brand-primary">
              <Sprout size={24} />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 uppercase tracking-tight">Hasil Diagnosa Visual</h3>
          </div>
          
          <div className="space-y-6">
            <div>
              <span className="text-xs uppercase font-black text-neutral-400 tracking-widest block mb-4">Identifikasi Gulma & Tekstur</span>
              <div className="space-y-4">
                {data.vegetationAnalysis.weeds.map((weed, i) => (
                  <div key={i} className="bg-neutral-50 p-5 rounded-[1.5rem] border-2 border-neutral-100 group hover:border-brand-primary/20 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-black text-xl text-neutral-800">{weed.commonName}</h4>
                      <span className="text-xs italic text-neutral-400 font-mono">{weed.scientificName}</span>
                    </div>
                    <p className="text-base text-neutral-600 flex items-start gap-3 leading-relaxed font-medium">
                      <Info size={18} className="shrink-0 mt-1 text-brand-primary" />
                      {weed.implication}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-brand-primary/5 p-4 rounded-2xl border border-brand-primary/10">
                <div className="flex items-center gap-2 text-brand-primary mb-1">
                  <Thermometer size={16} />
                  <span className="text-[10px] uppercase font-bold tracking-wider">Estimasi pH</span>
                </div>
                <p className="text-lg font-black text-neutral-800">{data.vegetationAnalysis.estimatedPh}</p>
              </div>
              <div className="bg-brand-primary/5 p-4 rounded-2xl border border-brand-primary/10">
                <div className="flex items-center gap-2 text-brand-primary mb-1">
                  <TrendingUp size={16} />
                  <span className="text-[10px] uppercase font-bold tracking-wider">Kesuburan</span>
                </div>
                <p className="text-lg font-black text-neutral-800">{data.vegetationAnalysis.fertilityLevel}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 3. Instruksi Kerja Lapangan */}
        <motion.div variants={itemVariants} className="glass-card p-8 border-l-8 border-amber-500">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-amber-500/10 rounded-xl text-amber-600">
              <Hammer size={24} />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 uppercase tracking-tight">Instruksi Kerja</h3>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-2xl border-2 border-amber-100">
              <Settings2 className="text-amber-600" size={24} />
              <div>
                <p className="text-[10px] uppercase font-black text-amber-700 tracking-wider">Metode Pengolahan</p>
                <p className="text-lg font-black text-neutral-800">{data.processingRecommendation.method}</p>
              </div>
            </div>

            <div className="text-base font-medium text-neutral-700 leading-relaxed bg-neutral-50 p-6 rounded-2xl border border-neutral-100">
              <ReactMarkdown>{data.processingRecommendation.instructions}</ReactMarkdown>
            </div>

            <div className="space-y-3">
              <span className="text-xs uppercase font-black text-neutral-400 tracking-widest px-1">Alat Yang Dibutuhkan</span>
              <div className="flex flex-wrap gap-3">
                {data.processingRecommendation.toolsNeeded.map((tool, i) => (
                  <span key={i} className="px-5 py-2 bg-white border-2 border-neutral-100 rounded-xl text-sm font-bold text-neutral-700 shadow-sm">
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 bg-red-50 text-red-700 rounded-2xl border-2 border-red-100 italic">
              <AlertTriangle size={24} className="shrink-0 mt-0.5" />
              <p className="text-sm font-bold leading-relaxed">{data.processingRecommendation.safetyNotes}</p>
            </div>
          </div>
        </motion.div>

        {/* 4. Rekomendasi Tanaman Presisi */}
        <motion.div variants={itemVariants} className="glass-card p-8 border-l-8 border-brand-accent">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-brand-accent/10 rounded-xl text-brand-primary">
              <Trees size={24} />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 uppercase tracking-tight">Rencana Tanam</h3>
          </div>
          
          <div className="space-y-5">
            {data.cropRecommendations.map((crop, i) => (
              <div key={i} className="p-6 bg-neutral-50 border-2 border-neutral-100 rounded-[2rem] relative group hover:bg-white hover:shadow-lg transition-all">
                <div className="absolute -left-4 top-6 w-10 h-10 bg-brand-primary text-white rounded-full flex items-center justify-center text-xl font-black shadow-xl">
                  {i + 1}
                </div>
                <div className="ml-8">
                  <h4 className="font-black text-2xl text-neutral-900">{crop.name}</h4>
                  <p className="text-base text-neutral-500 mt-2 font-medium leading-relaxed">{crop.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 5. Blueprints & Dimensi Penanaman */}
        <motion.div variants={itemVariants} className="glass-card p-8 border-l-8 border-blue-500 bg-blue-50/10">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-600">
              <Ruler size={24} />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 uppercase tracking-tight">Dimensi Teknis</h3>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-[1.5rem] border-2 border-blue-100 shadow-sm">
               <h4 className="font-bold text-blue-800 flex items-center gap-2 mb-3">
                 <ListChecks size={20} />
                 {data.plantingTechnique.methodName}
               </h4>
               <p className="text-sm text-neutral-600 leading-relaxed font-medium">{data.plantingTechnique.description}</p>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-600 text-white p-4 rounded-2xl text-center shadow-lg shadow-blue-600/20">
                <span className="text-[9px] uppercase font-bold tracking-widest block opacity-80 mb-1">Tinggi</span>
                <p className="text-base font-black">{data.plantingTechnique.dimensions.bedHeight}</p>
              </div>
              <div className="bg-blue-600 text-white p-4 rounded-2xl text-center shadow-lg shadow-blue-600/20">
                <span className="text-[9px] uppercase font-bold tracking-widest block opacity-80 mb-1">Lebar</span>
                <p className="text-base font-black">{data.plantingTechnique.dimensions.bedWidth}</p>
              </div>
              <div className="bg-blue-600 text-white p-4 rounded-2xl text-center shadow-lg shadow-blue-600/20">
                <span className="text-[9px] uppercase font-bold tracking-widest block opacity-80 mb-1">Jarak</span>
                <p className="text-base font-black">{data.plantingTechnique.dimensions.spacing}</p>
              </div>
            </div>

            <div className="space-y-3">
              {data.plantingTechnique.steps.map((step, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-white/50 border border-blue-50 rounded-xl transition-colors">
                  <CheckCircle2 size={18} className="text-blue-500 mt-0.5 shrink-0" />
                  <span className="text-base text-neutral-700 font-medium leading-snug">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* 6. Tanya Pakar Section */}
      <motion.section variants={itemVariants} className="pt-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-neutral-900 mb-2">Ingin Tahu Lebih Lanjut?</h2>
          <p className="text-neutral-500 font-medium italic">Tanyakan apapun tentang hasil analisis di atas</p>
        </div>
        <AnalysisChat 
          messages={chatHistory} 
          onSendMessage={onSendChatMessage} 
          isLoading={isChatLoading} 
        />
      </motion.section>
    </motion.div>
  );
}
