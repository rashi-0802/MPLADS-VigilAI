import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Filter,
  ArrowUpDown,
  Download,
  ExternalLink,
  Search,
} from 'lucide-react';
import { AnalyzedProject, ReviewStatus, RiskLevel } from '../types';

interface InvestigationQueueProps {
  projects: AnalyzedProject[];
  onSelectProject: (project: AnalyzedProject) => void;
  onUpdateReviewStatus: (projectId: string, newStatus: ReviewStatus) => void;
  initialRiskFilter?: string;
}

export const InvestigationQueue: React.FC<InvestigationQueueProps> = ({
  projects,
  onSelectProject,
  onUpdateReviewStatus,
  initialRiskFilter,
}) => {
  // Filter States
  const [selectedState, setSelectedState] = useState<string>('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<string>(initialRiskFilter || 'ALL');
  const [selectedAnomalyType, setSelectedAnomalyType] = useState<string>('ALL');
  const [selectedProjectType, setSelectedProjectType] = useState<string>('ALL');
  const [selectedReviewStatus, setSelectedReviewStatus] = useState<string>('ALL');
  const [localSearch, setLocalSearch] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'risk-desc' | 'risk-asc' | 'cost-desc' | 'gap-desc'>('risk-desc');

  // Derive unique filter options
  const uniqueStates = useMemo(() => {
    return Array.from(new Set(projects.map((p) => p.project.state))).sort();
  }, [projects]);

  const uniqueDistricts = useMemo(() => {
    const subset = selectedState === 'ALL'
      ? projects
      : projects.filter((p) => p.project.state === selectedState);
    return Array.from(new Set(subset.map((p) => p.project.district))).sort();
  }, [projects, selectedState]);

  const uniqueProjectTypes = useMemo(() => {
    return Array.from(new Set(projects.map((p) => p.project.projectType))).sort();
  }, [projects]);

  // Filtered & Sorted Projects
  const filteredProjects = useMemo(() => {
    return projects.filter((item) => {
      const p = item.project;
      if (selectedState !== 'ALL' && p.state !== selectedState) return false;
      if (selectedDistrict !== 'ALL' && p.district !== selectedDistrict) return false;
      if (selectedRiskLevel !== 'ALL' && item.risk.category !== selectedRiskLevel) return false;
      if (selectedProjectType !== 'ALL' && p.projectType !== selectedProjectType) return false;
      if (selectedReviewStatus !== 'ALL' && p.reviewStatus !== selectedReviewStatus) return false;

      if (selectedAnomalyType !== 'ALL') {
        const hasType = item.flags.some((f) => f.type === selectedAnomalyType);
        if (!hasType) return false;
      }

      if (localSearch.trim()) {
        const q = localSearch.toLowerCase();
        const matches =
          p.id.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.implementingAgency.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortOrder === 'risk-desc') return b.risk.totalScore - a.risk.totalScore;
      if (sortOrder === 'risk-asc') return a.risk.totalScore - b.risk.totalScore;
      if (sortOrder === 'cost-desc') return b.project.sanctionedCost - a.project.sanctionedCost;
      if (sortOrder === 'gap-desc') return b.metrics.progressGap - a.metrics.progressGap;
      return 0;
    });
  }, [
    projects,
    selectedState,
    selectedDistrict,
    selectedRiskLevel,
    selectedAnomalyType,
    selectedProjectType,
    selectedReviewStatus,
    localSearch,
    sortOrder,
  ]);

  const handleExportCSV = () => {
    const headers = [
      'Project ID',
      'State',
      'District',
      'Project Type',
      'Sanctioned Cost (Lakh)',
      'Expenditure (Lakh)',
      'Financial %',
      'Physical %',
      'Gap pts',
      'Risk Score',
      'Risk Level',
      'Primary Alert',
      'Review Status',
    ];

    const rows = filteredProjects.map((p) => [
      p.project.id,
      p.project.state,
      p.project.district,
      `"${p.project.projectType}"`,
      p.project.sanctionedCost,
      p.project.expenditure,
      p.metrics.financialProgress,
      p.project.physicalProgress,
      p.metrics.progressGap,
      p.risk.totalScore,
      p.risk.category,
      `"${p.risk.primaryAlert}"`,
      p.project.reviewStatus,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MPLADS_Investigation_Queue_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-bold text-slate-900">Investigation Queue</h2>
            <span className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded-full font-mono font-semibold">
              {filteredProjects.length} Projects Loaded
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            AI prioritizes unusual multi-signal patterns → Authorized audit officials perform human verification
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-3 py-1.5 rounded-lg border border-slate-300 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Multi-Facet Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-600 font-semibold border-b border-slate-100 pb-2">
          <div className="flex items-center space-x-1.5">
            <Filter className="w-3.5 h-3.5 text-blue-600" />
            <span>Audit Triage Filters</span>
          </div>
          {(selectedState !== 'ALL' ||
            selectedDistrict !== 'ALL' ||
            selectedRiskLevel !== 'ALL' ||
            selectedAnomalyType !== 'ALL' ||
            selectedProjectType !== 'ALL' ||
            selectedReviewStatus !== 'ALL' ||
            localSearch) && (
            <button
              onClick={() => {
                setSelectedState('ALL');
                setSelectedDistrict('ALL');
                setSelectedRiskLevel('ALL');
                setSelectedAnomalyType('ALL');
                setSelectedProjectType('ALL');
                setSelectedReviewStatus('ALL');
                setLocalSearch('');
              }}
              className="text-xs text-blue-600 hover:underline"
            >
              Reset All Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs">
          {/* State */}
          <div>
            <label className="block text-[11px] text-slate-500 mb-1">State</label>
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedDistrict('ALL');
              }}
              className="w-full bg-slate-50 border border-slate-300 rounded-md p-1.5 text-slate-800"
            >
              <option value="ALL">All States</option>
              {uniqueStates.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* District */}
          <div>
            <label className="block text-[11px] text-slate-500 mb-1">District</label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-md p-1.5 text-slate-800"
            >
              <option value="ALL">All Districts</option>
              {uniqueDistricts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Risk Level */}
          <div>
            <label className="block text-[11px] text-slate-500 mb-1">Risk Level</label>
            <select
              value={selectedRiskLevel}
              onChange={(e) => setSelectedRiskLevel(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-md p-1.5 text-slate-800"
            >
              <option value="ALL">All Risk Tiers</option>
              <option value="HIGH">High Risk (70–100)</option>
              <option value="MEDIUM">Medium Risk (40–69)</option>
              <option value="LOW">Low Risk (0–39)</option>
            </select>
          </div>

          {/* Anomaly Type */}
          <div>
            <label className="block text-[11px] text-slate-500 mb-1">Anomaly Type</label>
            <select
              value={selectedAnomalyType}
              onChange={(e) => setSelectedAnomalyType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-md p-1.5 text-slate-800"
            >
              <option value="ALL">All Anomaly Types</option>
              <option value="Cost Anomaly">Cost Anomaly</option>
              <option value="Progress Mismatch">Progress Mismatch</option>
              <option value="Delay">Execution Delay</option>
              <option value="Payment Anomaly">Payment Anomaly</option>
              <option value="Potential Duplicate">Potential Duplicate</option>
              <option value="Compliance Issue">Compliance Issue</option>
            </select>
          </div>

          {/* Project Category */}
          <div>
            <label className="block text-[11px] text-slate-500 mb-1">Project Category</label>
            <select
              value={selectedProjectType}
              onChange={(e) => setSelectedProjectType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-md p-1.5 text-slate-800"
            >
              <option value="ALL">All Categories</option>
              {uniqueProjectTypes.map((pt) => (
                <option key={pt} value={pt}>
                  {pt}
                </option>
              ))}
            </select>
          </div>

          {/* Review Status */}
          <div>
            <label className="block text-[11px] text-slate-500 mb-1">Review Status</label>
            <select
              value={selectedReviewStatus}
              onChange={(e) => setSelectedReviewStatus(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-md p-1.5 text-slate-800"
            >
              <option value="ALL">All Statuses</option>
              <option value="Pending Review">Pending Review</option>
              <option value="Under Investigation">Under Investigation</option>
              <option value="Reviewed">Reviewed</option>
              <option value="Cleared">Cleared</option>
            </select>
          </div>
        </div>

        {/* Search & Sort Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-slate-100">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter queue by ID, village, agency..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-md pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500">Sort by:</span>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-md p-1 text-slate-700 font-medium"
            >
              <option value="risk-desc">Highest Risk Score First</option>
              <option value="risk-asc">Lowest Risk Score First</option>
              <option value="cost-desc">Sanctioned Cost (High to Low)</option>
              <option value="gap-desc">Progress Gap (High to Low)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                <th className="py-3 px-4">Project ID</th>
                <th className="py-3 px-4">State & District</th>
                <th className="py-3 px-4">Category & Location</th>
                <th className="py-3 px-4">Financials & Gap</th>
                <th className="py-3 px-4">Risk / Anomaly Score</th>
                <th className="py-3 px-4">Primary Anomaly Signal</th>
                <th className="py-3 px-4">Review Status</th>
                <th className="py-3 px-4 text-right">Auditor Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No projects match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredProjects.map((item) => {
                  const p = item.project;
                  const isHigh = item.risk.category === 'HIGH';
                  const isMedium = item.risk.category === 'MEDIUM';

                  return (
                    <tr
                      key={p.id}
                      onClick={() => onSelectProject(item)}
                      className="hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      {/* Project ID */}
                      <td className="py-3 px-4 font-mono font-bold text-blue-700 whitespace-nowrap">
                        {p.id}
                      </td>

                      {/* State & District */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-800">{p.district}</div>
                        <div className="text-[11px] text-slate-500">{p.state}</div>
                      </td>

                      {/* Category & Location */}
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800">{p.projectType}</div>
                        <div className="text-[11px] text-slate-500 line-clamp-1">{p.location}</div>
                      </td>

                      {/* Financials & Gap */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-medium text-slate-900">
                          ₹{p.sanctionedCost}L <span className="text-slate-400 font-normal">(Spent: ₹{p.expenditure}L)</span>
                        </div>
                        <div className="text-[11px] flex items-center gap-1.5 mt-0.5">
                          <span className="text-slate-600">Fin: {item.metrics.financialProgress}%</span>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-600">Phys: {p.physicalProgress}%</span>
                          {item.metrics.progressGap > 25 && (
                            <span className="text-red-600 font-bold bg-red-50 px-1 rounded text-[10px]">
                              Δ {item.metrics.progressGap} pts
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Risk Score */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`inline-flex items-center font-bold px-2 py-0.5 rounded text-xs border ${
                              isHigh
                                ? 'bg-red-50 text-red-700 border-red-200'
                                : isMedium
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            }`}
                          >
                            {isHigh ? (
                              <ShieldAlert className="w-3 h-3 mr-1 text-red-600" />
                            ) : isMedium ? (
                              <AlertTriangle className="w-3 h-3 mr-1 text-amber-600" />
                            ) : (
                              <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                            )}
                            {item.risk.totalScore}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-600">
                            {item.risk.category}
                          </span>
                        </div>
                      </td>

                      {/* Primary Alert */}
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800 line-clamp-1 max-w-xs">
                          {item.risk.primaryAlert}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center space-x-1.5 mt-0.5">
                          <span>{item.flags.length} signal{item.flags.length > 1 ? 's' : ''}</span>
                          {item.metrics.duplicateCandidate && (
                            <span className="bg-cyan-50 text-cyan-700 px-1 rounded font-medium text-[10px] border border-cyan-200">
                              NLP Similar
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Review Status Selector */}
                      <td className="py-3 px-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={p.reviewStatus}
                          onChange={(e) => onUpdateReviewStatus(p.id, e.target.value as ReviewStatus)}
                          className={`text-xs font-semibold px-2 py-1 rounded border focus:outline-none ${
                            p.reviewStatus === 'Under Investigation'
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-300'
                              : p.reviewStatus === 'Cleared'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                              : p.reviewStatus === 'Reviewed'
                              ? 'bg-blue-50 text-blue-700 border-blue-300'
                              : 'bg-slate-100 text-slate-700 border-slate-300'
                          }`}
                        >
                          <option value="Pending Review">Pending Review</option>
                          <option value="Under Investigation">Under Investigation</option>
                          <option value="Reviewed">Reviewed</option>
                          <option value="Cleared">Cleared</option>
                        </select>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectProject(item);
                          }}
                          className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold px-2.5 py-1 rounded border border-blue-200 transition-colors inline-flex items-center gap-1"
                        >
                          <span>Investigate</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
