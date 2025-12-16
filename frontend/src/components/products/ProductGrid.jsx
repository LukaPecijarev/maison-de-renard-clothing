import React from 'react';
import { Box, Container, Typography, CircularProgress } from '@mui/material';
import ProductCard from './ProductCard';

const ProductGrid = ({ products, loading, onEdit, onDelete, onAddToCart, title }) => {
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (products.length === 0) {
        return (
            <Container>
                <Typography variant="h6" align="center" sx={{ py: 8 }}>
                    No products available
                </Typography>
            </Container>
        );
    }

    return (
        <Box>
            {title && (
                <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4 }}>
                    {title}
                </Typography>
            )}
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(3, 1fr)',
                        lg: 'repeat(4, 1fr)',
                    },
                    gap: 3,
                }}
            >
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onAddToCart={onAddToCart}
                    />
                ))}
            </Box>
        </Box>
    );
};

export default ProductGrid;