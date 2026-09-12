/**
 * Statistical Analysis & Peer Cohort Benchmarking
 * Analyzes costs against comparable projects (by type, region, scale),
 * calculates financial vs physical gaps, delays, and payment distributions.
 */

import { Project } from '../types';

export interface PeerCohortStats {
  cohortKey: string;
  projectType: string;
  count: number;
  medianCost: number;
  q1Cost: number;
  q3Cost: number;
  iqrCost: number;
  meanCost: number;
  medianPayments: number;
  medianDurationMonths: number;
}

function calculateMedian(values: number[]): number {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function calculateQuantile(values: number[], q: number): number {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  if (sorted[base + 1] !== undefined) {
    return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
  }
  return sorted[base];
}

export function buildPeerCohorts(projects: Project[]): Map<string, PeerCohortStats> {
  const cohortGroups = new Map<string, Project[]>();

  for (const p of projects) {
    const key = p.projectType || 'General Infrastructure';
    const existing = cohortGroups.get(key) || [];
    existing.push(p);
    cohortGroups.set(key, existing);
  }

  const cohorts = new Map<string, PeerCohortStats>();

  cohortGroups.forEach((cohortProjects, key) => {
    const costs = cohortProjects.map((p) => p.sanctionedCost).filter((c) => c > 0);
    const payments = cohortProjects.map((p) => p.numberOfPayments).filter((n) => n > 0);

    const medianCost = calculateMedian(costs) || 20.0;
    const q1Cost = calculateQuantile(costs, 0.25) || medianCost * 0.8;
    const q3Cost = calculateQuantile(costs, 0.75) || medianCost * 1.25;
    const iqrCost = Math.max(1, q3Cost - q1Cost);
    const sumCost = costs.reduce((a, b) => a + b, 0);
    const meanCost = costs.length ? sumCost / costs.length : medianCost;
    const medianPayments = calculateMedian(payments) || 7;

    cohorts.set(key, {
      cohortKey: key,
      projectType: key,
      count: cohortProjects.length,
      medianCost: +medianCost.toFixed(1),
      q1Cost: +q1Cost.toFixed(1),
      q3Cost: +q3Cost.toFixed(1),
      iqrCost: +iqrCost.toFixed(1),
      meanCost: +meanCost.toFixed(1),
      medianPayments: Math.round(medianPayments),
      medianDurationMonths: 12,
    });
  });

  return cohorts;
}

export function computeProjectStats(
  project: Project,
  cohorts: Map<string, PeerCohortStats>
) {
  const cohort = cohorts.get(project.projectType) || {
    cohortKey: 'Default',
    projectType: project.projectType,
    count: 1,
    medianCost: 22.0,
    q1Cost: 18.0,
    q3Cost: 26.0,
    iqrCost: 8.0,
    meanCost: 22.0,
    medianPayments: 8,
    medianDurationMonths: 12,
  };

  // 1. Financial Progress
  const financialProgress =
    project.sanctionedCost > 0
      ? +((project.expenditure / project.sanctionedCost) * 100).toFixed(1)
      : 0;

  // 2. Progress Gap
  const progressGap = +(financialProgress - project.physicalProgress).toFixed(1);

  // 3. Duration & Delay (calculated in months)
  const start = new Date(project.startDate || '2023-01-01');
  const expectedEnd = new Date(project.expectedCompletionDate || '2024-01-01');
  const nowOrActual = project.actualCompletionDate
    ? new Date(project.actualCompletionDate)
    : new Date('2024-10-01'); // Current reference audit period

  const expectedDurationMonths = Math.max(
    1,
    Math.round((expectedEnd.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30.44))
  );

  const projectDurationMonths = Math.max(
    1,
    Math.round((nowOrActual.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30.44))
  );

  const delayMonths = Math.max(0, projectDurationMonths - expectedDurationMonths);

  // 4. Cost Benchmarking
  const costRatio = +(project.sanctionedCost / (cohort.medianCost || 1)).toFixed(2);

  // 5. Payment Frequency Benchmarking
  const paymentRatioToPeer = +(
    project.numberOfPayments / (cohort.medianPayments || 1)
  ).toFixed(2);

  return {
    cohort,
    financialProgress,
    progressGap,
    expectedDurationMonths,
    projectDurationMonths,
    delayMonths,
    costRatio,
    paymentRatioToPeer,
  };
}
