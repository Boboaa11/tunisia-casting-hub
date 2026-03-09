
-- Fix: Replace overly permissive INSERT policy with role-scoped one
DROP POLICY "Anyone can submit a producer request" ON public.producer_requests;

CREATE POLICY "Anon and authenticated can submit producer requests"
  ON public.producer_requests FOR INSERT TO anon, authenticated
  WITH CHECK (
    status = 'pending'
  );
