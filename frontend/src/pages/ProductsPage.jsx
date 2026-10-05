import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Box, Button,
} from '@mui/material';
import { keyframes } from '@mui/material/styles';
import ProductGridSkeleton from '../components/ProductGridSkeleton';
import { useNavigate, useSearchParams, useLocation, useNavigationType } from 'react-router-dom';
import { AddProductFab } from '../components/AdminActionButton';
import useProducts from '../hooks/useProducts';
import categoryRepository from '../repository/categoryRepository';
import apiCache from '../utils/apiCache';
import { materialFamilies, colorFamilies, materialOptions, colorOptions, COLOR_SWATCHES } from '../utils/productFacets';
import FilterSelect from '../components/FilterSelect';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import Reveal from '../components/Reveal';
import { hasBackTransition } from '../utils/sharedImageTransition';
import RecentlyViewed from '../components/RecentlyViewed';
import { isAdminUser } from '../utils/auth';
import { prefersReducedMotion } from '../utils/motion';
import AppSnackbar from '../components/AppSnackbar';
import useGridView from '../hooks/useGridView';
import GridViewToggle from '../components/GridViewToggle';

// Category switch (e.g. Men -> Women from the nav): the old grid fades out, the
// new one is swapped in while invisible, then fades/slides in.
const CATEGORY_FADE_OUT_MS = 250;
const categoryFadeIn = keyframes`
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: none; }
`;
const SEASON_CATEGORY_DATA = {
    name: 'Fall/Winter 2026/2027',
    description: 'Discover our latest Fall/Winter collection featuring timeless pieces crafted from the finest materials.'
};
// Title/description for a category, as far as it's known without a request.
const knownCategoryData = ({ category, season }) => {
    if (category) return apiCache.getFresh(`categories:byId:${category}`, 5 * 60_000) || null;
    return season ? SEASON_CATEGORY_DATA : null;
};

const ProductsPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const categoryParam = searchParams.get('category');
    const seasonParam = searchParams.get('season'); // ✅ Add season parameter
    const searchQuery = searchParams.get('search') || ''; // ✅ Get search query from URL
    const location = useLocation();
    const navigationType = useNavigationType();

    // "Shop Now" (and similar buttons) land here from far down another page;
    // glide up to the top instead of opening wherever that page was scrolled.
    useEffect(() => {
        if (navigationType !== 'POP' && location.state?.smoothScrollTop && window.scrollY > 0) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        // only on arrival
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.key]);

    // The category actually on screen. It lags the URL by the fade-out when
    // switching categories, so the old grid can fade out before it's replaced.
    const urlCategoryKey = `${categoryParam || ''}|${seasonParam || ''}`;
    const [shownCategory, setShownCategory] = useState({ key: urlCategoryKey, category: categoryParam, season: seasonParam });
    const [categoryFadingOut, setCategoryFadingOut] = useState(false);
    const [hasSwitchedCategory, setHasSwitchedCategory] = useState(false); // no fade-in on first load / coming back from a product

    useEffect(() => {
        if (urlCategoryKey === shownCategory.key) return undefined;
        const next = { key: urlCategoryKey, category: categoryParam, season: seasonParam };
        // Swap the category and its title in one update, so the new content never
        // renders - even for a frame - with the previous category's title.
        // Color/material options differ per category - a filter kept from the
        // previous one could leave an empty grid with nothing visibly selected.
        const swap = () => {
            setShownCategory(next);
            setCategoryData(knownCategoryData(next));
            setFilterColor('');
            setFilterMaterial('');
        };
        if (prefersReducedMotion()) {
            swap();
            return undefined;
        }
        setCategoryFadingOut(true);
        const timer = setTimeout(() => {
            setHasSwitchedCategory(true);
            swap();
            setCategoryFadingOut(false);
        }, CATEGORY_FADE_OUT_MS);
        return () => clearTimeout(timer);
    }, [urlCategoryKey, shownCategory.key, categoryParam, seasonParam]);

    // Applied to the page content (not the outer Box, whose fixed-position Fab a
    // transform would break). Keyed by category so a switch remounts it and the
    // fade-in plays.
    const categoryTransitionSx = {
        opacity: categoryFadingOut ? 0 : 1,
        transform: categoryFadingOut ? 'translateY(8px)' : 'none',
        transition: `opacity ${CATEGORY_FADE_OUT_MS}ms ease, transform ${CATEGORY_FADE_OUT_MS}ms ease`,
        animation: hasSwitchedCategory ? `${categoryFadeIn} 0.45s cubic-bezier(0.25, 0.8, 0.25, 1)` : 'none',
    };
    const selectedCategory = shownCategory.category ? parseInt(shownCategory.category) : null;
    // Seeded from cache so returning to a category (e.g. back from a product)
    // renders its title/description/video immediately instead of popping them in
    // after the fetch and shifting the grid down. Lives under the 'categories:'
    // prefix so useCategories' invalidation on edit/delete clears it too.
    const [categoryData, setCategoryData] = useState(() => knownCategoryData({ category: categoryParam, season: seasonParam }));
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [quickViewProduct, setQuickViewProduct] = useState(null);
    const [sortBy, setSortBy] = useState('default');
    const [filterColor, setFilterColor] = useState('');
    const [filterMaterial, setFilterMaterial] = useState('');
    // Products per row (1 / 2 / 4) - chosen with the VIEW selector, remembered across pages.
    const { columns, options: gridOptions, setColumns, gridSx } = useGridView();


    const notify = (message, severity) => setSnackbar({ open: true, message, severity });

    // Update selected category when the shown category changes (see above)
    useEffect(() => {
        const { category: shownCategoryParam, season: shownSeasonParam } = shownCategory;

        // Fetch category details only if category parameter exists
        if (shownCategoryParam) {
            categoryRepository.findById(shownCategoryParam)
                .then(response => {
                    apiCache.set(`categories:byId:${shownCategoryParam}`, response.data);
                    setCategoryData(response.data);
                })
                .catch(error => console.error('Error fetching category:', error));
        } else if (shownSeasonParam) {
            // Set default category data for season
            setCategoryData(SEASON_CATEGORY_DATA);
        }
    }, [shownCategory]);

    const { products, loading, onDelete } = useProducts(selectedCategory);

    // Distinct filter options, derived from whatever is actually in this category
    // Grouped into simple families ("Wool" covers Wool Felt, Merino Wool, ...) -
    // see utils/productFacets.
    const uniqueColors = colorOptions(products);
    const uniqueMaterials = materialOptions(products);

    // ✅ Filter products by search query, color and material
    let filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (filterColor) filteredProducts = filteredProducts.filter((p) => colorFamilies(p.color).includes(filterColor));
    if (filterMaterial) filteredProducts = filteredProducts.filter((p) => materialFamilies(p.material).includes(filterMaterial));
    if (sortBy === 'price-asc') filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);

    const hasActiveFilters = sortBy !== 'default' || filterColor || filterMaterial;
    const clearFilters = () => {
        setSortBy('default');
        setFilterColor('');
        setFilterMaterial('');
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
                <Container key={shownCategory.key} maxWidth="xl" sx={{ pt: 4, pb: 3, ...categoryTransitionSx }}>
                    <ProductGridSkeleton />
                </Container>
            </Box>
        );
    }

    return (
        <Box sx={{ backgroundColor: '#f5f1e8', minHeight: '100vh', position: 'relative' }}>
            <Container key={shownCategory.key} maxWidth="xl" sx={{ pt: 4, pb: 3, ...categoryTransitionSx }}>
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
                        {searchQuery
                            ? `Search Results for "${searchQuery}"`
                            : (categoryData?.name || (shownCategory.category || shownCategory.season ? ' ' : 'All Products'))}
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
                        <FilterSelect
                            label="Sort"
                            value={sortBy}
                            onChange={setSortBy}
                            options={[
                                { value: 'default', label: 'Featured' },
                                { value: 'price-asc', label: 'Price: Low to High' },
                                { value: 'price-desc', label: 'Price: High to Low' },
                            ]}
                        />

                        {uniqueColors.length > 0 && (
                            <FilterSelect
                                label="Color"
                                value={filterColor}
                                onChange={setFilterColor}
                                allLabel="All"
                                options={uniqueColors.map((c) => ({ value: c, label: c, swatch: COLOR_SWATCHES[c] }))}
                            />
                        )}

                        {uniqueMaterials.length > 0 && (
                            <FilterSelect
                                label="Material"
                                value={filterMaterial}
                                onChange={setFilterMaterial}
                                allLabel="All"
                                options={uniqueMaterials.map((m) => ({ value: m, label: m }))}
                            />
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
                    {/* Products per row: 1 / 2 / 4, on every screen size */}
                    <GridViewToggle columns={columns} options={gridOptions} onChange={setColumns} sx={{ mb: 2.5 }} />

                    {/* Products Grid - products per row from the VIEW selector */}
                    <Box
                        sx={{
                            display: 'grid',
                            ...gridSx,
                            gap: { xs: 1.5, sm: 3 },
                            mb: 6,
                        }}
                    >
                        {filteredProducts.slice(0, 4).map((product, index) => (
                            <Reveal key={product.id} delay={index * 0.08} instant={hasBackTransition(product.id)}>
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
                                ...gridSx,
                                gap: 3,
                            }}
                        >
                            {filteredProducts.slice(4).map((product, index) => (
                                <Reveal key={product.id} delay={(index % 4) * 0.08} instant={hasBackTransition(product.id)}>
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
            {isAdminUser() && (
                <AddProductFab
                    onAddProduct={() => navigate('/products/add')}
                    onManageCategories={() => navigate('/admin/categories')}
                />
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

            <AppSnackbar snackbar={snackbar} onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))} />
        </Box>
    );
};

export default ProductsPage;