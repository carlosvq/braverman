import {
  NATURE_DEFICIENCY_DESCRIPTIONS,
  NATURE_DOMINANCE_DESCRIPTIONS,
} from "@/data/nature-descriptions";
import { severityLabel, type AssessmentResults } from "@/lib/scoring";

export function ResultsDisplay({ results }: { results: AssessmentResults }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg bg-muted/50 p-4">
          <p className="text-xs font-medium text-muted-foreground">
            Dominant nature
          </p>
          <p className="mt-1 text-lg font-semibold text-[var(--parc-heading)]">
            {results.dominantNatureLabel}
          </p>
        </div>
        <div className="rounded-lg bg-muted/50 p-4">
          <p className="text-xs font-medium text-muted-foreground">
            Most deficient nature
          </p>
          <p className="mt-1 text-lg font-semibold text-[var(--parc-heading)]">
            {results.mostDeficientNatureLabel}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-[var(--parc-heading)]">
          Part 1 — Dominance
        </h3>
        <ul className="space-y-2 text-sm">
          {results.dominance.map((score) => (
            <li
              key={score.section}
              className="flex items-center justify-between gap-4 border-b border-border/60 pb-2 last:border-0 last:pb-0"
            >
              <span>
                {score.section} {score.natureLabel}
              </span>
              <span className="tabular-nums text-muted-foreground">
                <strong className="text-foreground">{score.trueCount}</strong> /{" "}
                {score.total}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-4 rounded-lg border border-border/60 p-4">
        <h3 className="text-sm font-medium text-[var(--parc-heading)]">
          {results.dominantNatureLabel} nature
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {NATURE_DOMINANCE_DESCRIPTIONS[results.dominantNature].balanced}
        </p>
        <div className="space-y-1.5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Excessive {results.dominantNatureLabel.toLowerCase()}
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {NATURE_DOMINANCE_DESCRIPTIONS[results.dominantNature].excess}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-[var(--parc-heading)]">
          Part 2 — Deficiency
        </h3>
        <ul className="space-y-2 text-sm">
          {results.deficiency.map((score) => (
            <li
              key={score.section}
              className="flex items-center justify-between gap-4 border-b border-border/60 pb-2 last:border-0 last:pb-0"
            >
              <span>
                {score.section} {score.natureLabel}
              </span>
              <span className="text-right tabular-nums text-muted-foreground">
                <strong className="text-foreground">{score.trueCount}</strong> /{" "}
                {score.total}
                <span className="mt-0.5 block text-xs">
                  {severityLabel(score.severity ?? "none")}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-4 rounded-lg border border-border/60 p-4">
        <h3 className="text-sm font-medium text-[var(--parc-heading)]">
          Deficient {results.mostDeficientNatureLabel}
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {NATURE_DEFICIENCY_DESCRIPTIONS[results.mostDeficientNature].intro}
        </p>
        {(
          [
            ["Physical issues", "physical"],
            ["Personality issues", "personality"],
            ["Memory issues", "memory"],
            ["Attention issues", "attention"],
          ] as const
        ).map(([label, key]) => (
          <div key={key} className="space-y-1.5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {label}
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {
                NATURE_DEFICIENCY_DESCRIPTIONS[results.mostDeficientNature][
                  key
                ]
              }
            </p>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        This is not a medical diagnosis. Your practitioner will review your
        profile and follow up with you.
      </p>
    </div>
  );
}
