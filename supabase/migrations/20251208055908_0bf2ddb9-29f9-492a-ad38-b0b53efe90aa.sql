-- Add gambar_url column to pengumuman table for article images
ALTER TABLE public.pengumuman 
ADD COLUMN gambar_url text;