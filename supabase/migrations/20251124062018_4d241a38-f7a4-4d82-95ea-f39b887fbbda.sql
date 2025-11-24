-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles table
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Only admins can manage user roles"
ON public.user_roles
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Update admin_logs RLS policy to only allow admins
DROP POLICY IF EXISTS "Authenticated users can view admin logs" ON public.admin_logs;

CREATE POLICY "Only admins can view admin logs"
ON public.admin_logs
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can insert admin logs"
ON public.admin_logs
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Add RLS policies for other admin tables
DROP POLICY IF EXISTS "Authenticated users can manage fasilitas" ON public.fasilitas;
DROP POLICY IF EXISTS "Authenticated users can manage kegiatan" ON public.kegiatan;
DROP POLICY IF EXISTS "Authenticated users can manage dokumentasi" ON public.dokumentasi;
DROP POLICY IF EXISTS "Authenticated users can manage pengumuman" ON public.pengumuman;
DROP POLICY IF EXISTS "Authenticated users can manage profil" ON public.profil;

CREATE POLICY "Only admins can manage fasilitas"
ON public.fasilitas
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can manage kegiatan"
ON public.kegiatan
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can manage dokumentasi"
ON public.dokumentasi
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can manage pengumuman"
ON public.pengumuman
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can manage profil"
ON public.profil
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));