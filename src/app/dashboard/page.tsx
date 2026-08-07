import Link from "next/link";
import { NATURE_LABELS, type Nature } from "@/data/questions";
import { requireCoach } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { DashboardHeader } from "@/components/dashboard-header";
import { DeleteParticipantButton } from "@/components/delete-confirm-dialog";
import { InviteForm } from "@/components/invite-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ProfileRow = {
  id: string;
  email: string;
  full_name: string;
  role: string;
  invited_at: string;
};

type AssessmentRow = {
  user_id: string;
  dominant_nature: string | null;
  completed_at: string;
};

function natureLabel(value: string | null): string {
  if (!value) return "—";
  if (value in NATURE_LABELS) {
    return NATURE_LABELS[value as Nature];
  }
  return value;
}

function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(new Date(value));
}

export default async function DashboardPage() {
  await requireCoach();
  const supabase = await createClient();

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, invited_at")
    .eq("role", "participant")
    .order("invited_at", { ascending: false });

  const participantIds = (profiles ?? []).map((p) => p.id);
  const latestByUser = new Map<string, AssessmentRow>();

  if (participantIds.length > 0) {
    const { data: assessments } = await supabase
      .from("assessments")
      .select("user_id, dominant_nature, completed_at")
      .in("user_id", participantIds)
      .order("completed_at", { ascending: false });

    for (const row of assessments ?? []) {
      if (!latestByUser.has(row.user_id)) {
        latestByUser.set(row.user_id, row as AssessmentRow);
      }
    }
  }

  const people = (profiles ?? []) as ProfileRow[];

  return (
    <main className="flex flex-1 flex-col">
      <DashboardHeader />
      <div className="mx-auto w-full max-w-5xl space-y-8 px-4 py-8 sm:px-6">
        <Card>
          <CardHeader>
            <CardTitle>Invite participant</CardTitle>
            <CardDescription>
              Creates an account and a 6-digit code. Share the code with them
              manually — they sign in with email + code.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InviteForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>People</CardTitle>
            <CardDescription>
              {people.length === 0
                ? "No participants yet."
                : `${people.length} invited participant${people.length === 1 ? "" : "s"}.`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {people.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Invite someone above to get started.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                      <th className="py-2 pr-3 font-medium">Name</th>
                      <th className="py-2 pr-3 font-medium">Email</th>
                      <th className="py-2 pr-3 font-medium">Status</th>
                      <th className="py-2 pr-3 font-medium">Dominant</th>
                      <th className="py-2 pr-3 font-medium">Completed</th>
                      <th className="py-2 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {people.map((person) => {
                      const latest = latestByUser.get(person.id);
                      const completed = Boolean(latest);
                      const label =
                        person.full_name?.trim() || person.email || "this participant";
                      return (
                        <tr
                          key={person.id}
                          className="relative border-b border-border/60 transition-colors last:border-0 hover:bg-muted/50"
                        >
                          <td className="py-3 pr-3">
                            <Link
                              href={`/dashboard/${person.id}`}
                              className="font-medium text-[var(--parc-heading)] after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                            >
                              <span className="relative z-10">
                                {person.full_name || "Unnamed"}
                              </span>
                            </Link>
                          </td>
                          <td className="py-3 pr-3 text-muted-foreground">
                            {person.email}
                          </td>
                          <td className="py-3 pr-3">
                            {completed ? "Completed" : "Invited"}
                          </td>
                          <td className="py-3 pr-3">
                            {natureLabel(latest?.dominant_nature ?? null)}
                          </td>
                          <td className="py-3 pr-3">
                            {formatDate(latest?.completed_at)}
                          </td>
                          <td className="relative z-10 py-3">
                            <DeleteParticipantButton
                              userId={person.id}
                              participantLabel={label}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
