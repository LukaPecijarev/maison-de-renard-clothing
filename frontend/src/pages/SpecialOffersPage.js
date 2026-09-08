import React, { useState } from 'react';
import { Container, Typography, Box, Snackbar, Alert, Fab } from '@mui/material';
import ProductGridSkeleton from '../components/ProductGridSkeleton';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import useProducts from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import Reveal from '../components/Reveal';
import RecentlyViewed from '../components/RecentlyViewed';

const SpecialOffersPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search') || '';
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [quickViewProduct, setQuickViewProduct] = useState(null);

    const { products, loading, onDelete } = useProducts(6);

    const isAdmin = () => {
        const role = localStorage.getItem('role');
        return role === 'ROLE_ADMIN' || role === 'ADMIN';
    };

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

                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                        gap: { xs: 1.5, sm: 3 },
                    }}>
                        {filteredProducts.map((product, index) => (
                            <Reveal key={product.id} delay={(index % 4) * 0.08}>
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