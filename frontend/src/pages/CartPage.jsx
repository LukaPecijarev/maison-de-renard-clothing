import React from 'react';
import {
    Container,
    Typography,
    Box,
    Card,
    CardMedia,
    CardContent,
    IconButton,
    Button,
    Divider,
    CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';
import useOrder from '../hooks/useOrder';
import useAuth from '../hooks/useAuth';
import Reveal from '../components/Reveal';

const CartPage = () => {
    const { order, loading, removeFromCart } = useOrder();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    const handleRemoveItem = async (productId) => {
        await removeFromCart(productId);
    };

    const handleCheckout = () => {
        navigate('/checkout');
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', backgroundColor: '#f5f1e8' }}>
                <CircularProgress sx={{ color: '#2c2c2c' }} />
            </Box>
        );
    }

    const cartItems = order?.products || [];
    const isEmpty = cartItems.length === 0;

    const getDiscountedPrice = (item) => {
        const discountMatch = item.description?.match(/DISCOUNT:(\d+)/);
        if (discountMatch) {
            const discount = parseInt(discountMatch[1]);
            return item.price * (1 - discount / 100);
        }
        return item.price;
    };

    const getDiscount = (item) => {
        const discountMatch = item.description?.match(/DISCOUNT:(\d+)/);
        return discountMatch ? parseInt(discountMatch[1]) : 0;
    };

    const total = cartItems.reduce((sum, item) => sum + getDiscountedPrice(item), 0);

    return (
        <Box sx={{ backgroundColor: '#f5f1e8', minHeight: '100vh', py: 8 }}>
            <Reveal><Container maxWidth="xl">
                {/* Header */}
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <ShoppingCartIcon sx={{ fontSize: 50, color: '#2c2c2c', mb: 2 }} />
                    <Typography variant="h3" sx={{
                        fontFamily: '"Cormorant Garamond", serif',
                        fontWeight: 300, letterSpacing: '0.1em', color: '#2c2c2c',
                    }}>
                        Shopping Cart
                    </Typography>
                </Box>

                {isEmpty ? (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <ShoppingCartIcon sx={{ fontSize: 120, color: 'rgba(44, 44, 44, 0.3)', mb: 3 }} />
                        <Typography variant="h5" sx={{
                            fontFamily: '"Cormorant Garamond", serif', color: '#666', mb: 4,
                        }}>
                            Your cart is empty
                        </Typography>
                        <Button
                            variant="outlined"
                            onClick={() => navigate('/')}
                            sx={{
                                color: '#22223b', borderColor: '#e6b8a2', borderWidth: '1px',
                                px: 6, py: 1.5, fontSize: '0.9rem', fontWeight: 400,
                                letterSpacing: '0.15em', fontFamily: '"Lato", sans-serif',
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
                            }}
                        >
                            CONTINUE SHOPPING
                        </Button>
                    </Box>
                ) : (
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: { xs: 3, md: 4 } }}>
                        {/* Cart Items */}
                        <Box>
                            {cartItems.map((item) => {
                                const images = item.imageUrl ? item.imageUrl.split(',').map(url => url.trim()) : [];
                                const imageUrl = images[0] || 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500';
                                const discount = getDiscount(item);
                                const discountedPrice = getDiscountedPrice(item);

                                return (
                                    <Card key={item.id} sx={{
                                        display: 'flex', mb: 3, backgroundColor: '#fdfbf5',
                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)', borderRadius: '4px',
                                    }}>
                                        <CardMedia
                                            component="img"
                                            sx={{ width: { xs: 110, sm: 180 }, objectFit: 'cover' }}
                                            image={imageUrl}
                                            alt={item.name}
                                        />
                                        <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: { xs: 1.5, sm: 3 } }}>
                                            <Typography variant="h6" sx={{
                                                fontFamily: '"Lato", sans-serif',
                                                fontWeight: 400, fontSize: '1.1rem', mb: 1,
                                            }}>
                                                {item.name}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#666', mb: 2, fontSize: '0.9rem' }}>
                                                {item.description?.replace(/DISCOUNT:\d+\s?/, '').substring(0, 100)}...
                                            </Typography>
                                            <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Box>
                                                    {discount > 0 && (
                                                        <Typography sx={{
                                                            fontFamily: '"Cormorant Garamond", serif',
                                                            fontSize: '1rem', color: '#999',
                                                            textDecoration: 'line-through',
                                                        }}>
                                                            €{item.price.toFixed(0)}
                                                        </Typography>
                                                    )}
                                                    <Typography variant="h6" sx={{
                                                        fontFamily: '"Cormorant Garamond", serif',
                                                        fontSize: '1.3rem',
                                                        color: discount > 0 ? '#d32f2f' : '#2c2c2c',
                                                    }}>
                                                        €{discountedPrice.toFixed(0)}
                                                    </Typography>
                                                </Box>
                                                <IconButton
                                                    onClick={() => handleRemoveItem(item.id)}
                                                    sx={{
                                                        color: '#666',
                                                        '&:hover': { color: '#d32f2f', backgroundColor: 'rgba(211, 47, 47, 0.08)' },
                                                    }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </Box>

                        {/* Order Summary */}
                        <Box>
                            <Card sx={{
                                p: 4, position: 'sticky', top: 100,
                                backgroundColor: '#fdfbf5',
                                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)', borderRadius: '4px',
                            }}>
                                <Typography variant="h5" sx={{
                                    fontFamily: '"Cormorant Garamond", serif',
                                    fontWeight: 400, letterSpacing: '0.05em', mb: 3,
                                }}>
                                    Order Summary
                                </Typography>
                                <Divider sx={{ my: 2, borderColor: '#e6ccb2' }} />

                                <Box sx={{ mb: 3 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                        <Typography sx={{ color: '#666', fontSize: '0.95rem' }}>
                                            Items ({cartItems.length})
                                        </Typography>
                                        <Typography sx={{ fontSize: '0.95rem' }}>
                                            €{total.toFixed(0)}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                        <Typography sx={{ color: '#666', fontSize: '0.95rem' }}>
                                            Shipping
                                        </Typography>
                                        <Typography sx={{ color: '#2e7d32', fontSize: '0.95rem' }}>
                                            FREE
                                        </Typography>
                                    </Box>
                                </Box>

                                <Divider sx={{ my: 2, borderColor: '#e6ccb2' }} />

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                                    <Typography variant="h6" sx={{
                                        fontFamily: '"Cormorant Garamond", serif', fontSize: '1.3rem',
                                    }}>
                                        Total
                                    </Typography>
                                    <Typography variant="h6" sx={{
                                        fontFamily: '"Cormorant Garamond", serif',
                                        fontSize: '1.3rem', color: '#2c2c2c',
                                    }}>
                                        €{total.toFixed(0)}
                                    </Typography>
                                </Box>

                                <Button
                                    variant="outlined" fullWidth size="large"
                                    onClick={handleCheckout}
                                    sx={{
                                        color: '#22223b', borderColor: '#e6b8a2', borderWidth: '1px',
                                        backgroundColor: 'transparent',
                                        py: 1.5, mb: 2, fontSize: '0.85rem', fontWeight: 500,
                                        letterSpacing: '0.15em', fontFamily: '"Lato", sans-serif',
                                        position: 'relative', overflow: 'hidden', borderRadius: '6px',
                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
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
                                    }}
                                >
                                    PROCEED TO CHECKOUT
                                </Button>

                                <Button
                                    variant="outlined" fullWidth
                                    onClick={() => navigate('/')}
                                    sx={{
                                        color: '#22223b', borderColor: '#e6b8a2', borderWidth: '1px',
                                        py: 1.5, fontSize: '0.9rem', fontWeight: 400,
                                        letterSpacing: '0.1em', fontFamily: '"Lato", sans-serif',
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
                                    }}
                                >
                                    CONTINUE SHOPPING
                                </Button>
                            </Card>
                        </Box>
                    </Box>
                )}
            </Container></Reveal>
        </Box>
    );
};

export default CartPage;