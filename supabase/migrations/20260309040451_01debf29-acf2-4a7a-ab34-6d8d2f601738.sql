
-- Create timestamp update function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- ==========================================
-- CASTINGS TABLE
-- ==========================================
CREATE TABLE public.castings (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  production TEXT NOT NULL,
  type TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  deadline DATE NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT[] DEFAULT '{}',
  compensation TEXT NOT NULL,
  status TEXT DEFAULT 'Actif',
  applications_count INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  synopsis TEXT,
  shooting_locations TEXT[] DEFAULT '{}',
  production_dates TEXT,
  compensation_details TEXT,
  additional_requirements TEXT[] DEFAULT '{}',
  contact_email TEXT,
  is_paid BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.castings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Castings are publicly readable"
  ON public.castings FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create castings"
  ON public.castings FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Creators can update their castings"
  ON public.castings FOR UPDATE TO authenticated
  USING (auth.uid() = created_by);

CREATE POLICY "Creators can delete their castings"
  ON public.castings FOR DELETE TO authenticated
  USING (auth.uid() = created_by);

CREATE TRIGGER update_castings_updated_at
  BEFORE UPDATE ON public.castings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==========================================
-- CASTING ROLES TABLE
-- ==========================================
CREATE TABLE public.casting_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  casting_id INTEGER NOT NULL REFERENCES public.castings(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  age_range TEXT,
  gender TEXT,
  ethnicity TEXT,
  appearance TEXT,
  skills TEXT[] DEFAULT '{}',
  languages TEXT[] DEFAULT '{}',
  special_talents TEXT[] DEFAULT '{}',
  experience_level TEXT,
  talents_needed INTEGER DEFAULT 1,
  shooting_dates TEXT,
  role_location TEXT,
  role_compensation TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.casting_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Casting roles are publicly readable"
  ON public.casting_roles FOR SELECT USING (true);

CREATE POLICY "Casting creators can insert roles"
  ON public.casting_roles FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.castings WHERE id = casting_id AND created_by = auth.uid())
  );

CREATE POLICY "Casting creators can update roles"
  ON public.casting_roles FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.castings WHERE id = casting_id AND created_by = auth.uid())
  );

CREATE POLICY "Casting creators can delete roles"
  ON public.casting_roles FOR DELETE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.castings WHERE id = casting_id AND created_by = auth.uid())
  );

-- ==========================================
-- APPLICATIONS TABLE
-- ==========================================
CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  casting_id INTEGER NOT NULL REFERENCES public.castings(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES public.casting_roles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  applicant_name TEXT NOT NULL,
  applicant_email TEXT NOT NULL,
  cover_message TEXT NOT NULL,
  experience TEXT,
  availability TEXT,
  photo_files TEXT[] DEFAULT '{}',
  video_showreel TEXT,
  portfolio_file TEXT,
  status TEXT DEFAULT 'new',
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own applications"
  ON public.applications FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Casting creators can view applications"
  ON public.applications FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.castings WHERE id = casting_id AND created_by = auth.uid())
  );

CREATE POLICY "Users can submit applications"
  ON public.applications FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Casting creators can update applications"
  ON public.applications FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.castings WHERE id = casting_id AND created_by = auth.uid())
  );

CREATE INDEX idx_applications_casting_id ON public.applications(casting_id);
CREATE INDEX idx_applications_user_id ON public.applications(user_id);
CREATE INDEX idx_casting_roles_casting_id ON public.casting_roles(casting_id);
CREATE INDEX idx_castings_category ON public.castings(category);
