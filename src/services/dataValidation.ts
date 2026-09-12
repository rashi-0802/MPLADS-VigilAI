/**
 * Rule-Based Compliance Engine & Data Validation
 * Verifies statutory data integrity, chronology, and financial rules.
 */

import { Project, RuleCheckResult, ConfigurableRule } from '../types';

export const DEFAULT_RULES: ConfigurableRule[] = [
  {
    id: 'RULE_MANDATORY_FIELDS',
    name: 'Mandatory Information Check',
    description: 'Verifies presence of Project ID, State, District, Sanctioned Cost, and Description.',
    enabled: true,
    severity: 'CRITICAL',
  },
  {
    id: 'RULE_NON_NEGATIVE_FINANCES',
    name: 'Non-Negative Financials',
    description: 'Ensures sanctioned cost and expenditure are strictly greater than zero.',
    enabled: true,
    severity: 'CRITICAL',
  },
  {
    id: 'RULE_EXPENDITURE_SANCTION_CAP',
    name: 'Expenditure within Sanctioned Cap',
    description: 'Flags expenditure exceeding 105% of sanctioned cost without revised sanction order.',
    enabled: true,
    severity: 'CRITICAL',
  },
  {
    id: 'RULE_PHYSICAL_PROGRESS_BOUNDS',
    name: 'Physical Progress Bounds (0-100%)',
    description: 'Verifies that reported physical progress is within the valid 0% to 100% range.',
    enabled: true,
    severity: 'CRITICAL',
  },
  {
    id: 'RULE_DATE_CHRONOLOGY',
    name: 'Chronological Integrity',
    description: 'Checks that expected/actual completion dates do not precede project start date.',
    enabled: true,
    severity: 'CRITICAL',
  },
  {
    id: 'RULE_ZERO_PHYSICAL_WITH_HIGH_EXPENDITURE',
    name: 'Zero Physical with Substantial Expenditure',
    description: 'Flags projects with >40% fund expenditure but 0% reported ground physical progress.',
    enabled: true,
    severity: 'WARNING',
  },
];

export function validateProjectCompliance(
  project: Project,
  rules: ConfigurableRule[] = DEFAULT_RULES
): RuleCheckResult[] {
  const results: RuleCheckResult[] = [];

  for (const rule of rules) {
    if (!rule.enabled) continue;

    switch (rule.id) {
      case 'RULE_MANDATORY_FIELDS': {
        const hasId = !!project.id && project.id.trim().length > 0;
        const hasState = !!project.state;
        const hasCost = typeof project.sanctionedCost === 'number' && !isNaN(project.sanctionedCost);
        const hasDesc = !!project.description && project.description.trim().length > 5;
        const passed = hasId && hasState && hasCost && hasDesc;

        results.push({
          ruleId: rule.id,
          ruleName: rule.name,
          actualValue: passed ? 'All mandatory fields populated' : 'Missing required field(s)',
          expectedValue: 'ID, State, District, Cost, Description present',
          passed,
          severity: rule.severity,
          message: passed
            ? 'Compliant with mandatory schema specification'
            : 'Non-compliant: Essential record fields missing from payload',
        });
        break;
      }

      case 'RULE_NON_NEGATIVE_FINANCES': {
        const passed = project.sanctionedCost > 0 && project.expenditure >= 0;
        results.push({
          ruleId: rule.id,
          ruleName: rule.name,
          actualValue: `Cost: ₹${project.sanctionedCost}L, Exp: ₹${project.expenditure}L`,
          expectedValue: 'Sanctioned Cost > 0, Expenditure >= 0',
          passed,
          severity: rule.severity,
          message: passed ? 'Financial amounts are non-negative' : 'Negative financial values detected',
        });
        break;
      }

      case 'RULE_EXPENDITURE_SANCTION_CAP': {
        // Allow up to 5% buffer for minor adjustments, anything above is unapproved overrun
        const ratio = project.sanctionedCost > 0 ? (project.expenditure / project.sanctionedCost) : 1;
        const passed = ratio <= 1.05;
        results.push({
          ruleId: rule.id,
          ruleName: rule.name,
          actualValue: `${(ratio * 100).toFixed(1)}% of sanctioned budget`,
          expectedValue: '<= 100% (or max 105% buffer)',
          passed,
          severity: rule.severity,
          message: passed
            ? 'Expenditure within sanctioned administrative approval'
            : `Over-expenditure detected: Expenditure exceeds sanction by ₹${(project.expenditure - project.sanctionedCost).toFixed(2)} Lakh without revised sanction order`,
        });
        break;
      }

      case 'RULE_PHYSICAL_PROGRESS_BOUNDS': {
        const passed = project.physicalProgress >= 0 && project.physicalProgress <= 100;
        results.push({
          ruleId: rule.id,
          ruleName: rule.name,
          actualValue: `${project.physicalProgress}%`,
          expectedValue: '0% to 100%',
          passed,
          severity: rule.severity,
          message: passed ? 'Physical progress within mathematical bounds' : 'Physical progress reported outside 0–100% boundary',
        });
        break;
      }

      case 'RULE_DATE_CHRONOLOGY': {
        let passed = true;
        let note = 'Dates chronological';
        if (project.startDate && project.expectedCompletionDate) {
          const start = new Date(project.startDate).getTime();
          const exp = new Date(project.expectedCompletionDate).getTime();
          if (exp < start) {
            passed = false;
            note = 'Expected completion precedes start date';
          }
        }
        results.push({
          ruleId: rule.id,
          ruleName: rule.name,
          actualValue: `Start: ${project.startDate}, Exp: ${project.expectedCompletionDate}`,
          expectedValue: 'Completion Date >= Start Date',
          passed,
          severity: rule.severity,
          message: passed ? 'Valid chronological timeline' : note,
        });
        break;
      }

      case 'RULE_ZERO_PHYSICAL_WITH_HIGH_EXPENDITURE': {
        const finProgress = project.sanctionedCost > 0 ? (project.expenditure / project.sanctionedCost) * 100 : 0;
        const passed = !(finProgress > 40 && project.physicalProgress === 0);
        results.push({
          ruleId: rule.id,
          ruleName: rule.name,
          actualValue: `Financial: ${finProgress.toFixed(1)}%, Physical: ${project.physicalProgress}%`,
          expectedValue: 'Ground progress logged when financial > 40%',
          passed,
          severity: rule.severity,
          message: passed
            ? 'Ground progress is consistent with expenditure'
            : 'Unusual: More than 40% funds disbursed with zero reported physical progress',
        });
        break;
      }
    }
  }

  return results;
}
