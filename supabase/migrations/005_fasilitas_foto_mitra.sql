-- Add fasilitas_foto and mitra columns to kos_profile
ALTER TABLE kos_profile
ADD COLUMN IF NOT EXISTS fasilitas_foto JSON DEFAULT '[]'::json,
ADD COLUMN IF NOT EXISTS mitra JSON DEFAULT '["Traveloka","tiket.com","Airbnb","Tripadvisor"]'::json;
