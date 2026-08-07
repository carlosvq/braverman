"use server";

import { createClient } from "@/lib/supabase/server";
import type { Answers, AssessmentResults } from "@/lib/scoring";

export type SaveAssessmentResult =
  | { ok: true }
  | { ok: false; error: string };

export async function saveAssessment(input: {
  firstName: string;
  lastName: string;
  answers: Answers;
  results: AssessmentResults;
}): Promise<SaveAssessmentResult> {
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims?.sub) {
    return { ok: false, error: "You must be signed in to save results." };
  }

  const userId = claimsData.claims.sub as string;
  const fullName = `${input.firstName.trim()} ${input.lastName.trim()}`.trim();

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ full_name: fullName })
    .eq("id", userId);

  if (profileError) {
    return { ok: false, error: profileError.message };
  }

  const { error: insertError } = await supabase.from("assessments").insert({
    user_id: userId,
    answers: input.answers,
    results: input.results,
    dominant_nature: input.results.dominantNature,
    most_deficient_nature: input.results.mostDeficientNature,
  });

  if (insertError) {
    return { ok: false, error: insertError.message };
  }

  return { ok: true };
}
