import React, { useState } from 'react';
import { Dialog, DialogContent, IconButton, Box, Typography, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import { useNavigate } from 'react-router-dom';
import useOrder from '../hooks/useOrder';
import useAuth from '../hooks/useAuth';

// Lets a shopper preview a product without leaving the grid they're
// browsing. Reuses the same DisplayProductDto shape the product grids
// already have in hand, so no extra fetch is needed to open it.
const QuickViewModal = ({ product, open, onClose, onAddedToCart }) => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { addToCart } = useOrder();
    const [adding, setAdding] = useState(false);

    if (!product) return null;

    const images = product.imageUrl ? product.imageUrl.split(',').map((u) => u.trim()) : [];
    const imageUrl = images[0] || 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600';
    const description = product.description?.replace(/DISCOUNT:\d+\s?/, '') || '';

    const handleAddToCart = async () => {
        if (!isAuthenticated()) {
            onClose();
            navigate('/login');
            return;
        }
        setAdding(true);
        const success = await addToCart(product.id);
        setAdding(false);
        if (success) onAddedToCart?.(product);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '4px' } }}>
            <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1, color: '#2c2c2c' }}>
                <CloseIcon />
            </IconButton>
            <DialogContent sx={{ p: 0 }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
                    <Box sx={{ aspectRatio: '3/4', overflow: 'hidden', backgroundColor: '#f5f1e8' }}>
                        <Box component="img" src={imageUrl} alt={product.name}
                             sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Box>
                    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column' }}>
                        <Typography sx={{
                            fontFamily: '"Lato", sans-serif', fontSize: '0.75rem',
                            letterSpacing: '0.12em', color: '#8b7355', mb: 1, textTransform: 'uppercase',
                        }}>
                            {product.categoryName || 'Luxury Fashion'}
                        </Typography>
                        <Typography variant="h5" sx={{
                            fontFamily: '"Cormorant Garamond", serif', fontWeight: 400, mb: 1.5, color: '#2c2c2c',
                        }}>
                            {product.name}
                        </Typography>
                        <Typography variant="h6" sx={{
                            fontFamily: '"Cormorant Garamond", serif', color: '#2c2c2c', mb: 2,
                        }}>
                            €{product.price?.toFixed(0)}
                        </Typography>
                        <Typography sx={{
                            fontFamily: '"Lato", sans-serif', fontSize: '0.85rem',
                            color: '#666', lineHeight: 1.7, mb: 3, flexGrow: 1,
                        }}>
                            {description.slice(0, 160)}{description.length > 160 ? '…' : ''}
                        </Typography>
                        <Button
                            variant="outlined" fullWidth startIcon={<ShoppingBagOutlinedIcon />}
                            onClick={handleAddToCart} disabled={adding}
                            sx={{
                                color: '#22223b', borderColor: '#e6b8a2', borderWidth: '1px',
                                py: 1.5, mb: 1.5, fontSize: '0.85rem', fontWeight: 400,
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
                                '&.Mui-disabled': {
                                    color: 'rgba(34, 34, 59, 0.35)',
                                    borderColor: 'rgba(230, 184, 162, 0.4)',
                                },
                            }}
                        >
                            ADD TO CART
                        </Button>
                        <Button
                            variant="text" fullWidth
                            onClick={() => { onClose(); navigate(`/products/${product.id}`); }}
                            sx={{ color: '#8b7355', fontSize: '0.8rem', letterSpacing: '0.08em', fontFamily: '"Lato", sans-serif' }}
                        >
                            VIEW FULL DETAILS
                        </Button>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default QuickViewModal;
