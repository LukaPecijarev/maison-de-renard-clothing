import React, { useState } from 'react';
import { Container, Typography, Box, Button, CircularProgress, Snackbar, Alert } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import useProductDetails from '../hooks/useProductDetails';
import useOrder from '../hooks/useOrder';
import useAuth from '../hooks/useAuth';

const ProductDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { addToCart } = useOrder();
    const { product, loading } = useProductDetails(id);
    const [selectedImage, setSelectedImage] = useState(0);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', backgroundColor: '#f5f1e8' }}>
                <CircularProgress sx={{ color: '#2c2c2c' }} />
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

    const handleAddToCart = async () => {
        if (!isAuthenticated()) {
            setSnackbar({
                open: true,
                message: 'Please login to add items to cart',
                severity: 'warning',
            });
            setTimeout(() => navigate('/login'), 1500);
            return;
        }

        const success = await addToCart(product.id);
        if (success) {
            setSnackbar({
                open: true,
                message: `${product.name} added to cart!`,
                severity: 'success',
            });
        } else {
            setSnackbar({
                open: true,
                message: 'Failed to add item to cart',
                severity: 'error',
            });
        }
    };

    return (
        <Box sx={{ backgroundColor: '#f5f1e8', minHeight: '100vh', py: 6 }}>
            <Container maxWidth="lg">
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 6 }}>
                    {/* Images Section */}
                    <Box>
                        {/* Main Image */}
                        <Box
                            sx={{
                                width: '100%',
                                aspectRatio: '3/4',
                                overflow: 'hidden',
                                mb: 2,
                                backgroundColor: '#ffffff',
                            }}
                        >
                            <Box
                                component="img"
                                src={mainImage}
                                alt={product.name}
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                }}
                            />
                        </Box>

                        {/* Thumbnail Images */}
                        {images.length > 1 && (
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                {images.map((image, index) => (
                                    <Box
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        sx={{
                                            width: 80,
                                            height: 100,
                                            cursor: 'pointer',
                                            border: selectedImage === index ? '2px solid #d4b896' : '2px solid transparent',
                                            transition: 'border 0.3s ease',
                                            overflow: 'hidden',
                                            '&:hover': {
                                                border: '2px solid #d4b896',
                                            },
                                        }}
                                    >
                                        <Box
                                            component="img"
                                            src={image}
                                            alt={`${product.name} ${index + 1}`}
                                            sx={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                            }}
                                        />
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </Box>

                    {/* Product Info Section */}
                    <Box>
                        {/* Category */}
                        <Typography
                            sx={{
                                fontFamily: '"Lato", sans-serif',
                                fontSize: '0.85rem',
                                letterSpacing: '0.15em',
                                color: '#8b7355',
                                mb: 2,
                                textTransform: 'uppercase',
                            }}
                        >
                            {product.categoryName || 'Luxury Fashion'}
                        </Typography>

                        {/* Product Name */}
                        <Typography
                            variant="h3"
                            sx={{
                                fontFamily: '"Cormorant Garamond", serif',
                                fontWeight: 300,
                                letterSpacing: '0.05em',
                                mb: 3,
                                color: '#2c2c2c',
                            }}
                        >
                            {product.name}
                        </Typography>

                        {/* Price */}
                        <Typography
                            variant="h4"
                            sx={{
                                fontFamily: '"Cormorant Garamond", serif',
                                fontWeight: 400,
                                mb: 4,
                                color: '#2c2c2c',
                            }}
                        >
                            €{product.price.toFixed(0)}
                        </Typography>

                        {/* Description */}
                        <Typography
                            sx={{
                                fontFamily: '"Lato", sans-serif',
                                fontSize: '0.95rem',
                                lineHeight: 1.8,
                                color: '#666',
                                mb: 4,
                            }}
                        >
                            {product.description}
                        </Typography>

                        {/* Add to Cart Button */}
                        <Button
                            variant="contained"
                            size="large"
                            fullWidth
                            startIcon={<ShoppingBagOutlinedIcon />}
                            onClick={handleAddToCart}
                            sx={{
                                backgroundColor: '#2c2c2c',
                                color: '#ffffff',
                                py: 1.8,
                                fontSize: '0.9rem',
                                fontWeight: 400,
                                letterSpacing: '0.1em',
                                fontFamily: '"Lato", sans-serif',
                                mb: 3,
                                '&:hover': {
                                    backgroundColor: '#1a1a1a',
                                },
                            }}
                        >
                            ADD TO CART
                        </Button>

                        {/* Product Details */}
                        <Box sx={{ borderTop: '1px solid rgba(212, 184, 150, 0.3)', pt: 3 }}>
                            <Typography
                                sx={{
                                    fontFamily: '"Lato", sans-serif',
                                    fontSize: '0.85rem',
                                    letterSpacing: '0.05em',
                                    color: '#8b7355',
                                    mb: 2,
                                    textTransform: 'uppercase',
                                }}
                            >
                                Product Details
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography sx={{ fontFamily: '"Lato", sans-serif', fontSize: '0.9rem', color: '#666' }}>
                                        Material:
                                    </Typography>
                                    <Typography sx={{ fontFamily: '"Lato", sans-serif', fontSize: '0.9rem', color: '#2c2c2c' }}>
                                        100% Italian Cashmere
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography sx={{ fontFamily: '"Lato", sans-serif', fontSize: '0.9rem', color: '#666' }}>
                                        Origin:
                                    </Typography>
                                    <Typography sx={{ fontFamily: '"Lato", sans-serif', fontSize: '0.9rem', color: '#2c2c2c' }}>
                                        Made in Italy
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography sx={{ fontFamily: '"Lato", sans-serif', fontSize: '0.9rem', color: '#666' }}>
                                        Availability:
                                    </Typography>
                                    <Typography sx={{ fontFamily: '"Lato", sans-serif', fontSize: '0.9rem', color: '#2e7d32' }}>
                                        In Stock
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Container>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ProductDetailsPage;