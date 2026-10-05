import React from 'react';
import { Box, ButtonBase, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';

// Admin action buttons share the chat launcher's look (components/ChatBot.js):
// tan #d4b896 -> #c4a886 on hover, white icon, the same soft shadow, a small
// lift on hover and a gentle press-in on click.
export const adminButtonSx = {
    backgroundColor: '#d4b896',
    color: '#ffffff',
    boxShadow: '0 6px 24px rgba(212, 184, 150, 0.45)',
    transition: 'background-color 0.3s ease, transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease',
    '&:hover': {
        backgroundColor: '#c4a886',
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 30px rgba(196, 168, 134, 0.55)',
    },
    '&:active': { transform: 'translateY(0) scale(0.95)' },
};

// The small round edit button (product cards, category list): the delete
// button's cream background with a soft brown icon, so the two read as a pair;
// on hover it warms to the brand tan with a white icon.
export const adminEditIconButtonSx = {
    backgroundColor: 'rgba(245, 235, 224, 0.95)',
    color: '#6b5640',
    transition: 'background-color 0.3s ease, color 0.3s ease, transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease',
    '&:hover': {
        backgroundColor: '#d4b896',
        color: '#ffffff',
        transform: 'translateY(-1px) scale(1.06)',
        boxShadow: '0 4px 14px rgba(139, 115, 85, 0.3)',
    },
    '&:active': { transform: 'scale(0.95)' },
};

// Floating admin button (category pages, Special Offers): a round tan "+"
// that, on hover (desktop), expands to "ADD PRODUCT" - and reveals a second
// option above it, "MANAGE CATEGORIES". Both live in one fixed wrapper, and the
// gap between them is part of the wrapper, so moving the mouse up from the "+"
// to the second option doesn't lose the hover. Keyboard focus reveals it too.
// Touch screens (no hover) just get the "+"; categories stay in the menu there.
export const AddProductFab = ({ onAddProduct, onManageCategories }) => (
    <Box sx={{
        position: 'fixed',
        bottom: { xs: 'calc(16px + env(safe-area-inset-bottom))', sm: 27 },
        left: { xs: 16, sm: 32 },
        zIndex: 1050,
        display: 'flex', flexDirection: 'column-reverse', alignItems: 'flex-start', gap: 1.25,
        animation: 'adminFabIn 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)',
        '@keyframes adminFabIn': {
            '0%': { opacity: 0, transform: 'translateY(24px) scale(0.8)' },
            '100%': { opacity: 1, transform: 'none' },
        },
        '& .admin-fab-label': {
            maxWidth: 0, opacity: 0, ml: 0,
            transition: 'max-width 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease, margin-left 0.35s ease',
        },
        '& .admin-fab-secondary': {
            opacity: 0, transform: 'translateY(10px) scale(0.95)', pointerEvents: 'none',
            transition: 'opacity 0.3s ease, transform 0.35s cubic-bezier(0.25, 0.8, 0.25, 1), background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
        },
        '@media (hover: hover)': {
            '&:hover .admin-fab-label, &:focus-within .admin-fab-label': { maxWidth: 140, opacity: 1, ml: 1 },
            '&:hover .admin-fab-icon, &:focus-within .admin-fab-icon': { transform: 'rotate(90deg)' },
            '&:hover .admin-fab-secondary, &:focus-within .admin-fab-secondary': { opacity: 1, transform: 'none', pointerEvents: 'auto' },
        },
        // No hover on touch screens: keep the second option out of the way entirely.
        '@media (hover: none)': { '& .admin-fab-secondary': { display: 'none' } },
    }}>
        <ButtonBase
            onClick={onAddProduct}
            aria-label="Add product"
            sx={{
                ...adminButtonSx,
                height: { xs: 52, sm: 60 },
                minWidth: { xs: 52, sm: 60 },
                px: { xs: 0, sm: 2.1 },
                borderRadius: '999px',
                border: '1.5px solid rgba(255, 255, 255, 0.7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
        >
            <AddIcon className="admin-fab-icon" sx={{ fontSize: { xs: 26, sm: 28 }, transition: 'transform 0.35s ease' }} />
            <Box className="admin-fab-label" sx={{ overflow: 'hidden', whiteSpace: 'nowrap', display: { xs: 'none', sm: 'block' } }}>
                <Typography sx={{
                    fontFamily: '"Lato", sans-serif', fontSize: '0.72rem',
                    fontWeight: 700, letterSpacing: '0.15em',
                }}>
                    ADD PRODUCT
                </Typography>
            </Box>
        </ButtonBase>

        {onManageCategories && (
            <ButtonBase
                className="admin-fab-secondary"
                onClick={onManageCategories}
                aria-label="Manage categories"
                sx={{
                    display: 'flex', alignItems: 'center', gap: 1,
                    height: 44, pl: 1.6, pr: 2.2,
                    borderRadius: '999px',
                    backgroundColor: '#fdfbf5',
                    border: '1px solid rgba(212, 184, 150, 0.7)',
                    color: '#6b5640',
                    boxShadow: '0 6px 20px rgba(139, 115, 85, 0.18)',
                    whiteSpace: 'nowrap',
                    '&:hover': {
                        backgroundColor: '#d4b896', borderColor: '#d4b896', color: '#ffffff',
                        boxShadow: '0 8px 24px rgba(196, 168, 134, 0.45)',
                    },
                }}
            >
                <CategoryOutlinedIcon sx={{ fontSize: 20 }} />
                <Typography sx={{
                    fontFamily: '"Lato", sans-serif', fontSize: '0.7rem',
                    fontWeight: 700, letterSpacing: '0.15em',
                }}>
                    MANAGE CATEGORIES
                </Typography>
            </ButtonBase>
        )}
    </Box>
);
