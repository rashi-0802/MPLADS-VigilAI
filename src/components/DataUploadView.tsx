import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Database,
  Sliders,
  Play,
  RotateCcw,
  Info,
} from 'lucide-react';
import { Project, ConfigurableRule } from '../types';

interface DataUploadViewProps {
  onLoadDemoData: () => void;
  onUploadProjects: (projects: Project[]) => void;
  rules: ConfigurableRule[];
  onToggleRule: (ruleId: string) => void;
  totalLoaded: number;
  onNavigateToClassify?: () => void;
}

export const DataUploadView: React.FC<DataUploadViewProps> = ({
  onLoadDemoData,
  onUploadProjects,
  rules,
  onToggleRule,
  totalLoaded,
  onNavigateToClassify,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const EXPECTED_FIELDS = [
    'Project ID',
    'State',
    'District',
    'Constituency',
    'Location',
    'Project Type',
    'Project Description',
    'Sanctioned Cost',
    'Expenditure',
    'Start Date',
    'Expected Completion Date',
    'Actual Completion Date',
    'Physical Progress',
    'Number of Payments',
    'Implementing Agency',
  ];

  const handleFileProcess = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter((l) => l.trim().length > 0);
        if (lines.length < 2) {
          setUploadStatus('CSV file has insufficient rows');
          return;
        }

        const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
        const parsedProjects: Project[] = [];

        for (let i = 1; i < lines.length; i++) {
          const row = lines[i].split(',').map((c) => c.trim().replace(/^"|"$/g, ''));
          if (row.length >= 8) {
            parsedProjects.push({
              id: row[0] || `MPLAD-IMP-${Date.now()}-${i}`,
              state: row[1] || 'National',
              district: row[2] || 'Central',
              constituency: row[3] || 'General',
              location: row[4] || 'Block HQ',
              projectType: row[5] || 'Infrastructure',
              description: row[6] || 'Public Works Scheme',
              sanctionedCost: parseFloat(row[7]) || 20.0,
              expenditure: parseFloat(row[8]) || 15.0,
              startDate: row[9] || '2023-01-01',
              expectedCompletionDate: row[10] || '2024-01-01',
              actualCompletionDate: row[11] || undefined,
              physicalProgress: parseFloat(row[12]) || 60,
              numberOfPayments: parseInt(row[13], 10) || 6,
              implementingAgency: row[14] || 'Public Works Department',
              status: 'Ongoing',
              reviewStatus: 'Pending Review',
            });
          }
        }

        if (parsedProjects.length > 0) {
          onUploadProjects(parsedProjects);
          setUploadStatus(`Successfully parsed ${parsedProjects.length} records from ${file.name}`);
        } else {
          setUploadStatus('Unable to parse valid records from CSV. Please check formatting.');
        }
      } catch (err) {
        setUploadStatus('Error reading file. Ensure UTF-8 formatted CSV.');
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleDownloadTemplate = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      EXPECTED_FIELDS.join(',') +
      '\n' +
      'MPLAD-EX-001,Rajasthan,Barmer,Barmer,Village ABC,Road Construction,Construction of rural connecting road,22.0,20.2,2023-03-10,2024-03-10,,32,34,District Rural Development Agency';

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'MPLADS_VigilAI_Data_Template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Disclaimer Banner for Synthetic Data */}
      <div className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800 shadow-xs flex items-start space-x-3">
        <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed">
          <p className="font-bold text-amber-300 text-sm">
            Demo Dataset — Synthetic Data for Prototype Demonstration
          </p>
          <p className="text-slate-300 mt-0.5">
            <strong>Never present synthetic numbers as official MPLADS statistics.</strong>{' '}
            For the purpose of the Smart India Hackathon evaluation, realistic synthetic project records with planted statistical, progress, and NLP duplicate anomalies are generated deterministically to test detection accuracy.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Upload Zone (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Upload MPLADS Project Records</h3>
              <p className="text-xs text-slate-500">
                Ingest CSV files conforming to the Ministry of Statistics schema format
              </p>
            </div>

            {/* Drag & Drop Area */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                dragOver
                  ? 'border-blue-500 bg-blue-50/50'
                  : 'border-slate-300 hover:border-slate-400 bg-slate-50/50'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                accept=".csv"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleFileProcess(e.target.files[0]);
                }}
              />
              <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700">
                Drag and drop your MPLADS CSV file here, or click to browse
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Supports UTF-8 CSV up to 25 MB</p>
            </div>

            {uploadStatus && (
              <div className="p-3 bg-blue-50 text-blue-800 text-xs rounded-lg border border-blue-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{uploadStatus}</span>
              </div>
            )}

            {/* Expected Fields Checklist */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Expected Mandatory & Audit Fields:</span>
                <button
                  onClick={handleDownloadTemplate}
                  className="text-xs text-blue-600 hover:underline font-semibold"
                >
                  Download Sample CSV Template
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[11px] text-slate-600">
                {EXPECTED_FIELDS.map((f) => (
                  <div key={f} className="flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span className="truncate">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Demo Dataset Action */}
            <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-slate-900 block">Use Pre-Loaded Demo Dataset</span>
                <span className="text-[11px] text-slate-500">
                  Currently loaded: {totalLoaded} synthetic records (focused 10–20 cohort)
                </span>
              </div>
              <button
                onClick={onLoadDemoData}
                className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2 rounded-lg flex items-center justify-center space-x-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Database className="w-4 h-4 text-amber-400" />
                <span>Reload Demo Records</span>
              </button>
            </div>

            {/* Alternative: Enter Work Manually for AI Risk Classification */}
            {onNavigateToClassify && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between gap-3">
                <div className="text-xs">
                  <span className="font-bold text-blue-950 block">Option 2: Enter Work Done for AI Classification</span>
                  <span className="text-[11px] text-blue-700">
                    Input project progress & financials; Gemini AI classifies it as High, Medium, or Low risk.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onNavigateToClassify}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg shrink-0 transition-colors cursor-pointer"
                >
                  Classify Work
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Configurable Rule Engine Settings (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Rule-Based Compliance Engine</h3>
              </div>
              <span className="text-[11px] text-slate-500">
                {rules.filter((r) => r.enabled).length} Active Rules
              </span>
            </div>

            <p className="text-xs text-slate-500">
              Deterministic validation gates executed prior to statistical and ML anomaly scoring. Toggle rule enforcement:
            </p>

            <div className="space-y-3 text-xs">
              {rules.map((rule) => (
                <div
                  key={rule.id}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900">{rule.name}</span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                          rule.severity === 'CRITICAL'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {rule.severity}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {rule.description}
                    </p>
                  </div>

                  <button
                    onClick={() => onToggleRule(rule.id)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      rule.enabled ? 'bg-blue-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        rule.enabled ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
