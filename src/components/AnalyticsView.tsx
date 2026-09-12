import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ScatterChart,
  Scatter,
  ZAxis,
  CartesianGrid,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { AnalyzedProject } from '../types';

interface AnalyticsViewProps {
  analyzedProjects: AnalyzedProject[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ analyzedProjects }) => {
  // 1. Risk by State
  const stateRiskData = useMemo(() => {
    const map = new Map<string, { state: string; total: number; high: number; medium: number; low: number; totalCost: number }>();
    analyzedProjects.forEach((ap) => {
      const s = ap.project.state;
      const cur = map.get(s) || { state: s, total: 0, high: 0, medium: 0, low: 0, totalCost: 0 };
      cur.total++;
      cur.totalCost += ap.project.sanctionedCost;
      if (ap.risk.category === 'HIGH') cur.high++;
      else if (ap.risk.category === 'MEDIUM') cur.medium++;
      else cur.low++;
      map.set(s, cur);
    });
    return Array.from(map.values()).sort((a, b) => b.high - a.high);
  }, [analyzedProjects]);

  // 2. Delay Distribution (in 6-month bins)
  const delayData = useMemo(() => {
    const bins = {
      'On Schedule': 0,
      '1–6 Months': 0,
      '7–12 Months': 0,
      '13–24 Months': 0,
      '24+ Months (Stalled)': 0,
    };
    analyzedProjects.forEach((ap) => {
      const d = ap.metrics.delayMonths;
      if (d === 0) bins['On Schedule']++;
      else if (d <= 6) bins['1–6 Months']++;
      else if (d <= 12) bins['7–12 Months']++;
      else if (d <= 24) bins['13–24 Months']++;
      else bins['24+ Months (Stalled)']++;
    });
    return Object.entries(bins).map(([range, count]) => ({ range, count }));
  }, [analyzedProjects]);

  // 3. Average Cost by Category
  const categoryCostData = useMemo(() => {
    const map = new Map<string, { category: string; count: number; totalCost: number }>();
    analyzedProjects.forEach((ap) => {
      const c = ap.project.projectType;
      const cur = map.get(c) || { category: c, count: 0, totalCost: 0 };
      cur.count++;
      cur.totalCost += ap.project.sanctionedCost;
      map.set(c, cur);
    });
    return Array.from(map.values()).map((item) => ({
      category: item.category.length > 20 ? item.category.substring(0, 18) + '...' : item.category,
      avgCost: +(item.totalCost / item.count).toFixed(1),
      count: item.count,
    }));
  }, [analyzedProjects]);

  // 4. Scatter Sample: Financial Progress vs Physical Progress (Downsampled to 100 points for crispness)
  const scatterData = useMemo(() => {
    return analyzedProjects.slice(0, 120).map((ap) => ({
      id: ap.project.id,
      finProgress: ap.metrics.financialProgress,
      physProgress: ap.project.physicalProgress,
      gap: ap.metrics.progressGap,
      riskScore: ap.risk.totalScore,
      riskLevel: ap.risk.category,
    }));
  }, [analyzedProjects]);

  return (
    <div className="space-y-6">
      {/* Analytics Page Title */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900">Advanced Audit Analytics</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Macro statistical distributions, state-level risk densities, project delay timelines, and progress disparities
        </p>
      </div>

      {/* Row 1: State Risk Distribution & Category Costs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk by State */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-sm font-bold text-slate-900">Risk Profile by State</h3>
            <span className="text-[11px] text-slate-500">Stacked by Risk Severity</span>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Comparison of high, medium, and low risk project loads across states
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stateRiskData} margin={{ top: 10, right: 10, left: -10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="state" tick={{ fontSize: 10 }} angle={-25} textAnchor="end" interval={0} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="high" name="High Risk" fill="#dc2626" stackId="a" />
                <Bar dataKey="medium" name="Medium Risk" fill="#d97706" stackId="a" />
                <Bar dataKey="low" name="Low Risk" fill="#16a34a" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Delay Distribution */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-sm font-bold text-slate-900">Project Delay Distribution</h3>
            <span className="text-[11px] text-slate-500">Months Beyond Scheduled Target</span>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Categorization of execution timelines compared with administrative sanction terms
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={delayData} margin={{ top: 10, right: 10, left: -10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="range" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px' }} />
                <Bar dataKey="count" name="Projects" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                  {delayData.map((entry, index) => (
                    <Cell
                      key={`delay-${index}`}
                      fill={index === 4 ? '#ef4444' : index === 3 ? '#f97316' : '#3b82f6'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Financial vs Physical Scatter & Category Average Costs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial vs Physical Scatter */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-sm font-bold text-slate-900">
              Financial Progress vs Physical Progress Correlation
            </h3>
            <span className="text-[11px] text-slate-500">Outlier Analysis</span>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Points far above the 45° diagonal indicate high fund drawdowns with minimal physical completion
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  type="number"
                  dataKey="physProgress"
                  name="Physical Progress"
                  unit="%"
                  domain={[0, 100]}
                  tick={{ fontSize: 11 }}
                  label={{ value: 'Reported Physical Progress (%)', position: 'insideBottom', offset: -10, fontSize: 11 }}
                />
                <YAxis
                  type="number"
                  dataKey="finProgress"
                  name="Financial Progress"
                  unit="%"
                  domain={[0, 110]}
                  tick={{ fontSize: 11 }}
                  label={{ value: 'Financial Spend (%)', angle: -90, position: 'insideLeft', offset: 15, fontSize: 11 }}
                />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-2.5 rounded-lg text-xs shadow-md">
                          <p className="font-mono font-bold text-amber-300">{data.id}</p>
                          <p className="mt-0.5">Financial: {data.finProgress}%</p>
                          <p>Physical: {data.physProgress}%</p>
                          <p className="text-red-400 font-bold">Gap: {data.gap} pts</p>
                          <p className="text-slate-400">Risk Score: {data.riskScore}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter name="Projects" data={scatterData}>
                  {scatterData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.riskLevel === 'HIGH'
                          ? '#ef4444'
                          : entry.riskLevel === 'MEDIUM'
                          ? '#f59e0b'
                          : '#10b981'
                      }
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Average Cost by Category */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-sm font-bold text-slate-900">Average Sanctioned Cost by Category</h3>
            <span className="text-[11px] text-slate-500">₹ in Lakh</span>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Baseline mean cost benchmarks utilized by the peer cohort engine
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryCostData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 30, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 11 }} unit="L" />
                <YAxis dataKey="category" type="category" tick={{ fontSize: 10 }} width={120} />
                <Tooltip
                  formatter={(val: number | undefined) => [`₹${val ?? 0} Lakh`, 'Average Cost']}
                  contentStyle={{ fontSize: '12px', borderRadius: '8px' }}
                />
                <Bar dataKey="avgCost" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
