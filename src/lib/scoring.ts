import {
  NATURE_LABELS,
  QUESTIONS,
  QUESTIONS_BY_SECTION,
  SECTIONS,
  type Nature,
  type SectionId,
} from "@/data/questions";

export type Answers = Record<string, boolean>;

export type DeficiencySeverity = "none" | "minor" | "moderate" | "major";

export type SectionScore = {
  section: SectionId;
  nature: Nature;
  natureLabel: string;
  part: "dominance" | "deficiency";
  trueCount: number;
  total: number;
  severity?: DeficiencySeverity;
};

export type AssessmentResults = {
  dominance: SectionScore[];
  deficiency: SectionScore[];
  dominantNature: Nature;
  dominantNatureLabel: string;
  mostDeficientNature: Nature;
  mostDeficientNatureLabel: string;
};

export function deficiencySeverity(trueCount: number): DeficiencySeverity {
  if (trueCount <= 0) return "none";
  if (trueCount <= 5) return "minor";
  if (trueCount <= 15) return "moderate";
  return "major";
}

export function severityLabel(severity: DeficiencySeverity): string {
  switch (severity) {
    case "none":
      return "None";
    case "minor":
      return "Minor (0–5)";
    case "moderate":
      return "Moderate (6–15)";
    case "major":
      return "Major (15+)";
  }
}

function countTrue(section: SectionId, answers: Answers): number {
  return QUESTIONS_BY_SECTION[section].reduce((sum, question) => {
    return sum + (answers[question.id] === true ? 1 : 0);
  }, 0);
}

/** Tie-break order: Dopamine → GABA → Acetylcholine → Serotonin */
const DOMINANCE_TIEBREAK: Nature[] = [
  "dopamine",
  "gaba",
  "acetylcholine",
  "serotonin",
];

function pickHighestNature(scores: SectionScore[]): Nature {
  const max = Math.max(...scores.map((s) => s.trueCount));
  const tied = scores.filter((s) => s.trueCount === max).map((s) => s.nature);
  for (const nature of DOMINANCE_TIEBREAK) {
    if (tied.includes(nature)) return nature;
  }
  return tied[0];
}

export function scoreAnswers(answers: Answers): AssessmentResults {
  const scored: SectionScore[] = SECTIONS.map((meta) => {
    const trueCount = countTrue(meta.id, answers);
    const base: SectionScore = {
      section: meta.id,
      nature: meta.nature,
      natureLabel: NATURE_LABELS[meta.nature],
      part: meta.part,
      trueCount,
      total: QUESTIONS_BY_SECTION[meta.id].length,
    };
    if (meta.part === "deficiency") {
      base.severity = deficiencySeverity(trueCount);
    }
    return base;
  });

  const dominance = scored.filter((s) => s.part === "dominance");
  const deficiency = scored.filter((s) => s.part === "deficiency");
  const dominantNature = pickHighestNature(dominance);
  const mostDeficientNature = pickHighestNature(deficiency);

  return {
    dominance,
    deficiency,
    dominantNature,
    dominantNatureLabel: NATURE_LABELS[dominantNature],
    mostDeficientNature,
    mostDeficientNatureLabel: NATURE_LABELS[mostDeficientNature],
  };
}

export function validateAnswers(answers: Answers): string | null {
  if (!answers || typeof answers !== "object") {
    return "Answers are required.";
  }
  for (const question of QUESTIONS) {
    if (typeof answers[question.id] !== "boolean") {
      return `Missing answer for question ${question.id}.`;
    }
  }
  return null;
}

export function answeredCount(answers: Answers): number {
  return QUESTIONS.reduce((sum, q) => {
    return sum + (typeof answers[q.id] === "boolean" ? 1 : 0);
  }, 0);
}

export function sectionFullyAnswered(
  section: SectionId,
  answers: Answers
): boolean {
  return QUESTIONS_BY_SECTION[section].every(
    (q) => typeof answers[q.id] === "boolean"
  );
}
