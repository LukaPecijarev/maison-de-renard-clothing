import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Container, Typography, Box, Button, IconButton, Skeleton } from '@mui/material';
import { useParams, useNavigate, useLocation, useNavigationType } from 'react-router-dom';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import useProductDetails from '../hooks/useProductDetails';
import useOrder from '../hooks/useOrder';
import useAuth from '../hooks/useAuth';
import useWishlist from '../hooks/useWishlist';
import RecentlyViewed from '../components/RecentlyViewed';
import ProductImageZoom from '../components/ProductImageZoom';
import { fillButtonSx } from '../styles/buttons';
import { getProductImages, FALLBACK_PRODUCT_IMAGE } from '../utils/productImages';
import AppSnackbar from '../components/AppSnackbar';
import {
    hasForwardTransition, takeForwardTransition, flyImage,
    registerHero, updateHeroScroll, releaseHero,
} from '../utils/sharedImageTransition';



// The big product photo: full column width on desktop, but smaller on phones
// (at most 84% of the width / 60% of the screen height) and tablets (460px
// wide) - in the single-column layout a full-width 3:4 photo was too tall.
const HERO_SIZE_SX = {
    width: { xs: 'min(84%, calc(60vh * 0.75))', sm: 'min(100%, 460px)', md: '100%' },
    mx: 'auto',
};

const ProductDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { addToCart } = useOrder();
    const { isInWishlist, toggleWishlist } = useWishlist();
    const { product, loading } = useProductDetails(id);
    const location = useLocation();
    const navigationType = useNavigationType();
    // The clicked ProductCard passes its (list) product along, so the hero image
    // can render on the very first frame - before the details request finishes -
    // giving the shared-element transition something to land on.
    const preview = location.state?.preview && String(location.state.preview.id) === String(id)
        ? location.state.preview
        : null;
    const [selectedImage, setSelectedImage] = useState(() => (preview && location.state?.imageIndex) || 0);
    const [selectedSize, setSelectedSize] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const heroSource = product || preview;
    const heroImages = getProductImages(heroSource);
    const heroSrc = heroImages[selectedImage] || FALLBACK_PRODUCT_IMAGE;

    // Shared-element transition from the grid (see utils/sharedImageTransition):
    // the hero stays hidden while a ghost of the card image flies into its place.
    const heroRef = useRef(null);
    const transitionStartedForRef = useRef(null);
    const [heroHidden, setHeroHidden] = useState(() => hasForwardTransition(id));

    useLayoutEffect(() => {
        if (transitionStartedForRef.current === id) return; // StrictMode re-runs effects
        transitionStartedForRef.current = id;
        // Every new visit to a product starts at the top - whichever link led
        // here (grid, home page rows, wishlist, order history, quick view...).
        // Without this the page kept the previous page's scroll offset and could
        // open near the bottom. Back/Forward (POP) keep the browser's restored
        // position instead.
        if (navigationType !== 'POP') {
            window.scrollTo(0, 0);
        }
        const transition = takeForwardTransition(id);
        if (!transition || !heroRef.current) {
            setHeroHidden(false);
            return;
        }
        // Arriving from a clicked product image: fly it into the hero.
        // setHeroHidden(true) matters when this page stays mounted and only the
        // id changes (clicking a Recently Viewed item from another product).
        setHeroHidden(true);
        flyImage({
            fromRect: transition.rect,
            src: transition.src,
            fit: transition.fit,
            background: transition.background,
            getTargetElement: () => heroRef.current,
            onDone: () => setHeroHidden(false),
        });
    }, [id, navigationType]);

    // Keep the hero's position recorded while this page is open, for the reverse
    // transition when going back to the grid.
    useEffect(() => {
        if (heroHidden || !heroRef.current) return undefined;
        registerHero(id, heroRef.current, heroSrc);
        const onScroll = () => updateHeroScroll(id);
        const onResize = () => heroRef.current && registerHero(id, heroRef.current, heroSrc);
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onResize);
        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onResize);
            releaseHero(id);
        };
    }, [id, heroSrc, heroHidden, loading]);

    // Gallery: which way the last image change went, so the new image slides in
    // from that side (arrows wrap around; thumbnails go left/right by position).
    const [galleryDirection, setGalleryDirection] = useState(0);
    const goToImage = (index, direction) => {
        if (index === selectedImage) return;
        setGalleryDirection(direction ?? Math.sign(index - selectedImage));
        setSelectedImage(index);
    };
    const stepImage = (step) => {
        if (heroImages.length < 2) return;
        goToImage((selectedImage + step + heroImages.length) % heroImages.length, step);
    };

    // Left/right arrow keys cycle the images (not while typing in a field).
    useEffect(() => {
        const onKey = (e) => {
            if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
            if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;
            stepImage(e.key === 'ArrowRight' ? 1 : -1);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    });

    const arrowSx = (side) => ({
        position: 'absolute', top: '50%', [side]: { xs: 10, md: 16 }, zIndex: 2,
        width: { xs: 38, md: 46 }, height: { xs: 38, md: 46 },
        backgroundColor: 'rgba(253, 251, 245, 0.82)',
        backdropFilter: 'blur(6px)',
        border: '1px solid rgba(212, 184, 150, 0.5)',
        color: '#6b5640',
        boxShadow: '0 6px 18px rgba(44, 44, 44, 0.12)',
        opacity: 0,
        transform: `translateY(-50%) translateX(${side === 'left' ? -8 : 8}px)`,
        transition: 'opacity 0.35s ease, transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.25s ease, box-shadow 0.25s ease',
        '& svg': { transition: 'transform 0.25s ease' },
        '&:hover': {
            backgroundColor: '#fdfbf5',
            boxShadow: '0 8px 24px rgba(44, 44, 44, 0.18)',
            transform: 'translateY(-50%) scale(1.08)',
            '& svg': { transform: `translateX(${side === 'left' ? -2 : 2}px)` },
        },
        '&:active': { transform: 'translateY(-50%) scale(0.94)' },
        // Always shown on touch screens (no hover there).
        '@media (hover: none)': { opacity: 1, transform: 'translateY(-50%)' },
    });

    const renderHero = (src, alt) => (
        <Box ref={heroRef} sx={{
            position: 'relative',
            ...HERO_SIZE_SX, aspectRatio: '3/4',
            overflow: 'hidden', mb: 2, backgroundColor: '#faf6ee',
            visibility: heroHidden ? 'hidden' : 'visible',
            // Arrows glide in when the image is hovered.
            '&:hover .gallery-arrow': { opacity: 1, transform: 'translateY(-50%)' },
        }}>
            <ProductImageZoom src={src} alt={alt} direction={galleryDirection} />
            {heroImages.length > 1 && (
                <>
                    <IconButton className="gallery-arrow" aria-label="Previous image" onClick={() => stepImage(-1)} sx={arrowSx('left')}>
                        <ChevronLeftRoundedIcon />
                    </IconButton>
                    <IconButton className="gallery-arrow" aria-label="Next image" onClick={() => stepImage(1)} sx={arrowSx('right')}>
                        <ChevronRightRoundedIcon />
                    </IconButton>
                    <Box sx={{
                        position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)', zIndex: 2,
                        px: 1.4, py: 0.4, borderRadius: '999px',
                        backgroundColor: 'rgba(253, 251, 245, 0.8)', backdropFilter: 'blur(6px)',
                        fontFamily: '"Lato", sans-serif', fontSize: '0.7rem', letterSpacing: '0.12em', color: '#6b5640',
                        pointerEvents: 'none',
                    }}>
                        {selectedImage + 1} / {heroImages.length}
                    </Box>
                </>
            )}
        </Box>
    );

    useEffect(() => {
        if (product) {
            const viewed = JSON.parse(localStorage.getItem('viewedProducts') || '[]');
            const filtered = viewed.filter(p => p.id !== product.id);
            const updated = [
                {
                    id: product.id,
                    name: product.name,
                    imageUrl: product.imageUrl,
                    price: product.price
                },
                ...filtered
            ].slice(0, 10);
            localStorage.setItem('viewedProducts', JSON.stringify(updated));
        }
    }, [product]);

    if (loading) {
        const skeletonSx = { backgroundColor: 'rgba(212, 184, 150, 0.15)' };
        return (
            <Box sx={{ backgroundColor: '#f5f1e8', minHeight: '100vh', py: 6 }}>
                <Container maxWidth="lg">
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 6 }}>
                        {preview
                            ? <Box>{renderHero(heroSrc, preview.name)}</Box>
                            : <Skeleton variant="rectangular" sx={{ ...HERO_SIZE_SX, aspectRatio: '3/4', ...skeletonSx }} />}
                        <Box>
                            <Skeleton variant="text" width="30%" sx={{ mb: 2, ...skeletonSx }} />
                            <Skeleton variant="text" width="65%" height={56} sx={{ mb: 3, ...skeletonSx }} />
                            <Skeleton variant="text" width="20%" height={40} sx={{ mb: 4, ...skeletonSx }} />
                            <Skeleton variant="text" width="100%" sx={skeletonSx} />
                            <Skeleton variant="text" width="100%" sx={skeletonSx} />
                            <Skeleton variant="text" width="80%" sx={{ mb: 4, ...skeletonSx }} />
                            <Skeleton variant="rectangular" height={56} sx={skeletonSx} />
                        </Box>
                    </Box>
                </Container>
            </Box>
        );
    }

    if (!product) {
        return (
            <Box sx={{ backgroundColor: '#f5f1e8', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="h5" sx={{ color: '#666' }}>Product not found</Typography>
            </Box>
        );
    }

    const images = heroImages;

    const availableSizes = product.size
        ? product.size.split(',').map(s => s.trim().toUpperCase())
        : [];

    const isFootwear = ['sneaker', 'loafer', 'boot', 'shoe', 'slipper']
        .some(keyword => product.name.toLowerCase().includes(keyword));

    const shoesSizes = ['38', '39', '40', '41', '42', '43', '44', '45', '46', '47'];
    const clothingSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const allSizes = isFootwear ? shoesSizes : clothingSizes;

    const discount = product.discountPercentage || 0;
    const discountedPrice = discount > 0 ? product.price * (1 - discount / 100) : product.price;

    const handleAddToCart = async () => {
        if (!isAuthenticated()) {
            setSnackbar({ open: true, message: 'Please login to add items to cart', severity: 'warning' });
            setTimeout(() => navigate('/login'), 1500);
            return;
        }

        const success = await addToCart(product.id);
        if (success) {
            setSnackbar({ open: true, message: `${product.name} added to cart!`, severity: 'success' });
        } else {
            setSnackbar({ open: true, message: 'Failed to add item to cart', severity: 'error' });
        }
    };

    const details = [
        { label: 'Material', value: product.material || 'N/A' },
        { label: 'Color', value: product.color || 'N/A' },
        { label: 'Season', value: product.season || 'N/A' },
        { label: 'Gender', value: product.gender || 'N/A' },
        { label: 'Style', value: product.style || 'N/A' },
        { label: 'Origin', value: 'Made in Italy' },
    ];

    return (
        <Box sx={{ backgroundColor: '#f5f1e8', minHeight: '100vh', py: 6 }}>
            <Container maxWidth="lg">
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 6 }}>

                    {/* Images Section */}
                    <Box>
                        {renderHero(heroSrc, product.name)}

                        {images.length > 1 && (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                                {images.map((image, index) => (
                                    <Box
                                        key={index}
                                        onClick={() => goToImage(index)}
                                        sx={{
                                            width: 80, height: 100, cursor: 'pointer',
                                            border: selectedImage === index ? '2px solid #d4b896' : '2px solid transparent',
                                            opacity: selectedImage === index ? 1 : 0.65,
                                            transition: 'border 0.3s ease, opacity 0.3s ease, transform 0.3s ease', overflow: 'hidden',
                                            '&:hover': { border: '2px solid #d4b896', opacity: 1, transform: 'translateY(-2px)' },
                                        }}
                                    >
                                        <Box component="img" src={image} alt={`${product.name} ${index + 1}`}
                                             sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </Box>

                    {/* Product Info Section */}
                    <Box>
                        {/* Category */}
                        <Typography sx={{
                            fontFamily: '"Lato", sans-serif', fontSize: '0.85rem',
                            letterSpacing: '0.15em', color: '#8b7355', mb: 2, textTransform: 'uppercase',
                        }}>
                            {product.categoryName || 'Luxury Fashion'}
                        </Typography>

                        {/* Product Name */}
                        <Typography variant="h3" sx={{
                            fontFamily: '"Cormorant Garamond", serif', fontWeight: 300,
                            letterSpacing: '0.05em', mb: 3, color: '#2c2c2c',
                        }}>
                            {product.name}
                        </Typography>

                        {/* Price */}
                        <Box sx={{ mb: 4 }}>
                            {discount > 0 && (
                                <Typography sx={{
                                    fontFamily: '"Cormorant Garamond", serif',
                                    fontWeight: 400, fontSize: '1.3rem',
                                    color: '#999', textDecoration: 'line-through',
                                }}>
                                    €{product.price.toFixed(0)}
                                </Typography>
                            )}
                            <Typography variant="h4" sx={{
                                fontFamily: '"Cormorant Garamond", serif',
                                fontWeight: 400,
                                color: discount > 0 ? '#d32f2f' : '#2c2c2c',
                            }}>
                                €{discountedPrice.toFixed(0)}
                            </Typography>
                        </Box>

                        {/* Description */}
                        <Typography sx={{
                            fontFamily: '"Lato", sans-serif', fontSize: '0.95rem',
                            lineHeight: 1.8, color: '#666', mb: 4,
                        }}>
                            {product.description}
                        </Typography>

                        {/* Add to Cart Button + Wishlist Toggle */}
                        <Box sx={{ display: 'flex', gap: 1.5, mb: 3 }}>
                            <Button
                                variant="outlined" size="large" fullWidth
                                startIcon={<ShoppingBagOutlinedIcon />}
                                onClick={handleAddToCart}
                                disabled={availableSizes.length > 0 && !selectedSize}
                                sx={{
                                    ...fillButtonSx,
                                    py: 1.8, fontSize: '0.9rem', fontWeight: 400,
                                    letterSpacing: '0.12em', fontFamily: '"Lato", sans-serif',
                                }}
                            >
                                {availableSizes.length > 0 && !selectedSize ? 'SELECT A SIZE' : 'ADD TO CART'}
                            </Button>
                            <IconButton
                                onClick={() => toggleWishlist(product)}
                                sx={{
                                    border: '1px solid rgba(44, 44, 44, 0.2)',
                                    borderRadius: '4px',
                                    width: 56, height: 56, flexShrink: 0,
                                    '&:hover': { backgroundColor: 'rgba(211, 47, 47, 0.06)' },
                                }}
                            >
                                {isInWishlist(product.id)
                                    ? <FavoriteIcon sx={{ color: '#d32f2f' }} />
                                    : <FavoriteBorderIcon sx={{ color: '#2c2c2c' }} />}
                            </IconButton>
                        </Box>

                        {/* Size Selector - hidden entirely for one-size items (no
                            product.size on record) rather than showing every
                            option crossed out, which read as "nothing in stock" */}
                        {availableSizes.length > 0 && (
                        <Box sx={{ borderTop: '1px solid rgba(212, 184, 150, 0.3)', pt: 3, mb: 3 }}>
                            <Typography sx={{
                                fontFamily: '"Lato", sans-serif', fontSize: '0.85rem',
                                letterSpacing: '0.05em', color: '#8b7355', mb: 2, textTransform: 'uppercase',
                            }}>
                                Select Size
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                {allSizes.map((size) => {
                                    const isAvailable = availableSizes.includes(size);
                                    const isSelected = selectedSize === size;

                                    return (
                                        <Box
                                            key={size}
                                            onClick={() => isAvailable && setSelectedSize(isSelected ? null : size)}
                                            sx={{
                                                width: isFootwear ? 52 : 48,
                                                height: 48,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                border: isSelected
                                                    ? '2px solid #2c2c2c'
                                                    : isAvailable
                                                        ? '1px solid rgba(212, 184, 150, 0.5)'
                                                        : '1px solid rgba(212, 184, 150, 0.2)',
                                                cursor: isAvailable ? 'pointer' : 'not-allowed',
                                                fontFamily: '"Lato", sans-serif',
                                                fontSize: '0.75rem', letterSpacing: '0.05em',
                                                color: isSelected
                                                    ? '#2c2c2c'
                                                    : isAvailable
                                                        ? '#666'
                                                        : 'rgba(180, 180, 180, 0.5)',
                                                backgroundColor: isSelected
                                                    ? 'rgba(44, 44, 44, 0.05)'
                                                    : 'transparent',
                                                transition: 'all 0.25s ease',
                                                position: 'relative',
                                                overflow: 'hidden',
                                                '&::after': !isAvailable ? {
                                                    content: '""',
                                                    position: 'absolute',
                                                    top: '50%', left: '10%',
                                                    width: '80%', height: '1px',
                                                    backgroundColor: 'rgba(180, 180, 180, 0.4)',
                                                    transform: 'rotate(-45deg)',
                                                } : {},
                                                '&:hover': isAvailable ? {
                                                    borderColor: '#2c2c2c',
                                                    color: '#2c2c2c',
                                                } : {},
                                            }}
                                        >
                                            {size}
                                        </Box>
                                    );
                                })}
                            </Box>

                            <Box sx={{
                                overflow: 'hidden',
                                maxHeight: selectedSize ? '60px' : '0px',
                                opacity: selectedSize ? 1 : 0,
                                transition: 'max-height 0.4s ease, opacity 0.3s ease',
                                mt: selectedSize ? 2 : 0,
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box sx={{
                                        width: 8, height: 8, borderRadius: '50%',
                                        backgroundColor: '#2e7d32',
                                    }} />
                                    <Typography sx={{
                                        fontFamily: '"Lato", sans-serif', fontSize: '0.85rem',
                                        color: '#2e7d32',
                                    }}>
                                        Size {selectedSize} — Available
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                        )}

                        {/* Product Details */}
                        <Box sx={{ borderTop: '1px solid rgba(212, 184, 150, 0.3)', pt: 3 }}>
                            <Typography sx={{
                                fontFamily: '"Lato", sans-serif', fontSize: '0.85rem',
                                letterSpacing: '0.05em', color: '#8b7355', mb: 2, textTransform: 'uppercase',
                            }}>
                                Product Details
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                {details.map((detail) => (
                                    <Box key={detail.label} sx={{
                                        display: 'flex', justifyContent: 'space-between',
                                        borderBottom: '1px solid rgba(212, 184, 150, 0.15)', pb: 1,
                                    }}>
                                        <Typography sx={{
                                            fontFamily: '"Lato", sans-serif', fontSize: '0.9rem', color: '#666',
                                        }}>
                                            {detail.label}:
                                        </Typography>
                                        <Typography sx={{
                                            fontFamily: '"Lato", sans-serif', fontSize: '0.9rem',
                                            color: detail.color || '#2c2c2c', fontWeight: 500,
                                        }}>
                                            {detail.value}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Container>

            <Container maxWidth="lg" sx={{ mt: 8 }}>
                <RecentlyViewed excludeId={product.id} />
            </Container>

            <AppSnackbar snackbar={snackbar} onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))} />
        </Box>
    );
};

export default ProductDetailsPage;