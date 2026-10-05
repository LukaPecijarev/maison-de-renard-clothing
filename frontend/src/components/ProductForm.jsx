import React, { useEffect, useState } from 'react';
import {
    Container, Typography, Box, TextField, Button, MenuItem, InputAdornment,
    ToggleButton, ToggleButtonGroup, CircularProgress, } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import categoryRepository from '../repository/categoryRepository';
import { pageEnterDelayedSx } from '../utils/pageEnter';
import { getProductImages } from '../utils/productImages';
import AppSnackbar from './AppSnackbar';
import {
    AdminPageHeader, AdminSection, adminFieldSx, adminLabelSx, adminPrimaryButtonSx, adminSecondaryButtonSx,
} from './AdminUi';

// Shared form for AddProductPage and EditProductPage: an editorial header, the
// form in four numbered sections, a live preview of the product card next to
// it, and a save bar that stays in view while scrolling.

const SEASONS = ['WINTER', 'SUMMER', 'SPRING', 'ALL_SEASON'];
const GENDERS = ['MEN', 'WOMEN', 'UNISEX'];
const STYLES = ['FORMAL', 'CASUAL', 'SPORT'];
const FOOTWEAR_KEYWORDS = ['sneaker', 'loafer', 'boot', 'shoe', 'slipper'];

export const EMPTY_PRODUCT_FORM = {
    name: '', description: '', price: '', quantity: '', categoryId: '',
    imageUrl: '', imageUrl2: '', color: '', season: '', material: '',
    gender: '', style: '', size: '', discountPercentage: '',
};

// DisplayProductDto -> form values (imageUrl holds up to two comma-separated URLs).
export const productToForm = (product) => {
    const images = getProductImages(product);
    return {
        name: product.name || '',
        description: product.description || '',
        price: product.price ?? '',
        quantity: product.quantity ?? '',
        categoryId: product.categoryId || '',
        imageUrl: images[0] || '',
        imageUrl2: images[1] || '',
        color: product.color || '',
        season: product.season || '',
        material: product.material || '',
        gender: product.gender || '',
        style: product.style || '',
        size: product.size || '',
        discountPercentage: product.discountPercentage ?? '',
    };
};

// Form values -> request body (same shape both pages always sent).
export const formToProductData = (form) => ({
    name: form.name,
    description: form.description,
    price: parseFloat(form.price),
    quantity: parseInt(form.quantity),
    categoryId: parseInt(form.categoryId),
    imageUrl: form.imageUrl2 ? `${form.imageUrl},${form.imageUrl2}` : form.imageUrl,
    color: form.color,
    season: form.season,
    material: form.material,
    gender: form.gender,
    style: form.style,
    size: form.size,
    discountPercentage: form.discountPercentage === '' ? null : parseFloat(form.discountPercentage),
});



const titleCase = (value) => value.replace(/_/g, ' ').toLowerCase().replace(/(^|\s)\S/g, (c) => c.toUpperCase());


// Single-choice chips (Season / Gender / Style); clicking the selected chip clears it.
const ChipChoice = ({ label, value, options, onChange }) => (
    <Box>
        <Typography sx={adminLabelSx}>{label}</Typography>
        <ToggleButtonGroup
            exclusive
            value={value || null}
            onChange={(e, next) => onChange(next || '')}
            sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}
        >
            {options.map((option) => (
                <ToggleButton
                    key={option}
                    value={option}
                    sx={{
                        border: '1px solid rgba(212, 184, 150, 0.5) !important',
                        borderRadius: '999px !important',
                        px: 2, py: 0.6,
                        fontFamily: '"Lato", sans-serif', fontSize: '0.75rem',
                        letterSpacing: '0.06em', textTransform: 'none',
                        color: '#6b5640', backgroundColor: '#fffdf8',
                        transition: 'all 0.25s ease',
                        '&:hover': { backgroundColor: 'rgba(212, 184, 150, 0.12)' },
                        '&.Mui-selected': {
                            backgroundColor: '#d4b896', color: '#ffffff', borderColor: '#d4b896 !important',
                            boxShadow: '0 4px 12px rgba(212, 184, 150, 0.35)',
                        },
                        '&.Mui-selected:hover': { backgroundColor: '#c4a886' },
                    }}
                >
                    {titleCase(option)}
                </ToggleButton>
            ))}
        </ToggleButtonGroup>
    </Box>
);

// Image URL field with a small 3:4 thumbnail of what it points to.
const ImageField = ({ label, name, value, onChange, required, helperText }) => {
    const [broken, setBroken] = useState(false);
    useEffect(() => setBroken(false), [value]);
    return (
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <Box sx={{
                flex: '0 0 auto', width: 66, aspectRatio: '3/4', borderRadius: '8px', overflow: 'hidden',
                backgroundColor: '#f5f1e8', border: '1px dashed rgba(212, 184, 150, 0.6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                {value && !broken
                    ? <Box component="img" src={value} alt="" onError={() => setBroken(true)}
                           sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <ImageOutlinedIcon sx={{ color: '#d4b896' }} />}
            </Box>
            <TextField
                fullWidth label={label} name={name} value={value} onChange={onChange}
                required={required} placeholder="https://… or /products/…" sx={adminFieldSx}
                helperText={broken ? 'This image could not be loaded - check the URL' : helperText}
                error={broken}
            />
        </Box>
    );
};

// Live preview: renders the form values the way the product card looks in the shop.
const LivePreview = ({ form, categoryName }) => {
    const [hovered, setHovered] = useState(false);
    const price = parseFloat(form.price);
    const discount = parseFloat(form.discountPercentage) || 0;
    const shownImage = hovered && form.imageUrl2 ? form.imageUrl2 : form.imageUrl;
    const tags = [form.season, form.gender, form.style].filter(Boolean).map(titleCase);

    return (
        <Box sx={{ position: { md: 'sticky' }, top: { md: 24 }, maxWidth: { xs: 300, md: 'none' }, mx: { xs: 'auto', md: 0 } }}>
            <Typography sx={{ ...adminLabelSx, textAlign: 'center', mb: 1.5 }}>Live preview</Typography>
            <Box sx={{
                backgroundColor: '#ffffff', borderRadius: '16px', overflow: 'hidden',
                border: '1px solid rgba(212, 184, 150, 0.25)',
                boxShadow: '0 12px 40px rgba(44, 44, 44, 0.08)',
            }}>
                <Box
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    sx={{ position: 'relative', aspectRatio: '3/4', backgroundColor: '#f5f1e8', overflow: 'hidden' }}
                >
                    {shownImage ? (
                        <Box component="img" src={shownImage} alt=""
                             sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.6s ease', transform: hovered ? 'scale(1.03)' : 'none' }} />
                    ) : (
                        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1, color: '#c4a886' }}>
                            <ImageOutlinedIcon sx={{ fontSize: 40 }} />
                            <Typography sx={{ fontFamily: '"Lato", sans-serif', fontSize: '0.78rem', color: '#a0826d' }}>
                                Add an image to see it here
                            </Typography>
                        </Box>
                    )}
                    {discount > 0 && (
                        <Box sx={{
                            position: 'absolute', top: 12, left: 12, px: 1.2, py: 0.4, borderRadius: '999px',
                            backgroundColor: '#9c4a4a', color: '#ffffff',
                            fontFamily: '"Lato", sans-serif', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em',
                        }}>
                            -{discount}%
                        </Box>
                    )}
                    {form.imageUrl2 && (
                        <Typography sx={{
                            position: 'absolute', bottom: 10, right: 12, fontFamily: '"Lato", sans-serif',
                            fontSize: '0.65rem', letterSpacing: '0.1em', color: 'rgba(44, 44, 44, 0.55)',
                        }}>
                            HOVER FOR 2ND IMAGE
                        </Typography>
                    )}
                </Box>
                <Box sx={{ p: 2.5, textAlign: 'center' }}>
                    <Typography sx={{ ...adminLabelSx, fontSize: '0.65rem', mb: 0.8 }}>{categoryName || 'Category'}</Typography>
                    <Typography sx={{
                        fontFamily: '"Cormorant Garamond", serif', fontSize: '1.45rem', color: '#2c2c2c',
                        lineHeight: 1.2, mb: 1, wordBreak: 'break-word',
                    }}>
                        {form.name || 'Product name'}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 1 }}>
                        {discount > 0 && !Number.isNaN(price) && (
                            <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1rem', color: '#a0a0a0', textDecoration: 'line-through' }}>
                                €{price.toFixed(0)}
                            </Typography>
                        )}
                        <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.25rem', color: discount > 0 ? '#9c4a4a' : '#2c2c2c' }}>
                            {Number.isNaN(price) ? '€ —' : `€${(price * (1 - discount / 100)).toFixed(0)}`}
                        </Typography>
                    </Box>
                    {tags.length > 0 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 0.8, mt: 1.5 }}>
                            {tags.map((tag) => (
                                <Box key={tag} sx={{
                                    px: 1.2, py: 0.3, borderRadius: '999px', border: '1px solid rgba(212, 184, 150, 0.5)',
                                    fontFamily: '"Lato", sans-serif', fontSize: '0.68rem', color: '#8b7355',
                                }}>
                                    {tag}
                                </Box>
                            ))}
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

const ProductForm = ({ mode, initialValues = EMPTY_PRODUCT_FORM, onSubmit }) => {
    const navigate = useNavigate();
    const isEdit = mode === 'edit';
    const [form, setForm] = useState(initialValues);
    const [categories, setCategories] = useState([]);
    const [saving, setSaving] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        categoryRepository.findAll()
            .then((response) => setCategories(response.data))
            .catch((error) => console.error('Error fetching categories:', error));
    }, []);

    const set = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));
    const handleChange = (e) => set(e.target.name, e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await onSubmit(formToProductData(form));
            setSnackbar({ open: true, message: isEdit ? 'Product updated successfully!' : 'Product added successfully!', severity: 'success' });
            setTimeout(() => navigate('/products'), 1500);
        } catch (error) {
            setSaving(false);
            setSnackbar({
                open: true,
                message: error?.response?.data?.message || (isEdit ? 'Failed to update product' : 'Failed to add product'),
                severity: 'error',
            });
        }
    };

    const categoryName = categories.find((c) => String(c.id) === String(form.categoryId))?.name;
    const isFootwear = FOOTWEAR_KEYWORDS.some((k) => form.name.toLowerCase().includes(k));
    const sizes = form.size.split(',').map((s) => s.trim()).filter(Boolean);
    const price = parseFloat(form.price);
    const discount = parseFloat(form.discountPercentage) || 0;

    return (
        <Box sx={{ backgroundColor: '#f5f1e8', minHeight: '100vh', py: { xs: 4, md: 7 } }}>
            <Container maxWidth="lg">
                <AdminPageHeader
                    titleStart={isEdit ? 'Edit ' : 'New '}
                    titleAccent="piece"
                    subtitle={isEdit
                        ? 'Refine the details of this piece - the preview shows how it will appear in the shop.'
                        : 'Introduce a new piece to the collection - the preview shows how it will appear in the shop.'}
                    backLabel="Back to the collection"
                    onBack={() => navigate(-1)}
                />

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) 360px' },
                        gap: { xs: 4, md: 5 },
                        alignItems: 'start',
                    }}
                >
                    <Box sx={{ order: 1, minWidth: 0 }}>
                        <AdminSection number="01" title="The essentials" hint="What the piece is called and where it lives." delay={0.08}>
                            <TextField fullWidth label="Product name" name="name" value={form.name} onChange={handleChange} required sx={adminFieldSx} />
                            <TextField fullWidth select label="Category" name="categoryId" value={form.categoryId} onChange={handleChange} required sx={adminFieldSx}>
                                {categories.map((category) => (
                                    <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                fullWidth label="Description" name="description" value={form.description} onChange={handleChange}
                                required multiline minRows={4} sx={adminFieldSx}
                                helperText={`${form.description.length} characters`}
                            />
                        </AdminSection>

                        <AdminSection number="02" title="Price & stock" hint="Set an optional discount to feature it as a special offer." delay={0.14}>
                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2.5 }}>
                                <TextField
                                    fullWidth label="Price" name="price" type="number" value={form.price} onChange={handleChange}
                                    required sx={adminFieldSx} inputProps={{ step: '0.01', min: '0' }}
                                    InputProps={{ startAdornment: <InputAdornment position="start">€</InputAdornment> }}
                                />
                                <TextField
                                    fullWidth label="In stock" name="quantity" type="number" value={form.quantity} onChange={handleChange}
                                    required sx={adminFieldSx} inputProps={{ min: '0' }}
                                />
                                <TextField
                                    fullWidth label="Discount" name="discountPercentage" type="number" value={form.discountPercentage} onChange={handleChange}
                                    sx={adminFieldSx} inputProps={{ min: '0', max: '100', step: '1' }}
                                    InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                                    helperText="Optional"
                                />
                            </Box>
                            {discount > 0 && !Number.isNaN(price) && (
                                <Box sx={{
                                    display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 1.2, borderRadius: '10px',
                                    backgroundColor: 'rgba(156, 74, 74, 0.06)', border: '1px solid rgba(156, 74, 74, 0.15)',
                                }}>
                                    <Typography sx={{ fontFamily: '"Lato", sans-serif', fontSize: '0.85rem', color: '#6b5640' }}>
                                        Customers pay
                                    </Typography>
                                    <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.2rem', color: '#9c4a4a' }}>
                                        €{(price * (1 - discount / 100)).toFixed(2)}
                                    </Typography>
                                    <Typography sx={{ fontFamily: '"Lato", sans-serif', fontSize: '0.8rem', color: '#a0826d', textDecoration: 'line-through' }}>
                                        €{price.toFixed(2)}
                                    </Typography>
                                </Box>
                            )}
                        </AdminSection>

                        <AdminSection number="03" title="Details" hint="Used by the shop filters and the chat assistant." delay={0.2}>
                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
                                <TextField fullWidth label="Material" name="material" value={form.material} onChange={handleChange}
                                           placeholder="100% Italian Cashmere" sx={adminFieldSx} />
                                <TextField fullWidth label="Color" name="color" value={form.color} onChange={handleChange}
                                           placeholder="Navy Blue" sx={adminFieldSx} />
                            </Box>
                            <ChipChoice label="Season" value={form.season} options={SEASONS} onChange={(v) => set('season', v)} />
                            <ChipChoice label="Gender" value={form.gender} options={GENDERS} onChange={(v) => set('gender', v)} />
                            <ChipChoice label="Style" value={form.style} options={STYLES} onChange={(v) => set('style', v)} />
                            <Box>
                                <TextField
                                    fullWidth label="Available sizes" name="size" value={form.size} onChange={handleChange}
                                    placeholder={isFootwear ? '38,39,40,41,42' : 'XS,S,M,L,XL'} sx={adminFieldSx}
                                    helperText={isFootwear
                                        ? 'Внеси ги достапните големини одделени со запирка (пр. 38,39,40,41,42)'
                                        : 'Внеси ги достапните големини одделени со запирка (пр. XS,S,M,L)'}
                                />
                                {sizes.length > 0 && (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mt: 1.5 }}>
                                        {sizes.map((s, i) => (
                                            <Box key={`${s}-${i}`} sx={{
                                                minWidth: 36, px: 1, py: 0.5, textAlign: 'center', borderRadius: '6px',
                                                border: '1px solid rgba(212, 184, 150, 0.6)', backgroundColor: '#fffdf8',
                                                fontFamily: '"Lato", sans-serif', fontSize: '0.75rem', color: '#2c2c2c',
                                            }}>
                                                {s.toUpperCase()}
                                            </Box>
                                        ))}
                                    </Box>
                                )}
                            </Box>
                        </AdminSection>

                        <AdminSection number="04" title="Imagery" hint="The first image is shown in the shop; the second appears on hover." delay={0.26}>
                            <ImageField label="Main image URL" name="imageUrl" value={form.imageUrl} onChange={handleChange} required />
                            <ImageField label="Hover image URL" name="imageUrl2" value={form.imageUrl2} onChange={handleChange} helperText="Optional" />
                        </AdminSection>

                        {/* Save bar - stays in view at the bottom while scrolling the form */}
                        <Box sx={{
                            position: 'sticky', bottom: { xs: 12, md: 20 }, zIndex: 5,
                            display: 'flex', flexDirection: { xs: 'column-reverse', sm: 'row' }, justifyContent: 'flex-end', gap: 1.5,
                            p: 1.5, borderRadius: '16px',
                            backgroundColor: 'rgba(253, 251, 245, 0.88)', backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(212, 184, 150, 0.3)', boxShadow: '0 10px 30px rgba(44, 44, 44, 0.08)',
                        }}>
                            <Button onClick={() => navigate(-1)} disabled={saving} sx={adminSecondaryButtonSx}>
                                Cancel
                            </Button>
                            <Button
                                type="submit" disabled={saving}
                                startIcon={saving ? null : (isEdit ? <CheckRoundedIcon /> : <AddRoundedIcon />)}
                                sx={{ ...adminPrimaryButtonSx, minWidth: 190 }}
                            >
                                {saving ? <CircularProgress size={20} sx={{ color: '#8b7355' }} /> : (isEdit ? 'SAVE CHANGES' : 'PUBLISH PIECE')}
                            </Button>
                        </Box>
                    </Box>

                    {/* Below the form on phones (an empty preview first just pushed the form down); beside it on desktop, stretched to the full form height so the preview can stay in view (sticky) while scrolling. */}
                    <Box sx={{ ...pageEnterDelayedSx(0.18), order: 2, alignSelf: 'stretch' }}>
                        <LivePreview form={form} categoryName={categoryName} />
                    </Box>
                </Box>
            </Container>

            <AppSnackbar snackbar={snackbar} onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))} />
        </Box>
    );
};

export default ProductForm;
