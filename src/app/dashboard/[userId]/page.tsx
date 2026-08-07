import Link from "next/link";
import { notFound } from "next/navigation";
import { NATURE_LABELS, type Nature } from "@/data/questions";
import { requireCoach } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { DashboardHeader } from "@/components/dashboard-header";
import {
  DeleteAssessmentButton,
  DeleteParticipantButton,
} from "@/components/delete-confirm-dialog";
import { ResultsDisplay } from "@/components/results-display";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { AssessmentResults } from "@/lib/scoring";

type Params = Promise<{ userId: string }>;
type SearchParams = Promise<{ assessment?: string }>;

function isAssessmentResults(value: unknown): value is AssessmentResults {
  if (!value || typeof value !== "object") return false;
  const v = value as Partial<AssessmentResults>;
  return (
    Array.isArray(v.dominance) &&
    Array.isArray(v.deficiency) &&
    typeof v.dominantNature === "string" &&
    typeof v.mostDeficientNature === "string"
  );
}

function natureLabel(value: string | null): string {
  if (!value) return "—";
  if (value in NATURE_LABELS) {
    return NATURE_LABELS[value as Nature];
  }
  return value;
}

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function ParticipantDetailPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  await requireCoach();
  const { userId } = await params;
  const { assessment: assessmentId } = await searchParams;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, invited_at")
    .eq("id", userId)
    .maybeSingle();

  if (!profile || profile.role !== "participant") {
    notFound();
  }

  const { data: assessments } = await supabase
    .from("assessments")
    .select("id, results, completed_at, dominant_nature, most_deficient_nature")
    .eq("user_id", userId)
    .order("completed_at", { ascending: false });

  const selected =
    assessments?.find((row) => row.id === assessmentId) ?? assessments?.[0];
  const results =
    selected && isAssessmentResults(selected.results) ? selected.results : null;
  const participantLabel =
    profile.full_name?.trim() || profile.email || "this participant";

  return (
    <main className="flex flex-1 flex-col">
      <DashboardHeader title="Participant results" />
      <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/dashboard"
            className="text-sm text-muted-foreground underline-offset-4 hover:text-[var(--parc-heading)] hover:underline"
          >
            ← Back to dashboard
          </Link>
          <DeleteParticipantButton
            userId={userId}
            participantLabel={participantLabel}
            triggerLabel="Remove participant"
            redirectTo="/dashboard"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{profile.full_name || "Unnamed participant"}</CardTitle>
            <CardDescription>
              {profile.email}
              {selected?.completed_at
                ? ` · Completed ${formatDateTime(selected.completed_at)}`
                : " · Not completed yet"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {results ? (
              <ResultsDisplay results={results} />
            ) : (
              <p className="text-sm text-muted-foreground">
                This participant has not submitted an assessment yet.
              </p>
            )}
          </CardContent>
        </Card>

        {(assessments?.length ?? 0) > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Submissions</CardTitle>
              <CardDescription>
                {assessments?.length} assessment
                {assessments?.length === 1 ? "" : "s"} on file. Select a date to
                view results.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="divide-y divide-border/60">
                {assessments?.map((row) => {
                  const isActive = selected?.id === row.id;
                  const completedLabel = formatDateTime(row.completed_at);
                  return (
                    <li
                      key={row.id}
                      className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                    >
                      <Link
                        href={`/dashboard/${userId}?assessment=${row.id}`}
                        className={
                          isActive
                            ? "text-sm font-medium text-[var(--parc-heading)]"
                            : "text-sm text-muted-foreground underline-offset-4 hover:text-[var(--parc-heading)] hover:underline"
                        }
                      >
                        {completedLabel}
                        {row.dominant_nature
                          ? ` · Dominant: ${natureLabel(row.dominant_nature)}`
                          : null}
                        {isActive ? " · Viewing" : null}
                      </Link>
                      <DeleteAssessmentButton
                        assessmentId={row.id}
                        completedLabel={completedLabel}
                      />
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </main>
  );
}
