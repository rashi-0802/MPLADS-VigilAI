import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  FileSpreadsheet,
  Layers,
  HelpCircle,
  PlayCircle,
  UserCheck,
  Users,
  X,
  Cpu,
  CheckCircle2,
  Database,
  BarChart3,
  Scale,
  Sparkles,
} from 'lucide-react';

interface HeaderProps {
  currentTab?: string;
  activeTab?: string;
  setCurrentTab?: (tab: string) => void;
  onSelectTab?: (tab: string) => void;
  userRole?: 'official' | 'citizen' | 'Auditor' | 'Citizen';
  setUserRole?: (role: any) => void;
  onToggleRole?: (role: 'Auditor' | 'Citizen') => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  onSearchChange?: (query: string) => void;
  onRunDemo?: () => void;
  onOpenJudgeTour?: () => void;
  onTriggerPipeline?: () => void;
  onRunAnalysis?: () => void;
  isProcessing?: boolean;
  onOpenArchitecture?: () => void;
  totalProjects?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  activeTab,
  setCurrentTab,
  onSelectTab,
  userRole = 'official',
  setUserRole,
  onToggleRole,
  searchQuery = '',
  setSearchQuery,
  onSearchChange,
  onRunDemo,
  onOpenJudgeTour,
  onTriggerPipeline,
  onRunAnalysis,
  isProcessing = false,
  onOpenArchitecture,
  totalProjects = 16,
}) => {
  const [showSpecsModal, setShowSpecsModal] = useState(false);

  const effectiveTab = currentTab || activeTab || 'dashboard';
  const isAuditor = userRole === 'official' || userRole === 'Auditor';

  const handleTabClick = (tab: string) => {
    if (setCurrentTab) setCurrentTab(tab);
    if (onSelectTab) onSelectTab(tab);
  };

  const handleQueryChange = (val: string) => {
    if (setSearchQuery) setSearchQuery(val);
    if (onSearchChange) onSearchChange(val);
  };

  const handleRunDemoClick = () => {
    if (onRunDemo) onRunDemo();
    else if (onOpenJudgeTour) onOpenJudgeTour();
  };

  const handlePipelineClick = () => {
    if (onTriggerPipeline) onTriggerPipeline();
    else if (onRunAnalysis) onRunAnalysis();
  };

  const handleSetAuditor = () => {
    if (setUserRole) setUserRole('official');
    if (onToggleRole) onToggleRole('Auditor');
  };

  const handleSetCitizen = () => {
    if (setUserRole) setUserRole('citizen');
    if (onToggleRole) onToggleRole('Citizen');
    handleTabClick('citizen');
  };

  const handleSpecsClick = () => {
    if (onOpenArchitecture) {
      onOpenArchitecture();
    } else {
      setShowSpecsModal(true);
    }
  };

  return (
    <>
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
        {/* Top Ministry & SIH Banner */}
        <div className="bg-slate-950 px-4 py-1 text-xs text-slate-400 border-b border-slate-800/80 flex flex-wrap justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold text-slate-300">Government of India Decision-Support System</span>
            <span className="text-slate-600">|</span>
            <span>Ministry of Statistics & Programme Implementation (MoSPI) Alignment</span>
          </div>
          <div className="flex items-center space-x-3 text-[11px]">
            <span className="bg-indigo-900/70 text-indigo-200 px-2 py-0.5 rounded border border-indigo-700 font-mono font-medium">
              SIH 2026: SIH26102
            </span>
            <span className="bg-amber-900/60 text-amber-200 px-2 py-0.5 rounded border border-amber-700/80 font-mono">
              Smart Automation
            </span>
          </div>
        </div>

        {/* Main Bar */}
        <div className="px-4 lg:px-6 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-700 to-indigo-900 flex items-center justify-center shadow-inner border border-blue-500/40 text-white">
              <ShieldAlert className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                  MPLADS VigilAI
                </h1>
                <span className="text-[10px] uppercase tracking-wider bg-blue-900/90 text-blue-200 px-1.5 py-0.5 rounded font-bold border border-blue-700">
                  PROTOTYPE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                AI-Powered MPLADS Anomaly Detection & Audit Prioritization
              </p>
            </div>
          </div>

          {/* Global Search Bar */}
          <div className="flex-1 max-w-md mx-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search Project ID, State, District, Description, Agency..."
                value={searchQuery}
                onChange={(e) => handleQueryChange(e.target.value)}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => handleQueryChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Action Controls & Role Switcher */}
          <div className="flex items-center space-x-2 flex-wrap justify-end">
            {/* RUN DEMO Button */}
            <button
              onClick={handleRunDemoClick}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs shadow-md transition-all active:scale-95 cursor-pointer"
              title="Launch step-by-step 2-minute demonstration for SIH Judges"
            >
              <PlayCircle className="w-4 h-4 text-slate-950 fill-current" />
              <span>RUN DEMO</span>
            </button>

            {/* Trigger Pipeline Button */}
            <button
              onClick={handlePipelineClick}
              disabled={isProcessing}
              className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800/60 text-white font-medium px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
            >
              <Layers className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
              <span>{isProcessing ? 'Analyzing...' : 'Run AI Pipeline'}</span>
            </button>

            {/* Architecture / Specs */}
            <button
              onClick={handleSpecsClick}
              className="flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1.5 rounded-lg text-xs border border-slate-700 cursor-pointer"
              title="System Architecture & Methodology"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Specs</span>
            </button>

            {/* Role Switcher */}
            <div className="bg-slate-800 p-0.5 rounded-lg border border-slate-700 flex items-center text-xs">
              <button
                onClick={handleSetAuditor}
                className={`px-2.5 py-1 rounded flex items-center space-x-1 transition-colors cursor-pointer ${
                  isAuditor
                    ? 'bg-blue-600 text-white font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <UserCheck className="w-3 h-3" />
                <span>Official / Auditor</span>
              </button>
              <button
                onClick={handleSetCitizen}
                className={`px-2.5 py-1 rounded flex items-center space-x-1 transition-colors cursor-pointer ${
                  !isAuditor
                    ? 'bg-emerald-600 text-white font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Users className="w-3 h-3" />
                <span>CitiZen</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Sub-Tabs */}
        {isAuditor && (
          <div className="px-4 lg:px-6 bg-slate-900 border-t border-slate-800 flex space-x-1 overflow-x-auto text-xs py-1 scrollbar-none">
            <button
              onClick={() => handleTabClick('dashboard')}
              className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer ${
                effectiveTab === 'dashboard'
                  ? 'bg-slate-800 text-blue-400 border-b-2 border-blue-500'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => handleTabClick('queue')}
              className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer ${
                effectiveTab === 'queue'
                  ? 'bg-slate-800 text-blue-400 border-b-2 border-blue-500'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              Investigation Queue
            </button>
            <button
              onClick={() => handleTabClick('alerts')}
              className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer ${
                effectiveTab === 'alerts'
                  ? 'bg-slate-800 text-blue-400 border-b-2 border-blue-500'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              Alert Centre
            </button>
            <button
              onClick={() => handleTabClick('analytics')}
              className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer ${
                effectiveTab === 'analytics'
                  ? 'bg-slate-800 text-blue-400 border-b-2 border-blue-500'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => handleTabClick('map')}
              className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer ${
                effectiveTab === 'map'
                  ? 'bg-slate-800 text-blue-400 border-b-2 border-blue-500'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              District Risk Map
            </button>
            <button
              onClick={() => handleTabClick('classify')}
              className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                effectiveTab === 'classify'
                  ? 'bg-blue-600 text-white shadow-xs font-semibold'
                  : 'text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Classify Work</span>
            </button>
            <button
              onClick={() => handleTabClick('upload')}
              className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer ${
                effectiveTab === 'upload' || effectiveTab === 'data'
                  ? 'bg-slate-800 text-blue-400 border-b-2 border-blue-500'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <span className="flex items-center gap-1">
                <FileSpreadsheet className="w-3.5 h-3.5" />
                Upload & Rules
              </span>
            </button>
            <button
              onClick={() => handleTabClick('citizen')}
              className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer ${
                effectiveTab === 'citizen'
                  ? 'bg-slate-800 text-emerald-400 border-b-2 border-emerald-500'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              CitiZen Portal
            </button>
          </div>
        )}
      </header>

      {/* Technical Specifications & Architecture Modal */}
      {showSpecsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-2xl w-full text-slate-200 shadow-2xl p-6 relative my-8">
            <button
              onClick={() => setShowSpecsModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-blue-400 text-xs font-mono font-bold mb-1">
              <span>SIH26102 SPECIFICATION</span>
              <span>•</span>
              <span>SMART AUTOMATION</span>
            </div>

            <h2 className="text-lg font-bold text-white mb-2">
              MPLADS VigilAI: Architecture & Risk Scoring Pipeline
            </h2>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Designed for district collectors and MoSPI audit officers. Combines deterministic statutory validation, statistical cohort benchmarking, Isolation Forest multivariate ML, and NLP semantic duplicate detection.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs mb-4">
              <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                <div className="flex items-center gap-1.5 text-amber-400 font-semibold mb-1">
                  <Scale className="w-4 h-4" />
                  <span>Composite Risk Formula</span>
                </div>
                <p className="text-[11px] text-slate-300 font-mono bg-slate-950/80 p-2 rounded border border-slate-800 mt-1">
                  Score = 25% Cost + 25% ProgressGap + 20% Delay + 15% PaymentFreq + 10% Duplicate + 5% ML
                </p>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  High Risk (70-100), Medium Risk (40-69), Low Risk (0-39).
                </p>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
                  <Database className="w-4 h-4" />
                  <span>Cohort Statistics & IQR Fences</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Computes category medians and IQR fences [Q1 - 1.5×IQR, Q3 + 1.5×IQR] across cost and payment velocity to avoid arbitrary thresholds.
                </p>
              </div>
            </div>

            <div className="bg-slate-800/60 p-3.5 rounded-lg border border-slate-700 text-xs mb-4">
              <h4 className="font-semibold text-white mb-1.5 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-blue-400" />
                <span>Pre-Configured Planted Cases for Hackathon Judges:</span>
              </h4>
              <ul className="space-y-1.5 text-[11px] text-slate-300">
                <li className="flex items-start gap-1.5">
                  <span className="text-red-400 font-mono font-bold">CASE 1 (MPLAD-DEMO-1023):</span>
                  <span>Barmer Road Project — 92% funds spent with only 32% physical progress (60% gap), 34 payment installments, 18 months delayed.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-400 font-mono font-bold">CASE 2 (MPLAD-DEMO-0872 & 0914):</span>
                  <span>Jaipur Community Hall — 94% NLP text similarity in the same Gram Panchayat sanctioned within 3 months.</span>
                </li>
              </ul>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowSpecsModal(false);
                  handleRunDemoClick();
                }}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <PlayCircle className="w-4 h-4" />
                <span>Launch Demo Walkthrough</span>
              </button>
              <button
                onClick={() => setShowSpecsModal(false)}
                className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-lg text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
