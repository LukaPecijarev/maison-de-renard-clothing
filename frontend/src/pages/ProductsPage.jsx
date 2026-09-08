import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Box, Snackbar, Alert, Fab,
    FormControl, InputLabel, Select, MenuItem, Button, IconButton,
} from '@mui/material';
import ProductGridSkeleton from '../components/ProductGridSkeleton';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import ViewAgendaOutlinedIcon from '@mui/icons-material/ViewAgendaOutlined';
import useProducts from '../hooks/useProducts';
import categoryRepository from '../repository/categoryRepository';
import ProductCard from '../components/ProductCard';
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
    // Mobile-only grid density: 2-per-row (default) or 1-per-row/bigger. Doesn't
    // affect sm/md+ layouts, which always show 4 across regardless.
    const [mobileSingleColumn, setMobileSingleColumn] = useState(false);
    const mobileColumns = mobileSingleColumn ? '1fr' : 'repeat(2, 1fr)';

    // Check if user is admin
    const isAdmin = () => {
        const role = localStorage.getItem('role');
        return role === 'ROLE_ADMIN' || role === 'ADMIN';
    };

    const notify = (message, severity) => setSnackbar({ open: true, message, severity });

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

                    {/* Mobile view-mode toggle: 2-per-row <-> 1-per-row/bigger. Hidden on
                        sm+ where the grid is always 4 across regardless. */}
                    <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'flex-end', mb: 2 }}>
                        <IconButton
                            onClick={() => setMobileSingleColumn((prev) => !prev)}
                            aria-label={mobileSingleColumn ? 'Show 2 products per row' : 'Show 1 product per row'}
                            sx={{ color: '#8b7355', '&:hover': { backgroundColor: 'rgba(212, 184, 150, 0.12)' } }}
                        >
                            {mobileSingleColumn ? <GridViewOutlinedIcon /> : <ViewAgendaOutlinedIcon />}
                        </IconButton>
                    </Box>

                    {/* Products Grid - 2 per row on mobile (toggleable), 4 columns from md up */}
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: mobileColumns, md: 'repeat(4, 1fr)' },
                            gap: { xs: 1.5, sm: 3 },
                            mb: 6,
                        }}
                    >
                        {filteredProducts.slice(0, 4).map((product, index) => (
                            <Reveal key={product.id} delay={index * 0.08}>
                                <ProductCard
                                    product={product}
                                    variant="grid"
                                    onQuickView={setQuickViewProduct}
                                    onDelete={onDelete}
                                    onNotify={notify}
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
                                gridTemplateColumns: { xs: mobileColumns, md: 'repeat(4, 1fr)' },
                                gap: 3,
                            }}
                        >
                            {filteredProducts.slice(4).map((product, index) => (
                                <Reveal key={product.id} delay={(index % 4) * 0.08}>
                                    <ProductCard
                                        product={product}
                                        variant="grid"
                                        onQuickView={setQuickViewProduct}
                                        onDelete={onDelete}
                                        onNotify={notify}
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