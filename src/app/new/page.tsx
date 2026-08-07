import { LoginForm } from "@/components/login-form";

export default function ParticipantLoginPage() {
  return (
    <main className="flex flex-1 flex-col">
      <LoginForm variant="participant" />
    </main>
  );
}
