import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { pageEnterSx, pageEnterDelayedSx } from '../utils/pageEnter';
import { fillEffectSx } from '../styles/buttons';

// Shared look for the admin pages (Add/Edit Product, Manage Categories): an
// editorial page header, numbered card sections, soft rounded fields and pill
// buttons - so all of them feel like one consistent "atelier" area.

export const adminFieldSx = {
    '& .MuiOutlinedInput-root': {
        borderRadius: '10px',
        backgroundColor: '#fffdf8',
        fontFamily: '"Lato", sans-serif',
        transition: 'box-shadow 0.25s ease',
        '& fieldset': { borderColor: 'rgba(212, 184, 150, 0.35)' },
        '&:hover fieldset': { borderColor: '#d4b896' },
        '&.Mui-focused': { boxShadow: '0 0 0 4px rgba(212, 184, 150, 0.15)' },
        '&.Mui-focused fieldset': { borderColor: '#c4a886', borderWidth: '1.5px' },
    },
    '& .MuiInputLabel-root': { fontFamily: '"Lato", sans-serif' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#8b7355' },
    '& .MuiFormHelperText-root': { fontFamily: '"Lato", sans-serif', color: '#a0826d' },
};

export const adminLabelSx = {
    fontFamily: '"Lato", sans-serif', fontSize: '0.7rem', fontWeight: 700,
    letterSpacing: '0.18em', color: '#8b7355', textTransform: 'uppercase', mb: 1,
};


// Main action (Publish piece / Save changes / Add category) - the home page
// "Shop Now" effect (styles/buttons) - and the quieter secondary action
// (Cancel), same effect in softer colours.
export const adminPrimaryButtonSx = {
    ...fillEffectSx('#e6b8a2', '#f5ebe0', '#22223b'),
    whiteSpace: 'nowrap',
    px: 4, py: 1.2, borderRadius: '999px',
    fontFamily: '"Lato", sans-serif', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em',
    '&.Mui-disabled': { color: 'rgba(34, 34, 59, 0.35)', borderColor: 'rgba(230, 184, 162, 0.45)' },
};

export const adminSecondaryButtonSx = {
    ...fillEffectSx('rgba(212, 184, 150, 0.5)', '#f5ebe0', '#8b7355'),
    whiteSpace: 'nowrap',
    px: 3, py: 1.2, borderRadius: '999px',
    fontFamily: '"Lato", sans-serif', fontSize: '0.75rem', letterSpacing: '0.15em',
    '&.Mui-disabled': { color: 'rgba(139, 115, 85, 0.4)', borderColor: 'rgba(212, 184, 150, 0.3)' },
};

// "← Back" link, small eyebrow, big serif title with an italic accent word,
// a thin gold rule and a one-line description. Fades/slides in on open.
export const AdminPageHeader = ({ titleStart, titleAccent, subtitle, backLabel = 'Back', onBack }) => (
    <Box sx={{ ...pageEnterSx, mb: { xs: 4, md: 6 } }}>
        {onBack && (
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={onBack}
                sx={{
                    mb: 3, color: '#8b7355', textTransform: 'none', fontFamily: '"Lato", sans-serif',
                    fontSize: '0.9rem', borderRadius: '999px', px: 2,
                    '&:hover': { backgroundColor: 'rgba(212, 184, 150, 0.12)', color: '#2c2c2c' },
                }}
            >
                {backLabel}
            </Button>
        )}
        <Box sx={{ textAlign: 'center' }}>
            <Typography sx={{ ...adminLabelSx, letterSpacing: '0.3em', mb: 1.5 }}>Atelier · Admin</Typography>
            <Typography sx={{
                fontFamily: '"Cormorant Garamond", serif', fontWeight: 300,
                fontSize: { xs: '2.4rem', md: '3.4rem' }, color: '#2c2c2c', lineHeight: 1.1,
            }}>
                {titleStart}
                <Box component="span" sx={{ fontStyle: 'italic', color: '#8b7355' }}>{titleAccent}</Box>
            </Typography>
            <Box sx={{ width: 48, height: '1px', backgroundColor: '#d4b896', mx: 'auto', my: 2.5 }} />
            {subtitle && (
                <Typography sx={{ fontFamily: '"Lato", sans-serif', fontSize: '0.95rem', color: '#8b7355', maxWidth: 520, mx: 'auto' }}>
                    {subtitle}
                </Typography>
            )}
        </Box>
    </Box>
);

// A numbered card section ("01  THE ESSENTIALS"), fading in after `delay` seconds.
export const AdminSection = ({ number, title, hint, delay = 0, action, children, sx }) => (
    <Box sx={{
        ...pageEnterDelayedSx(delay),
        backgroundColor: '#ffffff',
        border: '1px solid rgba(212, 184, 150, 0.25)',
        borderRadius: '16px',
        boxShadow: '0 6px 24px rgba(44, 44, 44, 0.05)',
        p: { xs: 2.5, sm: 4 },
        mb: 3,
        ...sx,
    }}>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, mb: 3 }}>
            <Typography sx={{
                fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic',
                fontSize: '2rem', color: '#d4b896', lineHeight: 1,
            }}>
                {number}
            </Typography>
            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{
                    fontFamily: '"Lato", sans-serif', fontSize: '0.78rem', fontWeight: 700,
                    letterSpacing: '0.2em', color: '#2c2c2c', textTransform: 'uppercase',
                }}>
                    {title}
                </Typography>
                {hint && (
                    <Typography sx={{ fontFamily: '"Lato", sans-serif', fontSize: '0.8rem', color: '#a0826d', mt: 0.3 }}>
                        {hint}
                    </Typography>
                )}
            </Box>
            {action}
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {children}
        </Box>
    </Box>
);
