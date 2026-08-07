import { LoginForm } from "@/components/login-form";

export default function CoachLoginPage() {
  return (
    <main className="flex flex-1 flex-col">
      <LoginForm variant="coach" />
    </main>
  );
}
