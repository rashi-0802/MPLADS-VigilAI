import React, { useState } from 'react';
import {
  Users,
  Search,
  MapPin,
  Calendar,
  IndianRupee,
  CheckCircle2,
  AlertCircle,
  MessageSquarePlus,
  Send,
  Camera,
  X,
  Building,
} from 'lucide-react';
import { Project, CitizenIssueReport } from '../types';

interface CitizenPortalProps {
  projects: Project[];
  onReportSubmitted: (report: CitizenIssueReport) => void;
  reports: CitizenIssueReport[];
}

export const CitizenPortal: React.FC<CitizenPortalProps> = ({
  projects,
  onReportSubmitted,
  reports,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProjectForIssue, setSelectedProjectForIssue] = useState<Project | null>(null);

  // Form State
  const [issueType, setIssueType] = useState<CitizenIssueReport['issueType']>('Work incomplete');
  const [description, setDescription] = useState('');
  const [citizenName, setCitizenName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Filter public view
  const publicProjects = projects.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.id.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q) ||
      p.district.toLowerCase().includes(q) ||
      p.state.toLowerCase().includes(q)
    );
  });

  const handleSubmitIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectForIssue || !description.trim() || !citizenName.trim()) return;

    const report: CitizenIssueReport = {
      id: `CITIZEN-REP-${Date.now()}`,
      projectId: selectedProjectForIssue.id,
      projectTitle: selectedProjectForIssue.description,
      issueType,
      description: description.trim(),
      citizenName: citizenName.trim(),
      contactNumber: contactNumber.trim() || undefined,
      submittedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
      status: 'Received',
    };

    onReportSubmitted(report);
    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setSelectedProjectForIssue(null);
      setDescription('');
      setCitizenName('');
      setContactNumber('');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Citizen Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-5 rounded-2xl shadow-sm border border-emerald-700/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="bg-emerald-700/80 text-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                Public Transparency Layer
              </span>
              <span className="text-xs text-emerald-200">MoSPI Open Governance Portal</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">CitiZen: Public MPLADS Project Portal</h2>
            <p className="text-xs text-emerald-100 max-w-2xl leading-relaxed">
              Track government development works sanctioned in your locality. Verify execution status, milestone progress, and directly submit feedback to official auditors.
            </p>
          </div>

          <div className="bg-emerald-950/60 p-3 rounded-xl border border-emerald-600/40 text-center min-w-[160px]">
            <span className="text-2xl font-black text-emerald-300 block">
              {publicProjects.length.toLocaleString()}
            </span>
            <span className="text-[11px] text-emerald-200">Public Works in Database</span>
          </div>
        </div>
      </div>

      {/* Public Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by your village, gram panchayat, district, or project keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs text-slate-500 hover:text-slate-800 px-2"
          >
            Clear
          </button>
        )}
      </div>

      {/* Public Project Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {publicProjects.slice(0, 18).map((p) => {
          return (
            <div
              key={p.id}
              className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                    {p.id}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      p.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : p.status === 'Delayed'
                        ? 'bg-amber-100 text-amber-800'
                        : p.status === 'Stalled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {p.status}
                  </span>
                </div>

                <h3 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                  {p.description}
                </h3>

                <div className="space-y-1 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{p.location}, {p.district}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{p.implementingAgency}</span>
                  </div>
                </div>

                {/* Physical Progress Bar */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex justify-between text-[11px] font-semibold mb-1">
                    <span className="text-slate-600">Reported Physical Progress</span>
                    <span className="text-emerald-700 font-bold">{p.physicalProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-2 rounded-full"
                      style={{ width: `${p.physicalProgress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Public Financial Metrics (Non-sensitive) */}
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-lg text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Sanctioned Cost</span>
                    <span className="font-bold text-slate-800">₹{p.sanctionedCost} Lakh</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Utilized Funds</span>
                    <span className="font-bold text-slate-800">₹{p.expenditure} Lakh</span>
                  </div>
                </div>
              </div>

              {/* Citizen Action Button */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">
                  Target: {p.expectedCompletionDate}
                </span>
                <button
                  onClick={() => setSelectedProjectForIssue(p)}
                  className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-1 rounded border border-emerald-200 transition-colors flex items-center gap-1"
                >
                  <MessageSquarePlus className="w-3.5 h-3.5" />
                  <span>Report an Issue</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Citizen Feedback Reports History (Local Prototype Store) */}
      {reports.length > 0 && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Your Submitted Grievance Reports</h3>
          <div className="space-y-2">
            {reports.map((r) => (
              <div
                key={r.id}
                className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <span className="font-mono font-bold text-emerald-800">{r.projectId}</span>
                  <span className="mx-2 text-slate-300">|</span>
                  <span className="font-semibold text-slate-800">{r.issueType}</span>
                  <p className="text-slate-600 text-[11px] mt-0.5">"{r.description}"</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="inline-block bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-[10px] font-bold">
                    {r.status}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">{r.submittedAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Report an Issue Modal */}
      {selectedProjectForIssue && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold">Report an Issue on Public Work</h3>
                <span className="text-xs text-slate-400 font-mono">
                  {selectedProjectForIssue.id}
                </span>
              </div>
              <button
                onClick={() => setSelectedProjectForIssue(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submittedSuccess ? (
              <div className="p-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-base font-bold text-slate-900">Grievance Successfully Registered!</h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Your feedback has been logged in the audit queue for district administrative verification.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitIssue} className="p-5 space-y-4 text-xs">
                <div>
                  <span className="text-slate-500 text-[11px] block">Project Description:</span>
                  <p className="font-semibold text-slate-800 mt-0.5">
                    {selectedProjectForIssue.description}
                  </p>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nature of Grievance / Discrepancy:
                  </label>
                  <select
                    value={issueType}
                    onChange={(e) => setIssueType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 text-xs focus:outline-none"
                  >
                    <option value="Work incomplete">Work incomplete on ground</option>
                    <option value="Project not visible">Project not visible / No physical structure found</option>
                    <option value="Incorrect information">Incorrect information on sign board</option>
                    <option value="Quality concern">Substandard construction quality / Material defect</option>
                    <option value="Other">Other discrepancy</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Describe Ground Observation:
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Provide specific details regarding the ground progress observed..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Citizen Name:</label>
                    <input
                      type="text"
                      required
                      placeholder="Your Name"
                      value={citizenName}
                      onChange={(e) => setCitizenName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Contact Number (Optional):</label>
                    <input
                      type="text"
                      placeholder="Mobile number"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-500">
                  Privacy Notice: Citizen reports are stored in the prototype database and routed to authorized audit officers without exposing private contact info publicly.
                </div>

                <div className="pt-2 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setSelectedProjectForIssue(null)}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Grievance</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
