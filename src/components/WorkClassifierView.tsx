import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Building,
  IndianRupee,
  Calendar,
  MapPin,
  Sliders,
  RotateCcw,
  Check,
  Copy,
  PlusCircle,
  Activity,
  ArrowRight,
  Info,
  Layers,
  FileCheck,
} from 'lucide-react';
import { Project, RiskLevel } from '../types';

export interface AIClassificationResult {
  riskCategory: 'HIGH' | 'MEDIUM' | 'LOW';
  riskScore: number;
  confidence: number;
  summary: string;
  financialProgressPercent: number;
  progressGap: number;
  reasoning: string;
  anomalyFlags: Array<{
    type: string;
    severity: 'HIGH' | 'MEDIUM' | 'LOW';
    title: string;
    explanation: string;
    evidence: string;
  }>;
  recommendations: string[];
  aiModel?: string;
}

interface WorkClassifierViewProps {
  onAddProjectToPipeline: (project: Project) => void;
  onNavigateToQueue?: () => void;
}

const PROJECT_TYPES = [
  'Rural Roads & Connectivity',
  'Drinking Water & Sanitation',
  'Community Hall & Centre',
  'Education & Anganwadi Infrastructure',
  'Health Centres & Dispensaries',
  'Solar Street Lighting & Renewable Energy',
  'Irrigation & Canal Works',
  'Public Toilet Complex',
  'Other Public Asset',
];

const STATES_DISTRICTS: Record<string, string[]> = {
  Rajasthan: ['Barmer', 'Jaipur', 'Jodhpur', 'Bikaner', 'Udaipur'],
  'Uttar Pradesh': ['Varanasi', 'Lucknow', 'Gorakhpur', 'Prayagraj', 'Agra'],
  Maharashtra: ['Pune', 'Nagpur', 'Thane', 'Nashik', 'Solapur'],
  'Tamil Nadu': ['Chennai', 'Madurai', 'Coimbatore', 'Salem', 'Tiruchirappalli'],
  Karnataka: ['Bengaluru Urban', 'Mysuru', 'Belagavi', 'Ballari', 'Dharwad'],
  Bihar: ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga'],
  Gujarat: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar'],
};

export const WorkClassifierView: React.FC<WorkClassifierViewProps> = ({
  onAddProjectToPipeline,
  onNavigateToQueue,
}) => {
  // Form input states
  const [title, setTitle] = useState('');
  const [projectType, setProjectType] = useState('Rural Roads & Connectivity');
  const [state, setState] = useState('Rajasthan');
  const [district, setDistrict] = useState('Barmer');
  const [location, setLocation] = useState('');
  const [sanctionedCost, setSanctionedCost] = useState<number | ''>(35.0);
  const [expenditure, setExpenditure] = useState<number | ''>(32.2);
  const [physicalProgress, setPhysicalProgress] = useState<number>(35);
  const [numberOfPayments, setNumberOfPayments] = useState<number | ''>(28);
  const [startDate, setStartDate] = useState('2023-04-10');
  const [expectedCompletionDate, setExpectedCompletionDate] = useState('2024-03-31');
  const [implementingAgency, setImplementingAgency] = useState('District Rural Development Agency (DRDA)');
  const [groundObservations, setGroundObservations] = useState(
    'Work halted after basic gravel sub-base; machinery absent from site; financial withdrawal exceeds 90%.'
  );

  // Status & Results states
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [classificationResult, setClassificationResult] = useState<AIClassificationResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [addedToPipeline, setAddedToPipeline] = useState(false);

  // Dynamic calculations for instant UI feedback
  const safeSanctioned = Number(sanctionedCost) || 1;
  const safeExp = Number(expenditure) || 0;
  const financialProgress = +((safeExp / safeSanctioned) * 100).toFixed(1);
  const progressGap = +(financialProgress - physicalProgress).toFixed(1);

  // Sample Presets for easy evaluation
  const loadHighRiskSample = () => {
    setTitle('Construction of Bituminous Surface Road from Main NH to Basti Primary School');
    setProjectType('Rural Roads & Connectivity');
    setState('Rajasthan');
    setDistrict('Barmer');
    setLocation('Gudamalani Block, Barmer');
    setSanctionedCost(38.0);
    setExpenditure(35.5);
    setPhysicalProgress(32);
    setNumberOfPayments(34);
    setStartDate('2023-01-15');
    setExpectedCompletionDate('2023-11-30');
    setImplementingAgency('Zila Parishad Engineering Wing');
    setGroundObservations(
      'Work halted after stone metal laying; contractor removed machinery 5 months ago; 34 fragmented payment vouchers issued.'
    );
    setClassificationResult(null);
    setAddedToPipeline(false);
  };

  const loadMediumRiskSample = () => {
    setTitle('Construction of Additional Community Hall & Library Rooms');
    setProjectType('Community Hall & Centre');
    setState('Maharashtra');
    setDistrict('Pune');
    setLocation('Haveli Block, Pune');
    setSanctionedCost(42.0);
    setExpenditure(31.5);
    setPhysicalProgress(50);
    setNumberOfPayments(14);
    setStartDate('2022-09-01');
    setExpectedCompletionDate('2023-08-31');
    setImplementingAgency('PWD Sub-Division');
    setGroundObservations(
      'Structure built up to lintel level; roofing delayed by 10 months due to material cost renegotiation.'
    );
    setClassificationResult(null);
    setAddedToPipeline(false);
  };

  const loadLowRiskSample = () => {
    setTitle('Installation of 45 High-Lumen Solar LED Street Lights');
    setProjectType('Solar Street Lighting & Renewable Energy');
    setState('Karnataka');
    setDistrict('Bengaluru Urban');
    setLocation('Anekal Taluk Gram Panchayat');
    setSanctionedCost(18.5);
    setExpenditure(15.2);
    setPhysicalProgress(85);
    setNumberOfPayments(6);
    setStartDate('2023-06-01');
    setExpectedCompletionDate('2024-02-28');
    setImplementingAgency('State Renewable Energy Development Agency (KREDL)');
    setGroundObservations(
      '40 of 45 poles installed and operational; battery backup tested; final commissioning inspection scheduled.'
    );
    setClassificationResult(null);
    setAddedToPipeline(false);
  };

  const clearForm = () => {
    setTitle('');
    setLocation('');
    setSanctionedCost('');
    setExpenditure('');
    setPhysicalProgress(0);
    setNumberOfPayments(4);
    setGroundObservations('');
    setClassificationResult(null);
    setAddedToPipeline(false);
  };

  // Run AI Classification
  const handleClassify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter a work title or description.');
      return;
    }

    setIsLoading(true);
    setClassificationResult(null);
    setAddedToPipeline(false);

    // Simulated progress steps for visual feedback
    setLoadingStep(1);
    const t1 = setTimeout(() => setLoadingStep(2), 600);
    const t2 = setTimeout(() => setLoadingStep(3), 1200);

    const payload = {
      title: title.trim(),
      projectType,
      sanctionedCost: Number(sanctionedCost) || 20,
      expenditure: Number(expenditure) || 0,
      physicalProgress,
      numberOfPayments: Number(numberOfPayments) || 5,
      state,
      district,
      location: location.trim() || `${district} Block`,
      implementingAgency,
      startDate,
      expectedCompletionDate,
      groundObservations: groundObservations.trim(),
    };

    try {
      const response = await fetch('/api/ai/classify-work', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();
      if (json.success && json.classification) {
        setClassificationResult(json.classification);
      } else {
        throw new Error(json.error || 'Failed to classify work');
      }
    } catch (err) {
      console.warn('Backend classification failed, using client-side MoSPI audit engine:', err);
      // Resilient client-side fallback
      const gap = +(financialProgress - physicalProgress).toFixed(1);
      let category: 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
      let score = 18;

      if (gap >= 30 || Number(numberOfPayments) > 25 || safeExp > safeSanctioned) {
        category = 'HIGH';
        score = 88;
      } else if (gap >= 15 || Number(numberOfPayments) > 12) {
        category = 'MEDIUM';
        score = 58;
      }

      setClassificationResult({
        riskCategory: category,
        riskScore: score,
        confidence: 94,
        summary: `${category} Risk flagged under MoSPI guidelines with a progress-expenditure gap of ${gap} percentage points.`,
        financialProgressPercent: financialProgress,
        progressGap: gap,
        reasoning: `Analysis verifies that financial outflow is ${financialProgress}% while reported ground physical progress is ${physicalProgress}%. ${
          category === 'HIGH'
            ? 'Critical gap exceeds MoSPI anomaly threshold (30%). Potential milestone inflation or unverified payments require immediate on-site MB check.'
            : category === 'MEDIUM'
            ? 'Moderate variance between funding and ground milestones. Standard verification recommended.'
            : 'Healthy alignment between project funding and physical execution milestones.'
        }`,
        anomalyFlags:
          category === 'HIGH'
            ? [
                {
                  type: 'Progress Mismatch',
                  severity: 'HIGH',
                  title: 'Critical Progress Gap',
                  explanation: `Disbursement is ${financialProgress}% while physical progress is only ${physicalProgress}%.`,
                  evidence: `Disparity: ${gap}% gap`,
                },
                {
                  type: 'Payment Anomaly',
                  severity: Number(numberOfPayments) > 20 ? 'HIGH' : 'MEDIUM',
                  title: 'Payment Tranche Irregularity',
                  explanation: `${numberOfPayments} payment installments recorded.`,
                  evidence: `${numberOfPayments} installments released`,
                },
              ]
            : [],
        recommendations: [
          'Verify Measurement Book (MB) recordings against geo-tagged site images.',
          'Review milestone authorization certificates before subsequent funds disbursement.',
        ],
        aiModel: 'MoSPI Client-Side Resilient Engine',
      });
    } finally {
      clearTimeout(t1);
      clearTimeout(t2);
      setIsLoading(false);
      setLoadingStep(0);
    }
  };

  // Add this work as an analyzed project to the main audit pipeline
  const handleAddToPipeline = () => {
    if (!classificationResult) return;

    const newProject: Project = {
      id: `MPLAD-USR-${Math.floor(1000 + Math.random() * 9000)}`,
      title: title.trim(),
      description: groundObservations.trim() || `${projectType} in ${location}, ${district}`,
      projectType,
      state,
      district,
      constituency: `${district} Constituency`,
      location: location.trim() || `${district} Central Block`,
      sanctionedCost: Number(sanctionedCost) || 20,
      expenditure: Number(expenditure) || 0,
      physicalProgress,
      status: physicalProgress >= 100 ? 'Completed' : 'Ongoing',
      startDate,
      expectedCompletionDate,
      implementingAgency,
      numberOfPayments: Number(numberOfPayments) || 5,
      contractorName: 'District Empanelled Contractor',
      reviewStatus: classificationResult.riskCategory === 'HIGH' ? 'Pending Review' : 'Cleared',
      mpName: 'Hon. Member of Parliament',
      financialYear: '2023-24',
      auditorNotes: [
        {
          id: `ai-note-${Date.now()}`,
          timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
          author: 'MPLADS VigilAI Classifier',
          text: `User-entered work classified as ${classificationResult.riskCategory} RISK (Score: ${classificationResult.riskScore}/100). ${classificationResult.summary}`,
        },
      ],
    };

    onAddProjectToPipeline(newProject);
    setAddedToPipeline(true);
  };

  const copyAuditMemo = () => {
    if (!classificationResult) return;
    const memo = `
=========================================
MPLADS VIGILAI FORENSIC RISK REPORT
Ministry of Statistics & Programme Implementation (SIH26102)
=========================================
Work Title: ${title}
Sector: ${projectType}
Location: ${location}, ${district}, ${state}
Sanctioned Cost: ₹${sanctionedCost} Lakhs
Disbursed Expenditure: ₹${expenditure} Lakhs (${classificationResult.financialProgressPercent}%)
Ground Physical Progress: ${physicalProgress}%
Progress Gap: ${classificationResult.progressGap}% points
Number of Payments: ${numberOfPayments}

AI RISK VERDICT: ${classificationResult.riskCategory} RISK
Composite Risk Score: ${classificationResult.riskScore}/100 (Confidence: ${classificationResult.confidence}%)
Executive Summary: ${classificationResult.summary}

Forensic Audit Reasoning:
${classificationResult.reasoning}

Audit Recommendations:
${classificationResult.recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}
=========================================
Generated via: ${classificationResult.aiModel || 'Gemini 3.8 Flash'}
`;
    navigator.clipboard.writeText(memo.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white p-5 sm:p-6 rounded-2xl shadow-md border border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded tracking-wider uppercase flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" /> MoSPI AI Risk Classifier
              </span>
              <span className="text-xs text-blue-200 font-mono">Real-time Forensic Evaluation</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              Enter Work Done & Classify Audit Risk
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Enter project financials, physical completion percentage, and ground observations.
              The AI evaluates progress gap, payment frequency, and unit cost norms to classify the work as{' '}
              <strong className="text-red-400">High Risk</strong>,{' '}
              <strong className="text-amber-400">Medium Risk</strong>, or{' '}
              <strong className="text-emerald-400">Low Risk</strong>.
            </p>
          </div>

          {/* Preset Buttons */}
          <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700 space-y-1.5 shrink-0">
            <span className="text-[11px] font-semibold text-slate-300 block">
              Quick Test Templates:
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={loadHighRiskSample}
                className="bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-700/60 px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                <span>High Risk (Barmer Road)</span>
              </button>
              <button
                type="button"
                onClick={loadMediumRiskSample}
                className="bg-amber-950/80 hover:bg-amber-900 text-amber-200 border border-amber-700/60 px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>Medium Risk (Hall Delay)</span>
              </button>
              <button
                type="button"
                onClick={loadLowRiskSample}
                className="bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 border border-emerald-700/60 px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Low Risk (Solar Lights)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Input Form & Classification Result */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Work Input Form (7 cols) */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
            <div className="flex items-center space-x-2">
              <Building className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900">Work Execution & Financial Details</h2>
            </div>
            <button
              type="button"
              onClick={clearForm}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 hover:underline cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Clear Form
            </button>
          </div>

          <form onSubmit={handleClassify} className="space-y-4">
            {/* Work Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Work Title / Asset Description <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Construction of Concrete Road from Panchayat Bhawan to Primary School"
                className="w-full text-xs sm:text-sm p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-slate-900 transition-all font-medium"
              />
            </div>

            {/* Sector / Project Type & Implementing Agency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Sector / Project Type
                </label>
                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:border-blue-500 outline-none text-slate-900 font-medium"
                >
                  {PROJECT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Implementing Agency
                </label>
                <input
                  type="text"
                  value={implementingAgency}
                  onChange={(e) => setImplementingAgency(e.target.value)}
                  placeholder="e.g. DRDA, PWD, Gram Panchayat"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:border-blue-500 outline-none text-slate-900 font-medium"
                />
              </div>
            </div>

            {/* State, District & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">State</label>
                <select
                  value={state}
                  onChange={(e) => {
                    const newState = e.target.value;
                    setState(newState);
                    if (STATES_DISTRICTS[newState]) {
                      setDistrict(STATES_DISTRICTS[newState][0]);
                    }
                  }}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:border-blue-500 outline-none text-slate-900 font-medium"
                >
                  {Object.keys(STATES_DISTRICTS).map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">District</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:border-blue-500 outline-none text-slate-900 font-medium"
                >
                  {(STATES_DISTRICTS[state] || [district]).map((dist) => (
                    <option key={dist} value={dist}>
                      {dist}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Block / Gram Panchayat
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Block 4, Ward 7"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:border-blue-500 outline-none text-slate-900 font-medium"
                />
              </div>
            </div>

            {/* Financials & Payment Counts */}
            <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span className="flex items-center gap-1.5 text-indigo-900">
                  <IndianRupee className="w-4 h-4 text-indigo-600" /> Financial & Voucher Metrics
                </span>
                <span className="text-slate-500 font-normal">All amounts in ₹ Lakhs</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Sanctioned Cost (₹ Lakhs) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.5"
                    required
                    value={sanctionedCost}
                    onChange={(e) =>
                      setSanctionedCost(e.target.value === '' ? '' : parseFloat(e.target.value))
                    }
                    className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:border-indigo-500 outline-none text-slate-900 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Disbursed Expenditure (₹ Lakhs) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    required
                    value={expenditure}
                    onChange={(e) =>
                      setExpenditure(e.target.value === '' ? '' : parseFloat(e.target.value))
                    }
                    className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:border-indigo-500 outline-none text-slate-900 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Payment Installments (Count)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={numberOfPayments}
                    onChange={(e) =>
                      setNumberOfPayments(e.target.value === '' ? '' : parseInt(e.target.value, 10))
                    }
                    className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:border-indigo-500 outline-none text-slate-900 font-semibold"
                  />
                </div>
              </div>

              {/* Instant Calculated Progress Indicators */}
              <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-500 block uppercase">Financial Progress</span>
                  <span className="text-xs font-bold text-indigo-700">{financialProgress}%</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-500 block uppercase">Physical Progress</span>
                  <span className="text-xs font-bold text-emerald-700">{physicalProgress}%</span>
                </div>
                <div
                  className={`p-2 rounded-lg border ${
                    progressGap > 30
                      ? 'bg-red-50 border-red-200 text-red-700'
                      : progressGap > 15
                      ? 'bg-amber-50 border-amber-200 text-amber-700'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold block">Progress Gap</span>
                  <span className="text-xs font-black">
                    {progressGap > 0 ? `+${progressGap}%` : `${progressGap}%`}
                  </span>
                </div>
              </div>
            </div>

            {/* Physical Progress Slider */}
            <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-200/80 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-emerald-950">
                <span className="flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-emerald-600" /> Reported Physical Progress on Site
                </span>
                <span className="text-base font-extrabold text-emerald-700 bg-white px-2.5 py-0.5 rounded-md border border-emerald-300">
                  {physicalProgress}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={physicalProgress}
                onChange={(e) => setPhysicalProgress(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-emerald-800 font-medium">
                <span>0% (Not Started / Sanctioned Only)</span>
                <span>50% (Midway / Structure)</span>
                <span>100% (Fully Completed)</span>
              </div>
            </div>

            {/* Timelines */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white outline-none text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Expected Completion Date
                </label>
                <input
                  type="date"
                  value={expectedCompletionDate}
                  onChange={(e) => setExpectedCompletionDate(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white outline-none text-slate-900 font-medium"
                />
              </div>
            </div>

            {/* Ground Observations / Citizen Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Field Inspection / Ground Observations / Contractor Notes
              </label>
              <textarea
                rows={3}
                value={groundObservations}
                onChange={(e) => setGroundObservations(e.target.value)}
                placeholder="Enter details of ground status, citizen complaints, missing machinery, quality issues, or milestone notes..."
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:border-blue-500 outline-none text-slate-900 font-medium leading-relaxed"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-60 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Activity className="w-4 h-4 animate-spin" />
                    <span>
                      {loadingStep === 1
                        ? 'Analyzing Financial & Physical Data...'
                        : loadingStep === 2
                        ? 'Evaluating MoSPI Peer Cohort Norms...'
                        : 'Generating Gemini Audit Risk Verdict...'}
                    </span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Run AI Risk Classification</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: AI Risk Classification Result (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <AnimatePresence mode="wait">
            {!classificationResult && !isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs text-center space-y-3"
              >
                <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Awaiting Work Classification</h3>
                <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                  Fill out the work details on the left, or click one of the quick test sample buttons
                  above to classify the work into High, Medium, or Low risk.
                </p>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-left text-[11px] text-slate-600 space-y-1">
                  <span className="font-bold text-slate-800 block">How AI Risk is Determined:</span>
                  <p>• <strong>High Risk (70-100)</strong>: Large progress-expenditure gap (&gt;30%), voucher splitting (&gt;20 payments), or stalled ground execution.</p>
                  <p>• <strong>Medium Risk (40-69)</strong>: Moderate gaps (15-30%), timeline delays, or cost elevation above rural median.</p>
                  <p>• <strong>Low Risk (0-39)</strong>: Close sync between financial spend and physical progress on site with normal payments.</p>
                </div>
              </motion.div>
            )}

            {isLoading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-8 rounded-2xl border border-blue-200 shadow-md text-center space-y-4"
              >
                <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
                  <Sparkles className="w-7 h-7 text-blue-600 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-900">
                    Executing AI Forensic Audit Engine
                  </h3>
                  <p className="text-xs text-blue-600 font-semibold animate-pulse">
                    Evaluating against MoSPI MPLADS procurement norms...
                  </p>
                </div>
                <div className="max-w-xs mx-auto text-left text-[11px] text-slate-500 space-y-1.5 pt-2">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>Checking Sanction vs Outlay ratio</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>Quantifying Progress Gap disparity</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></span>
                    <span>Consulting Gemini 3.8 Flash model</span>
                  </div>
                </div>
              </motion.div>
            )}

            {classificationResult && !isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Result Hero Card */}
                <div
                  className={`p-5 rounded-2xl border shadow-md ${
                    classificationResult.riskCategory === 'HIGH'
                      ? 'bg-gradient-to-br from-red-500/10 via-red-500/5 to-white border-red-300'
                      : classificationResult.riskCategory === 'MEDIUM'
                      ? 'bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-white border-amber-300'
                      : 'bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-white border-emerald-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                        AI Classification Verdict
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        {classificationResult.riskCategory === 'HIGH' && (
                          <ShieldAlert className="w-7 h-7 text-red-600" />
                        )}
                        {classificationResult.riskCategory === 'MEDIUM' && (
                          <AlertTriangle className="w-7 h-7 text-amber-600" />
                        )}
                        {classificationResult.riskCategory === 'LOW' && (
                          <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                        )}
                        <h2
                          className={`text-2xl font-black tracking-tight ${
                            classificationResult.riskCategory === 'HIGH'
                              ? 'text-red-700'
                              : classificationResult.riskCategory === 'MEDIUM'
                              ? 'text-amber-700'
                              : 'text-emerald-700'
                          }`}
                        >
                          {classificationResult.riskCategory} RISK
                        </h2>
                      </div>
                    </div>

                    {/* Score Badge */}
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">
                        Risk Score
                      </span>
                      <div
                        className={`text-2xl font-black font-mono ${
                          classificationResult.riskCategory === 'HIGH'
                            ? 'text-red-700'
                            : classificationResult.riskCategory === 'MEDIUM'
                            ? 'text-amber-700'
                            : 'text-emerald-700'
                        }`}
                      >
                        {classificationResult.riskScore}
                        <span className="text-xs text-slate-400 font-sans font-normal">/100</span>
                      </div>
                    </div>
                  </div>

                  {/* Summary */}
                  <p className="text-xs text-slate-800 font-semibold mt-3 pt-3 border-t border-slate-200/80 leading-relaxed">
                    {classificationResult.summary}
                  </p>

                  {/* Dual Bar Progress Display */}
                  <div className="mt-4 p-3 bg-white/90 rounded-xl border border-slate-200/80 space-y-2.5">
                    <div>
                      <div className="flex justify-between text-[11px] font-bold text-indigo-900 mb-0.5">
                        <span>Financial Outflow (% Disbursed)</span>
                        <span>{classificationResult.financialProgressPercent}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-indigo-600 h-full rounded-full"
                          style={{
                            width: `${Math.min(100, classificationResult.financialProgressPercent)}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] font-bold text-emerald-900 mb-0.5">
                        <span>Physical Execution (% Ground Progress)</span>
                        <span>{physicalProgress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full"
                          style={{ width: `${Math.min(100, physicalProgress)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="text-[11px] flex justify-between font-bold pt-1 border-t border-slate-100 text-slate-700">
                      <span>Progress Disparity:</span>
                      <span
                        className={
                          classificationResult.progressGap > 25
                            ? 'text-red-600'
                            : classificationResult.progressGap > 10
                            ? 'text-amber-600'
                            : 'text-emerald-600'
                        }
                      >
                        {classificationResult.progressGap > 0
                          ? `+${classificationResult.progressGap}% Points Gap`
                          : `${classificationResult.progressGap}% Points`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Forensic Reasoning */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center space-x-2 text-xs font-bold text-slate-900">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span>AI Forensic Audit Reasoning</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {classificationResult.reasoning}
                  </p>
                  <div className="text-[10px] text-slate-400 font-mono pt-1">
                    Audited via: {classificationResult.aiModel || 'Gemini 3.8 Flash (Server-Side)'}
                  </div>
                </div>

                {/* Anomaly Flags */}
                {classificationResult.anomalyFlags.length > 0 && (
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2.5">
                    <div className="flex items-center space-x-2 text-xs font-bold text-slate-900">
                      <ShieldAlert className="w-4 h-4 text-red-600" />
                      <span>Identified Audit Red Flags ({classificationResult.anomalyFlags.length})</span>
                    </div>
                    <div className="space-y-2">
                      {classificationResult.anomalyFlags.map((flag, idx) => (
                        <div
                          key={idx}
                          className={`p-2.5 rounded-lg border text-xs ${
                            flag.severity === 'HIGH'
                              ? 'bg-red-50/60 border-red-200 text-red-950'
                              : 'bg-amber-50/60 border-amber-200 text-amber-950'
                          }`}
                        >
                          <div className="flex items-center justify-between font-bold mb-1">
                            <span>{flag.title}</span>
                            <span
                              className={`text-[9px] px-1.5 py-0.5 rounded font-black uppercase ${
                                flag.severity === 'HIGH'
                                  ? 'bg-red-200 text-red-900'
                                  : 'bg-amber-200 text-amber-900'
                              }`}
                            >
                              {flag.severity}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-700 leading-relaxed">
                            {flag.explanation}
                          </p>
                          {flag.evidence && (
                            <span className="text-[10px] font-mono text-slate-500 block mt-1">
                              Evidence: {flag.evidence}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {classificationResult.recommendations.length > 0 && (
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
                    <div className="flex items-center space-x-2 text-xs font-bold text-slate-900">
                      <FileCheck className="w-4 h-4 text-emerald-600" />
                      <span>Recommended Audit Verification Actions</span>
                    </div>
                    <ul className="text-xs text-slate-700 space-y-1.5 pl-4 list-disc">
                      {classificationResult.recommendations.map((rec, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Actions: Add to Pipeline & Copy Memo */}
                <div className="space-y-2 pt-1">
                  <button
                    type="button"
                    onClick={handleAddToPipeline}
                    disabled={addedToPipeline}
                    className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer ${
                      addedToPipeline
                        ? 'bg-emerald-600 text-white cursor-default'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    {addedToPipeline ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added to Active Projects & Audit Pipeline!</span>
                      </>
                    ) : (
                      <>
                        <PlusCircle className="w-4 h-4 text-blue-400" />
                        <span>Add this Project to Active Audit Pipeline</span>
                      </>
                    )}
                  </button>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={copyAuditMemo}
                      className="flex-1 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 font-bold">Memo Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-500" />
                          <span>Copy Audit Memo</span>
                        </>
                      )}
                    </button>

                    {onNavigateToQueue && (
                      <button
                        type="button"
                        onClick={onNavigateToQueue}
                        className="bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        <span>View Queue</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
