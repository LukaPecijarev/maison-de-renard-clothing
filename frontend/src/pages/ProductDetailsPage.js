import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, IconButton, Skeleton, Snackbar, Alert } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import useProductDetails from '../hooks/useProductDetails';
import useOrder from '../hooks/useOrder';
import useAuth from '../hooks/useAuth';
import useWishlist from '../hooks/useWishlist';
import RecentlyViewed from '../components/RecentlyViewed';
import ProductImageZoom from '../components/ProductImageZoom';


const ProductDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { addToCart } = useOrder();
    const { isInWishlist, toggleWishlist } = useWishlist();
    const { product, loading } = useProductDetails(id);
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

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
                        <Skeleton variant="rectangular" sx={{ width: '100%', aspectRatio: '3/4', ...skeletonSx }} />
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

    const images = product.imageUrl ? product.imageUrl.split(',').map(url => url.trim()) : [];
    const mainImage = images[selectedImage] || 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800';

    const availableSizes = product.size
        ? product.size.split(',').map(s => s.trim().toUpperCase())
        : [];

    const isFootwear = ['sneaker', 'loafer', 'boot', 'shoe', 'slipper']
        .some(keyword => product.name.toLowerCase().includes(keyword));

    const shoesSizes = ['38', '39', '40', '41', '42', '43', '44', '45', '46', '47'];
    const clothingSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const allSizes = isFootwear ? shoesSizes : clothingSizes;

    const discountMatch = product.description?.match(/DISCOUNT:(\d+)/);
    const discount = discountMatch ? parseInt(discountMatch[1]) : 0;
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
                        <Box sx={{
                            width: '100%', aspectRatio: '3/4',
                            overflow: 'hidden', mb: 2, backgroundColor: '#faf6ee',
                        }}>
                            <ProductImageZoom src={mainImage} alt={product.name} />
                        </Box>

                        {images.length > 1 && (
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                {images.map((image, index) => (
                                    <Box
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        sx={{
                                            width: 80, height: 100, cursor: 'pointer',
                                            border: selectedImage === index ? '2px solid #d4b896' : '2px solid transparent',
                                            transition: 'border 0.3s ease', overflow: 'hidden',
                                            '&:hover': { border: '2px solid #d4b896' },
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
                            {product.description?.replace(/DISCOUNT:\d+\s?/, '')}
                        </Typography>

                        {/* Add to Cart Button + Wishlist Toggle */}
                        <Box sx={{ display: 'flex', gap: 1.5, mb: 3 }}>
                            <Button
                                variant="outlined" size="large" fullWidth
                                startIcon={<ShoppingBagOutlinedIcon />}
                                onClick={handleAddToCart}
                                disabled={availableSizes.length > 0 && !selectedSize}
                                sx={{
                                    color: '#22223b', borderColor: '#e6b8a2', borderWidth: '1px',
                                    py: 1.8, fontSize: '0.9rem', fontWeight: 400,
                                    letterSpacing: '0.12em', fontFamily: '"Lato", sans-serif',
                                    backgroundColor: 'transparent',
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                    position: 'relative', overflow: 'hidden', borderRadius: '6px',
                                    '&::before': {
                                        content: '""', position: 'absolute', top: 0, left: '-100%',
                                        width: '100%', height: '100%', backgroundColor: '#f5ebe0',
                                        transition: 'left 0.4s cubic-bezier(0.4, 0, 0.2, 1)', zIndex: -1,
                                    },
                                    '&:hover': {
                                        color: '#22223b', borderColor: '#f5ebe0',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 4px 12px rgba(193, 154, 107, 0.3)',
                                    },
                                    '&:hover::before': { left: 0 },
                                    '&.Mui-disabled': {
                                        color: 'rgba(34, 34, 59, 0.35)',
                                        borderColor: 'rgba(230, 184, 162, 0.4)',
                                    },
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

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })}
                       severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ProductDetailsPage;