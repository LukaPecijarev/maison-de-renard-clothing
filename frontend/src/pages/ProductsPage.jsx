import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Box, IconButton, Snackbar, Alert, Fab,
    FormControl, InputLabel, Select, MenuItem, Button,
} from '@mui/material';
import ProductGridSkeleton from '../components/ProductGridSkeleton';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import useProducts from '../hooks/useProducts';
import useOrder from '../hooks/useOrder';
import useAuth from '../hooks/useAuth';
import useWishlist from '../hooks/useWishlist';
import categoryRepository from '../repository/categoryRepository';
import QuickViewModal from '../components/QuickViewModal';
import Reveal from '../components/Reveal';
import RecentlyViewed from '../components/RecentlyViewed';

const ProductsPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const categoryParam = searchParams.get('category');
    const seasonParam = searchParams.get('season'); // ✅ Add season parameter
    const searchQuery = searchParams.get('search') || ''; // ✅ Get search query from URL
    const [selectedCategory, setSelectedCategory] = useState(categoryParam ? parseInt(categoryParam) : null);
    const [categoryData, setCategoryData] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [quickViewProduct, setQuickViewProduct] = useState(null);
    const [sortBy, setSortBy] = useState('default');
    const [filterColor, setFilterColor] = useState('');
    const [filterMaterial, setFilterMaterial] = useState('');

    const { isAuthenticated } = useAuth();
    const { addToCart } = useOrder();
    const { isInWishlist, toggleWishlist } = useWishlist();

    // Check if user is admin
    const isAdmin = () => {
        const role = localStorage.getItem('role');
        return role === 'ROLE_ADMIN' || role === 'ADMIN';
    };

    // Update selected category when URL changes
    useEffect(() => {
        setSelectedCategory(categoryParam ? parseInt(categoryParam) : null);

        // Fetch category details only if category parameter exists
        if (categoryParam) {
            categoryRepository.findById(categoryParam)
                .then(response => setCategoryData(response.data))
                .catch(error => console.error('Error fetching category:', error));
        } else if (seasonParam) {
            // Set default category data for season
            setCategoryData({
                name: 'Fall/Winter 2026/2027',
                description: 'Discover our latest Fall/Winter collection featuring timeless pieces crafted from the finest materials.'
            });
        }
    }, [categoryParam, seasonParam]);

    const { products, loading, onDelete } = useProducts(selectedCategory);

    // Distinct filter options, derived from whatever is actually in this category
    const uniqueColors = [...new Set(products.map((p) => p.color).filter(Boolean))].sort();
    const uniqueMaterials = [...new Set(products.map((p) => p.material).filter(Boolean))].sort();

    // ✅ Filter products by search query, color and material
    let filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (filterColor) filteredProducts = filteredProducts.filter((p) => p.color === filterColor);
    if (filterMaterial) filteredProducts = filteredProducts.filter((p) => p.material === filterMaterial);
    if (sortBy === 'price-asc') filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);

    const hasActiveFilters = sortBy !== 'default' || filterColor || filterMaterial;
    const clearFilters = () => {
        setSortBy('default');
        setFilterColor('');
        setFilterMaterial('');
    };

    const filterFieldSx = {
        minWidth: 160,
        '& .MuiOutlinedInput-root': {
            fontFamily: '"Lato", sans-serif', fontSize: '0.85rem',
            borderRadius: '6px',
            backgroundColor: '#faf5ea',
            transition: 'background-color 0.25s ease',
            '& fieldset': { borderColor: 'rgba(212, 184, 150, 0.4)' },
            '&:hover': { backgroundColor: '#f5ebe0' },
            '&:hover fieldset': { borderColor: '#d4b896' },
            '&.Mui-focused': { backgroundColor: '#f5ebe0' },
            '&.Mui-focused fieldset': { borderColor: '#c4a886', borderWidth: '1px' },
        },
        '& .MuiInputLabel-root': { fontFamily: '"Lato", sans-serif', fontSize: '0.85rem' },
        '& .MuiInputLabel-root.Mui-focused': { color: '#8b7355' },
        '& .MuiSvgIcon-root': { color: '#8b7355' },
    };

    const filterMenuProps = {
        PaperProps: {
            sx: {
                mt: 0.5,
                backgroundColor: '#faf5ea',
                border: '1px solid rgba(212, 184, 150, 0.35)',
                borderRadius: '6px',
                boxShadow: '0 10px 28px rgba(44, 44, 44, 0.14)',
                '& .MuiMenuItem-root': {
                    fontFamily: '"Lato", sans-serif',
                    fontSize: '0.85rem',
                    color: '#2c2c2c',
                    '&:hover': { backgroundColor: 'rgba(212, 184, 150, 0.15)' },
                    '&.Mui-selected': {
                        backgroundColor: 'rgba(212, 184, 150, 0.25)',
                        '&:hover': { backgroundColor: 'rgba(212, 184, 150, 0.32)' },
                    },
                },
            },
        },
    };

    // Get category-specific video
    const getCategoryVideo = () => {
        if (!categoryData) return null;

        const categoryName = categoryData.name;
        if (categoryName === 'Men') return '/ManVideo.mp4';
        if (categoryName === 'Women') return '/WomenVideo.mp4';
        if (categoryName === 'Gifts') return '/GiftsVideo.mp4';
        return null;
    };

    const handleDelete = async (productId, productName) => {
        if (window.confirm(`Are you sure you want to delete "${productName}"?`)) {
            try {
                await onDelete(productId);
                setSnackbar({
                    open: true,
                    message: `${productName} deleted successfully!`,
                    severity: 'success',
                });
            } catch (error) {
                setSnackbar({
                    open: true,
                    message: 'Failed to delete product',
                    severity: 'error',
                });
            }
        }
    };

    // Component for image with hover effect
    const ImageWithHover = ({ product, onClick }) => {
        const [isHovered, setIsHovered] = useState(false);
        const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
        const [overIcon, setOverIcon] = useState(false);
        const admin = isAdmin();
        const showCursorHint = isHovered && !overIcon;

        // Tell the global CustomCursor to stand down while this tile's own
        // VIEW bubble is showing, so the two don't draw on top of each other.
        useEffect(() => {
            window.dispatchEvent(new CustomEvent('customCursor:localHint', { detail: { active: showCursorHint } }));
            return () => window.dispatchEvent(new CustomEvent('customCursor:localHint', { detail: { active: false } }));
        }, [showCursorHint]);

        // Parse imageUrl - should be in format: "url1,url2" or just "url1"
        const images = product.imageUrl ? product.imageUrl.split(',').map(url => url.trim()) : [];
        const defaultImage = images[0] || 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500';
        const hoverImage = images[1] || defaultImage;

        // Format price in euros
        const formattedPrice = `€${product.price.toFixed(0)}`;

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
                onClick={onClick}
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

                {/* Wishlist Toggle */}
                <IconButton
                    onMouseEnter={() => setOverIcon(true)}
                    onMouseLeave={() => setOverIcon(false)}
                    sx={{
                        position: 'absolute',
                        top: { xs: 6, sm: 12 },
                        left: { xs: 6, sm: 12 },
                        backgroundColor: 'transparent',
                        width: { xs: 28, sm: 36 },
                        height: { xs: 28, sm: 36 },
                        cursor: 'pointer',
                        opacity: isHovered ? 1 : 0,
                        transition: 'opacity 0.3s ease',
                        '@media (hover: none)': { opacity: 1 },
                        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product);
                    }}
                >
                    {isInWishlist(product.id)
                        ? <FavoriteIcon sx={{ fontSize: { xs: 15, sm: 20 }, color: '#d32f2f' }} />
                        : <FavoriteBorderIcon sx={{ fontSize: { xs: 15, sm: 20 }, color: '#ffffff' }} />}
                </IconButton>

                {/* Quick View */}
                <IconButton
                    onMouseEnter={() => setOverIcon(true)}
                    onMouseLeave={() => setOverIcon(false)}
                    sx={{
                        position: 'absolute',
                        bottom: { xs: 6, sm: 12 },
                        right: { xs: 6, sm: 12 },
                        backgroundColor: 'transparent',
                        width: { xs: 28, sm: 36 },
                        height: { xs: 28, sm: 36 },
                        cursor: 'pointer',
                        opacity: isHovered ? 1 : 0,
                        transition: 'opacity 0.3s ease',
                        '@media (hover: none)': { opacity: 1 },
                        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        setQuickViewProduct(product);
                    }}
                >
                    <VisibilityOutlinedIcon sx={{ fontSize: { xs: 15, sm: 20 }, color: '#ffffff' }} />
                </IconButton>

                {/* Admin Controls - Edit and Delete */}
                {admin ? (
                    <Box
                        onMouseEnter={() => setOverIcon(true)}
                        onMouseLeave={() => setOverIcon(false)}
                        sx={{
                            position: 'absolute',
                            top: { xs: 6, sm: 12 },
                            right: { xs: 6, sm: 12 },
                            display: 'flex',
                            gap: 1,
                            cursor: 'pointer',
                            opacity: isHovered ? 1 : 0,
                            transition: 'opacity 0.3s ease',
                            '@media (hover: none)': { opacity: 1 },
                        }}
                    >
                        {/* Edit Button */}
                        <IconButton
                            sx={{
                                backgroundColor: 'rgba(245, 235, 224, 0.95)',
                                width: { xs: 28, sm: 36 },
                                height: { xs: 28, sm: 36 },
                                '&:hover': {
                                    backgroundColor: 'rgba(230, 204, 178, 0.95)',
                                },
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/products/${product.id}/edit`);
                            }}
                        >
                            <EditOutlinedIcon sx={{ fontSize: { xs: 14, sm: 18 }, color: '#2c2c2c' }} />
                        </IconButton>

                        {/* Delete Button */}
                        <IconButton
                            sx={{
                                backgroundColor: 'rgba(245, 235, 224, 0.95)',
                                width: { xs: 28, sm: 36 },
                                height: { xs: 28, sm: 36 },
                                '&:hover': {
                                    backgroundColor: 'rgba(244, 143, 177, 0.95)',
                                },
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(product.id, product.name);
                            }}
                        >
                            <DeleteOutlineIcon sx={{ fontSize: { xs: 14, sm: 18 }, color: '#d32f2f' }} />
                        </IconButton>
                    </Box>
                ) : (
                    /* Customer Shopping Bag Icon */
                    <IconButton
                        onMouseEnter={() => setOverIcon(true)}
                        onMouseLeave={() => setOverIcon(false)}
                        sx={{
                            position: 'absolute',
                            top: { xs: 6, sm: 12 },
                            right: { xs: 6, sm: 12 },
                            backgroundColor: 'transparent',
                            width: { xs: 28, sm: 36 },
                            height: { xs: 28, sm: 36 },
                            cursor: 'pointer',
                            opacity: isHovered ? 1 : 0,
                            transition: 'opacity 0.3s ease',
                            '@media (hover: none)': { opacity: 1 },
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
                        <ShoppingBagOutlinedIcon sx={{ fontSize: { xs: 15, sm: 20 }, color: '#ffffff' }} />
                    </IconButton>
                )}

                {/* Price Popup - Shows on Hover */}
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: { xs: 8, sm: 16 },
                        left: '50%',
                        transform: { xs: 'translate(-50%, 0)', sm: isHovered ? 'translate(-50%, 0)' : 'translate(-50%, 20px)' },
                        opacity: isHovered ? 1 : 0,
                        transition: 'all 0.4s ease',
                        '@media (hover: none)': { opacity: 1 },
                        backgroundColor: '#f5ebe0',
                        padding: { xs: '5px 10px', sm: '8px 20px' },
                        borderRadius: '4px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                        pointerEvents: 'none',
                        minWidth: { xs: '100px', sm: '140px' },
                        maxWidth: { xs: '90%', sm: 'none' },
                        textAlign: 'center',
                    }}
                >
                    <Typography
                        sx={{
                            fontFamily: '"Lato", sans-serif',
                            fontSize: { xs: '0.55rem', sm: '0.7rem' },
                            fontWeight: 400,
                            color: 'rgba(44, 44, 44, 0.7)',
                            letterSpacing: '0.05em',
                            mb: 0.3,
                            textTransform: 'uppercase',
                            whiteSpace: { xs: 'nowrap', sm: 'normal' },
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}
                    >
                        {product.name}
                    </Typography>
                    <Typography
                        sx={{
                            fontFamily: '"Cormorant Garamond", serif',
                            fontSize: { xs: '0.85rem', sm: '1rem' },
                            fontWeight: 500,
                            color: '#2c2c2c',
                            letterSpacing: '0.05em',
                        }}
                    >
                        {formattedPrice}
                    </Typography>
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
                {/* Category Section */}
                <Box sx={{ mb: 6 }}>
                    {/* Category Title */}
                    <Typography
                        variant="h3"
                        align="center"
                        sx={{
                            fontFamily: '"Cormorant Garamond", serif',
                            fontWeight: 300,
                            letterSpacing: '0.1em',
                            mb: 2,
                        }}
                    >
                        {searchQuery ? `Search Results for "${searchQuery}"` : (categoryData?.name || 'Products')}
                    </Typography>

                    {/* Category Description right bellow the title for category */}
                    {categoryData?.description && !searchQuery && (
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
                            {categoryData.description}
                        </Typography>
                    )}

                    {/* Filter & Sort Bar */}
                    <Box sx={{
                        display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
                        alignItems: 'center', gap: 2, mb: 5,
                    }}>
                        <FormControl size="small" sx={filterFieldSx}>
                            <InputLabel>Sort By</InputLabel>
                            <Select value={sortBy} label="Sort By" onChange={(e) => setSortBy(e.target.value)} MenuProps={filterMenuProps}>
                                <MenuItem value="default">Featured</MenuItem>
                                <MenuItem value="price-asc">Price: Low to High</MenuItem>
                                <MenuItem value="price-desc">Price: High to Low</MenuItem>
                            </Select>
                        </FormControl>

                        {uniqueColors.length > 0 && (
                            <FormControl size="small" sx={filterFieldSx}>
                                <InputLabel>Color</InputLabel>
                                <Select value={filterColor} label="Color" onChange={(e) => setFilterColor(e.target.value)} MenuProps={filterMenuProps}>
                                    <MenuItem value="">All Colors</MenuItem>
                                    {uniqueColors.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                                </Select>
                            </FormControl>
                        )}

                        {uniqueMaterials.length > 0 && (
                            <FormControl size="small" sx={filterFieldSx}>
                                <InputLabel>Material</InputLabel>
                                <Select value={filterMaterial} label="Material" onChange={(e) => setFilterMaterial(e.target.value)} MenuProps={filterMenuProps}>
                                    <MenuItem value="">All Materials</MenuItem>
                                    {uniqueMaterials.map((m) => <MenuItem key={m} value={m}>{m}</MenuItem>)}
                                </Select>
                            </FormControl>
                        )}

                        {hasActiveFilters && (
                            <Button onClick={clearFilters} sx={{
                                color: '#8b7355', fontSize: '0.8rem', letterSpacing: '0.05em',
                                fontFamily: '"Lato", sans-serif',
                                '&:hover': { backgroundColor: 'rgba(212, 184, 150, 0.08)' },
                            }}>
                                Clear Filters
                            </Button>
                        )}
                    </Box>

                    {/* Products Grid - 4 columns */}
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                            gap: { xs: 1.5, sm: 3 },
                            mb: 6,
                        }}
                    >
                        {filteredProducts.slice(0, 4).map((product, index) => (
                            <Reveal key={product.id} delay={index * 0.08}>
                                <ImageWithHover
                                    product={product}
                                    onClick={() => navigate(`/products/${product.id}`)}
                                />
                            </Reveal>
                        ))}
                    </Box>

                    {/* Mid-Section Video - Only show if NOT searching and has enough products */}
                    {!searchQuery && filteredProducts.length > 4 && getCategoryVideo() && (
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '100%',
                                height: '80vh',
                                mb: 6,
                                overflow: 'hidden',
                                backgroundColor: '#f5f1e8',
                            }}
                        >
                            <video
                                autoPlay
                                loop
                                muted
                                playsInline
                                style={{
                                    width: '60%',
                                    height: 'auto',
                                    maxHeight: '100%',
                                    objectFit: 'cover',
                                }}
                            >
                                <source src={getCategoryVideo()} type="video/mp4" />
                            </video>
                        </Box>
                    )}

                    {/* Remaining Products Grid */}
                    {filteredProducts.length > 4 && (
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                                gap: 3,
                            }}
                        >
                            {filteredProducts.slice(4).map((product, index) => (
                                <Reveal key={product.id} delay={(index % 4) * 0.08}>
                                    <ImageWithHover
                                        product={product}
                                        onClick={() => navigate(`/products/${product.id}`)}
                                    />
                                </Reveal>
                            ))}
                        </Box>
                    )}

                    {/* No products message */}
                    {filteredProducts.length === 0 && (
                        <Typography
                            variant="h6"
                            align="center"
                            sx={{
                                color: '#666',
                                mt: 8,
                            }}
                        >
                            {searchQuery
                                ? `No products found matching "${searchQuery}"`
                                : 'No products found in this category'
                            }
                        </Typography>
                    )}
                </Box>

                {/* Recently Viewed */}
                <RecentlyViewed />
            </Container>

            {/* Floating Add Product Button - Admin Only */}
            {isAdmin() && (
                <Fab
                    color="primary"
                    aria-label="add product"
                    sx={{
                        position: 'fixed',
                        bottom: 27,
                        left: 32,
                        backgroundColor: '#d4b896',
                        color: '#2c2c2c',
                        width: 64,
                        height: 64,
                        boxShadow: 'none',
                        '&:hover': {
                            backgroundColor: '#c4a886',
                            boxShadow: 'none',
                        },
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

export default ProductsPage;