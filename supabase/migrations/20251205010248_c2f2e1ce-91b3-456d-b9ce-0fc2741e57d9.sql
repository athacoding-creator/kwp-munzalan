-- Create programs table for the 8 main programs displayed on homepage
CREATE TABLE public.programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nama text NOT NULL,
  subtitle text NOT NULL,
  deskripsi text,
  icon_name text NOT NULL DEFAULT 'Heart',
  urutan integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;

-- Programs are viewable by everyone
CREATE POLICY "Programs viewable by everyone"
ON public.programs
FOR SELECT
USING (true);

-- Authenticated users (admin) can manage programs
CREATE POLICY "Authenticated users can manage programs"
ON public.programs
FOR ALL
USING (auth.role() = 'authenticated');

-- Create trigger for updated_at
CREATE TRIGGER update_programs_updated_at
BEFORE UPDATE ON public.programs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default programs
INSERT INTO public.programs (nama, subtitle, deskripsi, icon_name, urutan) VALUES
('MMP', 'Mustahiq Mengaji Peduli', 'Program pemberdayaan bagi mustahiq untuk belajar mengaji dengan pendampingan penuh.', 'Heart', 1),
('Tahsin Warga', 'Perbaikan Bacaan Al-Quran', 'Kelas perbaikan bacaan Al-Quran untuk warga sekitar dengan metode yang mudah dipahami.', 'BookOpen', 2),
('Kelas Iqro'' Warga', 'Belajar Iqro'' untuk Warga', 'Program pembelajaran Iqro'' dari dasar untuk warga yang ingin belajar membaca Al-Quran.', 'BookOpen', 3),
('Kelas Quran Warga', 'Pengajian Al-Quran Rutin', 'Pengajian rutin Al-Quran dengan tadarus dan kajian tafsir untuk masyarakat.', 'BookOpen', 4),
('Kelas TPA Anak', 'Pendidikan Agama Anak-anak', 'Taman Pendidikan Al-Quran untuk anak-anak dengan kurikulum yang menyenangkan.', 'Users', 5),
('MUFASA', 'Munzalan After Isya', 'Kajian rutin setelah Isya dengan berbagai tema keislaman yang inspiratif.', 'Moon', 6),
('Bekam Masal', 'Kesehatan Gratis untuk Warga', 'Layanan bekam gratis untuk kesehatan warga sekitar dengan tenaga profesional.', 'Heart', 7),
('PASKAS', 'Pasukan Amal Sholeh', 'Program pembentukan dan pemberdayaan santri sebagai jembatan amal sholeh.', 'Users', 8);