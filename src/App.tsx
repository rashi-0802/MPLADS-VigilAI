import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { InvestigationQueue } from './components/InvestigationQueue';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { AlertCentre } from './components/AlertCentre';
import { AnalyticsView } from './components/AnalyticsView';
import { MapView } from './components/MapView';
import { DataUploadView } from './components/DataUploadView';
import { CitizenPortal } from './components/CitizenPortal';
import { JudgeDemoTour } from './components/JudgeDemoTour';
import { PipelineExecutionModal } from './components/PipelineExecutionModal';
import { WorkClassifierView } from './components/WorkClassifierView';

import { SYNTHETIC_PROJECTS } from './data/mockData';
import { DEFAULT_RULES } from './services/dataValidation';
import { runFullAuditPipeline } from './services/pipelineCoordinator';
import {
  Project,
  AnalyzedProject,
  ConfigurableRule,
  ReviewStatus,
  CitizenIssueReport,
} from './types';

export default function App() {
  // Core Application State
  const [projects, setProjects] = useState<Project[]>(SYNTHETIC_PROJECTS);
  const [rules, setRules] = useState<ConfigurableRule[]>(DEFAULT_RULES);
  const [analyzedProjects, setAnalyzedProjects] = useState<AnalyzedProject[]>([]);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [userRole, setUserRole] = useState<'Auditor' | 'Citizen'>('Auditor');
  const [selectedProject, setSelectedProject] = useState<AnalyzedProject | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [queueRiskFilter, setQueueRiskFilter] = useState<string>('ALL');

  // Interactive Demo & Pipeline Execution State
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStage, setAnalysisStage] = useState<number>(0);
  const [isJudgeTourOpen, setIsJudgeTourOpen] = useState<boolean>(false);

  // Citizen Reports Store
  const [citizenReports, setCitizenReports] = useState<CitizenIssueReport[]>([
    {
      id: 'CITIZEN-INIT-01',
      projectId: 'MPLAD-DEMO-1023',
      projectTitle: 'Construction of rural connecting road from NH-68 to Village Barmer Rural',
      issueType: 'Work incomplete',
      description:
        'Road work was halted 6 months back after laying stone aggregate. Huge dust problem for villagers and no contractor machinery present.',
      citizenName: 'Rameshwar Lal Patel (Village Pradhan)',
      contactNumber: '+91 98290 XXXXX',
      submittedAt: '2026-09-08 11:20 IST',
      status: 'Under Investigation',
    },
  ]);

  // Initial Pipeline Analysis Execution on Mount
  useEffect(() => {
    const results = runFullAuditPipeline(projects, rules);
    setAnalyzedProjects(results);
  }, []);

  // Handler: Run Full Multi-Stage Analysis with animated progression
  const handleRunPipeline = useCallback(() => {
    setIsAnalyzing(true);
    setAnalysisStage(0);

    // Simulate real pipeline stage transitions
    const stepInterval = setInterval(() => {
      setAnalysisStage((prev) => {
        if (prev >= 5) {
          clearInterval(stepInterval);
          setTimeout(() => {
            const results = runFullAuditPipeline(projects, rules);
            setAnalyzedProjects(results);
            setIsAnalyzing(false);
          }, 400);
          return 5;
        }
        return prev + 1;
      });
    }, 350);
  }, [projects, rules]);

  // Handler: Open Specific Planted Demo Case
  const handleOpenDemoCase = useCallback(
    (projectId: string) => {
      // Find analyzed project
      const target = analyzedProjects.find((p) => p.project.id === projectId);
      if (target) {
        setSelectedProject(target);
      } else {
        // Run pipeline first if needed
        const results = runFullAuditPipeline(projects, rules);
        setAnalyzedProjects(results);
        const match = results.find((p) => p.project.id === projectId);
        if (match) setSelectedProject(match);
      }
    },
    [analyzedProjects, projects, rules]
  );

  // Handler: Update Review Status
  const handleUpdateReviewStatus = useCallback((projectId: string, newStatus: ReviewStatus) => {
    setAnalyzedProjects((prev) =>
      prev.map((item) => {
        if (item.project.id === projectId) {
          return {
            ...item,
            project: {
              ...item.project,
              reviewStatus: newStatus,
            },
          };
        }
        return item;
      })
    );

    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          return { ...p, reviewStatus: newStatus };
        }
        return p;
      })
    );

    // Also update selectedProject if open
    setSelectedProject((prev) => {
      if (prev && prev.project.id === projectId) {
        return {
          ...prev,
          project: {
            ...prev.project,
            reviewStatus: newStatus,
          },
        };
      }
      return prev;
    });
  }, []);

  // Handler: Toggle Rule
  const handleToggleRule = useCallback((ruleId: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, enabled: !r.enabled } : r))
    );
    // Recalculate
    setTimeout(() => {
      setAnalyzedProjects((currentAnalyzed) => {
        const updatedRules = rules.map((r) => (r.id === ruleId ? { ...r, enabled: !r.enabled } : r));
        return runFullAuditPipeline(projects, updatedRules);
      });
    }, 50);
  }, [projects, rules]);

  // Handler: Load Demo Data
  const handleLoadDemoData = useCallback(() => {
    setProjects(SYNTHETIC_PROJECTS);
    const results = runFullAuditPipeline(SYNTHETIC_PROJECTS, rules);
    setAnalyzedProjects(results);
  }, [rules]);

  // Handler: Upload Projects CSV
  const handleUploadProjects = useCallback((newProjects: Project[]) => {
    setProjects(newProjects);
    const results = runFullAuditPipeline(newProjects, rules);
    setAnalyzedProjects(results);
    setActiveTab('dashboard');
  }, [rules]);

  // Handler: Report Issue from Citizen
  const handleCitizenReport = useCallback((report: CitizenIssueReport) => {
    setCitizenReports((prev) => [report, ...prev]);
  }, []);

  // Handler: Add User-Classified Project to Pipeline
  const handleAddProjectToPipeline = useCallback((newProject: Project) => {
    setProjects((prev) => {
      const updated = [newProject, ...prev];
      const results = runFullAuditPipeline(updated, rules);
      setAnalyzedProjects(results);
      return updated;
    });
  }, [rules]);

  // Switch to Queue with preset risk filter
  const handleNavigateToQueue = useCallback((filter: string) => {
    setQueueRiskFilter(filter);
    setActiveTab('queue');
  }, []);

  // Switch role changes
  const handleRoleChange = useCallback((role: 'Auditor' | 'Citizen') => {
    setUserRole(role);
    if (role === 'Citizen') {
      setActiveTab('citizen');
    } else {
      setActiveTab('dashboard');
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col">
      {/* Top Navigation & App Bar */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        userRole={userRole}
        onToggleRole={handleRoleChange}
        onRunAnalysis={handleRunPipeline}
        onOpenJudgeTour={() => setIsJudgeTourOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalProjects={projects.length}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 md:p-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            analyzedProjects={analyzedProjects}
            onSelectProject={setSelectedProject}
            onNavigateToQueue={handleNavigateToQueue}
            onOpenJudgeTour={() => setIsJudgeTourOpen(true)}
            onNavigateToClassify={() => setActiveTab('classify')}
          />
        )}

        {activeTab === 'queue' && (
          <InvestigationQueue
            projects={analyzedProjects}
            onSelectProject={setSelectedProject}
            onUpdateReviewStatus={handleUpdateReviewStatus}
            initialRiskFilter={queueRiskFilter}
          />
        )}

        {activeTab === 'classify' && (
          <WorkClassifierView
            onAddProjectToPipeline={handleAddProjectToPipeline}
            onNavigateToQueue={() => handleNavigateToQueue('ALL')}
          />
        )}

        {activeTab === 'alerts' && (
          <AlertCentre
            analyzedProjects={analyzedProjects}
            onSelectProject={setSelectedProject}
          />
        )}

        {activeTab === 'map' && (
          <MapView
            analyzedProjects={analyzedProjects}
            onSelectProject={setSelectedProject}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView analyzedProjects={analyzedProjects} />
        )}

        {activeTab === 'citizen' && (
          <CitizenPortal
            projects={projects}
            onReportSubmitted={handleCitizenReport}
            reports={citizenReports}
          />
        )}

        {(activeTab === 'data' || activeTab === 'upload') && (
          <DataUploadView
            onLoadDemoData={handleLoadDemoData}
            onUploadProjects={handleUploadProjects}
            rules={rules}
            onToggleRule={handleToggleRule}
            totalLoaded={projects.length}
            onNavigateToClassify={() => setActiveTab('classify')}
          />
        )}
      </main>

      {/* Project Deep Investigation Dossier Modal */}
      <ProjectDetailModal
        analyzedProject={selectedProject}
        onClose={() => setSelectedProject(null)}
        onUpdateReviewStatus={handleUpdateReviewStatus}
        onSelectDuplicatePair={(targetId) => {
          const match = analyzedProjects.find((p) => p.project.id === targetId);
          if (match) setSelectedProject(match);
        }}
      />

      {/* SIH 2026 Judge Tour Walkthrough Modal */}
      <JudgeDemoTour
        isOpen={isJudgeTourOpen}
        onClose={() => setIsJudgeTourOpen(false)}
        onTriggerDemoCase={handleOpenDemoCase}
        onRunFullPipeline={handleRunPipeline}
      />

      {/* Live Pipeline Progression Modal */}
      <PipelineExecutionModal
        isOpen={isAnalyzing}
        currentStage={analysisStage}
      />

      {/* Statutory Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-6 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-slate-800">MPLADS VigilAI</span>
          <span>•</span>
          <span>Smart India Hackathon 2026 (SIH26102)</span>
          <span>•</span>
          <span className="text-blue-700 font-semibold">Theme: Smart Automation</span>
        </div>
        <div className="text-[11px] text-slate-400">
          Prototype decision-support system. Risk scores flag statistical deviations for official inquiry; they do not establish legal fraud.
        </div>
      </footer>
    </div>
  );
}
