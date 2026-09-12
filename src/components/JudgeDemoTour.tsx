import React from 'react';
import {
  X,
  Play,
  CheckCircle2,
  AlertTriangle,
  FileSearch,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Award,
} from 'lucide-react';
import { AnalyzedProject } from '../types';

interface JudgeDemoTourProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerDemoCase: (projectId: string) => void;
  onRunFullPipeline: () => void;
}

export const JudgeDemoTour: React.FC<JudgeDemoTourProps> = ({
  isOpen,
  onClose,
  onTriggerDemoCase,
  onRunFullPipeline,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white p-5 flex items-start justify-between border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded tracking-wider uppercase flex items-center gap-1">
                <Award className="w-3 h-3" /> SIH 2026 Evaluation Flow
              </span>
              <span className="text-xs text-blue-200 font-mono">Problem ID: SIH26102</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold">
              2–3 Minute Judge Demonstration Guide
            </h2>
            <p className="text-xs text-slate-300">
              Follow this structured sequence to demonstrate the full audit intelligence pipeline
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps Content */}
        <div className="p-5 space-y-4 text-xs">
          {/* Step 1: Run Analysis Pipeline */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-start space-x-3">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
              1
            </span>
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900">Run the Audit AI Pipeline</h4>
                <button
                  onClick={() => {
                    onRunFullPipeline();
                    onClose();
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 rounded font-semibold text-[11px] flex items-center gap-1 transition-colors"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Execute Pipeline</span>
                </button>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Processes the curated cohort of MPLADS projects through 6 stages: Validation → Cohort Statistics → Isolation Forest → NLP Duplicate Analysis → Risk Scoring → Explainable Alert Generation.
              </p>
            </div>
          </div>

          {/* Step 2: Showcase Planted Case 1 (Road Project) */}
          <div className="bg-red-50/70 p-3.5 rounded-xl border border-red-200 flex items-start space-x-3">
            <span className="w-6 h-6 rounded-full bg-red-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
              2
            </span>
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-red-950">
                    Planted Case 1: Rural Road (MPLAD-DEMO-1023)
                  </h4>
                  <span className="bg-red-200 text-red-900 text-[10px] font-bold px-1.5 rounded">
                    Score: 91/100
                  </span>
                </div>
                <button
                  onClick={() => {
                    onTriggerDemoCase('MPLAD-DEMO-1023');
                    onClose();
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-2.5 py-1 rounded font-semibold text-[11px] flex items-center gap-1 transition-colors"
                >
                  <span>Open Dossier</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <p className="text-red-900 leading-relaxed">
                Highlights <strong>Cost Anomaly</strong> (3.67× peer median: ₹88.0L vs ₹24.0L), <strong>Progress Mismatch</strong> (91.8% financial vs 32.0% physical = 59.8 pt gap), and <strong>Execution Delay</strong> (18 months overdue).
              </p>
            </div>
          </div>

          {/* Step 3: Showcase Planted Case 2 (Duplicate Work) */}
          <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200 flex items-start space-x-3">
            <span className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
              3
            </span>
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-amber-950">
                    Planted Case 2: Potential Duplicate Work (MPLAD-DEMO-1456)
                  </h4>
                  <span className="bg-amber-200 text-amber-900 text-[10px] font-bold px-1.5 rounded">
                    Score: 78/100
                  </span>
                </div>
                <button
                  onClick={() => {
                    onTriggerDemoCase('MPLAD-DEMO-1456');
                    onClose();
                  }}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-2.5 py-1 rounded font-semibold text-[11px] flex items-center gap-1 transition-colors"
                >
                  <span>Open Dossier</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <p className="text-amber-900 leading-relaxed">
                Detects <strong>94% semantic description similarity</strong> with nearby community hall project (MPLAD-DEMO-1457) in same Gram Panchayat sanctioned within 3 months of each other.
              </p>
            </div>
          </div>

          {/* Step 4: Auditor Decision Support */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-start space-x-3">
            <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
              4
            </span>
            <div className="space-y-1 flex-1">
              <h4 className="font-bold text-slate-900">
                Auditor Decision-Support & Investigation Queue
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Demonstrate how government audit officers can sort by risk score, filter by anomaly type, append physical field inspection notes, and update the review status to "Under Investigation".
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-3.5 px-5 border-t border-slate-200 flex justify-between items-center text-xs">
          <span className="text-slate-500">
            Smart India Hackathon 2026 • Theme: Smart Automation
          </span>
          <button
            onClick={onClose}
            className="bg-slate-900 text-white font-semibold px-4 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            Got it, Let's Begin
          </button>
        </div>
      </div>
    </div>
  );
};
