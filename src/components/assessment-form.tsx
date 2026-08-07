"use client";

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Image from "next/image";
import { ArrowRight, Check, ChevronLeft, ChevronRight, Mail } from "lucide-react";
import {
  NATURE_LABELS,
  QUESTIONS,
  QUESTIONS_BY_SECTION,
  SECTIONS,
  SUBCATEGORY_LABELS,
  SUBCATEGORY_ORDER,
  type SectionId,
} from "@/data/questions";
import {
  NATURE_DEFICIENCY_DESCRIPTIONS,
  NATURE_DOMINANCE_DESCRIPTIONS,
} from "@/data/nature-descriptions";
import { openResultsMailto } from "@/lib/email";
import {
  answeredCount,
  scoreAnswers,
  sectionFullyAnswered,
  severityLabel,
  validateAnswers,
  type Answers,
  type AssessmentResults,
} from "@/lib/scoring";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "nature-assessment-v1";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ENTER_ANIMATION =
  "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300 motion-safe:ease-out";
const SWAP_ANIMATION =
  "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1 motion-safe:duration-200 motion-safe:ease-out";
const LOGO_WIDTH = 164;
const LOGO_HEIGHT = 39;
const LOGO_FILTER =
  "brightness(0) saturate(100%) invert(13%) sepia(18%) saturate(1048%) hue-rotate(152deg) brightness(95%) contrast(95%)";

const VALID_QUESTION_IDS = new Set(QUESTIONS.map((q) => q.id));

type Phase = "start" | "quiz" | "review" | "done";

type PersistedState = {
  firstName?: string;
  lastName?: string;
  email?: string;
  /** @deprecated older saves used a single full-name field */
  name?: string;
  answers: Answers;
  phase: Phase;
  sectionIndex: number;
  /** @deprecated older saves */
  stepIndex?: number;
  /** @deprecated older saves */
  questionIndex?: number;
};

function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

function patientDetailsComplete(
  firstName: string,
  lastName: string,
  email: string
): boolean {
  return (
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    isValidEmail(email)
  );
}

function formatPatientName(firstName: string, lastName: string): string {
  return `${firstName.trim()} ${lastName.trim()}`.trim();
}

function firstUnansweredSectionIndex(answers: Answers): number {
  const idx = SECTIONS.findIndex(
    (section) => !sectionFullyAnswered(section.id, answers)
  );
  return idx === -1 ? SECTIONS.length - 1 : idx;
}

function sectionIndexFromQuestionIndex(questionIndex: number): number {
  const question = QUESTIONS[questionIndex];
  if (!question) return 0;
  const idx = SECTIONS.findIndex((s) => s.id === question.section);
  return idx === -1 ? 0 : idx;
}

function sectionIndexFromStepIndex(stepIndex: number): number {
  // Older saves stored subcategory step index (0–31). Map to section.
  const sectionIdx = Math.floor(stepIndex / SUBCATEGORY_ORDER.length);
  return Math.min(Math.max(sectionIdx, 0), SECTIONS.length - 1);
}

function completedSectionCount(answers: Answers): number {
  return SECTIONS.filter((section) =>
    sectionFullyAnswered(section.id, answers)
  ).length;
}

/** Completed sections + fractional progress in the current incomplete section. */
function sectionProgressPercent(
  answers: Answers,
  sectionIndex: number
): number {
  const completed = completedSectionCount(answers);
  const section = SECTIONS[sectionIndex];
  if (!section) {
    return Math.round((completed / SECTIONS.length) * 100);
  }
  if (sectionFullyAnswered(section.id, answers)) {
    return Math.round((completed / SECTIONS.length) * 100);
  }
  const items = QUESTIONS_BY_SECTION[section.id];
  if (items.length === 0) {
    return Math.round((completed / SECTIONS.length) * 100);
  }
  const answeredInSection = items.filter(
    (q) => typeof answers[q.id] === "boolean"
  ).length;
  const fraction = answeredInSection / items.length;
  return Math.round(((completed + fraction) / SECTIONS.length) * 100);
}

function groupBySubcategory(sectionId: SectionId) {
  const items = QUESTIONS_BY_SECTION[sectionId];
  return SUBCATEGORY_ORDER.map((subcategory) => ({
    subcategory,
    label: SUBCATEGORY_LABELS[subcategory],
    questions: items.filter((q) => q.subcategory === subcategory),
  })).filter((group) => group.questions.length > 0);
}

function pruneAnswers(raw: Answers | undefined): Answers {
  if (!raw || typeof raw !== "object") return {};
  const next: Answers = {};
  for (const [id, value] of Object.entries(raw)) {
    if (VALID_QUESTION_IDS.has(id) && typeof value === "boolean") {
      next[id] = value;
    }
  }
  return next;
}

function clearStoredProgress() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore storage errors
  }
}

function readStoredProgress(): PersistedState | null {
  try {
    let raw = localStorage.getItem(STORAGE_KEY);
    let fromSession = false;
    if (!raw) {
      raw = sessionStorage.getItem(STORAGE_KEY);
      fromSession = Boolean(raw);
    }
    if (!raw) return null;

    const parsed = JSON.parse(raw) as PersistedState;
    if (fromSession) {
      localStorage.setItem(STORAGE_KEY, raw);
      sessionStorage.removeItem(STORAGE_KEY);
    }
    return parsed;
  } catch {
    return null;
  }
}

function AppShell({
  children,
  toolbar,
  className,
}: {
  children: ReactNode;
  toolbar?: ReactNode;
  className?: string;
}) {
  const headerRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    function updateHeight() {
      if (!header) return;
      document.documentElement.style.setProperty(
        "--app-header-height",
        `${header.offsetHeight}px`
      );
    }

    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(header);
    return () => observer.disconnect();
  }, [toolbar]);

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header
        ref={headerRef}
        className="sticky top-0 z-50 border-b border-[var(--parc-border)] bg-[var(--parc-bg)]"
      >
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-4 py-2.5 sm:px-6">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Image
              src="/logo.svg"
              alt="PARC"
              width={LOGO_WIDTH}
              height={LOGO_HEIGHT}
              priority
              className="h-5 w-auto sm:h-6"
              style={{
                maxWidth: `${LOGO_WIDTH}px`,
                filter: LOGO_FILTER,
              }}
            />
            <div className="min-w-0 border-l border-[var(--parc-border-strong)] pl-2.5 sm:pl-3">
              <h1 className="text-xs font-medium text-[var(--parc-heading)] sm:text-sm">
                Braverman Test
              </h1>
            </div>
          </div>
          {toolbar}
        </div>
      </header>
      <div
        className={cn(
          "mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-6 sm:px-6",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}

function sectionFillPercent(sectionId: SectionId, answers: Answers): number {
  const items = QUESTIONS_BY_SECTION[sectionId];
  if (items.length === 0) return 0;
  const answered = items.filter(
    (q) => typeof answers[q.id] === "boolean"
  ).length;
  return Math.round((answered / items.length) * 100);
}

function AssessmentMap({
  answers,
  sectionIndex,
  isReview,
  onSelectSection,
}: {
  answers: Answers;
  sectionIndex: number;
  isReview: boolean;
  onSelectSection: (index: number) => void;
}) {
  const part1 = SECTIONS.filter((s) => s.part === "dominance");
  const part2 = SECTIONS.filter((s) => s.part === "deficiency");

  function renderRow(
    label: string,
    sections: typeof SECTIONS,
    indexOffset: number
  ) {
    return (
      <div className="space-y-1">
        <p className="text-[10px] font-medium leading-tight tracking-wide text-muted-foreground sm:text-[11px]">
          {label}
        </p>
        <div className="grid grid-cols-4 gap-1.5">
          {sections.map((section, i) => {
            const index = indexOffset + i;
            const complete = sectionFullyAnswered(section.id, answers);
            const current = !isReview && index === sectionIndex;
            const fill = complete
              ? 100
              : sectionFillPercent(section.id, answers);

            return (
              <button
                key={section.id}
                type="button"
                onClick={() => onSelectSection(index)}
                aria-current={current ? "step" : undefined}
                aria-label={`${NATURE_LABELS[section.nature]}${complete ? ", complete" : current ? ", current" : ", remaining"
                  }`}
                className={cn(
                  "relative min-h-9 overflow-hidden rounded-md border px-1 py-1.5 text-center text-[10px] font-medium leading-tight transition-colors sm:min-h-10 sm:text-xs",
                  current &&
                  "border-[var(--parc-heading)] bg-[var(--parc-button-bg)] text-white ring-1 ring-[var(--parc-heading)]",
                  !current &&
                  complete &&
                  "border-[var(--parc-border-strong)] bg-[#e9f2d2] text-[var(--parc-heading)]",
                  !current &&
                  !complete &&
                  "border-[var(--parc-border)] bg-white text-muted-foreground hover:border-[var(--parc-border-strong)] hover:text-[var(--parc-heading)]"
                )}
              >
                {!complete && fill > 0 ? (
                  <span
                    aria-hidden
                    className={cn(
                      "absolute inset-y-0 left-0",
                      current ? "bg-white/25" : "bg-[#e9f2d2]/70"
                    )}
                    style={{ width: `${fill}%` }}
                  />
                ) : null}
                <span className="relative z-10">
                  {NATURE_LABELS[section.nature]}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <nav aria-label="Assessment map" className="space-y-2">
      {renderRow("Part 1: Determining your Dominant Nature", part1, 0)}
      {renderRow("Part 2: Defining your Deficiencies", part2, part1.length)}
    </nav>
  );
}

function QuizToolbar({
  progressPercent,
  answers,
  sectionIndex,
  isReview,
  onSelectSection,
}: {
  progressPercent: number;
  answers: Answers;
  sectionIndex: number;
  isReview: boolean;
  onSelectSection: (index: number) => void;
}) {
  return (
    <div className="space-y-2.5">
      <Progress value={progressPercent} className="h-1.5 w-full" />
      <AssessmentMap
        answers={answers}
        sectionIndex={sectionIndex}
        isReview={isReview}
        onSelectSection={onSelectSection}
      />
    </div>
  );
}

export function AssessmentForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [answers, setAnswers] = useState<Answers>({});
  const [phase, setPhase] = useState<Phase>("start");
  const [sectionIndex, setSectionIndex] = useState(0);
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [results, setResults] = useState<AssessmentResults | null>(null);
  const activeRowRef = useRef<HTMLDivElement | null>(null);

  const patientName = formatPatientName(firstName, lastName);
  const detailsComplete = patientDetailsComplete(firstName, lastName, email);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      const parsed = readStoredProgress();
      if (parsed) {
        if (parsed.firstName || parsed.lastName || parsed.email) {
          if (parsed.firstName) setFirstName(parsed.firstName);
          if (parsed.lastName) setLastName(parsed.lastName);
          if (parsed.email) setEmail(parsed.email);
        } else if (parsed.name) {
          const parts = parsed.name.trim().split(/\s+/);
          setFirstName(parts[0] ?? "");
          setLastName(parts.slice(1).join(" "));
        }
        const cleaned = pruneAnswers(parsed.answers);
        if (Object.keys(cleaned).length > 0) setAnswers(cleaned);
        if (parsed.phase === "review" && Object.keys(cleaned).length > 0) {
          setSectionIndex(SECTIONS.length - 1);
        } else if (typeof parsed.sectionIndex === "number") {
          setSectionIndex(
            Math.min(Math.max(parsed.sectionIndex, 0), SECTIONS.length - 1)
          );
        } else if (typeof parsed.stepIndex === "number") {
          setSectionIndex(sectionIndexFromStepIndex(parsed.stepIndex));
        } else if (typeof parsed.questionIndex === "number") {
          setSectionIndex(sectionIndexFromQuestionIndex(parsed.questionIndex));
        } else if (Object.keys(cleaned).length > 0) {
          setSectionIndex(firstUnansweredSectionIndex(cleaned));
        }
        setPhase("start");
      }
      setHydrated(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated || phase === "done") return;
    const payload: PersistedState = {
      firstName,
      lastName,
      email,
      answers,
      phase,
      sectionIndex,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // ignore quota / private mode errors
    }
  }, [firstName, lastName, email, answers, phase, sectionIndex, hydrated]);

  useEffect(() => {
    if (phase !== "quiz") return;
    activeRowRef.current?.scrollIntoView({
      block: "nearest",
      behavior: "smooth",
    });
  }, [phase, activeQuestionId, sectionIndex]);

  const totalQuestions = QUESTIONS.length;
  const answered = answeredCount(answers);
  const currentSection = SECTIONS[sectionIndex] ?? null;

  const subcategoryGroups = useMemo(
    () => (currentSection ? groupBySubcategory(currentSection.id) : []),
    [currentSection]
  );

  const progressPercent =
    phase === "review"
      ? Math.round((completedSectionCount(answers) / SECTIONS.length) * 100)
      : sectionProgressPercent(answers, sectionIndex);

  function goToSection(index: number) {
    setSectionIndex(index);
    setActiveQuestionId(null);
    setPhase("quiz");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function setSectionAnswer(questionId: string, value: boolean) {
    setAnswers((prev) => {
      if (prev[questionId] === value) {
        const next = { ...prev };
        delete next[questionId];
        return next;
      }
      return { ...prev, [questionId]: value };
    });
    setActiveQuestionId(questionId);
  }

  function goBackInQuiz() {
    setError(null);
    if (sectionIndex > 0) {
      goToSection(sectionIndex - 1);
      return;
    }
    setPhase("start");
  }

  function goNextSection() {
    if (sectionIndex >= SECTIONS.length - 1) {
      setPhase("review");
      return;
    }
    goToSection(sectionIndex + 1);
  }

  function resumeSession() {
    setError(null);
    if (answered === totalQuestions) {
      setPhase("review");
      return;
    }
    setPhase("quiz");
    setSectionIndex(firstUnansweredSectionIndex(answers));
  }

  function startQuiz() {
    if (!detailsComplete) {
      setError("Please enter your name, last name, and a valid email address.");
      return;
    }
    if (answered > 0) {
      resumeSession();
      return;
    }
    setError(null);
    setPhase("quiz");
    setSectionIndex(0);
  }

  function startNewSession() {
    setError(null);
    setResults(null);
    clearStoredProgress();
    setFirstName("");
    setLastName("");
    setEmail("");
    setAnswers({});
    setSectionIndex(0);
    setActiveQuestionId(null);
    setPhase("start");
  }

  function handleSubmit() {
    setError(null);
    setSubmitting(true);
    try {
      if (!detailsComplete) {
        throw new Error(
          "Please enter your name, last name, and a valid email address."
        );
      }
      const validationError = validateAnswers(answers);
      if (validationError) {
        throw new Error(validationError);
      }
      const scored = scoreAnswers(answers);
      clearStoredProgress();
      setResults(scored);
      setPhase("done");
      openResultsMailto({
        patientName,
        patientEmail: email.trim(),
        results: scored,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  }

  const quizToolbar = (
    <QuizToolbar
      progressPercent={progressPercent}
      answers={answers}
      sectionIndex={sectionIndex}
      isReview={phase === "review"}
      onSelectSection={goToSection}
    />
  );

  if (!hydrated) {
    return (
      <AppShell>
        <Card className="mx-auto w-full max-w-lg">
          <CardContent className="py-10 text-center text-muted-foreground">
            Loading assessment…
          </CardContent>
        </Card>
      </AppShell>
    );
  }

  if (phase === "done") {
    return (
      <AppShell>
        <div className={cn("mx-auto w-full max-w-2xl space-y-6", ENTER_ANIMATION)}>
          <Card>
            <CardHeader>
              <CardTitle>Your results</CardTitle>
              <CardDescription>
                Your Personality Type Assessment profile is ready. Send the
                email that opened to share results with your practitioner.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {results ? (
                <>
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
                            <strong className="text-foreground">
                              {score.trueCount}
                            </strong>{" "}
                            / {score.total}
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
                      {
                        NATURE_DOMINANCE_DESCRIPTIONS[results.dominantNature]
                          .balanced
                      }
                    </p>
                    <div className="space-y-1.5">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Excessive {results.dominantNatureLabel.toLowerCase()}
                      </p>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {
                          NATURE_DOMINANCE_DESCRIPTIONS[results.dominantNature]
                            .excess
                        }
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
                            <strong className="text-foreground">
                              {score.trueCount}
                            </strong>{" "}
                            / {score.total}
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
                      {
                        NATURE_DEFICIENCY_DESCRIPTIONS[
                          results.mostDeficientNature
                        ].intro
                      }
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
                            NATURE_DEFICIENCY_DESCRIPTIONS[
                            results.mostDeficientNature
                            ][key]
                          }
                        </p>
                      </div>
                    ))}
                  </div>

                  <p className="text-xs text-muted-foreground">
                    This is not a medical diagnosis. Your practitioner will
                    review your profile and follow up with you.
                  </p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Results could not be displayed. Please try again.
                </p>
              )}
            </CardContent>
            {results ? (
              <CardFooter>
                <Button
                  size="lg"
                  className="w-full"
                  onClick={() =>
                    openResultsMailto({
                      patientName,
                      patientEmail: email.trim(),
                      results,
                    })
                  }
                >
                  <Mail data-icon="inline-start" />
                  Email results to practitioner
                </Button>
              </CardFooter>
            ) : null}
          </Card>
        </div>
      </AppShell>
    );
  }

  if (phase === "start") {
    if (answered > 0) {
      return (
        <AppShell>
          <Card className={cn("mx-auto w-full max-w-lg", ENTER_ANIMATION)}>
            <CardHeader>
              <CardTitle>Welcome back</CardTitle>
              <CardDescription>
                A saved assessment was found on this device. Recover it, or
                start a new one.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-muted/50 p-4 text-sm leading-relaxed">
                <p>
                  <span className="text-muted-foreground">Name:</span>{" "}
                  <strong>{patientName || "Not set"}</strong>
                </p>
                <p className="mt-1">
                  <span className="text-muted-foreground">Email:</span>{" "}
                  <strong>{email.trim() || "Not set"}</strong>
                </p>
                <p className="mt-2">
                  <span className="text-muted-foreground">Progress</span>
                </p>
                <Progress
                  value={sectionProgressPercent(
                    answers,
                    firstUnansweredSectionIndex(answers)
                  )}
                  className="mt-1.5 h-1.5 w-full"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Progress is saved automatically on this device.
              </p>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button size="lg" className="w-full" onClick={resumeSession}>
                Continue where you left off
                <ArrowRight data-icon="inline-end" />
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={startNewSession}
              >
                Start a new assessment
              </Button>
            </CardFooter>
          </Card>
        </AppShell>
      );
    }

    return (
      <AppShell>
        <Card className={cn("mx-auto w-full max-w-2xl", ENTER_ANIMATION)}>
          <CardHeader>
            <CardTitle>Personality Type Assessment</CardTitle>
            <CardDescription>Neurotransmitter Assessment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3 rounded-lg bg-muted/50 p-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                To further enhance our work on your health and fitness goals, we
                introduce you to the Braverman Test. This assessment tool,
                developed by Dr. Eric Braverman, helps determine your
                neurotransmitter dominance and identifies potential deficiencies
                that might affect your mood, focus, and energy levels, and so
                many other aspects.
              </p>
              <p>
                Understanding your brain&apos;s chemical makeup can be
                incredibly insightful, guiding us to tailor your diet and
                lifestyle and even training modifications more effectively. The
                test focuses on four primary neurotransmitters: dopamine,
                acetylcholine, GABA, and serotonin, each playing a crucial role
                in your overall well-being.
              </p>
              <p>
                Click &apos;Submit&apos; after the completion of the test. This
                will help us discuss and incorporate the findings into your
                personalized wellness plan.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="patient-first-name">Name</Label>
                <Input
                  id="patient-first-name"
                  autoComplete="given-name"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patient-last-name">Last name</Label>
                <Input
                  id="patient-last-name"
                  autoComplete="family-name"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="patient-email">Email</Label>
                <Input
                  id="patient-email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && detailsComplete) startQuiz();
                  }}
                  required
                />
              </div>
            </div>
            {error ? (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            ) : null}
            <p className="text-xs text-muted-foreground">
              This is not a medical diagnosis.
            </p>
          </CardContent>
          <CardFooter>
            <Button
              size="lg"
              className="w-full"
              disabled={!detailsComplete}
              onClick={startQuiz}
            >
              Start
              <ArrowRight data-icon="inline-end" />
            </Button>
          </CardFooter>
        </Card>
      </AppShell>
    );
  }

  if (phase === "review") {
    const complete = answered === totalQuestions;
    return (
      <AppShell toolbar={quizToolbar}>
        <Card className={cn("mx-auto w-full max-w-2xl", ENTER_ANIMATION)}>
          <CardHeader>
            <CardTitle>Ready to submit</CardTitle>
            <CardDescription>
              Confirm your details, then submit to see your results.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-1 text-sm">
              <p>
                <span className="text-muted-foreground">Name:</span>{" "}
                <strong>{patientName}</strong>
              </p>
              <p>
                <span className="text-muted-foreground">Email:</span>{" "}
                <strong>{email.trim()}</strong>
              </p>
            </div>
            <Separator />
            <ul className="space-y-2 text-sm">
              {SECTIONS.map((section) => {
                const done = sectionFullyAnswered(section.id, answers);
                return (
                  <li
                    key={section.id}
                    className="flex items-center justify-between gap-4"
                  >
                    <span>{section.title}</span>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 text-xs font-medium",
                        done ? "text-[var(--parc-heading)]" : "text-destructive"
                      )}
                    >
                      {done ? (
                        <>
                          <Check className="size-3.5" aria-hidden />
                          Complete
                        </>
                      ) : (
                        "Incomplete"
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
            {error ? (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            ) : null}
            <p className="text-sm text-muted-foreground">
              After you submit, your scores appear on this page. A copy is also
              emailed to your practitioner.
            </p>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              disabled={submitting}
              onClick={() => goToSection(SECTIONS.length - 1)}
            >
              <ChevronLeft data-icon="inline-start" />
              Back
            </Button>
            {!complete ? (
              <Button
                variant="secondary"
                onClick={() =>
                  goToSection(firstUnansweredSectionIndex(answers))
                }
              >
                Finish remaining
                <ArrowRight data-icon="inline-end" />
              </Button>
            ) : null}
            <Button
              size="lg"
              disabled={!complete || submitting}
              onClick={handleSubmit}
            >
              {submitting ? "Opening…" : "Submit"}
              {!submitting ? <ArrowRight data-icon="inline-end" /> : null}
            </Button>
          </CardFooter>
        </Card>
      </AppShell>
    );
  }

  // Quiz — one nature section per page, with subcategory groups
  if (!currentSection) return null;

  return (
    <AppShell toolbar={quizToolbar} className="pb-20">
      <div
        key={currentSection.id}
        className={cn("flex flex-1 flex-col gap-3", SWAP_ANIMATION)}
      >
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            {currentSection.part === "dominance" ? "Part 1" : "Part 2"}
          </p>
          <h2 className="mt-0.5 text-base font-semibold tracking-tight text-[var(--parc-heading)]">
            {currentSection.title}
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {currentSection.instructions}
          </p>
        </div>

        <div className="overflow-hidden rounded-lg border border-[var(--parc-border)] bg-card">
          <div className="flex items-center gap-2 border-b border-[var(--parc-border)] bg-muted/40 px-3 py-1.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground sm:px-4">
            <span className="min-w-0 flex-1">Statement</span>
            <span className="w-[4.5rem] shrink-0 text-center sm:w-[5.25rem]">
              T / F
            </span>
          </div>

          {subcategoryGroups.map((group) => (
            <div key={group.subcategory}>
              <div className="border-t border-b border-[var(--parc-border)] bg-muted/25 px-3 py-2 sm:px-4">
                <p className="text-sm font-semibold tracking-tight text-[var(--parc-heading)] sm:text-base">
                  {group.label}
                </p>
              </div>
              {group.questions.map((q) => {
                const answer = answers[q.id];
                const isActive = activeQuestionId === q.id;
                return (
                  <div
                    key={q.id}
                    ref={isActive ? activeRowRef : null}
                    className={cn(
                      "flex items-start gap-2 border-b border-[var(--parc-border)] px-3 py-1.5 last:border-b-0 sm:items-center sm:px-4 sm:py-1",
                      isActive && "bg-[#e9f2d2]/40"
                    )}
                  >
                    <p className="min-w-0 flex-1 text-[13px] leading-snug text-[var(--parc-heading)] sm:text-sm">
                      {q.text}
                    </p>
                    <div
                      className="inline-flex shrink-0 gap-0.5 rounded-md border border-[var(--parc-border)] p-0.5"
                      role="group"
                      aria-label={q.text}
                    >
                      <button
                        type="button"
                        aria-pressed={answer === true}
                        onClick={() => setSectionAnswer(q.id, true)}
                        className={cn(
                          "h-7 w-8 rounded text-[11px] font-semibold transition-colors sm:w-9",
                          answer === true
                            ? "bg-[var(--parc-button-bg)] text-white"
                            : "text-muted-foreground hover:bg-muted hover:text-[var(--parc-heading)]"
                        )}
                      >
                        T
                      </button>
                      <button
                        type="button"
                        aria-pressed={answer === false}
                        onClick={() => setSectionAnswer(q.id, false)}
                        className={cn(
                          "h-7 w-8 rounded text-[11px] font-semibold transition-colors sm:w-9",
                          answer === false
                            ? "bg-[var(--parc-button-bg)] text-white"
                            : "text-muted-foreground hover:bg-muted hover:text-[var(--parc-heading)]"
                        )}
                      >
                        F
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-[var(--parc-border)] bg-[var(--parc-bg)]/95 backdrop-blur-sm">
          <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-2 px-4 py-2.5 sm:px-6">
            <Button variant="outline" size="sm" onClick={goBackInQuiz}>
              <ChevronLeft data-icon="inline-start" />
              {sectionIndex > 0 ? "Previous" : "Back"}
            </Button>
            <Button size="sm" onClick={goNextSection}>
              {sectionIndex >= SECTIONS.length - 1 ? "Review" : "Next"}
              <ChevronRight data-icon="inline-end" />
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
