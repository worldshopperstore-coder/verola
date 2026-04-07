-- =============================================
-- Fix blog post image_url to match actual files
-- in public/images/blog/
-- =============================================

-- Map existing file: winter-antalya.jpg → winter-antalya-transfer
UPDATE blog_posts
SET image_url = '/images/blog/winter-antalya.jpg'
WHERE slug = 'kis-antalya-tatil-transfer';

-- Map existing file: family-airport.avif → family-transfer-tips
UPDATE blog_posts
SET image_url = '/images/blog/family-airport.avif'
WHERE slug = 'aile-cocuk-havalimani-transfer';

-- Map antalya-airport.jpg for the airport guide post
UPDATE blog_posts
SET image_url = '/images/antalya-airport.jpg'
WHERE slug = 'antalya-havalimani-transfer-rehberi';

-- Map horizontal-hd.avif for VIP vs shuttle comparison
UPDATE blog_posts
SET image_url = '/images/blog/horizontal-hd.avif'
WHERE slug = 'vip-transfer-mi-shuttle-mi';
