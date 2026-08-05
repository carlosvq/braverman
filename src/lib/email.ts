import {
  severityLabel,
  type AssessmentResults,
} from "@/lib/scoring";

export const RESULTS_EMAIL =
  process.env.NEXT_PUBLIC_RESULTS_EMAIL ?? "sahra@parc.do";

export function buildResultsEmailBody(params: {
  patientName: string;
  results: AssessmentResults;
  submittedAt?: Date;
}): string {
  const { patientName, results, submittedAt = new Date() } = params;

  return [
    `Personality Type Assessment Results`,
    `Patient: ${patientName}`,
    `Submitted: ${submittedAt.toUTCString()}`,
    ``,
    `Dominant nature: ${results.dominantNatureLabel}`,
    `Most deficient nature: ${results.mostDeficientNatureLabel}`,
    ``,
    `Part 1 — Dominance:`,
    ...results.dominance.map(
      (s) => `  ${s.section} ${s.natureLabel}: ${s.trueCount}/${s.total}`
    ),
    ``,
    `Part 2 — Deficiency:`,
    ...results.deficiency.map(
      (s) =>
        `  ${s.section} ${s.natureLabel}: ${s.trueCount}/${s.total} (${severityLabel(s.severity ?? "none")})`
    ),
    ``,
    `For practitioner review only — not a medical diagnosis.`,
  ].join("\n");
}

export function buildResultsMailto(params: {
  patientName: string;
  results: AssessmentResults;
  submittedAt?: Date;
}): string {
  const { patientName, results, submittedAt } = params;
  const subject = `Personality Type Assessment results — ${patientName}`;
  const body = buildResultsEmailBody({ patientName, results, submittedAt });

  return `mailto:${RESULTS_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function openResultsMailto(params: {
  patientName: string;
  results: AssessmentResults;
  submittedAt?: Date;
}): void {
  window.location.href = buildResultsMailto(params);
}
