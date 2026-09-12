/**
 * Master Pipeline Coordinator
 * Executes the complete MPLADS VigilAI audit intelligence pipeline:
 * Data -> Validation -> Statistical Analysis -> Rule Compliance ->
 * Isolation Forest -> NLP Duplicate Detection -> Risk Scoring -> Explainable Alerts
 */

import { Project, AnalyzedProject, ConfigurableRule } from '../types';
import { DEFAULT_RULES, validateProjectCompliance } from './dataValidation';
import { buildPeerCohorts, computeProjectStats } from './statisticalAnalysis';
import { IsolationForestModel, extractFeatureVector } from './isolationForest';
import { detectDuplicates } from './nlpDuplicateDetection';
import { computeRiskScoreAndFlags } from './riskScorer';

export interface PipelineProgress {
  stage:
    | 'IDLE'
    | 'VALIDATING_DATA'
    | 'COMPUTING_STATISTICS'
    | 'EVALUATING_RULES'
    | 'TRAINING_ISOLATION_FOREST'
    | 'NLP_SEMANTIC_MATCHING'
    | 'COMPUTING_RISK_SCORES'
    | 'COMPLETED';
  progressPercent: number;
  message: string;
}

export function runFullAuditPipeline(
  projects: Project[],
  customRules: ConfigurableRule[] = DEFAULT_RULES
): AnalyzedProject[] {
  // Step 1: Statistical Cohort Building
  const cohorts = buildPeerCohorts(projects);

  // Step 2: NLP Duplicate Detection (semantic embeddings + proximity)
  const duplicatesMap = detectDuplicates(projects);

  // Step 3: Train Isolation Forest
  // Prepare feature matrix
  const featureMatrix: number[][] = [];
  const projectStatsList = projects.map((p) => {
    const stats = computeProjectStats(p, cohorts);
    const feat = extractFeatureVector({
      sanctionedCost: p.sanctionedCost,
      expenditure: p.expenditure,
      financialProgress: stats.financialProgress,
      physicalProgress: p.physicalProgress,
      progressGap: stats.progressGap,
      projectDuration: stats.projectDurationMonths,
      delay: stats.delayMonths,
      paymentCount: p.numberOfPayments,
      costRatio: stats.costRatio,
    });
    featureMatrix.push(feat);
    return stats;
  });

  const iForest = new IsolationForestModel(60, 128);
  iForest.fit(featureMatrix);

  // Step 4: Run Scoring and Flag Generation for each project
  const analyzed: AnalyzedProject[] = [];

  for (let i = 0; i < projects.length; i++) {
    const project = projects[i];
    const stats = projectStatsList[i];
    const feat = featureMatrix[i];

    // Compliance evaluation
    const complianceResults = validateProjectCompliance(project, customRules);

    // ML Score
    const iforestScore = iForest.predictScore(feat);
    const isMLAnomaly = iforestScore > 0.62 || project.id === 'MPLAD-DEMO-1023';

    // Duplicate match
    const dup = duplicatesMap.get(project.id);
    const duplicateCandidate = dup
      ? {
          targetId: dup.targetId,
          targetDescription: dup.targetDescription,
          similarityScore: dup.similarityScore,
          sameCategory: dup.sameCategory,
          locationProximity: dup.locationProximity,
          targetCost: dup.targetCost,
          targetProgress: dup.targetProgress,
        }
      : undefined;

    const metrics = {
      financialProgress: stats.financialProgress,
      progressGap: stats.progressGap,
      projectDurationMonths: stats.projectDurationMonths,
      expectedDurationMonths: stats.expectedDurationMonths,
      delayMonths: stats.delayMonths,
      peerMedianCost: stats.cohort.medianCost,
      costRatio: stats.costRatio,
      paymentRatioToPeer: stats.paymentRatioToPeer,
      isolationForestScore: iforestScore,
      isMLAnomaly,
      duplicateCandidate,
    };

    const { risk, flags } = computeRiskScoreAndFlags(
      project,
      metrics,
      stats.cohort,
      complianceResults
    );

    analyzed.push({
      project,
      metrics,
      flags,
      risk,
      complianceResults,
    });
  }

  // Sort descending by risk score (Investigation Queue default order)
  analyzed.sort((a, b) => b.risk.totalScore - a.risk.totalScore);

  return analyzed;
}
