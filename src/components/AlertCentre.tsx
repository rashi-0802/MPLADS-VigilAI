import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Flame,
  ArrowRight,
  Filter,
  CheckCircle2,
  GitCompare,
  TrendingUp,
} from 'lucide-react';
import { AnalyzedProject } from '../types';

interface AlertCentreProps {
  analyzedProjects: AnalyzedProject[];
  onSelectProject: (project: AnalyzedProject) => void;
}

export const AlertCentre: React.FC<AlertCentreProps> = ({
  analyzedProjects,
  onSelectProject,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<'ALL' | 'HIGH' | 'MEDIUM'>('ALL');
  const [filterType, setFilterType] = useState<string>('ALL');

  // Filter projects with at least one flag
  const flaggedProjects = analyzedProjects.filter((ap) => ap.flags.length > 0);

  const filtered = flaggedProjects.filter((item) => {
    if (filterSeverity !== 'ALL' && item.risk.category !== filterSeverity) return false;
    if (filterType !== 'ALL') {
      const hasType = item.flags.some((f) => f.type === filterType);
      if (!hasType) return false;
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Alert Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></div>
            <h2 className="text-lg font-bold text-slate-900">Alert Centre</h2>
            <span className="bg-red-50 text-red-700 text-xs px-2 py-0.5 rounded-full font-bold border border-red-200">
              {flaggedProjects.length} Active Anomaly Alerts
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time feed of flagged project deviations across expenditure, progress gaps, delays, and NLP duplicates
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center space-x-2 text-xs">
          <button
            onClick={() => setFilterSeverity('ALL')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              filterSeverity === 'ALL'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Alerts
          </button>
          <button
            onClick={() => setFilterSeverity('HIGH')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center space-x-1 ${
              filterSeverity === 'HIGH'
                ? 'bg-red-600 text-white'
                : 'bg-red-50 text-red-700 hover:bg-red-100'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>High Risk Only</span>
          </button>
          <button
            onClick={() => setFilterSeverity('MEDIUM')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center space-x-1 ${
              filterSeverity === 'MEDIUM'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Medium Risk</span>
          </button>
        </div>
      </div>

      {/* Alert Feed Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((item) => {
          const isHigh = item.risk.category === 'HIGH';
          const topFlag = item.flags[0];

          return (
            <div
              key={item.project.id}
              onClick={() => onSelectProject(item)}
              className={`p-4 rounded-xl border transition-all cursor-pointer hover:shadow-md ${
                isHigh
                  ? 'bg-white border-red-200 hover:border-red-400'
                  : 'bg-white border-amber-200 hover:border-amber-400'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span
                    className={`inline-flex items-center text-xs font-bold px-2 py-0.5 rounded border ${
                      isHigh
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {isHigh ? '🔴 HIGH RISK' : '🟠 MEDIUM RISK'}
                  </span>
                  <span className="font-mono font-bold text-slate-900 text-xs">
                    {item.project.id}
                  </span>
                </div>
                <span className="font-bold text-slate-800 text-xs">
                  Score: {item.risk.totalScore}/100
                </span>
              </div>

              <div className="mt-2.5">
                <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                  {item.risk.primaryAlert}
                </h4>
                <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                  {topFlag ? topFlag.explanation : item.project.description}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>
                  {item.project.district}, {item.project.state} • ₹{item.project.sanctionedCost}L
                </span>
                <span className="text-blue-600 font-semibold inline-flex items-center gap-0.5">
                  Open Dossier <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
