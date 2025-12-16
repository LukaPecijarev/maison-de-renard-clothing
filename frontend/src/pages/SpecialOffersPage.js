import React, { useState } from 'react';
import { Container, Typography, Box, IconButton, Snackbar, Alert, Fab } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import useOrder from '../hooks/useOrder';
import useAuth from '../hooks/useAuth';

const SpecialOffersPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search') || ''; // ✅ Get search query
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const { isAuthenticated } = useAuth();
    const { addToCart } = useOrder();

    // Check if user is admin
    const isAdmin = () => {
        const role = localStorage.getItem('role');
        return role === 'ROLE_ADMIN' || role === 'ADMIN';
    };

    // Hardcoded special offers products with discounts (10% - 50%)
    const specialOffers = [
        {
            id: 1,
            name: 'Cable Knit Cashmere Sweater',
            originalPrice: 1299.99,
            discount: 30, // 30% off
            imageUrl: 'https://media.loropiana.com/HYBRIS/FAQ/FAQ3218/60DA4312-63A0-4E89-8136-A429B6BD17FD/FAQ3218_51FU_MEDIUM.jpg?sw=500&sh=700',
            imageUrl2: 'https://media.loropiana.com/PRODUCTS/HYBRIS/FAQ/FAQ3218/51FU/L3/805ADE5C-7C68-445A-B04A-15BE848F0EB2_FAQ3218_51FU_MEDIUM.jpg',
        },
        {
            id: 13,
            name: 'Cashmere Polo Sweater',
            originalPrice: 1199.99,
            discount: 25,
            imageUrl: 'https://media.loropiana.com/PRODUCTS/HYBRIS/FAP/FAP7344/W000/FR/0B635099-D96A-4C7D-90A2-3AD87FFCA794_FAP7344_W000_MEDIUM.jpg?sw=500&sh=700',
            imageUrl2: 'https://media.loropiana.com/PRODUCTS/HYBRIS/FAP/FAP7344/W000/L2/78411282-CCEE-4178-8430-84F084F7C3C3_FAP7344_W000_MEDIUM.jpg',
        },
        {
            id: 15,
            name: 'Cashmere Trench Coat',
            originalPrice: 3299.99,
            discount: 40,
            imageUrl: 'https://media.loropiana.com/HYBRIS/FAQ/FAQ2737/28002A84-A27E-4229-9086-326B109373DC/FAQ2737_A014_MEDIUM.jpg',
            imageUrl2: 'https://media.loropiana.com/HYBRIS/FAQ/FAQ2737/3DAC5BFB-C1B8-41F4-BD66-15A3DBE5072F/FAQ2737_A014_MEDIUM.jpg',
        },
        {
            id: 3,
            name: 'Cashmere Overcoat',
            originalPrice: 3499.99,
            discount: 35,
            imageUrl: 'https://media.loropiana.com/HYBRIS/FAN/FAN1935/8CDAE738-7C09-44FE-97DB-908E07252E6F/FAN1935_W0ZP_MEDIUM.jpg?sw=500&sh=700',
            imageUrl2: 'https://media.loropiana.com/HYBRIS/FAN/FAN1935/AD3292E4-9C35-4C75-8F59-8323D35AABBC/FAN1935_W0ZP_MEDIUM.jpg',
        },
        {
            id: 26,
            name: 'Leather Backpack',
            originalPrice: 1299.99,
            discount: 20,
            imageUrl: 'https://media.loropiana.com/PRODUCTS/HYBRIS/FAP/FAP5328/804M/FR/373700F6-6FA0-4E8D-8842-D62BF7C00109_FAP5328_804M_MEDIUM.jpg',
            imageUrl2: 'https://media.loropiana.com/HYBRIS/FAP/FAP5328/3555E622-1314-4BBB-9E4E-D7B93E5162EE/FAP5328_804M_MEDIUM.jpg',
        },
        {
            id: 5,
            name: 'Lightweight Cashmere Cardigan',
            originalPrice: 1499.99,
            discount: 15,
            imageUrl: 'https://media.loropiana.com/HYBRIS/FAL/FAL2899/208D2585-554A-4F4E-822B-5CA46087C9F6/FAL2899_HC54_MEDIUM.jpg',
            imageUrl2: 'https://media.loropiana.com/HYBRIS/FAL/FAL2899/70C2796E-C045-4FE9-A65E-3F6CDD3F7742/FAL2899_HC54_MEDIUM.jpg',
        },
        {
            id: 18,
            name: 'Cashmere Wrap Coat',
            originalPrice: 2999.99,
            discount: 45,
            imageUrl: 'https://media.loropiana.com/HYBRIS/FAO/FAO0815/39CD89D9-E822-442A-966F-CB3452A8424B/FAO0815_H0YE_MEDIUM.jpg',
            imageUrl2: 'https://media.loropiana.com/HYBRIS/FAO/FAO0815/FC7CD8B2-825C-4F7D-A2AA-4E8465A97982/FAO0815_H0YE_MEDIUM.jpg',
        },
        {
            id: 12,
            name: 'Merino Wool Blazer',
            originalPrice: 1999.99,
            discount: 50,
            imageUrl: 'https://media.loropiana.com/HYBRIS/FAF/FAF6689/13481E0A-E9E1-41D1-B249-965BBE4C68A1/FAF6689_D0VN_MEDIUM.jpg?sw=500&sh=700',
            imageUrl2: 'https://media.loropiana.com/HYBRIS/FAF/FAF6689/E6BEB6A1-CAB7-40C1-B4E0-4CA5028B2793/FAF6689_D0VN_MEDIUM.jpg',
        },
    ];

    // ✅ Filter offers by search query
    const filteredOffers = specialOffers.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Calculate discounted price
    const calculateDiscountedPrice = (originalPrice, discount) => {
        return originalPrice * (1 - discount / 100);
    };

    // Component for product with hover effect
    const ProductWithDiscount = ({ product }) => {
        const [isHovered, setIsHovered] = useState(false);
        const admin = isAdmin();

        const discountedPrice = calculateDiscountedPrice(product.originalPrice, product.discount);
        const formattedOriginalPrice = `€${product.originalPrice.toFixed(0)}`;
        const formattedDiscountedPrice = `€${discountedPrice.toFixed(0)}`;

        return (
            <Box
                sx={{
                    width: '100%',
                    aspectRatio: '3/4',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    position: 'relative',
                    backgroundColor: '#f5f1e8',
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => navigate(`/products/${product.id}`)}
            >
                <Box
                    component="img"
                    src={isHovered ? product.imageUrl2 : product.imageUrl}
                    alt={product.name}
                    sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'all 0.6s ease',
                        transform: isHovered ? 'scale(1.03)' : 'scale(1)',
                        display: 'block',
                        filter: 'brightness(0.98) contrast(1.02)',
                        mixBlendMode: 'multiply',
                    }}
                />

                {/* Discount Badge - Top Left */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        backgroundColor: '#d32f2f',
                        color: '#ffffff',
                        padding: '8px 14px',
                        borderRadius: '20px', // ✅ More rounded
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        boxShadow: '0 3px 10px rgba(211, 47, 47, 0.35)', // ✅ Better shadow
                    }}
                >
                    <LocalOfferIcon sx={{ fontSize: 14 }} />
                    <Typography
                        sx={{
                            fontFamily: '"Lato", sans-serif',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            letterSpacing: '0.05em',
                        }}
                    >
                        -{product.discount}%
                    </Typography>
                </Box>

                {/* Admin Controls - Edit and Delete */}
                {admin ? (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            display: 'flex',
                            gap: 1,
                            opacity: isHovered ? 1 : 0,
                            transition: 'opacity 0.3s ease',
                        }}
                    >
                        {/* Edit Button */}
                        <IconButton
                            sx={{
                                backgroundColor: 'rgba(212, 184, 150, 0.9)',
                                width: 38,
                                height: 38,
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    backgroundColor: 'rgba(196, 168, 134, 1)',
                                    transform: 'scale(1.05)',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
                                },
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/products/${product.id}/edit`);
                            }}
                        >
                            <EditOutlinedIcon sx={{ fontSize: 19, color: '#ffffff' }} />
                        </IconButton>

                        {/* Delete Button */}
                        <IconButton
                            sx={{
                                backgroundColor: 'rgba(245, 235, 224, 0.9)',
                                width: 38,
                                height: 38,
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    backgroundColor: 'rgba(239, 154, 154, 0.95)',
                                    transform: 'scale(1.05)',
                                    boxShadow: '0 4px 12px rgba(211, 47, 47, 0.3)',
                                },
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                alert('Delete functionality not implemented for special offers');
                            }}
                        >
                            <DeleteOutlineIcon sx={{ fontSize: 19, color: '#c62828' }} />
                        </IconButton>
                    </Box>
                ) : (
                    /* Customer Shopping Bag Icon */
                    <IconButton
                        sx={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            backgroundColor: 'transparent',
                            width: 36,
                            height: 36,
                            opacity: isHovered ? 1 : 0,
                            transition: 'opacity 0.3s ease',
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            },
                        }}
                        onClick={async (e) => {
                            e.stopPropagation();

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
                        }}
                    >
                        <ShoppingBagOutlinedIcon sx={{ fontSize: 20, color: '#ffffff' }} />
                    </IconButton>
                )}

                {/* Price Popup - Shows on Hover */}
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 16,
                        left: '50%',
                        transform: isHovered ? 'translate(-50%, 0)' : 'translate(-50%, 20px)',
                        opacity: isHovered ? 1 : 0,
                        transition: 'all 0.4s ease',
                        backgroundColor: '#f5ebe0',
                        padding: '10px 20px',
                        borderRadius: '4px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                        pointerEvents: 'none',
                        minWidth: '160px',
                        textAlign: 'center',
                    }}
                >
                    <Typography
                        sx={{
                            fontFamily: '"Lato", sans-serif',
                            fontSize: '0.7rem',
                            fontWeight: 400,
                            color: 'rgba(44, 44, 44, 0.7)',
                            letterSpacing: '0.05em',
                            mb: 0.5,
                            textTransform: 'uppercase',
                        }}
                    >
                        {product.name}
                    </Typography>

                    {/* Original Price - Crossed Out */}
                    <Typography
                        sx={{
                            fontFamily: '"Cormorant Garamond", serif',
                            fontSize: '0.85rem',
                            fontWeight: 400,
                            color: '#999',
                            textDecoration: 'line-through',
                            letterSpacing: '0.05em',
                        }}
                    >
                        {formattedOriginalPrice}
                    </Typography>

                    {/* Discounted Price - Red */}
                    <Typography
                        sx={{
                            fontFamily: '"Cormorant Garamond", serif',
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            color: '#d32f2f',
                            letterSpacing: '0.05em',
                        }}
                    >
                        {formattedDiscountedPrice}
                    </Typography>
                </Box>
            </Box>
        );
    };

    return (
        <Box sx={{ backgroundColor: '#f5f1e8', minHeight: '100vh', position: 'relative' }}>
            <Container maxWidth="xl" sx={{ pt: 4, pb: 3 }}>
                {/* Page Header */}
                <Box sx={{ mb: 6 }}>
                    {/* Title with Red Accent */}
                    <Typography
                        variant="h3"
                        align="center"
                        sx={{
                            fontFamily: '"Cormorant Garamond", serif',
                            fontWeight: 300,
                            letterSpacing: '0.1em',
                            mb: 2,
                            color: '#d32f2f',
                        }}
                    >
                        SPECIAL OFFERS
                    </Typography>

                    {/* Subtitle */}
                    <Typography
                        variant="body1"
                        align="center"
                        sx={{
                            maxWidth: 800,
                            mx: 'auto',
                            mb: 5,
                            lineHeight: 1.8,
                            color: '#666',
                            fontSize: '0.95rem',
                        }}
                    >
                        Discover exceptional savings on our finest pieces. Limited time offers on selected luxury items.
                    </Typography>

                    {/* Products Grid */}
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                            gap: 3,
                        }}
                    >
                        {filteredOffers.map((product) => (
                            <ProductWithDiscount key={product.id} product={product} />
                        ))}
                    </Box>

                    {/* No results message */}
                    {filteredOffers.length === 0 && (
                        <Typography
                            variant="h6"
                            align="center"
                            sx={{
                                color: '#666',
                                mt: 8,
                            }}
                        >
                            {searchQuery
                                ? `No special offers found matching "${searchQuery}"`
                                : 'No special offers available'
                            }
                        </Typography>
                    )}
                </Box>
            </Container>

            {/* Floating Add Product Button - Admin Only */}
            {isAdmin() && (
                <Fab
                    color="primary"
                    aria-label="add product"
                    sx={{
                        position: 'fixed',
                        bottom: 32,
                        right: 32,
                        backgroundColor: '#d4b896',
                        color: '#2c2c2c',
                        width: 64,
                        height: 64,
                        '&:hover': {
                            backgroundColor: '#c4a886',
                        },
                    }}
                    onClick={() => navigate('/products/add')}
                >
                    <AddIcon sx={{ fontSize: 32 }} />
                </Fab>
            )}

            {/* Snackbar for notifications */}
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

export default SpecialOffersPage;