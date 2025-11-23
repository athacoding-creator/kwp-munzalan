-- Create profiles table for admin users (extends Supabase auth)
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by authenticated users"
  ON public.profiles FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create profil (institution profile content) table
CREATE TABLE public.profil (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  judul TEXT NOT NULL,
  konten TEXT NOT NULL,
  foto_profil_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profil ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profil is viewable by everyone"
  ON public.profil FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage profil"
  ON public.profil FOR ALL
  USING (auth.role() = 'authenticated');

-- Create fasilitas (facilities) table
CREATE TABLE public.fasilitas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nama TEXT NOT NULL,
  deskripsi TEXT NOT NULL,
  foto_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.fasilitas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Fasilitas is viewable by everyone"
  ON public.fasilitas FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage fasilitas"
  ON public.fasilitas FOR ALL
  USING (auth.role() = 'authenticated');

-- Create kegiatan (activities) table
CREATE TABLE public.kegiatan (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nama_kegiatan TEXT NOT NULL,
  deskripsi TEXT NOT NULL,
  tanggal DATE NOT NULL,
  lokasi TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.kegiatan ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kegiatan is viewable by everyone"
  ON public.kegiatan FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage kegiatan"
  ON public.kegiatan FOR ALL
  USING (auth.role() = 'authenticated');

-- Create dokumentasi (documentation/media) table
CREATE TABLE public.dokumentasi (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  kegiatan_id UUID REFERENCES public.kegiatan(id) ON DELETE CASCADE,
  jenis_media TEXT NOT NULL CHECK (jenis_media IN ('foto', 'video')),
  media_url TEXT NOT NULL,
  deskripsi TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.dokumentasi ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Dokumentasi is viewable by everyone"
  ON public.dokumentasi FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage dokumentasi"
  ON public.dokumentasi FOR ALL
  USING (auth.role() = 'authenticated');

-- Create pengumuman (announcements) table
CREATE TABLE public.pengumuman (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  judul TEXT NOT NULL,
  isi TEXT NOT NULL,
  tanggal DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.pengumuman ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Pengumuman is viewable by everyone"
  ON public.pengumuman FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage pengumuman"
  ON public.pengumuman FOR ALL
  USING (auth.role() = 'authenticated');

-- Create storage bucket for media uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true);

-- Storage policies for media bucket
CREATE POLICY "Media is viewable by everyone"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'media');

CREATE POLICY "Authenticated users can upload media"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update media"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'media' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete media"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'media' AND auth.role() = 'authenticated');

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers to tables
CREATE TRIGGER update_profil_updated_at
  BEFORE UPDATE ON public.profil
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_fasilitas_updated_at
  BEFORE UPDATE ON public.fasilitas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_kegiatan_updated_at
  BEFORE UPDATE ON public.kegiatan
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pengumuman_updated_at
  BEFORE UPDATE ON public.pengumuman
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();