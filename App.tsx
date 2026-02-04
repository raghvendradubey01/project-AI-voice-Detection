
import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Activity, 
  LayoutDashboard, 
  BookOpen, 
  History,
  Settings,
  Languages,
  ArrowRight,
  BrainCircuit,
  Loader2,
  FileAudio,
  Type
} from 'lucide-react';
import { FileUpload } from './components/FileUpload';
import { PasteInput } from './components/PasteInput';
import { ResultDisplay } from './components/ResultDisplay';
import { Documentation } from './components/Documentation';
import { UpgradeModal } from './components/UpgradeModal';
import { SUPPORTED_LANGUAGES } from './constants';
import { Language, DetectionResponse } from './types';
import { analyzeVoice } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'detector' | 'docs' | 'history'>('detector');
  const [inputMode, setInputMode] = useState<'file' | 'paste'>('file');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('English');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentResult, setCurrentResult] = useState<DetectionResponse | null>(null);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('audio/mpeg');
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const handleFileSelect = (base64: string, name: string, type: string) => {
    setAudioBase64(base64);
    setMimeType(type || 'audio/mpeg');
    setCurrentResult(null);
  };

  const handlePasteSelect = (base64: string, type: string) => {
    setAudioBase64(base64);
    setMimeType(type || 'audio/mpeg');
    setCurrentResult(null);
  };

  const startAnalysis = async () => {
    if (!audioBase64) return;
    setIsProcessing(true);
    setCurrentResult(null);
    
    try {
      const result = await analyzeVoice(audioBase64, selectedLanguage, mimeType);
      setCurrentResult(result);
    } catch (err) {
      setCurrentResult({
        status: 'error',
        message: 'An error occurred during multi-format analysis.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#020617] text-slate-100 overflow-hidden">
      {/* Modals */}
      <UpgradeModal 
        isOpen={isUpgradeModalOpen} 
        onClose={() => setIsUpgradeModalOpen(false)} 
      />

      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 flex flex-col shrink-0 bg-slate-950/50 backdrop-blur-xl hidden md:flex">
        <div className="p-6">
          <div className="flex items-center gap-3 text-blue-500 mb-8">
            <div className="bg-blue-500/20 p-2 rounded-xl">
              <ShieldCheck size={24} />
            </div>
            <h1 className="text-xl font-black tracking-tight text-white uppercase">VOICE VERIFY</h1>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('detector')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'detector' ? 'bg-blue-500/10 text-blue-400 font-bold' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'}`}
            >
              <LayoutDashboard size={18} />
              Detection Console
            </button>
            <button
              onClick={() => setActiveTab('docs')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'docs' ? 'bg-blue-500/10 text-blue-400 font-bold' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'}`}
            >
              <BookOpen size={18} />
              API Documentation
            </button>
            <button
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-700 cursor-not-allowed"
              disabled
            >
              <History size={18} />
              Audit Logs
            </button>
          </nav>
        </div>

        <div className="mt-auto p-6 space-y-4">
          <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">System Load</span>
              <span className="text-[10px] text-emerald-500 font-bold px-1.5 py-0.5 bg-emerald-500/10 rounded">LOW</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full w-[12%] bg-emerald-500"></div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg border border-slate-800">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600"></div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Enterprise User</span>
              <span className="text-[10px] text-slate-500 uppercase font-black">PRO PLAN</span>
            </div>
            <Settings size={14} className="ml-auto text-slate-500 hover:text-white cursor-pointer" />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-slate-950/20">
        <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-8 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">
              {activeTab === 'detector' && 'Detection Console'}
              {activeTab === 'docs' && 'API Documentation'}
            </h2>
            <p className="text-xs text-slate-500">
              {activeTab === 'detector' && 'Perform neural-network based voice verification'}
              {activeTab === 'docs' && 'Technical implementation guide for developers'}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5">
              <Activity size={14} className="text-emerald-500" />
              <span className="text-xs font-mono text-emerald-500">API ACTIVE: v2.4.0</span>
            </div>
            <button 
              onClick={() => setIsUpgradeModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-900/20"
            >
              <ArrowRight size={14} />
              Upgrade Plan
            </button>
          </div>
        </header>

        <div className="max-w-5xl mx-auto p-8">
          {activeTab === 'detector' && (
            <div className="space-y-10">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                  <div>
                    <h3 className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] mb-4">Configuration</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm text-slate-500 flex items-center gap-2">
                          <Languages size={14} /> Target Language
                        </label>
                        <div className="grid grid-cols-1 gap-2">
                          {SUPPORTED_LANGUAGES.map(lang => (
                            <button
                              key={lang}
                              onClick={() => setSelectedLanguage(lang)}
                              className={`text-left px-4 py-2.5 rounded-xl border text-sm transition-all ${
                                selectedLanguage === lang 
                                ? 'bg-blue-600 border-blue-500 text-white font-bold shadow-[0_0_20px_-5px_rgba(37,99,235,0.4)]' 
                                : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                              }`}
                            >
                              {lang}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-indigo-500/10 border border-indigo-500/30 p-5 rounded-2xl">
                    <div className="flex items-center gap-3 text-indigo-400 mb-3">
                      <BrainCircuit size={20} />
                      <h4 className="font-bold text-sm uppercase tracking-wider">Universal Support</h4>
                    </div>
                    <p className="text-xs text-indigo-200/60 leading-relaxed">
                      Now accepting all major audio formats including MP3, WAV, M4A, and AAC. Our engine automatically detects the container for precise spectral analysis.
                    </p>
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-8">
                  <div className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800 shadow-2xl backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm font-black">1</span>
                        Choose Input Method
                      </h3>
                      
                      <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
                        <button 
                          onClick={() => setInputMode('file')}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${inputMode === 'file' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                          <FileAudio size={14} /> File
                        </button>
                        <button 
                          onClick={() => setInputMode('paste')}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${inputMode === 'paste' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                          <Type size={14} /> Base64
                        </button>
                      </div>
                    </div>
                    
                    {inputMode === 'file' ? (
                      <FileUpload onFileSelect={handleFileSelect} disabled={isProcessing} />
                    ) : (
                      <PasteInput onPaste={handlePasteSelect} disabled={isProcessing} />
                    )}
                    
                    <div className="mt-8 flex flex-col items-center">
                      <button
                        onClick={startAnalysis}
                        disabled={!audioBase64 || isProcessing}
                        className={`w-full py-4 rounded-xl font-black text-lg tracking-widest transition-all transform flex items-center justify-center gap-3
                          ${!audioBase64 || isProcessing 
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:scale-[1.01] hover:shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] active:scale-95'}`}
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="animate-spin" size={24} />
                            ANALYZING AUDIO SPECTRUM...
                          </>
                        ) : (
                          <>
                            <Activity size={24} />
                            START VOICE DETECTION
                          </>
                        )}
                      </button>
                      <p className="mt-4 text-[10px] text-slate-600 uppercase tracking-widest font-bold">
                        Secure Multi-Format Processing • {mimeType} detected
                      </p>
                    </div>
                  </div>

                  {currentResult && <ResultDisplay result={currentResult} />}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'docs' && <Documentation />}
        </div>
      </main>
    </div>
  );
};

export default App;
