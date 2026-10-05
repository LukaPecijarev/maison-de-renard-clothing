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
import ConfirmDialog from './ConfirmDialog';
import { adminEditIconButtonSx } from './AdminActionButton';
import useSharedImageReturn from '../hooks/useSharedImageReturn';
import { startProductTransition } from '../utils/sharedImageTransition';
import { isAdminUser } from '../utils/auth';
import { getProductImages, FALLBACK_PRODUCT_IMAGE } from '../utils/productImages';



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

    // Shared-element transition back from ProductDetailsPage: if this is the
    // product that was just open, stay hidden until the hero image has flown
    // back into this card's spot (see utils/sharedImageTransition).
    const { ref: cardRef, hidden: hiddenForTransition } = useSharedImageReturn(product.id, 'grid');

    // Only the grid variant (ProductsPage) coordinates with the global
    // CustomCursor - matches the original ImageWithHover behavior.
    useEffect(() => {
        if (variant !== 'grid') return undefined;
        window.dispatchEvent(new CustomEvent('customCursor:localHint', { detail: { active: showCursorHint } }));
        return () => window.dispatchEvent(new CustomEvent('customCursor:localHint', { detail: { active: false } }));
    }, [variant, showCursorHint]);

    const images = getProductImages(product);
    const defaultImage = images[0] || (variant === 'grid' ? FALLBACK_PRODUCT_IMAGE : '');
    const hoverImage = images[1] || defaultImage;

    const openDetails = () => {
        // Hovering shows the second image - open the details page on that same
        // image so the transition doesn't swap pictures mid-flight.
        const showingHoverImage = isHovered && images.length > 1;
        startProductTransition(product.id, cardRef.current, showingHoverImage ? hoverImage : defaultImage, { source: 'grid' });
        navigate(`/products/${product.id}`, {
            state: { preview: product, imageIndex: showingHoverImage ? 1 : 0 },
        });
    };

    // Only the offers variant (SpecialOffersPage) parses/displays discounts.
    const discount = variant === 'offers' ? (product.discountPercentage || 0) : 0;
    const originalPrice = product.price;
    const discountedPrice = discount > 0 ? originalPrice * (1 - discount / 100) : originalPrice;

    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = (e) => {
        e.stopPropagation();
        setConfirmDeleteOpen(true);
    };

    const confirmDelete = async () => {
        setDeleting(true);
        try {
            await onDelete(product.id);
            onNotify(`${product.name} deleted successfully!`, 'success');
        } catch (error) {
            onNotify(error?.response?.data?.message || 'Failed to delete product', 'error');
        } finally {
            setDeleting(false);
            setConfirmDeleteOpen(false);
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
        <>
            <Box
                ref={cardRef}
                sx={{
                    width: '100%',
                    aspectRatio: '3/4',
                    overflow: 'hidden',
                    cursor: showCursorHint ? 'none' : 'pointer',
                    position: 'relative',
                    backgroundColor: '#f5f1e8',
                    visibility: hiddenForTransition ? 'hidden' : 'visible',
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setCursorPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                }}
                onClick={openDetails}
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
                                aria-label="Edit product"
                                sx={{ ...adminEditIconButtonSx, width: { xs: 28, sm: 36 }, height: { xs: 28, sm: 36 } }}
                                onClick={(e) => { e.stopPropagation(); navigate(`/products/${product.id}/edit`); }}
                            >
                                <EditOutlinedIcon sx={{ fontSize: { xs: 14, sm: 18 } }} />
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
                                aria-label="Toggle wishlist"
                                sx={{
                                    // Same cream as the delete button next to it.
                                    backgroundColor: 'rgba(245, 235, 224, 0.9)', width: { xs: 28, sm: 38 }, height: { xs: 28, sm: 38 },
                                    '&:hover': { backgroundColor: 'rgba(230, 204, 178, 0.95)' },
                                }}
                                onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
                            >
                                {isInWishlist(product.id)
                                    ? <FavoriteIcon sx={{ fontSize: { xs: 14, sm: 19 }, color: '#d32f2f' }} />
                                    : <FavoriteBorderIcon sx={{ fontSize: { xs: 14, sm: 19 }, color: '#2c2c2c' }} />}
                            </IconButton>
                            <IconButton
                                aria-label="Edit product"
                                sx={{ ...adminEditIconButtonSx, width: { xs: 28, sm: 38 }, height: { xs: 28, sm: 38 } }}
                                onClick={(e) => { e.stopPropagation(); navigate(`/products/${product.id}/edit`); }}
                            >
                                <EditOutlinedIcon sx={{ fontSize: { xs: 14, sm: 19 } }} />
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
                    // No minimum on small cards (e.g. 4 per row on a phone) so the label never spills out.
                    minWidth: variant === 'offers' ? { xs: 0, md: '160px' } : { xs: 0, md: '140px' },
                    maxWidth: '90%', textAlign: 'center',
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
            {/* Outside the card's Box on purpose: clicks inside the dialog would
                otherwise bubble (through the portal) to the card and open the product. */}
            <ConfirmDialog
                open={confirmDeleteOpen}
                title="Delete this product?"
                message={`"${product.name}" will be permanently removed from the shop and from any carts or orders it's in.`}
                confirmLabel="Delete"
                onConfirm={confirmDelete}
                onCancel={() => setConfirmDeleteOpen(false)}
                busy={deleting}
            />
        </>
    );
};

export default ProductCard;
