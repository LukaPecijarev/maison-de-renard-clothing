import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    TextField,
    Button,
    MenuItem,
    Paper,
    Snackbar,
    Alert,
    CircularProgress,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import categoryRepository from '../repository/categoryRepository';
import productRepository from '../repository/productRepository';
import useProducts from '../hooks/useProducts';

const EditProductPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { onEdit } = useProducts();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        quantity: '',
        categoryId: '',
        imageUrl: '',
        imageUrl2: '',
    });

    useEffect(() => {
        // Fetch categories
        categoryRepository.findAll()
            .then(response => setCategories(response.data))
            .catch(error => console.error('Error fetching categories:', error));

        // Fetch product details
        productRepository.findById(id)
            .then(response => {
                const product = response.data;

                // Split imageUrl by comma
                const images = product.imageUrl ? product.imageUrl.split(',').map(url => url.trim()) : [];

                setFormData({
                    name: product.name || '',
                    description: product.description || '',
                    price: product.price || '',
                    quantity: product.quantity || '',
                    categoryId: product.categoryId || '',
                    imageUrl: images[0] || '',
                    imageUrl2: images[1] || '',
                });
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching product:', error);
                setSnackbar({
                    open: true,
                    message: 'Failed to load product',
                    severity: 'error',
                });
                setLoading(false);
            });
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Combine two image URLs with comma
        const combinedImageUrl = formData.imageUrl2
            ? `${formData.imageUrl},${formData.imageUrl2}`
            : formData.imageUrl;

        const productData = {
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            quantity: parseInt(formData.quantity),
            categoryId: parseInt(formData.categoryId),
            imageUrl: combinedImageUrl,
        };

        try {
            await onEdit(id, productData);
            setSnackbar({
                open: true,
                message: 'Product updated successfully!',
                severity: 'success',
            });
            setTimeout(() => navigate('/products'), 1500);
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Failed to update product',
                severity: 'error',
            });
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', backgroundColor: '#f5f1e8' }}>
                <CircularProgress sx={{ color: '#2c2c2c' }} />
            </Box>
        );
    }

    return (
        <Box sx={{ backgroundColor: '#f5f1e8', minHeight: '100vh', py: 8 }}>
            <Container maxWidth="md">
                {/* Back Button */}
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(-1)}
                    sx={{
                        mb: 4,
                        color: '#2c2c2c',
                        textTransform: 'none',
                        fontSize: '0.95rem',
                        fontFamily: '"Lato", sans-serif',
                        '&:hover': {
                            backgroundColor: 'rgba(212, 184, 150, 0.1)',
                        },
                    }}
                >
                    Back to Products
                </Button>

                {/* Page Title */}
                <Typography
                    variant="h3"
                    align="center"
                    sx={{
                        fontFamily: '"Cormorant Garamond", serif',
                        fontWeight: 300,
                        letterSpacing: '0.15em',
                        mb: 1,
                        color: '#2c2c2c',
                        fontSize: { xs: '2rem', md: '2.5rem' },
                    }}
                >
                    EDIT PRODUCT
                </Typography>

                <Typography
                    variant="body1"
                    align="center"
                    sx={{
                        color: '#8b7355',
                        mb: 6,
                        fontSize: '0.9rem',
                        fontFamily: '"Lato", sans-serif',
                        letterSpacing: '0.05em',
                    }}
                >
                    Refine your masterpiece with precision
                </Typography>

                {/* Form */}
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 3, md: 6 },
                        backgroundColor: '#ffffff',
                        borderRadius: '2px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                        border: '1px solid rgba(212, 184, 150, 0.2)',
                    }}
                >
                    <form onSubmit={handleSubmit}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            {/* Product Name */}
                            <TextField
                                fullWidth
                                label="Product Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        fontFamily: '"Lato", sans-serif',
                                        '& fieldset': {
                                            borderColor: 'rgba(212, 184, 150, 0.3)',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#d4b896',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#c4a886',
                                            borderWidth: '2px',
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        fontFamily: '"Lato", sans-serif',
                                        fontSize: '0.9rem',
                                        '&.Mui-focused': {
                                            color: '#8b7355',
                                        },
                                    },
                                }}
                            />

                            {/* Description */}
                            <TextField
                                fullWidth
                                label="Description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                multiline
                                rows={4}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '&:hover fieldset': {
                                            borderColor: '#d4b896',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#c4a886',
                                        },
                                    },
                                }}
                            />

                            {/* Price and Quantity */}
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
                                <TextField
                                    fullWidth
                                    label="Price (€)"
                                    name="price"
                                    type="number"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                    inputProps={{ step: '0.01', min: '0' }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '&:hover fieldset': {
                                                borderColor: '#d4b896',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#c4a886',
                                            },
                                        },
                                    }}
                                />

                                <TextField
                                    fullWidth
                                    label="Quantity"
                                    name="quantity"
                                    type="number"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    required
                                    inputProps={{ min: '0' }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '&:hover fieldset': {
                                                borderColor: '#d4b896',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#c4a886',
                                            },
                                        },
                                    }}
                                />
                            </Box>

                            {/* Category */}
                            <TextField
                                fullWidth
                                select
                                label="Category"
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleChange}
                                required
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '&:hover fieldset': {
                                            borderColor: '#d4b896',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#c4a886',
                                        },
                                    },
                                }}
                            >
                                {categories.map((category) => (
                                    <MenuItem key={category.id} value={category.id}>
                                        {category.name}
                                    </MenuItem>
                                ))}
                            </TextField>

                            {/* Image URLs */}
                            <Typography
                                variant="h6"
                                sx={{
                                    fontFamily: '"Cormorant Garamond", serif',
                                    fontWeight: 400,
                                    color: '#2c2c2c',
                                    mt: 2,
                                }}
                            >
                                Product Images
                            </Typography>

                            <TextField
                                fullWidth
                                label="Image URL 1 (Default)"
                                name="imageUrl"
                                value={formData.imageUrl}
                                onChange={handleChange}
                                required
                                placeholder="https://example.com/image1.jpg"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '&:hover fieldset': {
                                            borderColor: '#d4b896',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#c4a886',
                                        },
                                    },
                                }}
                            />

                            <TextField
                                fullWidth
                                label="Image URL 2 (Hover)"
                                name="imageUrl2"
                                value={formData.imageUrl2}
                                onChange={handleChange}
                                placeholder="https://example.com/image2.jpg"
                                helperText="Optional - This image will show on hover"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '&:hover fieldset': {
                                            borderColor: '#d4b896',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#c4a886',
                                        },
                                    },
                                }}
                            />

                            {/* Buttons */}
                            <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    onClick={() => navigate(-1)}
                                    sx={{
                                        color: '#8b7355',
                                        borderColor: 'rgba(212, 184, 150, 0.5)',
                                        py: 1.8,
                                        fontSize: '0.85rem',
                                        fontWeight: 500,
                                        letterSpacing: '0.15em',
                                        textTransform: 'uppercase',
                                        fontFamily: '"Lato", sans-serif',
                                        borderWidth: '1.5px',
                                        '&:hover': {
                                            borderColor: '#d4b896',
                                            backgroundColor: 'rgba(212, 184, 150, 0.08)',
                                            borderWidth: '1.5px',
                                        },
                                    }}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    sx={{
                                        backgroundColor: '#d4b896',
                                        color: '#ffffff',
                                        py: 1.8,
                                        fontSize: '0.85rem',
                                        fontWeight: 500,
                                        letterSpacing: '0.15em',
                                        textTransform: 'uppercase',
                                        fontFamily: '"Lato", sans-serif',
                                        boxShadow: '0 4px 12px rgba(212, 184, 150, 0.3)',
                                        '&:hover': {
                                            backgroundColor: '#c4a886',
                                            boxShadow: '0 6px 16px rgba(196, 168, 134, 0.4)',
                                        },
                                    }}
                                >
                                    Update Product
                                </Button>
                            </Box>
                        </Box>
                    </form>
                </Paper>
            </Container>

            {/* Snackbar */}
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

export default EditProductPage;