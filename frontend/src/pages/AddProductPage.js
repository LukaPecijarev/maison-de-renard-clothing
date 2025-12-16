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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import categoryRepository from '../repository/categoryRepository';
import useProducts from '../hooks/useProducts';

const AddProductPage = () => {
    const navigate = useNavigate();
    const { onAdd } = useProducts();
    const [categories, setCategories] = useState([]);
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
    }, []);

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
            await onAdd(productData);
            setSnackbar({
                open: true,
                message: 'Product added successfully!',
                severity: 'success',
            });
            setTimeout(() => navigate('/products'), 1500);
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Failed to add product',
                severity: 'error',
            });
        }
    };

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
                        '&:hover': {
                            backgroundColor: 'rgba(44, 44, 44, 0.05)',
                        },
                    }}
                >
                    Back
                </Button>

                {/* Page Title */}
                <Typography
                    variant="h3"
                    align="center"
                    sx={{
                        fontFamily: '"Cormorant Garamond", serif',
                        fontWeight: 300,
                        letterSpacing: '0.1em',
                        mb: 2,
                        color: '#2c2c2c',
                    }}
                >
                    Add New Product
                </Typography>

                <Typography
                    variant="body1"
                    align="center"
                    sx={{
                        color: '#666',
                        mb: 6,
                        fontSize: '0.95rem',
                    }}
                >
                    Create a new product with elegant details
                </Typography>

                {/* Form */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 5,
                        backgroundColor: '#ffffff',
                        borderRadius: '4px',
                        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
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
                                        '&:hover fieldset': {
                                            borderColor: '#d4b896',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#c4a886',
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
                            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    onClick={() => navigate(-1)}
                                    sx={{
                                        color: '#2c2c2c',
                                        borderColor: '#e6ccb2',
                                        py: 1.5,
                                        fontSize: '0.9rem',
                                        fontWeight: 400,
                                        letterSpacing: '0.1em',
                                        '&:hover': {
                                            borderColor: '#d4b896',
                                            backgroundColor: 'rgba(230, 204, 178, 0.1)',
                                        },
                                    }}
                                >
                                    CANCEL
                                </Button>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    sx={{
                                        backgroundColor: '#2c2c2c',
                                        color: '#ffffff',
                                        py: 1.5,
                                        fontSize: '0.9rem',
                                        fontWeight: 400,
                                        letterSpacing: '0.1em',
                                        '&:hover': {
                                            backgroundColor: '#1a1a1a',
                                        },
                                    }}
                                >
                                    ADD PRODUCT
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

export default AddProductPage;