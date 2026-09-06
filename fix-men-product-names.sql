-- Fixes the Men category product-name/description/attribute mismatches.
--
-- Root cause: a prior pass rewrote each product's text fields (name,
-- description, color, season, material, gender, style, size) with fresh
-- copy, but applied the new text bundles to the wrong rows relative to
-- their id/price/quantity/image_url (which were never touched and still
-- anchor each row to its true, originally-seeded product). This swaps the
-- text bundles back onto the rows whose image actually depicts them.
--
-- ids 5 and 9 have no surviving "new style" text bundle anywhere in the
-- table (their original identities - Navy Storm System(R) Coat and Storm
-- Blue Windmate Gilet - never got one), so they're restored from the
-- original DataInitializer seed copy instead.
--
-- id 2 (Olive Cotton Five-Pocket Trousers) was already correct and is left
-- untouched.

BEGIN;

-- id1: was labeled "Navy Denim Boat Shoes" but image is the leather bomber jacket
UPDATE products SET
    name = 'Dark Brown Leather Bomber Jacket',
    description = 'An impeccably crafted bomber jacket in rich dark brown leather, featuring a ribbed knit collar, cuffs and hem with silver snap button closure for timeless masculine refinement',
    color = 'Dark Brown', season = 'SPRING', material = 'Leather', gender = 'MEN', style = 'CASUAL', size = 'XS,M,L'
WHERE id = 1;

-- id4: was labeled "Dark Khaki Pleated Wool Trousers" but image is the denim bermuda shorts
UPDATE products SET
    name = 'Light Blue Denim Bermuda Shorts',
    description = 'Refined pleated bermuda shorts in light blue denim with a relaxed yet tailored silhouette for effortless summer elegance.',
    color = 'Light Blue', season = 'SUMMER', material = 'Denim', gender = 'MEN', style = 'SPORT', size = 'S,M,L,XL,XXL'
WHERE id = 4;

-- id5: was labeled "Brown Suede Sneakers" but image is the Storm System coat; no
-- surviving new-style text bundle exists for this identity, restored from seed
UPDATE products SET
    name = 'Navy Storm System® Coat',
    description = 'Sophisticated protection in a navy Storm System® coat with concealed button closure.',
    color = 'Navy', season = 'WINTER', material = 'Technical Fabric', gender = 'MEN', style = 'SPORT', size = 'XS,S,M,L,XL,XXL'
WHERE id = 5;

-- id6: was labeled "Sand Belted Linen Trench Coat" but image is the pink t-shirt
UPDATE products SET
    name = 'Blush Pink Cotton T-Shirt',
    description = 'A refined crew-neck t-shirt in blush pink cotton, crafted for understated everyday elegance with a clean minimal silhouette.',
    color = 'Pink', season = 'SUMMER', material = 'Cotton', gender = 'MEN', style = 'SPORT', size = 'XL,S,M,L'
WHERE id = 6;

-- id7: was labeled "Light Blue Denim Bermuda Shorts" but image is the denim field jacket
UPDATE products SET
    name = 'Navy Denim Field Jacket',
    description = 'A structured field jacket in deep navy denim with patch pockets and refined button closure for a contemporary yet timeless masculine silhouette.',
    color = 'Navy', season = 'ALL_SEASON', material = 'Denim', gender = 'MEN', style = 'CASUAL', size = 'L,XL'
WHERE id = 7;

-- id8: was labeled "Dark Brown Leather Bomber Jacket" but image is the pleated wool trousers
UPDATE products SET
    name = 'Dark Khaki Pleated Wool Trousers',
    description = 'Impeccably tailored pleated trousers in dark khaki wool with turn-up cuffs and a relaxed yet refined silhouette for effortless everyday sophistication.',
    color = 'Dark Khaki', season = 'SPRING', material = 'Wool', gender = 'MEN', style = 'FORMAL', size = 'M,L,XL'
WHERE id = 8;

-- id9: was labeled "Navy Denim Field Jacket" but image is the Windmate gilet; no
-- surviving new-style text bundle exists for this identity, restored from seed
UPDATE products SET
    name = 'Storm Blue Windmate Gilet',
    description = 'Technical precision meets understated luxury in this storm blue windmate gilet.',
    color = 'Storm Blue', season = 'WINTER', material = 'Technical Fabric', gender = 'MEN', style = 'SPORT', size = 'XS,S,M,L,XL,XXL'
WHERE id = 9;

-- id11: was labeled "Blush Pink Cotton T-Shirt" but image is the boat shoes
-- (this image is a duplicate of the original seed's boat-shoe photo, a
-- pre-existing bug where "Beige Double-Breasted Linen Blazer" was seeded
-- with the boat shoes' image; that blazer identity has no real photo left)
UPDATE products SET
    name = 'Navy Denim Boat Shoes',
    description = 'Classic Italian boat shoes in navy denim and suede, featuring leather lacing and a clean white rubber sole for effortless coastal elegance.',
    color = 'Navy', season = 'ALL_SEASON', material = 'Denim', gender = 'MEN', style = 'CASUAL', size = '41,43,44,45,47'
WHERE id = 11;

-- id12: was labeled "Beige Double-Breasted Linen Blazer" but image is the suede sneakers
UPDATE products SET
    name = 'Brown Suede Sneakers',
    description = 'Effortlessly refined sneakers in rich brown suede with a sock-knit collar and clean ivory rubber sole for understated everyday luxury.',
    color = 'Brown', season = 'SPRING', material = 'Suede', gender = 'MEN', style = 'SPORT', size = '42,44,45,46'
WHERE id = 12;

-- id98: named/described as a plain white shirt, but its photographed piece
-- (ManShirt*.jpg) is a light blue pinstripe shirt
UPDATE products SET
    name = 'Blue Striped Cotton Shirt',
    description = 'A crisp blue-striped cotton shirt with a clean point collar, tailored to sit smoothly under a cardigan or coat.',
    color = 'Light Blue'
WHERE id = 98;

-- id100: named "Wool Flat Cap" but its photographed piece (ManHat*.jpg) is a
-- rolled-brim wool beanie, not a flat cap
UPDATE products SET
    name = 'Navy Wool Beanie',
    description = 'A snug ribbed wool beanie with a rolled brim that finishes the look with a quiet, understated touch.'
WHERE id = 100;

COMMIT;
