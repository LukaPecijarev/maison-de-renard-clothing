import React, { useMemo, useState } from 'react';
import {
    Container,
    Typography,
    Box,
    TextField,
    Button,
    Paper,
    Snackbar,
    Alert,
    CircularProgress,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from '@mui/material';
import { Navigate, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import useCategories from '../hooks/useCategories';
import useProducts from '../hooks/useProducts';

const fieldSx = {
    '& .MuiOutlinedInput-root': {
        '& fieldset': { borderColor: 'rgba(212, 184, 150, 0.3)' },
        '&:hover fieldset': { borderColor: '#d4b896' },
        '&.Mui-focused fieldset': { borderColor: '#c4a886', borderWidth: '2px' },
    },
    '& .MuiInputLabel-root.Mui-focused': { color: '#8b7355' },
};

const secondaryButtonSx = {
    color: '#8b7355',
    borderColor: 'rgba(212, 184, 150, 0.5)',
    py: 1.5, fontSize: '0.85rem', fontWeight: 500,
    letterSpacing: '0.15em', textTransform: 'uppercase',
    fontFamily: '"Lato", sans-serif', borderWidth: '1.5px',
    '&:hover': {
        borderColor: '#d4b896',
        backgroundColor: 'rgba(212, 184, 150, 0.08)',
        borderWidth: '1.5px',
    },
};

const primaryButtonSx = {
    color: '#22223b', borderColor: '#e6b8a2', borderWidth: '1px',
    backgroundColor: 'transparent',
    py: 1.5, fontSize: '0.85rem', fontWeight: 500,
    letterSpacing: '0.15em', textTransform: 'uppercase',
    fontFamily: '"Lato", sans-serif',
    borderRadius: '6px',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
        borderColor: '#d4b896',
        backgroundColor: '#f5ebe0',
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(193, 154, 107, 0.3)',
    },
};

const EMPTY_FORM = { name: '', description: '' };

const isAdmin = () => {
    const role = localStorage.getItem('role');
    return role === 'ROLE_ADMIN' || role === 'ADMIN';
};

// Single admin page for category CRUD - categories only have a name and a
// description, so add/edit share one form at the top instead of separate
// Add/Edit pages like products have.
const ManageCategoriesPage = () => {
    const navigate = useNavigate();
    const { categories, loading, onAdd, onEdit, onDelete } = useCategories();
    const { products } = useProducts();
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [editingId, setEditingId] = useState(null);
    const [saving, setSaving] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // A category that still has products can't be deleted (products.category_id
    // is NOT NULL), so count them up front and disable delete instead of letting
    // the request fail.
    const productCountByCategory = useMemo(() => {
        const counts = {};
        products.forEach((p) => { counts[p.categoryId] = (counts[p.categoryId] || 0) + 1; });
        return counts;
    }, [products]);

    if (!isAdmin()) {
        return <Navigate to="/" replace />;
    }

    const notify = (message, severity) => setSnackbar({ open: true, message, severity });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const startEditing = (category) => {
        setEditingId(category.id);
        setFormData({ name: category.name || '', description: category.description || '' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData(EMPTY_FORM);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = { name: formData.name.trim(), description: formData.description.trim() };
        setSaving(true);
        try {
            if (editingId) {
                await onEdit(editingId, data);
                notify('Category updated successfully!', 'success');
            } else {
                await onAdd(data);
                notify('Category added successfully!', 'success');
            }
            resetForm();
        } catch (error) {
            notify(editingId ? 'Failed to update category' : 'Failed to add category', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleConfirmDelete = async () => {
        const category = categoryToDelete;
        setCategoryToDelete(null);
        try {
            await onDelete(category.id);
            if (editingId === category.id) resetForm();
            notify(`"${category.name}" deleted`, 'success');
        } catch (error) {
            notify(`Could not delete "${category.name}" - make sure it has no products left.`, 'error');
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
                        textTransform: 'none',
                        fontSize: '0.95rem',
                        fontFamily: '"Lato", sans-serif',
                        '&:hover': { backgroundColor: 'rgba(212, 184, 150, 0.1)' },
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
                        letterSpacing: '0.15em',
                        mb: 1,
                        color: '#2c2c2c',
                        fontSize: { xs: '2rem', md: '2.5rem' },
                    }}
                >
                    MANAGE CATEGORIES
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
                    Curate how the collection is organised
                </Typography>

                {/* Add / Edit form */}
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 3, md: 5 },
                        mb: 5,
                        backgroundColor: '#ffffff',
                        borderRadius: '2px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                        border: '1px solid rgba(212, 184, 150, 0.2)',
                    }}
                >
                    <Typography variant="h6" sx={{
                        fontFamily: '"Cormorant Garamond", serif',
                        fontWeight: 400, color: '#2c2c2c', mb: 3,
                    }}>
                        {editingId ? 'Edit Category' : 'Add Category'}
                    </Typography>

                    <form onSubmit={handleSubmit}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <TextField fullWidth label="Category Name" name="name"
                                       value={formData.name} onChange={handleChange} required sx={fieldSx} />

                            <TextField fullWidth label="Description" name="description"
                                       value={formData.description} onChange={handleChange}
                                       multiline rows={3} sx={fieldSx} />

                            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                                {editingId && (
                                    <Button variant="outlined" fullWidth onClick={resetForm} sx={secondaryButtonSx}>
                                        Cancel Edit
                                    </Button>
                                )}
                                <Button type="submit" variant="outlined" fullWidth
                                        disabled={saving || !formData.name.trim()} sx={primaryButtonSx}>
                                    {saving ? 'Saving...' : editingId ? 'Update Category' : 'Add Category'}
                                </Button>
                            </Box>
                        </Box>
                    </form>
                </Paper>

                {/* Category list */}
                <Paper
                    elevation={0}
                    sx={{
                        backgroundColor: '#ffffff',
                        borderRadius: '2px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                        border: '1px solid rgba(212, 184, 150, 0.2)',
                    }}
                >
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                            <CircularProgress sx={{ color: '#2c2c2c' }} />
                        </Box>
                    ) : categories.length === 0 ? (
                        <Typography align="center" sx={{ py: 6, color: '#8b7355', fontFamily: '"Lato", sans-serif' }}>
                            No categories yet.
                        </Typography>
                    ) : (
                        categories.map((category, index) => {
                            const productCount = productCountByCategory[category.id] || 0;
                            return (
                                <Box
                                    key={category.id}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2,
                                        px: { xs: 2, md: 4 },
                                        py: 2.5,
                                        borderTop: index === 0 ? 'none' : '1px solid rgba(212, 184, 150, 0.2)',
                                        backgroundColor: editingId === category.id ? 'rgba(212, 184, 150, 0.08)' : 'transparent',
                                    }}
                                >
                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                        <Typography sx={{
                                            fontFamily: '"Cormorant Garamond", serif',
                                            fontSize: '1.25rem',
                                            color: '#2c2c2c',
                                        }}>
                                            {category.name}
                                        </Typography>
                                        {category.description && (
                                            <Typography sx={{
                                                fontFamily: '"Lato", sans-serif',
                                                fontSize: '0.85rem',
                                                color: '#8b7355',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                            }}>
                                                {category.description}
                                            </Typography>
                                        )}
                                        <Typography sx={{
                                            fontFamily: '"Lato", sans-serif',
                                            fontSize: '0.75rem',
                                            color: '#a0826d',
                                            letterSpacing: '0.05em',
                                            mt: 0.5,
                                        }}>
                                            {productCount} {productCount === 1 ? 'product' : 'products'}
                                        </Typography>
                                    </Box>

                                    <Tooltip title="Edit">
                                        <IconButton onClick={() => startEditing(category)} sx={{ color: '#8b7355' }}>
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title={productCount > 0 ? 'Move or delete its products first' : 'Delete'}>
                                        {/* span keeps the tooltip working while the button is disabled */}
                                        <span>
                                            <IconButton
                                                onClick={() => setCategoryToDelete(category)}
                                                disabled={productCount > 0}
                                                sx={{ color: '#9c4a4a' }}
                                            >
                                                <DeleteOutlineIcon />
                                            </IconButton>
                                        </span>
                                    </Tooltip>
                                </Box>
                            );
                        })
                    )}
                </Paper>
            </Container>

            {/* Delete confirmation */}
            <Dialog open={!!categoryToDelete} onClose={() => setCategoryToDelete(null)}>
                <DialogTitle sx={{ fontFamily: '"Cormorant Garamond", serif' }}>
                    Delete category?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ fontFamily: '"Lato", sans-serif' }}>
                        "{categoryToDelete?.name}" will be permanently removed. This can't be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCategoryToDelete(null)} sx={{ color: '#8b7355' }}>
                        Keep it
                    </Button>
                    <Button onClick={handleConfirmDelete} sx={{ color: '#9c4a4a' }}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

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

export default ManageCategoriesPage;
