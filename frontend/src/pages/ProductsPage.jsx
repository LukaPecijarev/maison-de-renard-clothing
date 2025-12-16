import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, IconButton, CircularProgress, Snackbar, Alert, Fab } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import useProducts from '../hooks/useProducts';
import useOrder from '../hooks/useOrder';
import useAuth from '../hooks/useAuth';
import categoryRepository from '../repository/categoryRepository';

const ProductsPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const categoryParam = searchParams.get('category');
    const seasonParam = searchParams.get('season'); // ✅ Add season parameter
    const searchQuery = searchParams.get('search') || ''; // ✅ Get search query from URL
    const [selectedCategory, setSelectedCategory] = useState(categoryParam ? parseInt(categoryParam) : null);
    const [categoryData, setCategoryData] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const { isAuthenticated } = useAuth();
    const { addToCart } = useOrder();

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
                name: 'Fall/Winter 2025-2026',
                description: 'Discover our latest Fall/Winter collection featuring timeless pieces crafted from the finest materials.'
            });
        }
    }, [categoryParam, seasonParam]);

    const { products, loading, onDelete } = useProducts(selectedCategory);

    // ✅ Filter products by search query
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
        const admin = isAdmin();

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
                    cursor: 'pointer',
                    position: 'relative',
                    backgroundColor: '#f5f1e8',
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={onClick}
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

                {/* Admin Controls - Edit and Delete */}
                {admin ? (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            display: 'flex',
                            gap: 1,
                            opacity: isHovered ? 1 : 0,
                            transition: 'opacity 0.3s ease',
                        }}
                    >
                        {/* Edit Button */}
                        <IconButton
                            sx={{
                                backgroundColor: 'rgba(245, 235, 224, 0.95)',
                                width: 36,
                                height: 36,
                                '&:hover': {
                                    backgroundColor: 'rgba(230, 204, 178, 0.95)',
                                },
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/products/${product.id}/edit`);
                            }}
                        >
                            <EditOutlinedIcon sx={{ fontSize: 18, color: '#2c2c2c' }} />
                        </IconButton>

                        {/* Delete Button */}
                        <IconButton
                            sx={{
                                backgroundColor: 'rgba(245, 235, 224, 0.95)',
                                width: 36,
                                height: 36,
                                '&:hover': {
                                    backgroundColor: 'rgba(244, 143, 177, 0.95)',
                                },
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(product.id, product.name);
                            }}
                        >
                            <DeleteOutlineIcon sx={{ fontSize: 18, color: '#d32f2f' }} />
                        </IconButton>
                    </Box>
                ) : (
                    /* Customer Shopping Bag Icon */
                    <IconButton
                        sx={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            backgroundColor: 'transparent',
                            width: 36,
                            height: 36,
                            opacity: isHovered ? 1 : 0,
                            transition: 'opacity 0.3s ease',
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
                        <ShoppingBagOutlinedIcon sx={{ fontSize: 20, color: '#ffffff' }} />
                    </IconButton>
                )}

                {/* Price Popup - Shows on Hover */}
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 16,
                        left: '50%',
                        transform: isHovered ? 'translate(-50%, 0)' : 'translate(-50%, 20px)',
                        opacity: isHovered ? 1 : 0,
                        transition: 'all 0.4s ease',
                        backgroundColor: '#f5ebe0',
                        padding: '8px 20px',
                        borderRadius: '4px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                        pointerEvents: 'none',
                        minWidth: '140px',
                        textAlign: 'center',
                    }}
                >
                    <Typography
                        sx={{
                            fontFamily: '"Lato", sans-serif',
                            fontSize: '0.7rem',
                            fontWeight: 400,
                            color: 'rgba(44, 44, 44, 0.7)',
                            letterSpacing: '0.05em',
                            mb: 0.3,
                            textTransform: 'uppercase',
                        }}
                    >
                        {product.name}
                    </Typography>
                    <Typography
                        sx={{
                            fontFamily: '"Cormorant Garamond", serif',
                            fontSize: '1rem',
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
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', backgroundColor: '#f5f1e8' }}>
                <CircularProgress sx={{ color: '#2c2c2c' }} />
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

                    {/* Category Description */}
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

                    {/* Products Grid - 4 columns */}
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                            gap: 3,
                            mb: 6,
                        }}
                    >
                        {filteredProducts.slice(0, 4).map((product) => (
                            <ImageWithHover
                                key={product.id}
                                product={product}
                                onClick={() => navigate(`/products/${product.id}`)}
                            />
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
                            {filteredProducts.slice(4).map((product) => (
                                <ImageWithHover
                                    key={product.id}
                                    product={product}
                                    onClick={() => navigate(`/products/${product.id}`)}
                                />
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
            </Container>

            {/* Floating Add Product Button - Admin Only */}
            {isAdmin() && (
                <Fab
                    color="primary"
                    aria-label="add product"
                    sx={{
                        position: 'fixed',
                        bottom: 32,
                        right: 32,
                        backgroundColor: '#d4b896',
                        color: '#2c2c2c',
                        width: 64,
                        height: 64,
                        '&:hover': {
                            backgroundColor: '#c4a886',
                        },
                    }}
                    onClick={() => navigate('/products/add')}
                >
                    <AddIcon sx={{ fontSize: 32 }} />
                </Fab>
            )}

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