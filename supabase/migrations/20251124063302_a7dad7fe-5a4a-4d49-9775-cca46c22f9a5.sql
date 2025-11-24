-- TEMPORARY: Remove admin role requirement for testing
-- WARNING: This makes all admin features accessible to ANY authenticated user!

-- Update RLS policies to allow any authenticated user (not just admin)
DROP POLICY IF EXISTS "Only admins can view admin logs" ON public.admin_logs;
DROP POLICY IF EXISTS "Only admins can insert admin logs" ON public.admin_logs;
DROP POLICY IF EXISTS "Only admins can manage fasilitas" ON public.fasilitas;
DROP POLICY IF EXISTS "Only admins can manage kegiatan" ON public.kegiatan;
DROP POLICY IF EXISTS "Only admins can manage dokumentasi" ON public.dokumentasi;
DROP POLICY IF EXISTS "Only admins can manage pengumuman" ON public.pengumuman;
DROP POLICY IF EXISTS "Only admins can manage profil" ON public.profil;

-- Create new policies allowing ANY authenticated user
CREATE POLICY "Authenticated users can view admin logs"
ON public.admin_logs
FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert admin logs"
ON public.admin_logs
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage fasilitas"
ON public.fasilitas
FOR ALL
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage kegiatan"
ON public.kegiatan
FOR ALL
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage dokumentasi"
ON public.dokumentasi
FOR ALL
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage pengumuman"
ON public.pengumuman
FOR ALL
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage profil"
ON public.profil
FOR ALL
USING (auth.role() = 'authenticated');