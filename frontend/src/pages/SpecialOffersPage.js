import React, { useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import ProductGridSkeleton from '../components/ProductGridSkeleton';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AddProductFab } from '../components/AdminActionButton';
import useProducts from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import Reveal from '../components/Reveal';
import { hasBackTransition } from '../utils/sharedImageTransition';
import RecentlyViewed from '../components/RecentlyViewed';
import { isAdminUser } from '../utils/auth';
import AppSnackbar from '../components/AppSnackbar';
import useGridView from '../hooks/useGridView';
import GridViewToggle from '../components/GridViewToggle';

const SpecialOffersPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search') || '';
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [quickViewProduct, setQuickViewProduct] = useState(null);

    const { products, loading, onDelete } = useProducts(6);
    // Products per row (1 / 2 / 4) - chosen with the VIEW selector, remembered across pages.
    const { columns, options: gridOptions, setColumns, gridSx } = useGridView();


    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const notify = (message, severity) => setSnackbar({ open: true, message, severity });

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
                    {/* Products per row: 1 / 2 / 4, on every screen size */}
                    <GridViewToggle columns={columns} options={gridOptions} onChange={setColumns} sx={{ mb: 2.5 }} />

                    <Box sx={{
                        display: 'grid',
                        ...gridSx,
                        gap: { xs: 1.5, sm: 3 },
                    }}>
                        {filteredProducts.map((product, index) => (
                            <Reveal key={product.id} delay={(index % 4) * 0.08} instant={hasBackTransition(product.id)}>
                                <ProductCard
                                    product={product}
                                    variant="offers"
                                    onQuickView={setQuickViewProduct}
                                    onDelete={onDelete}
                                    onNotify={notify}
                                />
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

export default SpecialOffersPage;