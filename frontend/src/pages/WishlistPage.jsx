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

const WishlistPage = () => {
    const { wishlist, removeFromWishlist } = useWishlist();
    const { addToCart } = useOrder();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleAddToCart = async (product) => {
        if (!isAuthenticated()) {
            navigate('/login');
            return;
        }
        await addToCart(product.id);
    };

    return (
        <Box sx={{ backgroundColor: '#f5f1e8', minHeight: '100vh', py: 8 }}>
            <Reveal><Container maxWidth="md">
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
                            onClick={() => navigate('/products')}
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
                            DISCOVER PRODUCTS
                        </Button>
                    </Box>
                ) : (
                    wishlist.map((item) => {
                        const images = item.imageUrl ? item.imageUrl.split(',').map((u) => u.trim()) : [];
                        const imageUrl = images[0] || 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500';

                        return (
                            <Card key={item.id} sx={{
                                display: 'flex', mb: 3, backgroundColor: '#fdfbf5',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)', borderRadius: '4px',
                            }}>
                                <CardMedia
                                    component="img"
                                    sx={{ width: { xs: 110, sm: 180 }, objectFit: 'cover', cursor: 'pointer' }}
                                    image={imageUrl}
                                    alt={item.name}
                                    onClick={() => navigate(`/products/${item.id}`)}
                                />
                                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: { xs: 1.5, sm: 3 } }}>
                                    <Typography
                                        variant="h6"
                                        onClick={() => navigate(`/products/${item.id}`)}
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
                                            onClick={() => handleAddToCart(item)}
                                            sx={{
                                                color: '#2c2c2c', fontSize: '0.8rem', letterSpacing: '0.08em',
                                                '&:hover': { backgroundColor: 'rgba(44, 44, 44, 0.05)' },
                                            }}
                                        >
                                            ADD TO CART
                                        </Button>
                                        <IconButton
                                            onClick={() => removeFromWishlist(item.id)}
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
                    })
                )}
            </Container></Reveal>
        </Box>
    );
};

export default WishlistPage;
