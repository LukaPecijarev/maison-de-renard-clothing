import React, { useEffect, useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import useAuth from '../hooks/useAuth';
import useOrder from '../hooks/useOrder';
import useWishlist from '../hooks/useWishlist';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500';

const isAdminUser = () => {
    const role = localStorage.getItem('role');
    return role === 'ROLE_ADMIN' || role === 'ADMIN';
};

// Shared product tile used by ProductsPage ("grid" variant) and SpecialOffersPage
// ("offers" variant) - the two pages rendered near-identical hover cards
// independently, so this consolidates them while keeping each page's exact
// existing layout/behavior via the `variant` prop.
const ProductCard = ({ product, variant = 'grid', onQuickView, onDelete, onNotify }) => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { addToCart } = useOrder();
    const { isInWishlist, toggleWishlist } = useWishlist();

    const [isHovered, setIsHovered] = useState(false);
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const [overIcon, setOverIcon] = useState(false);
    const admin = isAdminUser();
    const showCursorHint = isHovered && !overIcon;

    // Only the grid variant (ProductsPage) coordinates with the global
    // CustomCursor - matches the original ImageWithHover behavior.
    useEffect(() => {
        if (variant !== 'grid') return undefined;
        window.dispatchEvent(new CustomEvent('customCursor:localHint', { detail: { active: showCursorHint } }));
        return () => window.dispatchEvent(new CustomEvent('customCursor:localHint', { detail: { active: false } }));
    }, [variant, showCursorHint]);

    const images = product.imageUrl ? product.imageUrl.split(',').map((url) => url.trim()) : [];
    const defaultImage = images[0] || (variant === 'grid' ? FALLBACK_IMAGE : '');
    const hoverImage = images[1] || defaultImage;

    // Only the offers variant (SpecialOffersPage) parses/displays discounts.
    const discountMatch = variant === 'offers' ? product.description?.match(/DISCOUNT:(\d+)/) : null;
    const discount = discountMatch ? parseInt(discountMatch[1]) : 0;
    const originalPrice = product.price;
    const discountedPrice = discount > 0 ? originalPrice * (1 - discount / 100) : originalPrice;

    const handleDelete = async (e) => {
        e.stopPropagation();
        if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
            try {
                await onDelete(product.id);
                onNotify(`${product.name} deleted successfully!`, 'success');
            } catch (error) {
                onNotify('Failed to delete product', 'error');
            }
        }
    };

    const handleAddToCart = async (e) => {
        e.stopPropagation();
        if (!isAuthenticated()) {
            onNotify('Please login to add items to cart', 'warning');
            setTimeout(() => navigate('/login'), 1500);
            return;
        }
        const success = await addToCart(product.id);
        if (success) {
            onNotify(`${product.name} added to cart!`, 'success');
        } else {
            onNotify('Failed to add item to cart', 'error');
        }
    };

    const iconHoverProps = {
        onMouseEnter: () => setOverIcon(true),
        onMouseLeave: () => setOverIcon(false),
    };

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

            {variant === 'offers' && discount > 0 && (
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

            {variant === 'grid' && (
                <IconButton
                    {...iconHoverProps}
                    sx={{
                        position: 'absolute', top: { xs: 6, sm: 12 }, left: { xs: 6, sm: 12 },
                        backgroundColor: 'transparent', width: { xs: 28, sm: 36 }, height: { xs: 28, sm: 36 },
                        cursor: 'pointer',
                        opacity: isHovered ? 1 : 0, transition: 'opacity 0.3s ease',
                        '@media (hover: none)': { opacity: 1 },
                        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
                    }}
                    onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
                >
                    {isInWishlist(product.id)
                        ? <FavoriteIcon sx={{ fontSize: { xs: 15, sm: 20 }, color: '#d32f2f' }} />
                        : <FavoriteBorderIcon sx={{ fontSize: { xs: 15, sm: 20 }, color: '#ffffff' }} />}
                </IconButton>
            )}

            {/* Quick View */}
            <IconButton
                {...iconHoverProps}
                sx={{
                    position: 'absolute', bottom: { xs: 6, sm: 12 }, right: { xs: 6, sm: 12 },
                    backgroundColor: 'transparent', width: { xs: 28, sm: 36 }, height: { xs: 28, sm: 36 },
                    cursor: 'pointer',
                    opacity: isHovered ? 1 : 0, transition: 'opacity 0.3s ease',
                    '@media (hover: none)': { opacity: 1 },
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
                }}
                onClick={(e) => { e.stopPropagation(); onQuickView(product); }}
            >
                <VisibilityOutlinedIcon sx={{ fontSize: { xs: 15, sm: 20 }, color: '#ffffff' }} />
            </IconButton>

            {variant === 'grid' ? (
                admin ? (
                    <Box {...iconHoverProps} sx={{
                        position: 'absolute', top: { xs: 6, sm: 12 }, right: { xs: 6, sm: 12 },
                        display: 'flex', gap: 1,
                        cursor: 'pointer',
                        opacity: isHovered ? 1 : 0, transition: 'opacity 0.3s ease',
                        '@media (hover: none)': { opacity: 1 },
                    }}>
                        <IconButton
                            sx={{
                                backgroundColor: 'rgba(245, 235, 224, 0.95)', width: { xs: 28, sm: 36 }, height: { xs: 28, sm: 36 },
                                '&:hover': { backgroundColor: 'rgba(230, 204, 178, 0.95)' },
                            }}
                            onClick={(e) => { e.stopPropagation(); navigate(`/products/${product.id}/edit`); }}
                        >
                            <EditOutlinedIcon sx={{ fontSize: { xs: 14, sm: 18 }, color: '#2c2c2c' }} />
                        </IconButton>
                        <IconButton
                            sx={{
                                backgroundColor: 'rgba(245, 235, 224, 0.95)', width: { xs: 28, sm: 36 }, height: { xs: 28, sm: 36 },
                                '&:hover': { backgroundColor: 'rgba(244, 143, 177, 0.95)' },
                            }}
                            onClick={handleDelete}
                        >
                            <DeleteOutlineIcon sx={{ fontSize: { xs: 14, sm: 18 }, color: '#d32f2f' }} />
                        </IconButton>
                    </Box>
                ) : (
                    <IconButton
                        {...iconHoverProps}
                        sx={{
                            position: 'absolute', top: { xs: 6, sm: 12 }, right: { xs: 6, sm: 12 },
                            backgroundColor: 'transparent', width: { xs: 28, sm: 36 }, height: { xs: 28, sm: 36 },
                            cursor: 'pointer',
                            opacity: isHovered ? 1 : 0, transition: 'opacity 0.3s ease',
                            '@media (hover: none)': { opacity: 1 },
                            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
                        }}
                        onClick={handleAddToCart}
                    >
                        <ShoppingBagOutlinedIcon sx={{ fontSize: { xs: 15, sm: 20 }, color: '#ffffff' }} />
                    </IconButton>
                )
            ) : (
                admin ? (
                    <Box {...iconHoverProps} sx={{
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
                            onClick={handleDelete}
                        >
                            <DeleteOutlineIcon sx={{ fontSize: { xs: 14, sm: 19 }, color: '#c62828' }} />
                        </IconButton>
                    </Box>
                ) : (
                    <Box {...iconHoverProps} sx={{
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
                            onClick={handleAddToCart}
                        >
                            <ShoppingBagOutlinedIcon sx={{ fontSize: { xs: 15, sm: 20 }, color: '#ffffff' }} />
                        </IconButton>
                    </Box>
                )
            )}

            <Box sx={{
                position: 'absolute',
                bottom: { xs: 8, sm: 16 }, left: '50%',
                transform: { xs: 'translate(-50%, 0)', sm: isHovered ? 'translate(-50%, 0)' : 'translate(-50%, 20px)' },
                opacity: isHovered ? 1 : 0, transition: 'all 0.4s ease',
                '@media (hover: none)': { opacity: 1 },
                backgroundColor: '#f5ebe0',
                padding: variant === 'offers' ? { xs: '6px 10px', sm: '10px 20px' } : { xs: '5px 10px', sm: '8px 20px' },
                borderRadius: '4px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                pointerEvents: 'none',
                minWidth: variant === 'offers' ? { xs: '110px', sm: '160px' } : { xs: '100px', sm: '140px' },
                maxWidth: { xs: '90%', sm: 'none' }, textAlign: 'center',
            }}>
                <Typography sx={{
                    fontFamily: '"Lato", sans-serif', fontSize: { xs: '0.55rem', sm: '0.7rem' },
                    fontWeight: 400, color: 'rgba(44, 44, 44, 0.7)',
                    letterSpacing: '0.05em', mb: variant === 'offers' ? 0.5 : 0.3, textTransform: 'uppercase',
                    whiteSpace: { xs: 'nowrap', sm: 'normal' }, overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                    {product.name}
                </Typography>
                {variant === 'offers' && discount > 0 ? (
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

export default ProductCard;
