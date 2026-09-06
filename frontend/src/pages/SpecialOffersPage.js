import React, { useState } from 'react';
import { Container, Typography, Box, IconButton, Snackbar, Alert, Fab } from '@mui/material';
import ProductGridSkeleton from '../components/ProductGridSkeleton';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import useProducts from '../hooks/useProducts';
import useOrder from '../hooks/useOrder';
import useAuth from '../hooks/useAuth';
import useWishlist from '../hooks/useWishlist';
import QuickViewModal from '../components/QuickViewModal';
import Reveal from '../components/Reveal';
import RecentlyViewed from '../components/RecentlyViewed';

const SpecialOffersPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search') || '';
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [quickViewProduct, setQuickViewProduct] = useState(null);

    const { isAuthenticated } = useAuth();
    const { addToCart } = useOrder();
    const { isInWishlist, toggleWishlist } = useWishlist();
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
        const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
        const [overIcon, setOverIcon] = useState(false);
        const admin = isAdmin();
        const showCursorHint = isHovered && !overIcon;

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
                    cursor: showCursorHint ? 'none' : 'pointer',
                    position: 'relative',
                    backgroundColor: '#f5f1e8',
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setCursorPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                }}
                onClick={() => navigate(`/products/${product.id}`)}
            >
                {/* Custom cursor-follow "VIEW" hint, replacing the system pointer while hovering -
                    hidden over the icon buttons so the real cursor shows through instead */}
                <Box
                    sx={{
                        position: 'absolute',
                        left: cursorPos.x, top: cursorPos.y,
                        transform: `translate(-50%, -50%) scale(${showCursorHint ? 1 : 0.4})`,
                        opacity: showCursorHint ? 1 : 0,
                        transition: 'opacity 0.2s ease, transform 0.2s ease',
                        pointerEvents: 'none',
                        width: 62, height: 62, borderRadius: '50%',
                        backgroundColor: 'rgba(230, 204, 178, 0.55)',
                        backdropFilter: 'blur(2px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 3,
                    }}
                >
                    <Typography sx={{
                        fontFamily: '"Lato", sans-serif', fontSize: '0.65rem',
                        color: '#2c2c2c', letterSpacing: '0.1em',
                    }}>
                        VIEW
                    </Typography>
                </Box>

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
                        position: 'absolute', top: { xs: 6, sm: 12 }, left: { xs: 6, sm: 12 },
                        background: 'linear-gradient(135deg, #a0453d, #7c332d)',
                        color: '#f5f1e8',
                        padding: { xs: '4px 8px', sm: '8px 14px' }, borderRadius: '20px',
                        display: 'flex', alignItems: 'center', gap: 0.5,
                        boxShadow: '0 3px 10px rgba(124, 51, 45, 0.4)',
                    }}>
                        <LocalOfferIcon sx={{ fontSize: { xs: 11, sm: 14 } }} />
                        <Typography sx={{
                            fontFamily: '"Lato", sans-serif',
                            fontSize: { xs: '0.6rem', sm: '0.75rem' }, fontWeight: 600, letterSpacing: '0.05em',
                        }}>
                            -{discount}%
                        </Typography>
                    </Box>
                )}

                {/* Quick View */}
                <IconButton
                    onMouseEnter={() => setOverIcon(true)}
                    onMouseLeave={() => setOverIcon(false)}
                    sx={{
                        position: 'absolute', bottom: { xs: 6, sm: 12 }, right: { xs: 6, sm: 12 },
                        backgroundColor: 'transparent', width: { xs: 28, sm: 36 }, height: { xs: 28, sm: 36 },
                        cursor: 'pointer',
                        opacity: isHovered ? 1 : 0, transition: 'opacity 0.3s ease',
                        '@media (hover: none)': { opacity: 1 },
                        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
                    }}
                    onClick={(e) => { e.stopPropagation(); setQuickViewProduct(product); }}
                >
                    <VisibilityOutlinedIcon sx={{ fontSize: { xs: 15, sm: 20 }, color: '#ffffff' }} />
                </IconButton>

                {admin ? (
                    <Box
                        onMouseEnter={() => setOverIcon(true)}
                        onMouseLeave={() => setOverIcon(false)}
                        sx={{
                        position: 'absolute', top: { xs: 6, sm: 12 }, right: { xs: 6, sm: 12 },
                        display: 'flex', gap: { xs: 0.5, sm: 1 },
                        cursor: 'pointer',
                        opacity: isHovered ? 1 : 0, transition: 'opacity 0.3s ease',
                        '@media (hover: none)': { opacity: 1 },
                    }}>
                        <IconButton
                            sx={{
                                backgroundColor: 'rgba(255, 255, 255, 0.85)', width: { xs: 28, sm: 38 }, height: { xs: 28, sm: 38 },
                                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' },
                            }}
                            onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
                        >
                            {isInWishlist(product.id)
                                ? <FavoriteIcon sx={{ fontSize: { xs: 14, sm: 19 }, color: '#d32f2f' }} />
                                : <FavoriteBorderIcon sx={{ fontSize: { xs: 14, sm: 19 }, color: '#2c2c2c' }} />}
                        </IconButton>
                        <IconButton
                            sx={{
                                backgroundColor: 'rgba(212, 184, 150, 0.9)', width: { xs: 28, sm: 38 }, height: { xs: 28, sm: 38 },
                                '&:hover': { backgroundColor: 'rgba(196, 168, 134, 1)' },
                            }}
                            onClick={(e) => { e.stopPropagation(); navigate(`/products/${product.id}/edit`); }}
                        >
                            <EditOutlinedIcon sx={{ fontSize: { xs: 14, sm: 19 }, color: '#ffffff' }} />
                        </IconButton>
                        <IconButton
                            sx={{
                                backgroundColor: 'rgba(245, 235, 224, 0.9)', width: { xs: 28, sm: 38 }, height: { xs: 28, sm: 38 },
                                '&:hover': { backgroundColor: 'rgba(239, 154, 154, 0.95)' },
                            }}
                            onClick={(e) => { e.stopPropagation(); handleDelete(product.id, product.name); }}
                        >
                            <DeleteOutlineIcon sx={{ fontSize: { xs: 14, sm: 19 }, color: '#c62828' }} />
                        </IconButton>
                    </Box>
                ) : (
                    <Box
                        onMouseEnter={() => setOverIcon(true)}
                        onMouseLeave={() => setOverIcon(false)}
                        sx={{
                        position: 'absolute', top: { xs: 6, sm: 12 }, right: { xs: 6, sm: 12 },
                        display: 'flex', gap: 0.5,
                        cursor: 'pointer',
                        opacity: isHovered ? 1 : 0, transition: 'opacity 0.3s ease',
                        '@media (hover: none)': { opacity: 1 },
                    }}>
                        <IconButton
                            sx={{
                                backgroundColor: 'transparent', width: { xs: 28, sm: 36 }, height: { xs: 28, sm: 36 },
                                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
                            }}
                            onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
                        >
                            {isInWishlist(product.id)
                                ? <FavoriteIcon sx={{ fontSize: { xs: 15, sm: 20 }, color: '#d32f2f' }} />
                                : <FavoriteBorderIcon sx={{ fontSize: { xs: 15, sm: 20 }, color: '#ffffff' }} />}
                        </IconButton>
                        <IconButton
                            sx={{
                                backgroundColor: 'transparent', width: { xs: 28, sm: 36 }, height: { xs: 28, sm: 36 },
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
                            <ShoppingBagOutlinedIcon sx={{ fontSize: { xs: 15, sm: 20 }, color: '#ffffff' }} />
                        </IconButton>
                    </Box>
                )}

                <Box sx={{
                    position: 'absolute', bottom: { xs: 8, sm: 16 }, left: '50%',
                    transform: { xs: 'translate(-50%, 0)', sm: isHovered ? 'translate(-50%, 0)' : 'translate(-50%, 20px)' },
                    opacity: isHovered ? 1 : 0, transition: 'all 0.4s ease',
                    '@media (hover: none)': { opacity: 1 },
                    backgroundColor: '#f5ebe0', padding: { xs: '6px 10px', sm: '10px 20px' },
                    borderRadius: '4px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                    pointerEvents: 'none', minWidth: { xs: '110px', sm: '160px' },
                    maxWidth: { xs: '90%', sm: 'none' }, textAlign: 'center',
                }}>
                    <Typography sx={{
                        fontFamily: '"Lato", sans-serif', fontSize: { xs: '0.55rem', sm: '0.7rem' },
                        fontWeight: 400, color: 'rgba(44, 44, 44, 0.7)',
                        letterSpacing: '0.05em', mb: 0.5, textTransform: 'uppercase',
                        whiteSpace: { xs: 'nowrap', sm: 'normal' }, overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                        {product.name}
                    </Typography>
                    {discount > 0 ? (
                        <>
                            <Typography sx={{
                                fontFamily: '"Cormorant Garamond", serif', fontSize: { xs: '0.7rem', sm: '0.85rem' },
                                color: '#999', textDecoration: 'line-through', letterSpacing: '0.05em',
                            }}>
                                €{originalPrice.toFixed(0)}
                            </Typography>
                            <Typography sx={{
                                fontFamily: '"Cormorant Garamond", serif', fontSize: { xs: '0.95rem', sm: '1.1rem' },
                                fontWeight: 600, color: '#a0453d', letterSpacing: '0.05em',
                            }}>
                                €{discountedPrice.toFixed(0)}
                            </Typography>
                        </>
                    ) : (
                        <Typography sx={{
                            fontFamily: '"Cormorant Garamond", serif', fontSize: { xs: '0.85rem', sm: '1rem' },
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
            <Box sx={{ backgroundColor: '#f5f1e8', minHeight: '100vh' }}>
                <Container maxWidth="xl" sx={{ pt: 4, pb: 3 }}>
                    <ProductGridSkeleton />
                </Container>
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
                        gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                        gap: { xs: 1.5, sm: 3 },
                    }}>
                        {filteredProducts.map((product, index) => (
                            <Reveal key={product.id} delay={(index % 4) * 0.08}>
                                <ProductCard product={product} />
                            </Reveal>
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

                <RecentlyViewed />
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

            <QuickViewModal
                product={quickViewProduct}
                open={!!quickViewProduct}
                onClose={() => setQuickViewProduct(null)}
                onAddedToCart={(p) => {
                    setSnackbar({ open: true, message: `${p.name} added to cart!`, severity: 'success' });
                    setQuickViewProduct(null);
                }}
            />

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