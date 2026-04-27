
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" ON public.user_roles
FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles" ON public.user_roles
FOR ALL USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Verification status enum
CREATE TYPE public.verification_status AS ENUM ('verified', 'pending', 'source_required');

-- Elections
CREATE TABLE public.elections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  region TEXT NOT NULL,
  election_type TEXT NOT NULL,
  voting_start_date DATE,
  voting_end_date DATE,
  nomination_deadline DATE,
  result_date DATE,
  phases INTEGER DEFAULT 1,
  official_link TEXT,
  source_url TEXT,
  description TEXT,
  status public.verification_status NOT NULL DEFAULT 'pending',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.elections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read elections" ON public.elections FOR SELECT USING (true);
CREATE POLICY "Admins/editors can insert elections" ON public.elections
FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));
CREATE POLICY "Admins/editors can update elections" ON public.elections
FOR UPDATE USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));
CREATE POLICY "Admins can delete elections" ON public.elections
FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER elections_set_updated_at
BEFORE UPDATE ON public.elections
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Parties
CREATE TABLE public.parties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  abbreviation TEXT,
  region TEXT NOT NULL,
  symbol_url TEXT,
  leader TEXT,
  founded_year INTEGER,
  ideology TEXT,
  manifesto_link TEXT,
  official_site TEXT,
  source_url TEXT,
  description TEXT,
  status public.verification_status NOT NULL DEFAULT 'pending',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.parties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read parties" ON public.parties FOR SELECT USING (true);
CREATE POLICY "Admins/editors can insert parties" ON public.parties
FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));
CREATE POLICY "Admins/editors can update parties" ON public.parties
FOR UPDATE USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));
CREATE POLICY "Admins can delete parties" ON public.parties
FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER parties_set_updated_at
BEFORE UPDATE ON public.parties
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Candidates
CREATE TABLE public.candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  party_id UUID REFERENCES public.parties(id) ON DELETE SET NULL,
  election_id UUID REFERENCES public.elections(id) ON DELETE SET NULL,
  region TEXT NOT NULL,
  constituency TEXT,
  age INTEGER,
  education TEXT,
  profession TEXT,
  affidavit_link TEXT,
  photo_url TEXT,
  bio TEXT,
  source_url TEXT,
  status public.verification_status NOT NULL DEFAULT 'pending',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read candidates" ON public.candidates FOR SELECT USING (true);
CREATE POLICY "Admins/editors can insert candidates" ON public.candidates
FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));
CREATE POLICY "Admins/editors can update candidates" ON public.candidates
FOR UPDATE USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));
CREATE POLICY "Admins can delete candidates" ON public.candidates
FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER candidates_set_updated_at
BEFORE UPDATE ON public.candidates
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_elections_region ON public.elections(region);
CREATE INDEX idx_parties_region ON public.parties(region);
CREATE INDEX idx_candidates_region ON public.candidates(region);
CREATE INDEX idx_candidates_party ON public.candidates(party_id);
CREATE INDEX idx_candidates_election ON public.candidates(election_id);
