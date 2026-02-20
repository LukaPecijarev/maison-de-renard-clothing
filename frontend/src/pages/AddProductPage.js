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

const SEASONS = ['WINTER', 'SUMMER', 'SPRING', 'ALL_SEASON'];
const GENDERS = ['MEN', 'WOMEN', 'UNISEX'];
const STYLES = ['FORMAL', 'CASUAL', 'SPORT'];

const fieldSx = {
    '& .MuiOutlinedInput-root': {
        '& fieldset': { borderColor: 'rgba(212, 184, 150, 0.3)' },
        '&:hover fieldset': { borderColor: '#d4b896' },
        '&.Mui-focused fieldset': { borderColor: '#c4a886', borderWidth: '2px' },
    },
    '& .MuiInputLabel-root.Mui-focused': { color: '#8b7355' },
};

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
        color: '',
        season: '',
        material: '',
        gender: '',
        style: '',
        size: ''
    });

    useEffect(() => {
        categoryRepository.findAll()
            .then(response => setCategories(response.data))
            .catch(error => console.error('Error fetching categories:', error));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

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
            color: formData.color,
            season: formData.season,
            material: formData.material,
            gender: formData.gender,
            style: formData.style,
            size: formData.size,
        };

        try {
            await onAdd(productData);
            setSnackbar({ open: true, message: 'Product added successfully!', severity: 'success' });
            setTimeout(() => navigate('/products'), 1500);
        } catch (error) {
            setSnackbar({ open: true, message: 'Failed to add product', severity: 'error' });
        }
    };

    return (
        <Box sx={{ backgroundColor: '#f5f1e8', minHeight: '100vh', py: 8 }}>
            <Container maxWidth="md">
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(-1)}
                    sx={{
                        mb: 4,
                        color: '#2c2c2c',
                        '&:hover': { backgroundColor: 'rgba(44, 44, 44, 0.05)' },
                    }}
                >
                    Back
                </Button>

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
                    sx={{ color: '#666', mb: 6, fontSize: '0.95rem' }}
                >
                    Create a new product with elegant details
                </Typography>

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
                            <TextField fullWidth label="Product Name" name="name"
                                       value={formData.name} onChange={handleChange} required sx={fieldSx} />

                            {/* Description */}
                            <TextField fullWidth label="Description" name="description"
                                       value={formData.description} onChange={handleChange}
                                       required multiline rows={4} sx={fieldSx} />

                            {/* Price and Quantity */}
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
                                <TextField fullWidth label="Price (€)" name="price" type="number"
                                           value={formData.price} onChange={handleChange}
                                           required inputProps={{ step: '0.01', min: '0' }} sx={fieldSx} />
                                <TextField fullWidth label="Quantity" name="quantity" type="number"
                                           value={formData.quantity} onChange={handleChange}
                                           required inputProps={{ min: '0' }} sx={fieldSx} />
                            </Box>

                            {/* Category */}
                            <TextField fullWidth select label="Category" name="categoryId"
                                       value={formData.categoryId} onChange={handleChange} required sx={fieldSx}>
                                {categories.map((category) => (
                                    <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                                ))}
                            </TextField>

                            {/* Product Attributes */}
                            <Typography variant="h6" sx={{
                                fontFamily: '"Cormorant Garamond", serif',
                                fontWeight: 400, color: '#2c2c2c', mt: 2,
                            }}>
                                Product Attributes
                            </Typography>

                            {/* Material and Color */}
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
                                <TextField fullWidth label="Material" name="material"
                                           value={formData.material} onChange={handleChange}
                                           placeholder="100% Italian Cashmere" sx={fieldSx} />
                                <TextField fullWidth label="Color" name="color"
                                           value={formData.color} onChange={handleChange}
                                           placeholder="Navy Blue" sx={fieldSx} />
                            </Box>

                            {/* Season, Gender, Style */}
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 3 }}>
                                <TextField fullWidth select label="Season" name="season"
                                           value={formData.season} onChange={handleChange} sx={fieldSx}>
                                    <MenuItem value=""><em>None</em></MenuItem>
                                    {SEASONS.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                                </TextField>

                                <TextField fullWidth select label="Gender" name="gender"
                                           value={formData.gender} onChange={handleChange} sx={fieldSx}>
                                    <MenuItem value=""><em>None</em></MenuItem>
                                    {GENDERS.map(g => <MenuItem key={g} value={g}>{g}</MenuItem>)}
                                </TextField>

                                <TextField fullWidth select label="Style" name="style"
                                           value={formData.style} onChange={handleChange} sx={fieldSx}>
                                    <MenuItem value=""><em>None</em></MenuItem>
                                    {STYLES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                                </TextField>
                                <TextField fullWidth label="Available Sizes" name="size"
                                           value={formData.size} onChange={handleChange}
                                           placeholder="XS,S,M,L,XL,XXL"
                                           helperText={
                                               ['sneaker', 'loafer', 'boot', 'shoe', 'slipper']
                                                   .some(k => formData.name.toLowerCase().includes(k))
                                                   ? "Внеси ги достапните големини одделени со запирка (пр. 38,39,40,41,42)"
                                                   : "Внеси ги достапните големини одделени со запирка (пр. XS,S,M,L или 38,39)"
                                           }
                                           sx={fieldSx} />
                            </Box>

                            {/* Image URLs */}
                            <Typography variant="h6" sx={{
                                fontFamily: '"Cormorant Garamond", serif',
                                fontWeight: 400, color: '#2c2c2c', mt: 2,
                            }}>
                                Product Images
                            </Typography>

                            <TextField fullWidth label="Image URL 1 (Default)" name="imageUrl"
                                       value={formData.imageUrl} onChange={handleChange}
                                       required placeholder="https://example.com/image1.jpg" sx={fieldSx} />

                            <TextField fullWidth label="Image URL 2 (Hover)" name="imageUrl2"
                                       value={formData.imageUrl2} onChange={handleChange}
                                       placeholder="https://example.com/image2.jpg"
                                       helperText="Optional - This image will show on hover" sx={fieldSx} />

                            {/* Buttons */}
                            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                                <Button variant="outlined" fullWidth onClick={() => navigate(-1)}
                                        sx={{
                                            color: '#2c2c2c', borderColor: '#e6ccb2',
                                            py: 1.5, fontSize: '0.9rem', fontWeight: 400,
                                            letterSpacing: '0.1em',
                                            '&:hover': {
                                                borderColor: '#d4b896',
                                                backgroundColor: 'rgba(230, 204, 178, 0.1)',
                                            },
                                        }}>
                                    CANCEL
                                </Button>

                                <Button type="submit" variant="contained" fullWidth
                                        sx={{
                                            backgroundColor: '#2c2c2c', color: '#ffffff',
                                            py: 1.5, fontSize: '0.9rem', fontWeight: 400,
                                            letterSpacing: '0.1em',
                                            '&:hover': { backgroundColor: '#1a1a1a' },
                                        }}>
                                    ADD PRODUCT
                                </Button>
                            </Box>
                        </Box>
                    </form>
                </Paper>
            </Container>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })}
                       severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AddProductPage;