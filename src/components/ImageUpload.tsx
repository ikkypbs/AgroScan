import { useState, useRef, useEffect } from 'react';
import { Upload, X, RotateCcw, Undo2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Point {
  x: number;
  y: number;
}

interface ImageUploadProps {
  onImageChange: (base64: string | null) => void;
  onPolygonChange?: (polygon: Point[]) => void;
  isAnalyzing?: boolean;
}

export default function ImageUpload({ onImageChange, onPolygonChange, isAnalyzing }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [polygon, setPolygon] = useState<Point[]>([]);
  const [history, setHistory] = useState<Point[][]>([]);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [aspectRatio, setAspectRatio] = useState<number>(4 / 3);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    onPolygonChange?.(polygon);
  }, [polygon]);

  const triggerHaptic = () => {
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(50);
    }
  };

  const saveToHistory = () => {
    setHistory(prev => [...prev.slice(-9), [...polygon]]);
  };

  const undo = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (history.length > 0) {
      const last = history[history.length - 1];
      setPolygon(last);
      setHistory(prev => prev.slice(0, -1));
      triggerHaptic();
    }
  };

  const clearAll = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    saveToHistory();
    setPolygon([]);
    triggerHaptic();
  };

  const resetPoints = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    saveToHistory();
    setPolygon([
      { x: 25, y: 25 },
      { x: 75, y: 25 },
      { x: 75, y: 75 },
      { x: 25, y: 75 }
    ]);
    triggerHaptic();
  };

  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        
        const img = new Image();
        img.onload = () => {
          setAspectRatio(img.width / img.height);
          setPreview(base64);
          onImageChange(base64.split(',')[1]);
          setPolygon([
            { x: 25, y: 25 },
            { x: 75, y: 25 },
            { x: 75, y: 75 },
            { x: 25, y: 75 }
          ]);
          setHistory([]);
        };
        img.src = base64;
      };
      reader.readAsDataURL(file);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    
    // Get clientX and clientY from mouse or touch event
    let clientX, clientY;
    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    return {
      x: ((clientX - rect.left) / rect.width) * 100,
      y: ((clientY - rect.top) / rect.height) * 100
    };
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (draggingIndex === null || isAnalyzing) return;
    const { x, y } = getCoordinates(e);
    const newPolygon = [...polygon];
    newPolygon[draggingIndex] = {
      x: Math.max(0, Math.min(x, 100)),
      y: Math.max(0, Math.min(y, 100))
    };
    setPolygon(newPolygon);
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    if (isAnalyzing || draggingIndex !== null) return;
    const { x, y } = getCoordinates(e);
    saveToHistory();
    setPolygon([...polygon, { x, y }]);
    triggerHaptic();
  };

  const removePoint = (e: React.MouseEvent | React.TouchEvent, index: number) => {
    if ('preventDefault' in e) e.preventDefault();
    if (isAnalyzing || polygon.length <= 3) return;
    saveToHistory();
    setPolygon(polygon.filter((_, i) => i !== index));
    triggerHaptic();
  };

  const polygonPath = polygon.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!preview ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-4 border-dashed border-neutral-300 rounded-[2.5rem] p-12 flex flex-col items-center justify-center gap-6 cursor-pointer hover:border-brand-primary/50 hover:bg-brand-primary/5 transition-all group min-h-[350px]"
          >
            <div className="w-24 h-24 rounded-full bg-brand-primary flex items-center justify-center shadow-2xl shadow-brand-primary/20 group-hover:scale-110 transition-transform">
              <Upload className="text-white" size={40} strokeWidth={3} />
            </div>
            <div className="text-center px-6">
              <p className="text-2xl font-bold text-neutral-800 tracking-tight leading-tight">TEKAN UNTUK PILIH FOTO LAHAN</p>
              <p className="text-sm font-medium text-neutral-400 mt-2 uppercase tracking-widest leading-relaxed italic">Ambil foto baru atau dari galeri</p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              capture="environment"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative rounded-2xl md:rounded-[2rem] overflow-hidden bg-black border-2 md:border-4 border-white shadow-xl select-none cursor-crosshair group touch-none mx-auto"
            style={{ 
              aspectRatio: `${aspectRatio}`, 
              maxHeight: 'min(70vh, 500px)',
              width: '100%'
            }}
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onTouchMove={handleMouseMove}
            onMouseUp={() => setDraggingIndex(null)}
            onTouchEnd={() => setDraggingIndex(null)}
            onMouseLeave={() => setDraggingIndex(null)}
            onClick={handleContainerClick}
          >
            <img src={preview} alt="Land Preview" className="w-full h-full object-contain pointer-events-none" />
            
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" preserveAspectRatio="none">
              <defs>
                <clipPath id="polygonClip">
                  <polygon points={polygonPath} />
                </clipPath>
              </defs>
              
              <rect x="0" y="0" width="100" height="100" fill="rgba(0,0,0,0.6)" mask="url(#polygonMask)" />
              <mask id="polygonMask">
                <rect x="0" y="0" width="100" height="100" fill="white" />
                <polygon points={polygonPath} fill="black" />
              </mask>

              <polygon 
                points={polygonPath} 
                className="stroke-brand-neon fill-brand-neon/20" 
                strokeWidth="1.5"
                style={{ filter: isAnalyzing ? 'none' : 'drop-shadow(0 0 12px #E2FF00)' }}
              />

              {isAnalyzing && (
                <motion.line
                  initial={{ y1: 0, y2: 0 }}
                  animate={{ y1: 100, y2: 100 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  x1="0"
                  x2="100"
                  stroke="#E2FF00"
                  strokeWidth="2.5"
                  style={{ filter: 'drop-shadow(0 0 15px #E2FF00)' }}
                  clipPath="url(#polygonClip)"
                />
              )}
            </svg>

            {polygon.map((p, i) => (
              <div
                key={i}
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
                className={`absolute w-7 h-7 -ml-3.5 -mt-3.5 md:w-8 md:h-8 md:-ml-4 md:-mt-4 bg-white border-4 border-brand-neon rounded-full cursor-grab active:cursor-grabbing z-30 shadow-2xl hover:scale-125 transition-transform ${draggingIndex === i ? 'scale-150 ring-8 ring-brand-neon/30' : ''}`}
                onMouseDown={(e) => { e.stopPropagation(); setDraggingIndex(i); triggerHaptic(); }}
                onTouchStart={(e) => { e.stopPropagation(); setDraggingIndex(i); triggerHaptic(); }}
                onContextMenu={(e) => removePoint(e, i)}
              />
            ))}

            <div className="absolute top-2 right-2 md:top-4 md:right-4 flex flex-col gap-2 md:gap-3">
              <button 
                onClick={(e) => { e.stopPropagation(); setPreview(null); onImageChange(null); triggerHaptic(); }}
                className="bg-red-600 p-2.5 md:p-4 rounded-xl md:rounded-2xl text-white shadow-xl hover:bg-red-700 transition-all transform hover:scale-110 active:scale-95"
                title="Hapus Foto"
              >
                <X size={20} md:size={24} strokeWidth={3} />
              </button>
              <button 
                onClick={resetPoints}
                className="bg-brand-primary p-2.5 md:p-4 rounded-xl md:rounded-2xl text-white shadow-xl hover:bg-brand-secondary transition-all transform hover:scale-110 active:scale-95"
                title="Reset Kotak"
              >
                <RotateCcw size={20} md:size={24} strokeWidth={3} />
              </button>
              <button 
                onClick={undo}
                disabled={history.length === 0}
                className="bg-white p-2.5 md:p-4 rounded-xl md:rounded-2xl text-brand-primary shadow-xl hover:bg-neutral-100 transition-all transform hover:scale-110 active:scale-95 disabled:opacity-50 disabled:scale-100"
                title="Undo"
              >
                <Undo2 size={20} md:size={24} strokeWidth={3} />
              </button>
            </div>

            <div className="absolute bottom-4 left-4 right-4 text-center pointer-events-none">
              <p className="text-[10px] md:text-sm font-bold bg-black/40 backdrop-blur-md text-white py-1.5 px-4 rounded-full inline-block border border-white/20 uppercase tracking-tight shadow-lg">
                Klik pojok • Seret titik kuning
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
