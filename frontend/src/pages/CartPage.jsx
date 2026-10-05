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
import ConfirmDialog from '../components/ConfirmDialog';
import RemoveShoppingCartOutlinedIcon from '@mui/icons-material/RemoveShoppingCartOutlined';
import animateRemoval, { resetRemoval } from '../utils/animateRemoval';
import { fillButtonSx } from '../styles/buttons';
import { getProductImages, FALLBACK_PRODUCT_IMAGE } from '../utils/productImages';
import AppSnackbar from '../components/AppSnackbar';

const CartPage = () => {
    const { order, loading, removeFromCart, cancelOrder } = useOrder();
    const [confirmCancelOpen, setConfirmCancelOpen] = React.useState(false);
    const [cancelling, setCancelling] = React.useState(false);
    const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' });
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    // Slide the item off to the left first, then remove it.
    const handleRemoveItem = async (productId, cardElement) => {
        await animateRemoval(cardElement);
        const success = await removeFromCart(productId);
        if (!success) {
            resetRemoval(cardElement);
            setSnackbar({ open: true, message: 'Failed to remove item. Please try again.', severity: 'error' });
        } else if (cardElement?.isConnected) {
            // Same product in the cart twice: React keeps this element for the
            // remaining copy, so it must not stay collapsed.
            resetRemoval(cardElement);
        }
    };

    const handleCheckout = () => {
        navigate('/checkout');
    };

    const handleConfirmCancel = async () => {
        setConfirmCancelOpen(false);
        setCancelling(true);
        const success = await cancelOrder();
        setCancelling(false);
        setSnackbar(success
            ? { open: true, message: 'Your order has been cancelled.', severity: 'success' }
            : { open: true, message: 'Failed to cancel order. Please try again.', severity: 'error' });
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

    // Per-item prices are only for display - the total comes from the backend
    // (Order.totalPrice), which applies the same discounts server-side.
    const getDiscount = (item) => item.discountPercentage || 0;
    const getDiscountedPrice = (item) => item.price * (1 - getDiscount(item) / 100);

    const total = order?.totalPrice || 0;

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
                                ...fillButtonSx,
                                px: 6, py: 1.5, fontSize: '0.9rem', fontWeight: 400,
                                letterSpacing: '0.15em', fontFamily: '"Lato", sans-serif',
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
                                const images = getProductImages(item);
                                const imageUrl = images[0] || FALLBACK_PRODUCT_IMAGE;
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
                                                {item.description?.substring(0, 100)}...
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
                                                    onClick={(e) => handleRemoveItem(item.id, e.currentTarget.closest('.MuiCard-root'))}
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
                                        ...fillButtonSx,
                                        py: 1.5, mb: 2, fontSize: '0.85rem', fontWeight: 500,
                                        letterSpacing: '0.15em', fontFamily: '"Lato", sans-serif',
                                    }}
                                >
                                    PROCEED TO CHECKOUT
                                </Button>

                                <Button
                                    variant="outlined" fullWidth
                                    onClick={() => navigate('/')}
                                    sx={{
                                        ...fillButtonSx,
                                        py: 1.5, fontSize: '0.9rem', fontWeight: 400,
                                        letterSpacing: '0.1em', fontFamily: '"Lato", sans-serif',
                                    }}
                                >
                                    CONTINUE SHOPPING
                                </Button>

                                <Button
                                    fullWidth
                                    onClick={() => setConfirmCancelOpen(true)}
                                    disabled={cancelling}
                                    sx={{
                                        mt: 2, py: 1, color: '#9c4a4a',
                                        fontSize: '0.8rem', letterSpacing: '0.1em',
                                        fontFamily: '"Lato", sans-serif',
                                        '&:hover': { backgroundColor: 'rgba(156, 74, 74, 0.06)' },
                                    }}
                                >
                                    {cancelling ? 'CANCELLING...' : 'CANCEL ORDER'}
                                </Button>
                            </Card>
                        </Box>
                    </Box>
                )}
            </Container></Reveal>

            {/* Cancel order confirmation */}
            <ConfirmDialog
                open={confirmCancelOpen}
                title="Cancel this order?"
                message={`All ${cartItems.length} ${cartItems.length === 1 ? 'item' : 'items'} will be removed from your cart. This can't be undone.`}
                confirmLabel="Cancel order"
                cancelLabel="Keep order"
                icon={<RemoveShoppingCartOutlinedIcon sx={{ fontSize: 24, color: '#9c4a4a' }} />}
                onConfirm={handleConfirmCancel}
                onCancel={() => setConfirmCancelOpen(false)}
            />

            <AppSnackbar snackbar={snackbar} onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))} />
        </Box>
    );
};

export default CartPage;