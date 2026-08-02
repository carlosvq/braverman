# Nature Assessment

Online Nature Assessment for PARC patients. Patients complete ~315 true/false questions, see their results on screen, and share a copy with the practitioner via their email client (mailto).

## Stack

- Next.js (App Router) + TypeScript
- shadcn/ui + Tailwind CSS

## Setup

```bash
pnpm install
cp .env.example .env.local
```

Edit `.env.local`:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_RESULTS_EMAIL` | Practitioner recipient (default `sahra@parc.do`) |

## Develop

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scoring

- **Part 1 (1A–4A):** TRUE counts → dominant nature (highest score)
- **Part 2 (1B–4B):** TRUE counts → deficiency severity: Minor (0–5), Moderate (6–15), Major (15+)

Not a medical diagnosis.
