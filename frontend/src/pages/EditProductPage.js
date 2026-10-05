import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography, Button } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import ProductForm, { productToForm } from '../components/ProductForm';
import productRepository from '../repository/productRepository';
import useProducts from '../hooks/useProducts';

// Loads the product, then hands it to the shared ProductForm (components/
// ProductForm, also used by AddProductPage).
const EditProductPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { onEdit } = useProducts();
    const [initialValues, setInitialValues] = useState(null);
    const [loadFailed, setLoadFailed] = useState(false);

    useEffect(() => {
        setInitialValues(null);
        setLoadFailed(false);
        productRepository.findById(id)
            .then((response) => setInitialValues(productToForm(response.data)))
            .catch((error) => {
                console.error('Error fetching product:', error);
                setLoadFailed(true);
            });
    }, [id]);

    if (loadFailed) {
        return (
            <Box sx={{ backgroundColor: '#f5f1e8', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.6rem', color: '#2c2c2c' }}>
                    This product could not be loaded
                </Typography>
                <Button onClick={() => navigate('/products')} sx={{ color: '#8b7355', letterSpacing: '0.1em' }}>
                    Back to the collection
                </Button>
            </Box>
        );
    }

    if (!initialValues) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', backgroundColor: '#f5f1e8' }}>
                <CircularProgress sx={{ color: '#d4b896' }} />
            </Box>
        );
    }

    return (
        <ProductForm
            key={id}
            mode="edit"
            initialValues={initialValues}
            onSubmit={(data) => onEdit(id, data)}
        />
    );
};

export default EditProductPage;
