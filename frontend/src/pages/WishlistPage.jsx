import React from 'react';
import { Container, Typography, Box, Card, CardMedia, CardContent, IconButton, Button } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import { useNavigate } from 'react-router-dom';
import useWishlist from '../hooks/useWishlist';
import useOrder from '../hooks/useOrder';
import useAuth from '../hooks/useAuth';
import Reveal from '../components/Reveal';
import useSharedImageReturn from '../hooks/useSharedImageReturn';
import { startProductTransition, hasBackTransition } from '../utils/sharedImageTransition';
import animateRemoval from '../utils/animateRemoval';
import flyToCart from '../utils/flyToCart';
import { fillButtonSx } from '../styles/buttons';
import { getProductImages, FALLBACK_PRODUCT_IMAGE } from '../utils/productImages';
import AppSnackbar from '../components/AppSnackbar';

// One wishlist entry - its own component so its image can take part in the
// shared-element transition to/from ProductDetailsPage.
const WishlistItem = ({ item, onAddToCart, onRemove }) => {
    const navigate = useNavigate();
    const { ref: imageRef, hidden } = useSharedImageReturn(item.id, 'wishlist');
    const images = getProductImages(item);
    const imageUrl = images[0] || FALLBACK_PRODUCT_IMAGE;

    const openDetails = () => {
        startProductTransition(item.id, imageRef.current, imageUrl, { source: 'wishlist' });
        navigate(`/products/${item.id}`, { state: { preview: item, imageIndex: 0 } });
    };

    return (
        <Card sx={{
            display: 'flex', mb: 3, backgroundColor: '#fdfbf5',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)', borderRadius: '4px',
        }}>
            <CardMedia
                ref={imageRef}
                component="img"
                sx={{
                    width: { xs: 110, sm: 180 }, objectFit: 'cover', cursor: 'pointer',
                    visibility: hidden ? 'hidden' : 'visible',
                }}
                image={imageUrl}
                alt={item.name}
                onClick={openDetails}
            />
            <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: { xs: 1.5, sm: 3 } }}>
                <Typography
                    variant="h6"
                    onClick={openDetails}
                    sx={{
                        fontFamily: '"Lato", sans-serif', fontWeight: 400,
                        fontSize: '1.1rem', mb: 1, cursor: 'pointer',
                    }}
                >
                    {item.name}
                </Typography>
                <Typography variant="h6" sx={{
                    fontFamily: '"Cormorant Garamond", serif',
                    fontSize: '1.3rem', color: '#2c2c2c', mb: 'auto',
                }}>
                    €{item.price?.toFixed(0)}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Button
                        startIcon={<ShoppingBagOutlinedIcon />}
                        onClick={(e) => onAddToCart(item, imageRef.current, imageUrl, e.currentTarget.closest('.MuiCard-root'))}
                        sx={{
                            color: '#2c2c2c', fontSize: '0.8rem', letterSpacing: '0.08em',
                            '&:hover': { backgroundColor: 'rgba(44, 44, 44, 0.05)' },
                        }}
                    >
                        ADD TO CART
                    </Button>
                    <IconButton
                        onClick={async (e) => {
                        // Slide the entry off to the left first, then remove it.
                        await animateRemoval(e.currentTarget.closest('.MuiCard-root'));
                        onRemove(item.id);
                    }}
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
};

const WishlistPage = () => {
    const { wishlist, removeFromWishlist } = useWishlist();
    const { addToCart } = useOrder();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' });

    // Once the item is really in the cart, its photo flies up to the navbar cart
    // icon, then the entry fades out of the wishlist and is removed from it (it's
    // in the cart now). If adding failed (e.g. out of stock) say so instead.
    const handleAddToCart = async (product, imageElement, imageUrl, cardElement) => {
        if (!isAuthenticated()) {
            navigate('/login');
            return;
        }
        if (cardElement) cardElement.style.pointerEvents = 'none'; // no double add while it flies
        const success = await addToCart(product.id);
        if (success) {
            await flyToCart(imageElement, imageUrl);
            await animateRemoval(cardElement, { slide: false });
            removeFromWishlist(product.id);
        } else {
            if (cardElement) cardElement.style.pointerEvents = '';
            setSnackbar({ open: true, message: `Couldn't add "${product.name}" to your cart - it may be out of stock.`, severity: 'error' });
        }
    };

    return (
        <Box sx={{ backgroundColor: '#f5f1e8', minHeight: '100vh', py: 8 }}>
            <Reveal instant={wishlist.some((item) => hasBackTransition(item.id, 'wishlist'))}><Container maxWidth="md">
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <FavoriteIcon sx={{ fontSize: 50, color: '#d32f2f', mb: 2 }} />
                    <Typography variant="h3" sx={{
                        fontFamily: '"Cormorant Garamond", serif',
                        fontWeight: 300, letterSpacing: '0.1em', color: '#2c2c2c',
                    }}>
                        My Wishlist
                    </Typography>
                </Box>

                {wishlist.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <FavoriteIcon sx={{ fontSize: 120, color: 'rgba(44, 44, 44, 0.15)', mb: 3 }} />
                        <Typography variant="h5" sx={{
                            fontFamily: '"Cormorant Garamond", serif', color: '#666', mb: 4,
                        }}>
                            Your wishlist is empty
                        </Typography>
                        <Button
                            variant="outlined"
                            onClick={() => navigate('/products', { state: { smoothScrollTop: true } })}
                            sx={{
                                ...fillButtonSx,
                                px: 6, py: 1.5, fontSize: '0.9rem', fontWeight: 400,
                                letterSpacing: '0.15em', fontFamily: '"Lato", sans-serif',
                            }}
                        >
                            DISCOVER PRODUCTS
                        </Button>
                    </Box>
                ) : (
                    wishlist.map((item) => (
                        <WishlistItem
                            key={item.id}
                            item={item}
                            onAddToCart={handleAddToCart}
                            onRemove={removeFromWishlist}
                        />
                    ))
                )}
            </Container></Reveal>

            <AppSnackbar snackbar={snackbar} onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))} duration={3500} />
        </Box>
    );
};

export default WishlistPage;
