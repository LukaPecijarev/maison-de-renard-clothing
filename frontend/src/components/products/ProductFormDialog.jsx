import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    MenuItem,
    Box,
} from '@mui/material';
import useCategories from '../../hooks/useCategories';

const ProductFormDialog = ({ open, onClose, onSave, product }) => {
    const { categories } = useCategories();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        quantity: '',
        categoryId: '',
        imageUrl: '',
    });

    // Load product data when editing
    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                description: product.description || '',
                price: product.price || '',
                quantity: product.quantity || '',
                categoryId: product.categoryId || '',
                imageUrl: product.imageUrl || '',
            });
        } else {
            // Reset form for adding new product
            setFormData({
                name: '',
                description: '',
                price: '',
                quantity: '',
                categoryId: '',
                imageUrl: '',
            });
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate
        if (!formData.name || !formData.price || !formData.categoryId) {
            alert('Please fill in all required fields');
            return;
        }

        // Convert to proper types
        const dataToSend = {
            ...formData,
            price: parseFloat(formData.price),
            quantity: parseInt(formData.quantity) || 0,
            categoryId: parseInt(formData.categoryId),
        };

        onSave(dataToSend);
    };

    const handleClose = () => {
        setFormData({
            name: '',
            description: '',
            price: '',
            quantity: '',
            categoryId: '',
            imageUrl: '',
        });
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {product ? 'Edit Product' : 'Add New Product'}
            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Product Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            fullWidth
                        />

                        <TextField
                            label="Description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            multiline
                            rows={3}
                            fullWidth
                        />

                        <TextField
                            label="Price"
                            name="price"
                            type="number"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            fullWidth
                            inputProps={{ step: '0.01', min: '0' }}
                        />

                        <TextField
                            label="Quantity"
                            name="quantity"
                            type="number"
                            value={formData.quantity}
                            onChange={handleChange}
                            fullWidth
                            inputProps={{ min: '0' }}
                        />

                        <TextField
                            label="Category"
                            name="categoryId"
                            select
                            value={formData.categoryId}
                            onChange={handleChange}
                            required
                            fullWidth
                        >
                            {categories.map((category) => (
                                <MenuItem key={category.id} value={category.id}>
                                    {category.name}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            label="Image URL"
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleChange}
                            fullWidth
                            helperText="Enter a URL for the product image"
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleClose} color="inherit">
                        Cancel
                    </Button>
                    <Button type="submit" variant="contained">
                        {product ? 'Save Changes' : 'Add Product'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default ProductFormDialog;