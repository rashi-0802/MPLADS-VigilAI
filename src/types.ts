/**
 * MPLADS VigilAI - Type Definitions
 * Problem Statement ID: SIH26102
 * Theme: Smart Automation | Category: Software
 */

export type ProjectStatus = 'Completed' | 'Ongoing' | 'Delayed' | 'Stalled';
export type ReviewStatus = 'Pending Review' | 'Under Investigation' | 'Reviewed' | 'Cleared';
export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export type AnomalyType =
  | 'Cost Anomaly'
  | 'Progress Mismatch'
  | 'Delay'
  | 'Payment Anomaly'
  | 'Potential Duplicate'
  | 'Compliance Issue'
  | 'ML Anomaly Signal';

export interface Project {
  id: string;
  title?: string;
  state: string;
  district: string;
  constituency: string;
  location: string;
  projectType: string;
  description: string;
  sanctionedCost: number; // In Lakhs (₹ Lakh)
  expenditure: number; // In Lakhs (₹ Lakh)
  startDate: string;
  expectedCompletionDate: string;
  actualCompletionDate?: string;
  physicalProgress: number; // 0 - 100%
  numberOfPayments: number;
  implementingAgency: string;
  contractorName?: string;
  mpName?: string;
  financialYear?: string;
  status: ProjectStatus;
  reviewStatus: ReviewStatus;
  auditorNotes?: {
    id: string;
    timestamp: string;
    author: string;
    text: string;
  }[];
  // Citizen reporting logs
  citizenIssuesCount?: number;
}

export interface RuleCheckResult {
  ruleId: string;
  ruleName: string;
  actualValue: string;
  expectedValue: string;
  passed: boolean;
  severity: 'CRITICAL' | 'WARNING';
  message: string;
}

export interface AnomalyEvidence {
  label: string;
  value: string;
  benchmark?: string;
}

export interface AnomalyFlag {
  id: string;
  type: AnomalyType;
  severity: RiskLevel;
  title: string;
  explanation: string;
  evidence: AnomalyEvidence[];
}

export interface AnalysisMetrics {
  financialProgress: number; // Percentage
  progressGap: number; // Percentage points (Financial - Physical)
  projectDurationMonths: number;
  expectedDurationMonths: number;
  delayMonths: number;
  peerMedianCost: number;
  costRatio: number;
  paymentRatioToPeer: number;
  isolationForestScore: number; // Score from model (-1 to 1)
  isMLAnomaly: boolean;
  duplicateCandidate?: {
    targetId: string;
    targetDescription: string;
    similarityScore: number; // 0 - 100%
    sameCategory: boolean;
    locationProximity: string;
    targetCost: number;
    targetProgress: number;
  };
}

export interface RiskBreakdown {
  costAnomalyScore: number; // 0 - 100 (weight: 25%)
  progressMismatchScore: number; // 0 - 100 (weight: 25%)
  delayScore: number; // 0 - 100 (weight: 20%)
  paymentScore: number; // 0 - 100 (weight: 15%)
  duplicateScore: number; // 0 - 100 (weight: 10%)
  mlAnomalyScore: number; // 0 - 100 (weight: 5%)
  totalScore: number; // 0 - 100
  category: RiskLevel;
  primaryAlert: string;
  recommendation: string;
}

export interface AnalyzedProject {
  project: Project;
  metrics: AnalysisMetrics;
  flags: AnomalyFlag[];
  risk: RiskBreakdown;
  complianceResults: RuleCheckResult[];
}

export interface DashboardKPIs {
  totalProjects: number;
  totalExpenditureLakhs: number;
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
  requiringReviewCount: number;
}

export interface CitizenIssueReport {
  id: string;
  projectId: string;
  projectTitle: string;
  issueType: 'Project not visible' | 'Work incomplete' | 'Incorrect information' | 'Quality concern' | 'Other';
  description: string;
  citizenName: string;
  contactNumber?: string;
  submittedAt: string;
  status: 'Received' | 'Acknowledged' | 'Under Investigation' | 'Resolved';
}

export interface ConfigurableRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  severity: 'CRITICAL' | 'WARNING';
}
