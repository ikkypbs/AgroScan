import { useState } from 'react';
import { FarmerInterviewData } from '../types';
import { motion } from 'motion/react';
import { 
  Ruler, 
  Leaf, 
  History, 
  CloudRain, 
  Droplets, 
  FileText,
  ArrowRight
} from 'lucide-react';

interface Props {
  onSubmit: (data: FarmerInterviewData) => void;
  isAnalyzing: boolean;
}

export default function FarmerInterview({ onSubmit, isAnalyzing }: Props) {
  const [formData, setFormData] = useState<FarmerInterviewData>({
    dimensions: '',
    vegetation: '',
    history: '',
    weather: '',
    waterSource: '',
    additionalNotes: ''
  });

  const handleChange = (key: keyof FarmerInterviewData, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const questions = [
    {
      key: 'dimensions',
      label: 'Dimensi Lahan',
      sublabel: 'Berapa perkiraan panjang x lebar lahan Anda?',
      icon: <Ruler size={32} />,
      placeholder: 'Contoh: 10m x 20m'
    },
    {
      key: 'vegetation',
      label: 'Vegetasi',
      sublabel: 'Rumput atau tumbuhan apa yang paling dominan di sana?',
      icon: <Leaf size={32} />,
      placeholder: 'Contoh: Rumput teki, ilalang tinggi'
    },
    {
      key: 'history',
      label: 'Riwayat Lahan',
      sublabel: 'Kapan terakhir kali lahan diberi pupuk atau kapur Dolomit?',
      icon: <History size={32} />,
      placeholder: 'Contoh: Belum pernah / 6 bulan lalu'
    },
    {
      key: 'weather',
      label: 'Cuaca',
      sublabel: 'Apakah di lokasi tersebut saat ini sering hujan lebat?',
      icon: <CloudRain size={32} />,
      placeholder: 'Contoh: Ya, sering banjir / Jarang hujan'
    },
    {
      key: 'waterSource',
      label: 'Sumber Air',
      sublabel: 'Apakah lokasi lahan dekat dengan sungai/sumur/irigasi?',
      icon: <Droplets size={32} />,
      placeholder: 'Contoh: Ada sumur di pinggir lahan'
    },
    {
      key: 'additionalNotes',
      label: 'Catatan Tambahan',
      sublabel: 'Apakah ada hal lain yang ingin Anda sampaikan?',
      icon: <FileText size={32} />,
      placeholder: 'Contoh: Bekas kandang ayam'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 md:space-y-10 pb-40 md:pb-20"
    >
      <div className="bg-brand-primary/5 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border-2 border-brand-primary/20">
        <h2 className="text-xl md:text-2xl font-bold text-brand-primary mb-1 md:mb-2 uppercase tracking-tight text-center">Tanya Jawab Lahan</h2>
        <p className="text-base md:text-lg text-neutral-600 text-center font-medium leading-tight">Bantu AI memberikan saran lebih akurat.</p>
        <p className="text-xs md:text-sm text-neutral-400 text-center mt-2 italic font-bold">Ketik tanda strip (-) jika tidak tahu.</p>
      </div>

      <div className="space-y-8 md:space-y-10">
        {questions.map((q) => (
          <div key={q.key} className="space-y-3">
            <label className="flex items-center gap-3 md:gap-4 text-base md:text-lg font-bold text-neutral-800">
              <div className="p-2 md:p-3 bg-brand-primary/10 rounded-xl text-brand-primary shrink-0">
                <div className="scale-75 md:scale-90">
                  {q.icon}
                </div>
              </div>
              <div className="flex flex-col">
                <span className="leading-tight">{q.label}</span>
                <span className="text-xs md:text-sm font-medium text-neutral-400">{q.sublabel}</span>
              </div>
            </label>
            <input
              type="text"
              value={formData[q.key as keyof FarmerInterviewData]}
              onChange={(e) => handleChange(q.key as keyof FarmerInterviewData, e.target.value)}
              placeholder={`${q.placeholder} (Ketik - jika ragu)`}
              className="input-field py-3 md:py-4"
            />
          </div>
        ))}
      </div>

      {/* Sticky Bottom button for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-lg border-t border-neutral-100 md:relative md:p-0 md:bg-transparent md:border-none md:backdrop-blur-none z-50">
        <button
          onClick={() => onSubmit(formData)}
          disabled={isAnalyzing}
          className="btn-primary w-full py-4 md:py-5 text-lg md:text-xl font-bold rounded-2xl shadow-xl shadow-brand-primary/20 uppercase tracking-wide flex items-center justify-center gap-3 group"
        >
          {isAnalyzing ? 'Sedang Menganalisis...' : 'Selesai & Lihat Hasil'}
          {!isAnalyzing && <ArrowRight size={22} md:size={24} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />}
        </button>
      </div>
    </motion.div>
  );
}
