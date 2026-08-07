-- Coaches may delete assessment submissions from the dashboard.
grant delete on public.assessments to authenticated;

create policy "Coaches can delete assessments"
  on public.assessments for delete to authenticated
  using (public.is_coach());
