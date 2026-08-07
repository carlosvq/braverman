import Image from "next/image";
import Link from "next/link";
import { SignOutButton } from "@/components/sign-out-button";

const LOGO_WIDTH = 164;
const LOGO_HEIGHT = 39;
const LOGO_FILTER =
  "brightness(0) saturate(100%) invert(13%) sepia(18%) saturate(1048%) hue-rotate(152deg) brightness(95%) contrast(95%)";

export function DashboardHeader({
  title = "Coach dashboard",
}: {
  title?: string;
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--parc-border)] bg-[var(--parc-bg)]">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="shrink-0">
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
          </Link>
          <span className="hidden text-sm text-[var(--parc-heading)] sm:inline">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="text-sm text-muted-foreground transition-colors hover:text-[var(--parc-heading)]"
          >
            Assessment
          </Link>
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}
