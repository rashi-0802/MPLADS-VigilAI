import React, { useMemo } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  Info,
  Building2,
  IndianRupee,
  PlayCircle,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import { AnalyzedProject, DashboardKPIs } from '../types';

interface DashboardViewProps {
  analyzedProjects: AnalyzedProject[];
  kpis?: DashboardKPIs;
  onSelectProject: (project: AnalyzedProject) => void;
  onNavigateToQueue: (filterPreset?: string) => void;
  onOpenJudgeTour?: () => void;
  onNavigateToClassify?: () => void;
}

const RISK_COLORS = {
  HIGH: '#dc2626', // Red 600
  MEDIUM: '#d97706', // Amber 600
  LOW: '#16a34a', // Green 600
};

export const DashboardView: React.FC<DashboardViewProps> = ({
  analyzedProjects = [],
  kpis,
  onSelectProject,
  onNavigateToQueue,
  onOpenJudgeTour,
  onNavigateToClassify,
}) => {
  // Resilient fallback KPI computation so undefined kpis never throws
  const effectiveKpis: DashboardKPIs = useMemo(() => {
    if (kpis) return kpis;
    const safeProjects = Array.isArray(analyzedProjects) ? analyzedProjects : [];
    const totalProjects = safeProjects.length;
    const totalExpenditureLakhs = safeProjects.reduce(
      (acc, p) => acc + (p?.project?.expenditure ?? (p?.project as any)?.expenditureLakhs ?? 0),
      0
    );
    const highRiskCount = safeProjects.filter((p) => p?.risk?.category === 'HIGH').length;
    const mediumRiskCount = safeProjects.filter((p) => p?.risk?.category === 'MEDIUM').length;
    const lowRiskCount = safeProjects.filter((p) => p?.risk?.category === 'LOW').length;
    const requiringReviewCount = safeProjects.filter(
      (p) =>
        p?.project?.reviewStatus === 'Pending Review' ||
        p?.project?.reviewStatus === 'Under Investigation'
    ).length;

    return {
      totalProjects,
      totalExpenditureLakhs,
      highRiskCount,
      mediumRiskCount,
      lowRiskCount,
      requiringReviewCount,
    };
  }, [kpis, analyzedProjects]);

  // Chart Data: Risk Distribution
  const riskPieData = [
    { name: 'High Risk (70-100)', value: effectiveKpis.highRiskCount, color: RISK_COLORS.HIGH },
    { name: 'Medium Risk (40-69)', value: effectiveKpis.mediumRiskCount, color: RISK_COLORS.MEDIUM },
    { name: 'Low Risk (0-39)', value: effectiveKpis.lowRiskCount, color: RISK_COLORS.LOW },
  ];

  // Chart Data: Anomaly Distribution
  const anomalyCounts: Record<string, number> = {
    'Cost Anomaly': 0,
    'Progress Mismatch': 0,
    'Delay': 0,
    'Payment Anomaly': 0,
    'Potential Duplicate': 0,
    'Compliance Issue': 0,
  };

  (analyzedProjects || []).forEach((ap) => {
    (ap?.flags || []).forEach((f) => {
      if (anomalyCounts[f.type] !== undefined) {
        anomalyCounts[f.type]++;
      }
    });
  });

  const anomalyBarData = [
    { type: 'Cost Anomaly', count: anomalyCounts['Cost Anomaly'], fill: '#ef4444' },
    { type: 'Progress Mismatch', count: anomalyCounts['Progress Mismatch'], fill: '#f97316' },
    { type: 'Delay', count: anomalyCounts['Delay'], fill: '#f59e0b' },
    { type: 'Payment Anomaly', count: anomalyCounts['Payment Anomaly'], fill: '#8b5cf6' },
    { type: 'Potential Duplicate', count: anomalyCounts['Potential Duplicate'], fill: '#06b6d4' },
    { type: 'Compliance Issue', count: anomalyCounts['Compliance Issue'], fill: '#ec4899' },
  ];

  // Status Distribution
  const statusCounts = {
    Completed: 0,
    Ongoing: 0,
    Delayed: 0,
    Stalled: 0,
  };
  (analyzedProjects || []).forEach((ap) => {
    if (ap?.project?.status && statusCounts[ap.project.status] !== undefined) {
      statusCounts[ap.project.status]++;
    }
  });

  // Top 6 Highest Risk Projects
  const highRiskTop = analyzedProjects.slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Statutory Disclaimer Banner */}
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg shadow-xs flex items-start space-x-3 text-amber-900">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed">
          <p className="font-semibold text-amber-950">
            Official Advisory & Decision-Support Scope
          </p>
          <p className="mt-0.5">
            <strong>MPLADS VigilAI identifies anomalies and risk signals. It does not determine or prove fraud.</strong>{' '}
            Final verification, physical measurement, and regulatory action remain with authorized audit and administrative officials.
          </p>
        </div>
      </div>

      {/* Featured Test Cases Quick Launcher for Judges */}
      <div className="bg-slate-900 text-white rounded-xl p-4 shadow-sm border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
              SIH26102 Quick Evaluation Panel
            </span>
            <h2 className="text-sm font-bold text-white">
              Target Reference Case Studies (Pre-Configured for Judges)
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 hidden sm:inline">Click any card to inspect immediate explainable evidence</span>
            {onOpenJudgeTour && (
              <button
                onClick={onOpenJudgeTour}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-2.5 py-1 rounded text-xs flex items-center gap-1 transition-all active:scale-95"
              >
                <PlayCircle className="w-3.5 h-3.5" />
                <span>2-Min Judge Tour</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {/* Case 1 */}
          <button
            onClick={() => {
              const c1 = analyzedProjects.find((p) => p.project.id === 'MPLAD-DEMO-1023');
              if (c1) onSelectProject(c1);
            }}
            className="text-left bg-slate-800/90 hover:bg-slate-750 p-3 rounded-lg border border-red-500/40 transition-all hover:border-red-400 group"
          >
            <div className="flex justify-between items-center mb-1">
              <span className="font-mono text-red-400 font-bold">CASE 1: MPLAD-DEMO-1023</span>
              <span className="bg-red-950 text-red-300 px-1.5 py-0.5 rounded text-[10px] font-bold border border-red-800">
                Score: 87 (HIGH)
              </span>
            </div>
            <p className="font-medium text-slate-200 truncate">Road Construction, Barmer (Rajasthan)</p>
            <p className="text-slate-400 text-[11px] mt-1 line-clamp-2">
              92% financial spent vs 32% physical progress (60% gap), 34 payments, cost anomaly.
            </p>
            <span className="text-blue-400 font-semibold text-[11px] mt-2 inline-flex items-center gap-1 group-hover:underline">
              Inspect Case 1 <ChevronRight className="w-3 h-3" />
            </span>
          </button>

          {/* Case 2 */}
          <button
            onClick={() => {
              const c2 = analyzedProjects.find((p) => p.project.id === 'MPLAD-DEMO-0872');
              if (c2) onSelectProject(c2);
            }}
            className="text-left bg-slate-800/90 hover:bg-slate-750 p-3 rounded-lg border border-amber-500/40 transition-all hover:border-amber-400 group"
          >
            <div className="flex justify-between items-center mb-1">
              <span className="font-mono text-amber-400 font-bold">CASE 2: MPLAD-DEMO-0872</span>
              <span className="bg-amber-950 text-amber-300 px-1.5 py-0.5 rounded text-[10px] font-bold border border-amber-800">
                Score: 68 (MEDIUM)
              </span>
            </div>
            <p className="font-medium text-slate-200 truncate">Potential Duplicate Work (Jaipur)</p>
            <p className="text-slate-400 text-[11px] mt-1 line-clamp-2">
              94% NLP similarity detected with MPLAD-DEMO-0914 (Community Hall/Centre Rampura).
            </p>
            <span className="text-blue-400 font-semibold text-[11px] mt-2 inline-flex items-center gap-1 group-hover:underline">
              Inspect Case 2 <ChevronRight className="w-3 h-3" />
            </span>
          </button>

          {/* Normal Case */}
          <button
            onClick={() => {
              const cNormal = analyzedProjects.find((p) => p.project.id === 'MPLAD-DEMO-0402');
              if (cNormal) onSelectProject(cNormal);
            }}
            className="text-left bg-slate-800/90 hover:bg-slate-750 p-3 rounded-lg border border-emerald-500/40 transition-all hover:border-emerald-400 group"
          >
            <div className="flex justify-between items-center mb-1">
              <span className="font-mono text-emerald-400 font-bold">BENCHMARK: MPLAD-DEMO-0402</span>
              <span className="bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded text-[10px] font-bold border border-emerald-800">
                Score: 18 (LOW)
              </span>
            </div>
            <p className="font-medium text-slate-200 truncate">Normal Compliant Solar Lighting</p>
            <p className="text-slate-400 text-[11px] mt-1 line-clamp-2">
              Sanctioned ₹20L, Exp ₹17L, 82% physical progress, 7 payments. Not falsely flagged.
            </p>
            <span className="text-blue-400 font-semibold text-[11px] mt-2 inline-flex items-center gap-1 group-hover:underline">
              Inspect Low-Risk <ChevronRight className="w-3 h-3" />
            </span>
          </button>
        </div>
      </div>

      {/* AI Work Classification Quick Banner */}
      {onNavigateToClassify && (
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-4 rounded-xl shadow-xs border border-blue-700/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start space-x-3">
            <div className="w-9 h-9 rounded-lg bg-blue-500/20 border border-blue-400/40 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>Enter Work Done & Run AI Risk Classification</span>
                <span className="bg-amber-400 text-slate-950 text-[10px] font-bold px-1.5 py-0.2 rounded uppercase">
                  AI Classifier
                </span>
              </h3>
              <p className="text-xs text-blue-200 mt-0.5">
                Input project financials, ground physical progress, and site observations. The AI will classify it as High, Medium, or Low risk with forensic audit reasoning.
              </p>
            </div>
          </div>
          <button
            onClick={onNavigateToClassify}
            className="shrink-0 bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold px-3.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <span>Classify New Work</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Projects */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Total Projects</span>
            <Building2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">
            {effectiveKpis.totalProjects.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500">100% Verified in Batch</span>
        </div>

        {/* Total Expenditure */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Expenditure</span>
            <IndianRupee className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">
            ₹{(effectiveKpis.totalExpenditureLakhs / 100).toFixed(2)} Cr
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            ₹{effectiveKpis.totalExpenditureLakhs.toFixed(1)} Lakhs Total
          </span>
        </div>

        {/* High Risk */}
        <div
          onClick={() => onNavigateToQueue('HIGH')}
          className="bg-red-50/70 p-3.5 rounded-xl border border-red-200 shadow-xs cursor-pointer hover:bg-red-50 transition-colors"
        >
          <div className="flex items-center justify-between text-red-700 text-xs mb-1 font-semibold">
            <span>High Risk (70+)</span>
            <ShieldAlert className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-red-700 tracking-tight">
            {effectiveKpis.highRiskCount}
          </div>
          <span className="text-[11px] text-red-600 font-medium">
            {((effectiveKpis.highRiskCount / (effectiveKpis.totalProjects || 1)) * 100).toFixed(1)}% of cohort
          </span>
        </div>

        {/* Medium Risk */}
        <div
          onClick={() => onNavigateToQueue('MEDIUM')}
          className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200 shadow-xs cursor-pointer hover:bg-amber-50 transition-colors"
        >
          <div className="flex items-center justify-between text-amber-700 text-xs mb-1 font-semibold">
            <span>Medium (40-69)</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-700 tracking-tight">
            {effectiveKpis.mediumRiskCount}
          </div>
          <span className="text-[11px] text-amber-600 font-medium">
            {((effectiveKpis.mediumRiskCount / (effectiveKpis.totalProjects || 1)) * 100).toFixed(1)}% of cohort
          </span>
        </div>

        {/* Low Risk */}
        <div
          onClick={() => onNavigateToQueue('LOW')}
          className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200 shadow-xs cursor-pointer hover:bg-emerald-50 transition-colors"
        >
          <div className="flex items-center justify-between text-emerald-700 text-xs mb-1 font-semibold">
            <span>Low Risk (0-39)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700 tracking-tight">
            {effectiveKpis.lowRiskCount}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">
            {((effectiveKpis.lowRiskCount / (effectiveKpis.totalProjects || 1)) * 100).toFixed(1)}% normal
          </span>
        </div>

        {/* Requiring Review */}
        <div
          onClick={() => onNavigateToQueue('REVIEW')}
          className="bg-blue-50/70 p-3.5 rounded-xl border border-blue-200 shadow-xs cursor-pointer hover:bg-blue-50 transition-colors"
        >
          <div className="flex items-center justify-between text-blue-700 text-xs mb-1 font-semibold">
            <span>Action Required</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-800 tracking-tight">
            {effectiveKpis.requiringReviewCount}
          </div>
          <span className="text-[11px] text-blue-600 font-medium">Pending Auditor Review</span>
        </div>
      </div>

      {/* Visual Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Risk Distribution Donut Chart (4 cols) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold text-slate-800">Risk Distribution</h3>
              <span className="text-[11px] text-slate-500">Multi-Signal Score</span>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Proportion of projects categorized by audit priority
            </p>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {riskPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: number | undefined) => [
                    `${val ?? 0} projects (${(((val ?? 0) / (effectiveKpis.totalProjects || 1)) * 100).toFixed(1)}%)`,
                    'Count',
                  ]}
                  contentStyle={{ fontSize: '12px', borderRadius: '8px' }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-2 border-t border-slate-100 grid grid-cols-3 text-center text-xs">
            <div>
              <span className="text-red-600 font-bold block text-sm">{effectiveKpis.highRiskCount}</span>
              <span className="text-slate-500 text-[11px]">High (70+)</span>
            </div>
            <div>
              <span className="text-amber-600 font-bold block text-sm">{effectiveKpis.mediumRiskCount}</span>
              <span className="text-slate-500 text-[11px]">Medium (40-69)</span>
            </div>
            <div>
              <span className="text-emerald-600 font-bold block text-sm">{effectiveKpis.lowRiskCount}</span>
              <span className="text-slate-500 text-[11px]">Low (0-39)</span>
            </div>
          </div>
        </div>

        {/* Anomaly Distribution Bar Chart (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-bold text-slate-800">Anomaly Distribution</h3>
            <span className="text-[11px] text-slate-500">Triggered Signals</span>
          </div>
          <p className="text-xs text-slate-500 mb-3">
            Frequency of specific anomaly flags across the analyzed dataset
          </p>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={anomalyBarData} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="type" type="category" tick={{ fontSize: 11 }} width={110} />
                <Tooltip
                  formatter={(val: number | undefined) => [`${val ?? 0} flags`, 'Triggered Projects']}
                  contentStyle={{ fontSize: '12px', borderRadius: '8px' }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {anomalyBarData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Project Status Summary (3 cols) */}
        <div className="lg:col-span-3 bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 mb-1">Execution Status</h3>
            <p className="text-xs text-slate-500 mb-4">Reported physical lifecycle status</p>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-medium mb-1">
                <span className="text-slate-700">Completed</span>
                <span className="text-emerald-700 font-bold">{statusCounts.Completed}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-emerald-500 h-2 rounded-full"
                  style={{ width: `${(statusCounts.Completed / (effectiveKpis.totalProjects || 1)) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-medium mb-1">
                <span className="text-slate-700">Ongoing</span>
                <span className="text-blue-700 font-bold">{statusCounts.Ongoing}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${(statusCounts.Ongoing / (effectiveKpis.totalProjects || 1)) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-medium mb-1">
                <span className="text-slate-700">Delayed</span>
                <span className="text-amber-700 font-bold">{statusCounts.Delayed}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-amber-500 h-2 rounded-full"
                  style={{ width: `${(statusCounts.Delayed / (effectiveKpis.totalProjects || 1)) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-medium mb-1">
                <span className="text-slate-700">Stalled</span>
                <span className="text-red-700 font-bold">{statusCounts.Stalled}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full"
                  style={{ width: `${(statusCounts.Stalled / (effectiveKpis.totalProjects || 1)) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between items-center">
            <span>Stalled/Delayed Rate:</span>
            <span className="font-semibold text-slate-800">
              {(((statusCounts.Delayed + statusCounts.Stalled) / (effectiveKpis.totalProjects || 1)) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Recent High-Risk Alerts Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
              <h3 className="text-sm font-bold text-slate-900">Highest-Priority Anomaly Alerts</h3>
            </div>
            <p className="text-xs text-slate-500">
              Projects exhibiting multiple converging statistical, progress, or NLP duplicate signals
            </p>
          </div>
          <button
            onClick={() => onNavigateToQueue('ALL')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
          >
            <span>View Complete Queue ({analyzedProjects.length})</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-slate-600 border-b border-slate-200 font-semibold">
                <th className="py-3 px-4">Project ID</th>
                <th className="py-3 px-4">Location & State</th>
                <th className="py-3 px-4">Project Category</th>
                <th className="py-3 px-4">Sanctioned & Spent</th>
                <th className="py-3 px-4">Risk / Anomaly Score</th>
                <th className="py-3 px-4">Primary Anomaly Signal</th>
                <th className="py-3 px-4">Review Status</th>
                <th className="py-3 px-4 text-right">Investigation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {highRiskTop.map((item) => {
                const isHigh = item.risk.category === 'HIGH';
                return (
                  <tr
                    key={item.project.id}
                    onClick={() => onSelectProject(item)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-blue-700 whitespace-nowrap">
                      {item.project.id}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">{item.project.district}</div>
                      <div className="text-[11px] text-slate-500">{item.project.state}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-700 whitespace-nowrap">
                      {item.project.projectType}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-900">₹{item.project.sanctionedCost}L</div>
                      <div className="text-[11px] text-slate-500">Exp: ₹{item.project.expenditure}L</div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`inline-flex items-center justify-center font-bold px-2 py-0.5 rounded text-xs border ${
                            isHigh
                              ? 'bg-red-50 text-red-700 border-red-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          {item.risk.totalScore} / 100
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500">
                          {item.risk.category}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800 line-clamp-1 max-w-xs">
                        {item.risk.primaryAlert}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {item.flags.length} anomaly signal{item.flags.length > 1 ? 's' : ''} triggered
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                          item.project.reviewStatus === 'Under Investigation'
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                            : item.project.reviewStatus === 'Cleared'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {item.project.reviewStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectProject(item);
                        }}
                        className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold px-2.5 py-1 rounded border border-blue-200 transition-colors"
                      >
                        Inspect Dossier
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
