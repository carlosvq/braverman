import { AssessmentForm } from "@/components/assessment-form";
import { getCurrentProfile, requireUser } from "@/lib/auth";

function splitFullName(fullName: string): {
  firstName: string;
  lastName: string;
} {
  const trimmed = fullName.trim();
  if (!trimmed) return { firstName: "", lastName: "" };
  const parts = trimmed.split(/\s+/);
  return {
    firstName: parts[0] ?? "",
    lastName: parts.slice(1).join(" "),
  };
}

export default async function Home() {
  const session = await requireUser();
  const profile = await getCurrentProfile();
  const { firstName, lastName } = splitFullName(profile?.full_name ?? "");

  return (
    <main className="flex flex-1 flex-col">
      <AssessmentForm
        initialFirstName={firstName}
        initialLastName={lastName}
        initialEmail={profile?.email || session.email}
        isCoach={session.role === "coach"}
      />
    </main>
  );
}
