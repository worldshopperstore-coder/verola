-- =============================================
-- Fix remaining blog post image_url values
-- Maps to actual files in public/images/blog/
-- =============================================

-- Belek golf & hotel transfer post
UPDATE blog_posts
SET image_url = '/images/blog/belek-golf.avif'
WHERE slug = 'belek-golf-otelleri-transfer';

-- Side antik kent transfer post
UPDATE blog_posts
SET image_url = '/images/blog/side-temple.avif'
WHERE slug = 'side-antik-kent-transfer';

-- Uber Antalya alternative transport post
UPDATE blog_posts
SET image_url = '/images/blog/uber-taxi.avif'
WHERE slug = 'uber-antalya-havalimanı-ulasim';

-- Kemer VIP transfer post
UPDATE blog_posts
SET image_url = '/images/blog/kemer-vip.avif'
WHERE slug = 'antalya-havalimani-kemer-vip-transfer';

-- Havaş vs VIP transfer comparison post
UPDATE blog_posts
SET image_url = '/images/blog/havas-shuttle.avif'
WHERE slug = 'antalya-havas-mi-vip-transfer-mi';
