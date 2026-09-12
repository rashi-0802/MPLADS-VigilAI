import React, { useState } from 'react';
import {
  X,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  MapPin,
  Building,
  Layers,
  ArrowRight,
  Sparkles,
  GitCompare,
  FileCheck,
  Send,
  MessageSquare,
  Printer,
  ChevronRight,
} from 'lucide-react';
import { AnalyzedProject, ReviewStatus } from '../types';

interface ProjectDetailModalProps {
  analyzedProject: AnalyzedProject | null;
  onClose: () => void;
  onUpdateReviewStatus: (projectId: string, newStatus: ReviewStatus) => void;
  onSelectDuplicatePair?: (targetId: string) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  analyzedProject,
  onClose,
  onUpdateReviewStatus,
  onSelectDuplicatePair,
}) => {
  if (!analyzedProject) return null;

  const { project, metrics, flags, risk, complianceResults } = analyzedProject;
  const isHigh = risk.category === 'HIGH';
  const isMedium = risk.category === 'MEDIUM';

  const [activeTab, setActiveTab] = useState<'evidence' | 'financials' | 'compliance' | 'duplicate' | 'auditor'>('evidence');
  const [newNote, setNewNote] = useState('');
  const [localNotes, setLocalNotes] = useState<Array<{ id: string; timestamp: string; author: string; text: string }>>(
    project.auditorNotes || [
      {
        id: 'init',
        timestamp: '2026-09-10 14:32 IST',
        author: 'Audit Officer (VigilAI Auto-Log)',
        text: `Automated risk triage flagged project with ${risk.totalScore}/100 composite risk score. Reason: ${risk.primaryAlert}.`,
      },
    ]
  );

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    const note = {
      id: String(Date.now()),
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
      author: 'Senior Audit Inspector',
      text: newNote.trim(),
    };
    setLocalNotes([...localNotes, note]);
    setNewNote('');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header Bar */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-start justify-between border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-sm sm:text-base font-bold text-amber-400 bg-slate-800 px-2.5 py-0.5 rounded border border-slate-700">
                {project.id}
              </span>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border ${
                  isHigh
                    ? 'bg-red-950 text-red-300 border-red-800'
                    : isMedium
                    ? 'bg-amber-950 text-amber-300 border-amber-800'
                    : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                }`}
              >
                Risk Score: {risk.totalScore} / 100 ({risk.category})
              </span>
              <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                {project.status}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
              {project.description}
            </h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300 pt-0.5">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {project.location}, {project.district}, {project.state}
              </span>
              <span className="flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                {project.implementingAgency}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0 ml-3">
            <button
              onClick={handlePrint}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
              title="Print / Save Audit Brief"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Official Statutory Disclaimer Bar */}
        <div className="bg-amber-50 px-4 py-2 border-b border-amber-200 text-xs text-amber-900 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Audit Advisory:</strong> This risk score indicates unusual data patterns requiring human review. It does not establish fraud.
            </span>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <span className="text-[11px] font-semibold text-slate-600">Review Status:</span>
            <select
              value={project.reviewStatus}
              onChange={(e) => onUpdateReviewStatus(project.id, e.target.value as ReviewStatus)}
              className="text-xs font-bold bg-white border border-amber-300 text-slate-800 rounded px-2 py-0.5 focus:outline-none"
            >
              <option value="Pending Review">Pending Review</option>
              <option value="Under Investigation">Under Investigation</option>
              <option value="Reviewed">Reviewed</option>
              <option value="Cleared">Cleared</option>
            </select>
          </div>
        </div>

        {/* Navigation Tabs Inside Modal */}
        <div className="bg-slate-100 px-4 border-b border-slate-200 flex space-x-1 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('evidence')}
            className={`py-2.5 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'evidence'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Explainable AI Findings ({flags.length})
          </button>
          <button
            onClick={() => setActiveTab('financials')}
            className={`py-2.5 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'financials'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Financial & Progress Gap
          </button>
          {metrics.duplicateCandidate && (
            <button
              onClick={() => setActiveTab('duplicate')}
              className={`py-2.5 px-3 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'duplicate'
                  ? 'border-cyan-600 text-cyan-700 bg-white'
                  : 'border-transparent text-cyan-700 hover:text-cyan-900'
              }`}
            >
              <GitCompare className="w-3.5 h-3.5" />
              <span>Potential Similar Work ({metrics.duplicateCandidate.similarityScore}%)</span>
            </button>
          )}
          <button
            onClick={() => setActiveTab('compliance')}
            className={`py-2.5 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'compliance'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Rule Compliance ({complianceResults.filter((r) => r.passed).length}/{complianceResults.length})
          </button>
          <button
            onClick={() => setActiveTab('auditor')}
            className={`py-2.5 px-3 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'auditor'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Auditor Notes ({localNotes.length})</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: EXPLAINABLE EVIDENCE */}
          {activeTab === 'evidence' && (
            <div className="space-y-6">
              {/* Overall Score Decomposition */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Multi-Signal Risk Score Decomposition
                    </h3>
                    <p className="text-xs text-slate-600">
                      Mathematically weighted combination across 6 independent audit dimensions
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-slate-900">{risk.totalScore}</span>
                    <span className="text-xs text-slate-500"> / 100</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-center text-xs">
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-[11px] text-slate-500 block">Cost Anomaly (25%)</span>
                    <span className="font-bold text-slate-800 text-sm">{risk.costAnomalyScore}</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-[11px] text-slate-500 block">Progress Gap (25%)</span>
                    <span className="font-bold text-slate-800 text-sm">{risk.progressMismatchScore}</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-[11px] text-slate-500 block">Delay (20%)</span>
                    <span className="font-bold text-slate-800 text-sm">{risk.delayScore}</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-[11px] text-slate-500 block">Payments (15%)</span>
                    <span className="font-bold text-slate-800 text-sm">{risk.paymentScore}</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-[11px] text-slate-500 block">Duplicate (10%)</span>
                    <span className="font-bold text-slate-800 text-sm">{risk.duplicateScore}</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-[11px] text-slate-500 block">ML Signal (5%)</span>
                    <span className="font-bold text-slate-800 text-sm">{risk.mlAnomalyScore}</span>
                  </div>
                </div>
              </div>

              {/* WHY WAS THIS PROJECT FLAGGED? */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                    WHY WAS THIS PROJECT FLAGGED?
                  </h3>
                </div>

                {flags.length === 0 ? (
                  <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-emerald-800 text-xs flex items-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>No statistical or rule anomalies detected. All parameters fall within normal peer ranges.</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {flags.map((flag) => {
                      const isHighFlag = flag.severity === 'HIGH';
                      return (
                        <div
                          key={flag.id}
                          className={`p-4 rounded-xl border transition-all ${
                            isHighFlag
                              ? 'bg-red-50/50 border-red-200 text-red-950'
                              : 'bg-amber-50/50 border-amber-200 text-amber-950'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center space-x-2">
                              {isHighFlag ? (
                                <span className="w-3 h-3 rounded-full bg-red-600 shrink-0"></span>
                              ) : (
                                <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0"></span>
                              )}
                              <span className="font-bold text-sm text-slate-900">
                                {flag.type}: {flag.title}
                              </span>
                            </div>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                                isHighFlag
                                  ? 'bg-red-100 text-red-700 border border-red-300'
                                  : 'bg-amber-100 text-amber-700 border border-amber-300'
                              }`}
                            >
                              {flag.severity} RISK SIGNAL
                            </span>
                          </div>

                          <p className="text-xs text-slate-700 mt-2 leading-relaxed">
                            {flag.explanation}
                          </p>

                          {/* Evidence Table */}
                          {flag.evidence.length > 0 && (
                            <div className="mt-3 bg-white/80 rounded-lg p-2.5 border border-slate-200/80 text-xs">
                              <span className="text-[11px] font-semibold text-slate-600 block mb-1.5">
                                Verified Audit Evidence:
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                                {flag.evidence.map((ev, idx) => (
                                  <div key={idx} className="bg-slate-50 p-2 rounded border border-slate-100">
                                    <span className="text-[10px] text-slate-500 block truncate">{ev.label}</span>
                                    <span className="font-bold text-slate-900 text-xs">{ev.value}</span>
                                    {ev.benchmark && (
                                      <span className="text-[10px] text-slate-500 block">
                                        Norm: {ev.benchmark}
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Recommendation Card */}
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex items-start space-x-3">
                <FileCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <h4 className="font-bold text-blue-950 text-sm">System Recommendation for Audit Team</h4>
                  <p className="text-blue-900 mt-0.5 font-medium">{risk.recommendation}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FINANCIALS & PROGRESS GAP */}
          {activeTab === 'financials' && (
            <div className="space-y-6">
              {/* Financial Progress vs Physical Progress Visualizer */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900">
                  Financial Disbursement vs Physical Progress Execution
                </h3>
                <p className="text-xs text-slate-500">
                  Compares cumulative fund drawdowns against ground physical asset completion metrics.
                </p>

                {/* Progress Dual Bar Component */}
                <div className="space-y-4 pt-2">
                  {/* Financial Bar */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-indigo-800 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 bg-indigo-600 rounded-xs"></span>
                        Financial Progress (Expenditure / Sanctioned)
                      </span>
                      <span className="text-indigo-900 font-bold">{metrics.financialProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden p-0.5">
                      <div
                        className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, metrics.financialProgress)}%` }}
                      ></div>
                    </div>
                    <span className="text-[11px] text-slate-500 mt-0.5 block">
                      Disbursed: ₹{project.expenditure.toFixed(2)} Lakh of ₹{project.sanctionedCost.toFixed(2)} Lakh
                    </span>
                  </div>

                  {/* Physical Bar */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-emerald-800 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 bg-emerald-600 rounded-xs"></span>
                        Reported Physical Progress (Ground Measurement)
                      </span>
                      <span className="text-emerald-900 font-bold">{project.physicalProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden p-0.5">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, project.physicalProgress)}%` }}
                      ></div>
                    </div>
                    <span className="text-[11px] text-slate-500 mt-0.5 block">
                      Ground Status: {project.status}
                    </span>
                  </div>

                  {/* Disparity Gap Highlight */}
                  <div
                    className={`p-3 rounded-lg border text-xs flex items-center justify-between ${
                      metrics.progressGap > 40
                        ? 'bg-red-50 border-red-200 text-red-900'
                        : metrics.progressGap > 20
                        ? 'bg-amber-50 border-amber-200 text-amber-900'
                        : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div>
                      <span className="font-bold block">
                        Net Progress Gap: {metrics.progressGap} percentage points
                      </span>
                      <span className="text-[11px] text-slate-600">
                        {metrics.progressGap > 40
                          ? 'Critical alert: Substantial fund outflow without corresponding physical milestone completion.'
                          : 'Progress tracking within acceptable administrative threshold.'}
                      </span>
                    </div>
                    <span
                      className={`font-black text-lg px-2.5 py-1 rounded ${
                        metrics.progressGap > 40
                          ? 'bg-red-200/80 text-red-950'
                          : 'bg-slate-200 text-slate-800'
                      }`}
                    >
                      Δ {metrics.progressGap}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Financial & Timeline Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">Sanctioned Cost</span>
                  <span className="text-lg font-bold text-slate-900">₹{project.sanctionedCost} Lakh</span>
                  <span className="text-[11px] text-slate-500 block mt-1">
                    Peer Median: ₹{metrics.peerMedianCost} Lakh ({metrics.costRatio}× ratio)
                  </span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">Total Expenditure</span>
                  <span className="text-lg font-bold text-slate-900">₹{project.expenditure} Lakh</span>
                  <span className="text-[11px] text-slate-500 block mt-1">
                    Unspent Balance: ₹{(project.sanctionedCost - project.expenditure).toFixed(2)} Lakh
                  </span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">Payment Transactions</span>
                  <span className="text-lg font-bold text-slate-900">{project.numberOfPayments} payments</span>
                  <span className="text-[11px] text-slate-500 block mt-1">
                    Peer Norm: 5–10 payments
                  </span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">Project Timeline</span>
                  <span className="text-lg font-bold text-slate-900">{metrics.delayMonths} mo delay</span>
                  <span className="text-[11px] text-slate-500 block mt-1">
                    Elapsed: {metrics.projectDurationMonths} mo (Expected: {metrics.expectedDurationMonths} mo)
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: POTENTIAL DUPLICATE WORK */}
          {activeTab === 'duplicate' && metrics.duplicateCandidate && (
            <div className="space-y-4">
              <div className="bg-cyan-50 border border-cyan-200 p-4 rounded-xl text-xs text-cyan-950">
                <div className="flex items-center space-x-2 font-bold text-sm text-cyan-900 mb-1">
                  <GitCompare className="w-4 h-4 text-cyan-700" />
                  <span>
                    Potential Similar / Duplicate Work Detection ({metrics.duplicateCandidate.similarityScore}% Semantic Match)
                  </span>
                </div>
                <p>
                  <strong>Notice to Auditor:</strong> The NLP similarity engine flags high semantic similarity between descriptions, paired with geographic proximity. This is <em>NOT</em> a confirmed duplicate; it presents an audit lead for human verification.
                </p>
              </div>

              {/* Side by Side Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Project A (Current) */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-300 space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-mono font-bold text-blue-700">Project A: {project.id}</span>
                    <span className="bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded text-[10px]">
                      Under Review
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">Description:</span>
                    <p className="font-medium text-slate-900 mt-0.5">"{project.description}"</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-[11px]">
                    <div>
                      <span className="text-slate-500 block">Location:</span>
                      <span className="font-semibold text-slate-800">{project.location}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Category:</span>
                      <span className="font-semibold text-slate-800">{project.projectType}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Sanctioned Cost:</span>
                      <span className="font-semibold text-slate-800">₹{project.sanctionedCost} Lakh</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Physical Progress:</span>
                      <span className="font-semibold text-slate-800">{project.physicalProgress}%</span>
                    </div>
                  </div>
                </div>

                {/* Project B (Candidate Pair) */}
                <div className="bg-cyan-50/50 p-4 rounded-xl border border-cyan-300 space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-cyan-200 pb-2">
                    <span className="font-mono font-bold text-cyan-800">
                      Project B: {metrics.duplicateCandidate.targetId}
                    </span>
                    <span className="bg-cyan-100 text-cyan-900 font-semibold px-2 py-0.5 rounded text-[10px]">
                      Comparison Lead
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">Description:</span>
                    <p className="font-medium text-slate-900 mt-0.5">
                      "{metrics.duplicateCandidate.targetDescription}"
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-cyan-200 text-[11px]">
                    <div>
                      <span className="text-slate-500 block">Location Proximity:</span>
                      <span className="font-semibold text-slate-800">
                        {metrics.duplicateCandidate.locationProximity}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Category:</span>
                      <span className="font-semibold text-slate-800">{project.projectType}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Sanctioned Cost:</span>
                      <span className="font-semibold text-slate-800">
                        ₹{metrics.duplicateCandidate.targetCost} Lakh
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Physical Progress:</span>
                      <span className="font-semibold text-slate-800">
                        {metrics.duplicateCandidate.targetProgress}%
                      </span>
                    </div>
                  </div>

                  {onSelectDuplicatePair && (
                    <div className="pt-2">
                      <button
                        onClick={() => onSelectDuplicatePair(metrics.duplicateCandidate!.targetId)}
                        className="w-full bg-cyan-700 hover:bg-cyan-800 text-white font-semibold py-1.5 px-3 rounded-lg text-xs flex items-center justify-center gap-1 transition-colors"
                      >
                        <span>Open Project B Dossier</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Recommended Physical Verification Checklist */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                <h4 className="font-bold text-slate-900">Auditor Physical Verification Checklist for Similar Work:</h4>
                <ul className="list-disc pl-5 space-y-1 text-slate-700">
                  <li>Cross-verify GPS coordinates and geo-tagged photographs from both project completion reports.</li>
                  <li>Inspect land title / revenue record khatauni for Village Rampura to confirm if two distinct plots were sanctioned.</li>
                  <li>Check measurement books (MB) for duplicate work descriptions or identical contractor invoices.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 4: RULE COMPLIANCE */}
          {activeTab === 'compliance' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Rule-Based Compliance & Data Validation Engine
                  </h3>
                  <p className="text-xs text-slate-500">
                    Deterministic checks across statutory, financial, and chronological constraints
                  </p>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                      <th className="py-2.5 px-4">Compliance Rule</th>
                      <th className="py-2.5 px-4">Actual Value</th>
                      <th className="py-2.5 px-4">Expected Benchmark</th>
                      <th className="py-2.5 px-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {complianceResults.map((rule) => (
                      <tr key={rule.ruleId} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-4">
                          <div className="font-semibold text-slate-800">{rule.ruleName}</div>
                          <div className="text-[11px] text-slate-500">{rule.message}</div>
                        </td>
                        <td className="py-2.5 px-4 font-mono text-slate-700">{rule.actualValue}</td>
                        <td className="py-2.5 px-4 text-slate-600">{rule.expectedValue}</td>
                        <td className="py-2.5 px-4 text-center">
                          {rule.passed ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                              <CheckCircle2 className="w-3 h-3" /> Pass
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-red-700 font-semibold bg-red-50 px-2 py-0.5 rounded border border-red-200 text-[11px]">
                              <AlertTriangle className="w-3 h-3" /> Flagged
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: AUDITOR NOTES & LOGS */}
          {activeTab === 'auditor' && (
            <div className="space-y-4 text-xs">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Official Investigation Log & Audit Trail</h3>
                <p className="text-slate-500">
                  Append human auditor findings, on-site physical measurement notes, and disciplinary orders.
                </p>
              </div>

              {/* Note History */}
              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {localNotes.map((note) => (
                  <div key={note.id} className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="font-bold text-slate-800">{note.author}</span>
                      <span className="text-slate-400">{note.timestamp}</span>
                    </div>
                    <p className="text-slate-700 text-xs leading-relaxed">{note.text}</p>
                  </div>
                ))}
              </div>

              {/* Add New Note */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <label className="block text-xs font-semibold text-slate-700">
                  Add Audit Note / Verification Finding:
                </label>
                <div className="flex gap-2">
                  <textarea
                    rows={2}
                    placeholder="E.g., Field inspection conducted by Executive Engineer on 11-Sep-2026. Found physical progress matches 32% reported..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleAddNote}
                    disabled={!newNote.trim()}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold px-4 rounded-lg text-xs flex items-center justify-center transition-colors"
                  >
                    <Send className="w-3.5 h-3.5 mr-1" /> Add
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 p-3.5 px-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-slate-500">
            Project Category: <span className="font-semibold text-slate-700">{project.projectType}</span> • Constituency: <span className="font-semibold text-slate-700">{project.constituency}</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold px-4 py-1.5 rounded-lg transition-colors"
            >
              Close Dossier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
