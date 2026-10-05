// A product's imageUrl holds one or more comma-separated URLs (the first is the
// main image, the second the hover image).

export const FALLBACK_PRODUCT_IMAGE = 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600';

export const getProductImages = (product) =>
    product?.imageUrl ? product.imageUrl.split(',').map((url) => url.trim()).filter(Boolean) : [];

export const getMainImage = (product) => getProductImages(product)[0] || FALLBACK_PRODUCT_IMAGE;
