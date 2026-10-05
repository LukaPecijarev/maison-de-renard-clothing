import React, { useMemo, useRef, useState } from 'react';
import {
    Container,
    Typography,
    Box,
    TextField,
    Button,
    CircularProgress,
    IconButton,
    Tooltip,
} from '@mui/material';
import { Navigate, useNavigate } from 'react-router-dom';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import useCategories from '../hooks/useCategories';
import useProducts from '../hooks/useProducts';
import ConfirmDialog from '../components/ConfirmDialog';
import Reveal from '../components/Reveal';
import { adminEditIconButtonSx } from '../components/AdminActionButton';
import {
    AdminPageHeader, AdminSection, adminFieldSx, adminPrimaryButtonSx, adminSecondaryButtonSx,
} from '../components/AdminUi';
import animateRemoval, { resetRemoval } from '../utils/animateRemoval';
import { isAdminUser } from '../utils/auth';
import AppSnackbar from '../components/AppSnackbar';

const EMPTY_FORM = { name: '', description: '' };


// Single admin page for category CRUD - categories only have a name and a
// description, so add/edit share one form instead of separate Add/Edit pages
// like products have. Same "atelier" look as the product form (components/AdminUi).
const ManageCategoriesPage = () => {
    const navigate = useNavigate();
    const { categories, loading, onAdd, onEdit, onDelete } = useCategories();
    const { products } = useProducts();
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [editingId, setEditingId] = useState(null);
    const [saving, setSaving] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    // Keeps the name on screen while the dialog fades out after a choice.
    const lastDeleteNameRef = useRef('');
    if (categoryToDelete) lastDeleteNameRef.current = categoryToDelete.name;
    const rowRefs = useRef({});
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // A category that still has products can't be deleted (products.category_id
    // is NOT NULL), so count them up front and disable delete instead of letting
    // the request fail.
    const productCountByCategory = useMemo(() => {
        const counts = {};
        products.forEach((p) => { counts[p.categoryId] = (counts[p.categoryId] || 0) + 1; });
        return counts;
    }, [products]);

    if (!isAdminUser()) {
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

    // The row slides out to the left (like wishlist/cart items), then it's deleted.
    const handleConfirmDelete = async () => {
        const category = categoryToDelete;
        setCategoryToDelete(null);
        const row = rowRefs.current[category.id];
        await animateRemoval(row);
        try {
            await onDelete(category.id);
            if (editingId === category.id) resetForm();
            notify(`"${category.name}" deleted`, 'success');
        } catch (error) {
            resetRemoval(row);
            notify(`Could not delete "${category.name}" - make sure it has no products left.`, 'error');
        }
    };

    const editing = editingId !== null;

    return (
        <Box sx={{ backgroundColor: '#f5f1e8', minHeight: '100vh', py: { xs: 4, md: 7 } }}>
            <Container maxWidth="lg">
                <AdminPageHeader
                    titleStart="Manage "
                    titleAccent="categories"
                    subtitle="Shape how the collection is organised - every product belongs to one of these."
                    onBack={() => navigate(-1)}
                />

                <Box sx={{
                    display: 'grid',
                    // minmax(0, 1fr), not 1fr: a plain 1fr column grows to fit the longest
                    // one-line (ellipsised) description and overflows the screen.
                    gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: '380px minmax(0, 1fr)' },
                    gap: { xs: 3, md: 5 },
                    alignItems: 'start',
                }}>
                    {/* Add / Edit form - stays in view while scrolling the list */}
                    <Box sx={{ position: { md: 'sticky' }, top: { md: 24 } }}>
                        <AdminSection
                            number="01"
                            title={editing ? 'Edit category' : 'Add a category'}
                            hint={editing ? 'Update its name or description.' : 'A name and a short description.'}
                            delay={0.08}
                            sx={editing ? { borderColor: '#d4b896', boxShadow: '0 10px 30px rgba(212, 184, 150, 0.25)' } : undefined}
                        >
                            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                <TextField fullWidth label="Category name" name="name"
                                           value={formData.name} onChange={handleChange} required sx={adminFieldSx} />
                                <TextField fullWidth label="Description" name="description"
                                           value={formData.description} onChange={handleChange}
                                           multiline minRows={3} maxRows={6} sx={adminFieldSx} />
                                {/* Stacked full-width (main action on top): side by side, the narrow
                                    form column squeezed "SAVE CHANGES" narrower than its own text. */}
                                <Box sx={{ display: 'flex', flexDirection: 'column-reverse', gap: 1.5 }}>
                                    {editing && (
                                        <Button fullWidth onClick={resetForm} disabled={saving} sx={adminSecondaryButtonSx}>
                                            Cancel
                                        </Button>
                                    )}
                                    <Button
                                        type="submit"
                                        disabled={saving || !formData.name.trim()}
                                        startIcon={saving ? null : (editing ? <CheckRoundedIcon /> : <AddRoundedIcon />)}
                                        fullWidth
                                        sx={adminPrimaryButtonSx}
                                    >
                                        {saving ? <CircularProgress size={20} sx={{ color: '#8b7355' }} /> : (editing ? 'SAVE CHANGES' : 'ADD CATEGORY')}
                                    </Button>
                                </Box>
                            </Box>
                        </AdminSection>
                    </Box>

                    {/* Category list */}
                    <AdminSection
                        number="02"
                        title="The collection"
                        hint={loading ? 'Loading…' : `${categories.length} ${categories.length === 1 ? 'category' : 'categories'}`}
                        delay={0.16}
                    >
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                                <CircularProgress sx={{ color: '#d4b896' }} />
                            </Box>
                        ) : categories.length === 0 ? (
                            <Typography align="center" sx={{ py: 6, color: '#8b7355', fontFamily: '"Lato", sans-serif' }}>
                                No categories yet - add the first one.
                            </Typography>
                        ) : (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                {categories.map((category, index) => {
                                    const productCount = productCountByCategory[category.id] || 0;
                                    const isEditingThis = editingId === category.id;
                                    return (
                                        <Reveal key={category.id} delay={Math.min(index, 8) * 0.05}>
                                            <Box
                                                ref={(el) => { rowRefs.current[category.id] = el; }}
                                                sx={{
                                                    display: 'flex', alignItems: 'center', gap: 2,
                                                    p: { xs: 1.5, sm: 2 },
                                                    borderRadius: '12px',
                                                    backgroundColor: isEditingThis ? 'rgba(212, 184, 150, 0.12)' : '#fffdf8',
                                                    border: '1px solid',
                                                    borderColor: isEditingThis ? '#d4b896' : 'rgba(212, 184, 150, 0.22)',
                                                    borderLeft: `3px solid ${isEditingThis ? '#d4b896' : 'transparent'}`,
                                                    transition: 'background-color 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease',
                                                    '&:hover': {
                                                        boxShadow: '0 8px 22px rgba(44, 44, 44, 0.07)',
                                                        transform: 'translateY(-1px)',
                                                    },
                                                }}
                                            >
                                                {/* Monogram */}
                                                <Box sx={{
                                                    flex: '0 0 auto', width: 46, height: 46, borderRadius: '50%',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    backgroundColor: 'rgba(212, 184, 150, 0.18)', border: '1px solid rgba(212, 184, 150, 0.45)',
                                                    fontFamily: '"Cormorant Garamond", serif', fontSize: '1.4rem', color: '#8b7355',
                                                }}>
                                                    {(category.name || '?').charAt(0).toUpperCase()}
                                                </Box>

                                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                                    <Typography sx={{
                                                        fontFamily: '"Cormorant Garamond", serif', fontSize: '1.3rem', color: '#2c2c2c', lineHeight: 1.2,
                                                    }}>
                                                        {category.name}
                                                    </Typography>
                                                    {category.description && (
                                                        <Typography sx={{
                                                            fontFamily: '"Lato", sans-serif', fontSize: '0.82rem', color: '#8b7355',
                                                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                                        }}>
                                                            {category.description}
                                                        </Typography>
                                                    )}
                                                </Box>

                                                <Box sx={{
                                                    display: { xs: 'none', sm: 'block' }, flex: '0 0 auto',
                                                    px: 1.4, py: 0.4, borderRadius: '999px',
                                                    border: '1px solid rgba(212, 184, 150, 0.5)',
                                                    fontFamily: '"Lato", sans-serif', fontSize: '0.72rem', color: '#8b7355', whiteSpace: 'nowrap',
                                                }}>
                                                    {productCount} {productCount === 1 ? 'product' : 'products'}
                                                </Box>

                                                <Tooltip title="Edit">
                                                    <IconButton aria-label={`Edit ${category.name}`} onClick={() => startEditing(category)} sx={adminEditIconButtonSx}>
                                                        <EditOutlinedIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title={productCount > 0 ? 'Move or delete its products first' : 'Delete'}>
                                                    {/* span keeps the tooltip working while the button is disabled */}
                                                    <span>
                                                        <IconButton
                                                            aria-label={`Delete ${category.name}`}
                                                            onClick={() => setCategoryToDelete(category)}
                                                            disabled={productCount > 0}
                                                            sx={{
                                                                color: '#9c4a4a',
                                                                transition: 'background-color 0.25s ease, transform 0.25s ease',
                                                                '&:hover': { backgroundColor: 'rgba(156, 74, 74, 0.08)', transform: 'scale(1.06)' },
                                                            }}
                                                        >
                                                            <DeleteOutlineIcon fontSize="small" />
                                                        </IconButton>
                                                    </span>
                                                </Tooltip>
                                            </Box>
                                        </Reveal>
                                    );
                                })}
                            </Box>
                        )}
                    </AdminSection>
                </Box>
            </Container>

            <ConfirmDialog
                open={!!categoryToDelete}
                title="Delete this category?"
                message={`"${lastDeleteNameRef.current}" will be permanently removed. This can't be undone.`}
                onConfirm={handleConfirmDelete}
                onCancel={() => setCategoryToDelete(null)}
            />

            <AppSnackbar snackbar={snackbar} onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))} />
        </Box>
    );
};

export default ManageCategoriesPage;
