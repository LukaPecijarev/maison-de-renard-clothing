import React, { useState } from 'react';
import { Container, Typography, Box, IconButton, CircularProgress, Snackbar, Alert, Fab } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import useProducts from '../hooks/useProducts';
import useOrder from '../hooks/useOrder';
import useAuth from '../hooks/useAuth';

const SpecialOffersPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search') || '';
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const { isAuthenticated } = useAuth();
    const { addToCart } = useOrder();
    const { products, loading, onDelete } = useProducts(6);

    const isAdmin = () => {
        const role = localStorage.getItem('role');
        return role === 'ROLE_ADMIN' || role === 'ADMIN';
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = async (productId, productName) => {
        if (window.confirm(`Are you sure you want to delete "${productName}"?`)) {
            try {
                await onDelete(productId);
                setSnackbar({ open: true, message: `${productName} deleted successfully!`, severity: 'success' });
            } catch (error) {
                setSnackbar({ open: true, message: 'Failed to delete product', severity: 'error' });
            }
        }
    };

    const ProductCard = ({ product }) => {
        const [isHovered, setIsHovered] = useState(false);
        const admin = isAdmin();

        const images = product.imageUrl ? product.imageUrl.split(',').map(url => url.trim()) : [];
        const defaultImage = images[0] || '';
        const hoverImage = images[1] || defaultImage;

        const discountMatch = product.description?.match(/DISCOUNT:(\d+)/);
        const discount = discountMatch ? parseInt(discountMatch[1]) : 0;
        const originalPrice = product.price;
        const discountedPrice = discount > 0 ? originalPrice * (1 - discount / 100) : originalPrice;

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
                    src={isHovered ? hoverImage : defaultImage}
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

                {discount > 0 && (
                    <Box sx={{
                        position: 'absolute', top: 12, left: 12,
                        backgroundColor: '#d32f2f', color: '#ffffff',
                        padding: '8px 14px', borderRadius: '20px',
                        display: 'flex', alignItems: 'center', gap: 0.5,
                        boxShadow: '0 3px 10px rgba(211, 47, 47, 0.35)',
                    }}>
                        <LocalOfferIcon sx={{ fontSize: 14 }} />
                        <Typography sx={{
                            fontFamily: '"Lato", sans-serif',
                            fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em',
                        }}>
                            -{discount}%
                        </Typography>
                    </Box>
                )}

                {admin ? (
                    <Box sx={{
                        position: 'absolute', top: 12, right: 12,
                        display: 'flex', gap: 1,
                        opacity: isHovered ? 1 : 0, transition: 'opacity 0.3s ease',
                    }}>
                        <IconButton
                            sx={{
                                backgroundColor: 'rgba(212, 184, 150, 0.9)', width: 38, height: 38,
                                '&:hover': { backgroundColor: 'rgba(196, 168, 134, 1)' },
                            }}
                            onClick={(e) => { e.stopPropagation(); navigate(`/products/${product.id}/edit`); }}
                        >
                            <EditOutlinedIcon sx={{ fontSize: 19, color: '#ffffff' }} />
                        </IconButton>
                        <IconButton
                            sx={{
                                backgroundColor: 'rgba(245, 235, 224, 0.9)', width: 38, height: 38,
                                '&:hover': { backgroundColor: 'rgba(239, 154, 154, 0.95)' },
                            }}
                            onClick={(e) => { e.stopPropagation(); handleDelete(product.id, product.name); }}
                        >
                            <DeleteOutlineIcon sx={{ fontSize: 19, color: '#c62828' }} />
                        </IconButton>
                    </Box>
                ) : (
                    <IconButton
                        sx={{
                            position: 'absolute', top: 12, right: 12,
                            backgroundColor: 'transparent', width: 36, height: 36,
                            opacity: isHovered ? 1 : 0, transition: 'opacity 0.3s ease',
                            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
                        }}
                        onClick={async (e) => {
                            e.stopPropagation();
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
                        }}
                    >
                        <ShoppingBagOutlinedIcon sx={{ fontSize: 20, color: '#ffffff' }} />
                    </IconButton>
                )}

                <Box sx={{
                    position: 'absolute', bottom: 16, left: '50%',
                    transform: isHovered ? 'translate(-50%, 0)' : 'translate(-50%, 20px)',
                    opacity: isHovered ? 1 : 0, transition: 'all 0.4s ease',
                    backgroundColor: '#f5ebe0', padding: '10px 20px',
                    borderRadius: '4px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                    pointerEvents: 'none', minWidth: '160px', textAlign: 'center',
                }}>
                    <Typography sx={{
                        fontFamily: '"Lato", sans-serif', fontSize: '0.7rem',
                        fontWeight: 400, color: 'rgba(44, 44, 44, 0.7)',
                        letterSpacing: '0.05em', mb: 0.5, textTransform: 'uppercase',
                    }}>
                        {product.name}
                    </Typography>
                    {discount > 0 ? (
                        <>
                            <Typography sx={{
                                fontFamily: '"Cormorant Garamond", serif', fontSize: '0.85rem',
                                color: '#999', textDecoration: 'line-through', letterSpacing: '0.05em',
                            }}>
                                €{originalPrice.toFixed(0)}
                            </Typography>
                            <Typography sx={{
                                fontFamily: '"Cormorant Garamond", serif', fontSize: '1.1rem',
                                fontWeight: 600, color: '#d32f2f', letterSpacing: '0.05em',
                            }}>
                                €{discountedPrice.toFixed(0)}
                            </Typography>
                        </>
                    ) : (
                        <Typography sx={{
                            fontFamily: '"Cormorant Garamond", serif', fontSize: '1rem',
                            fontWeight: 500, color: '#2c2c2c', letterSpacing: '0.05em',
                        }}>
                            €{originalPrice.toFixed(0)}
                        </Typography>
                    )}
                </Box>
            </Box>
        );
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', backgroundColor: '#f5f1e8' }}>
                <CircularProgress sx={{ color: '#2c2c2c' }} />
            </Box>
        );
    }

    return (
        <Box sx={{ backgroundColor: '#f5f1e8', minHeight: '100vh', position: 'relative' }}>
            <Container maxWidth="xl" sx={{ pt: 4, pb: 3 }}>
                <Box sx={{ mb: 6 }}>
                    <Typography variant="h3" align="center" sx={{
                        fontFamily: '"Cormorant Garamond", serif',
                        fontWeight: 300, letterSpacing: '0.1em', mb: 2, color: '#d32f2f',
                    }}>
                        SPECIAL OFFERS
                    </Typography>
                    <Typography variant="body1" align="center" sx={{
                        maxWidth: 800, mx: 'auto', mb: 5, lineHeight: 1.8, color: '#666', fontSize: '0.95rem',
                    }}>
                        Discover exceptional savings on our finest pieces. Limited time offers on selected luxury items.
                    </Typography>

                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                        gap: 3,
                    }}>
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </Box>

                    {filteredProducts.length === 0 && (
                        <Typography variant="h6" align="center" sx={{ color: '#666', mt: 8 }}>
                            {searchQuery
                                ? `No special offers found matching "${searchQuery}"`
                                : 'No special offers available at this time.'
                            }
                        </Typography>
                    )}
                </Box>
            </Container>

            {isAdmin() && (
                <Fab sx={{
                    position: 'fixed', bottom: 27, left: 32,
                    backgroundColor: '#d4b896', color: '#2c2c2c', width: 64, height: 64,
                    boxShadow: 'none',
                    '&:hover': { backgroundColor: '#c4a886', boxShadow: 'none' },
                }}
                     onClick={() => navigate('/products/add')}
                >
                    <AddIcon sx={{ fontSize: 32 }} />
                </Fab>
            )}

            <Snackbar
                open={snackbar.open} autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default SpecialOffersPage;