import Link from "next/link";
import { notFound } from "next/navigation";
import { requireCoach } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { DashboardHeader } from "@/components/dashboard-header";
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

export default async function ParticipantDetailPage({
  params,
}: {
  params: Params;
}) {
  await requireCoach();
  const { userId } = await params;
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

  const latest = assessments?.[0];
  const results =
    latest && isAssessmentResults(latest.results) ? latest.results : null;

  return (
    <main className="flex flex-1 flex-col">
      <DashboardHeader title="Participant results" />
      <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-8 sm:px-6">
        <Link
          href="/dashboard"
          className="text-sm text-muted-foreground underline-offset-4 hover:text-[var(--parc-heading)] hover:underline"
        >
          ← Back to dashboard
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>{profile.full_name || "Unnamed participant"}</CardTitle>
            <CardDescription>
              {profile.email}
              {latest?.completed_at
                ? ` · Completed ${new Intl.DateTimeFormat("en", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(latest.completed_at))}`
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

        {(assessments?.length ?? 0) > 1 ? (
          <Card>
            <CardHeader>
              <CardTitle>Previous submissions</CardTitle>
              <CardDescription>
                {(assessments?.length ?? 0) - 1} earlier result
                {(assessments?.length ?? 0) - 1 === 1 ? "" : "s"} on file.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {assessments?.slice(1).map((row) => (
                  <li key={row.id}>
                    {new Intl.DateTimeFormat("en", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(new Date(row.completed_at))}
                    {row.dominant_nature
                      ? ` · Dominant: ${row.dominant_nature}`
                      : null}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </main>
  );
}
