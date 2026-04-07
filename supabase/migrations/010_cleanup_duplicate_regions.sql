-- =============================================
-- Deactivate duplicate/orphan regions that came  
-- from 002_seed_regions.sql and conflict with
-- the original seed.sql regions.
--
-- seed.sql has 24 regions WITH pricing.
-- 002 added overlapping regions WITHOUT pricing.
-- This causes: no price shown, no route, confusion.
-- =============================================

-- Deactivate 002 regions that duplicate seed.sql regions
-- (these have no pricing records → "Pricing not found" error)

-- "kundu" overlaps "kundu-lara"
UPDATE regions SET is_active = false WHERE slug = 'kundu';

-- "lara" overlaps "kundu-lara"  
UPDATE regions SET is_active = false WHERE slug = 'lara';

-- "konyaalti" overlaps "sehirici" (Antalya city area)
UPDATE regions SET is_active = false WHERE slug = 'konyaalti';

-- "antalya-city-center" overlaps "sehirici"
UPDATE regions SET is_active = false WHERE slug = 'antalya-city-center';

-- "olympos" has no pricing
UPDATE regions SET is_active = false WHERE slug = 'olympos';

-- "demre" has no pricing
UPDATE regions SET is_active = false WHERE slug = 'demre';

-- "finike" has no pricing
UPDATE regions SET is_active = false WHERE slug = 'finike';

-- "kumluca" has no pricing
UPDATE regions SET is_active = false WHERE slug = 'kumluca';

-- "gazipasa" has no pricing
UPDATE regions SET is_active = false WHERE slug = 'gazipasa';

-- "turkler" from 002 duplicates seed.sql turkler (may have different ID → no pricing)
-- Delete 002 duplicates that share the same slug but have different IDs (no pricing)
DELETE FROM regions 
WHERE slug IN ('turkler', 'okurcalar', 'mahmutlar', 'beldibi', 'goynuk', 'tekirova', 'camyuva', 'adrasan', 'kas', 'belek', 'side', 'kemer', 'alanya', 'avsallar', 'konakli', 'kestel', 'manavgat')
AND id::text NOT LIKE 'b0000000%';

-- Now ensure the seed.sql regions have coordinates
-- (003 may have set coords on the 002 versions, not on seed.sql versions)

UPDATE regions SET latitude = 36.8570, longitude = 30.6480 WHERE slug = 'kundu-lara' AND latitude IS NULL;
UPDATE regions SET latitude = 36.8841, longitude = 30.7036 WHERE slug = 'sehirici' AND latitude IS NULL;
UPDATE regions SET latitude = 36.8600, longitude = 30.8100 WHERE slug = 'kadriye' AND latitude IS NULL;
UPDATE regions SET latitude = 36.8583, longitude = 30.8217 WHERE slug = 'belek' AND latitude IS NULL;
UPDATE regions SET latitude = 36.8300, longitude = 30.8700 WHERE slug = 'bogazkent' AND latitude IS NULL;
UPDATE regions SET latitude = 36.7800, longitude = 31.0200 WHERE slug = 'evrenseki' AND latitude IS NULL;
UPDATE regions SET latitude = 36.7609, longitude = 31.0440 WHERE slug = 'side' AND latitude IS NULL;
UPDATE regions SET latitude = 36.7200, longitude = 31.1500 WHERE slug = 'kizilagac' AND latitude IS NULL;
UPDATE regions SET latitude = 36.6500, longitude = 31.4000 WHERE slug = 'okurcalar' AND latitude IS NULL;
UPDATE regions SET latitude = 36.6000, longitude = 31.6000 WHERE slug = 'turkler' AND latitude IS NULL;
UPDATE regions SET latitude = 36.5444, longitude = 32.0008 WHERE slug = 'alanya' AND latitude IS NULL;
UPDATE regions SET latitude = 36.4671, longitude = 32.1503 WHERE slug = 'mahmutlar' AND latitude IS NULL;
UPDATE regions SET latitude = 36.4500, longitude = 32.1800 WHERE slug = 'kargicak' AND latitude IS NULL;
UPDATE regions SET latitude = 36.6489, longitude = 30.4773 WHERE slug = 'beldibi' AND latitude IS NULL;
UPDATE regions SET latitude = 36.6283, longitude = 30.5172 WHERE slug = 'goynuk' AND latitude IS NULL;
UPDATE regions SET latitude = 36.5965, longitude = 30.5549 WHERE slug = 'kemer' AND latitude IS NULL;
UPDATE regions SET latitude = 36.5800, longitude = 30.5650 WHERE slug = 'kiris' AND latitude IS NULL;
UPDATE regions SET latitude = 36.6222, longitude = 30.5906 WHERE slug = 'camyuva' AND latitude IS NULL;
UPDATE regions SET latitude = 36.5229, longitude = 30.5614 WHERE slug = 'tekirova' AND latitude IS NULL;
UPDATE regions SET latitude = 36.3800, longitude = 30.4700 WHERE slug = 'adrasan' AND latitude IS NULL;
UPDATE regions SET latitude = 36.3074, longitude = 30.5571 WHERE slug = 'kas' AND latitude IS NULL;
UPDATE regions SET latitude = 36.2600, longitude = 29.4200 WHERE slug = 'kalkan' AND latitude IS NULL;
UPDATE regions SET latitude = 36.6218, longitude = 29.1181 WHERE slug = 'fethiye' AND latitude IS NULL;
UPDATE regions SET latitude = 36.8500, longitude = 28.2700 WHERE slug = 'marmaris' AND latitude IS NULL;
