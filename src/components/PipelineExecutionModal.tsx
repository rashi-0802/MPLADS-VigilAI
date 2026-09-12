import React from 'react';
import { Loader2, CheckCircle2, Cpu, FileCheck, Layers, Sparkles } from 'lucide-react';

interface PipelineExecutionModalProps {
  currentStage: number; // 0 to 5
  isOpen: boolean;
}

export const PipelineExecutionModal: React.FC<PipelineExecutionModalProps> = ({
  currentStage,
  isOpen,
}) => {
  if (!isOpen) return null;

  const stages = [
    {
      title: 'Rule-Based Compliance Checks',
      desc: 'Validating 1,000 project records against 6 statutory constraints (cost caps, dates, payments)',
    },
    {
      title: 'Cohort Benchmarking & Statistical Outliers',
      desc: 'Computing project type medians, IQR fences, financial vs physical progress gaps',
    },
    {
      title: 'Isolation Forest ML Anomaly Engine',
      desc: 'Training ensemble random partition trees on 5 continuous multivariate features',
    },
    {
      title: 'NLP Duplicate & Semantic Similarity Matrix',
      desc: 'Running shingle n-gram & TF-IDF vectorizer across project descriptions and geographic proximity',
    },
    {
      title: 'Composite Risk Scoring & Explainable Alerts',
      desc: 'Synthesizing weighted multi-signal scores (Cost, Progress Gap, Delay, Duplicate, ML)',
    },
    {
      title: 'Investigation Queue Prioritization',
      desc: 'Rank-ordering high-risk triage backlog for official auditor investigation',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="text-center space-y-1">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2 border border-blue-100">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            Executing Audit AI Intelligence Pipeline
          </h3>
          <p className="text-xs text-slate-500">
            Processing 1,000 synthetic records through full statistical and ML inference models
          </p>
        </div>

        {/* Stages List */}
        <div className="space-y-3">
          {stages.map((stage, idx) => {
            const isDone = currentStage > idx;
            const isCurrent = currentStage === idx;

            return (
              <div
                key={idx}
                className={`p-3 rounded-xl border text-xs flex items-start space-x-3 transition-all ${
                  isCurrent
                    ? 'bg-blue-50 border-blue-300 text-blue-950 shadow-xs'
                    : isDone
                    ? 'bg-emerald-50/60 border-emerald-200 text-slate-800'
                    : 'bg-slate-50/60 border-slate-200 text-slate-400'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[10px] text-slate-400">
                      {idx + 1}
                    </div>
                  )}
                </div>

                <div className="space-y-0.5 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">
                      {stage.title}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.2 rounded animate-pulse">
                        In progress
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] opacity-80 leading-relaxed">{stage.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center text-[11px] text-slate-400">
          Running in-browser mathematical simulation • Pure TypeScript runtime
        </div>
      </div>
    </div>
  );
};
