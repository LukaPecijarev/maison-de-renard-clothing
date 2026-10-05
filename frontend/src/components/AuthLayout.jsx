import React, { useState } from 'react';
import { Box, Container, Typography, TextField, InputAdornment, IconButton, Button, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import { adminFieldSx, adminPrimaryButtonSx } from './AdminUi';
import { pageEnterSx, pageEnterDelayedSx } from '../utils/pageEnter';

// Shared look for LoginPage and RegisterPage: one large rounded card split into
// a campaign photo (with the script logo and a line of copy) and the form.
// On phones the photo becomes a short banner above the form.

export const authFieldSx = adminFieldSx;

// Password field with a show/hide toggle.
export const PasswordField = (props) => {
    const [visible, setVisible] = useState(false);
    return (
        <TextField
            {...props}
            type={visible ? 'text' : 'password'}
            sx={authFieldSx}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton
                            aria-label={visible ? 'Hide password' : 'Show password'}
                            onClick={() => setVisible((v) => !v)}
                            edge="end"
                            sx={{ color: '#a0826d', '&:hover': { color: '#6b5640', backgroundColor: 'rgba(212, 184, 150, 0.12)' } }}
                        >
                            {visible ? <VisibilityOffOutlinedIcon fontSize="small" /> : <VisibilityOutlinedIcon fontSize="small" />}
                        </IconButton>
                    </InputAdornment>
                ),
            }}
        />
    );
};

// Error message in the brand's wine tone; `key` it by the message so it gives a
// small shake each time a new error appears.
export const AuthError = ({ message }) => (
    <Box role="alert" sx={{
        display: 'flex', alignItems: 'center', gap: 1.2,
        px: 2, py: 1.4, borderRadius: '10px',
        backgroundColor: 'rgba(156, 74, 74, 0.06)', border: '1px solid rgba(156, 74, 74, 0.25)',
        color: '#9c4a4a', fontFamily: '"Lato", sans-serif', fontSize: '0.88rem',
        animation: 'authShake 0.45s ease',
        '@keyframes authShake': {
            '0%, 100%': { transform: 'translateX(0)' },
            '20%': { transform: 'translateX(-6px)' },
            '40%': { transform: 'translateX(5px)' },
            '60%': { transform: 'translateX(-3px)' },
            '80%': { transform: 'translateX(2px)' },
        },
    }}>
        <ErrorOutlineRoundedIcon sx={{ fontSize: 20 }} />
        {message}
    </Box>
);

export const AuthSubmitButton = ({ loading, children }) => (
    <Button type="submit" fullWidth disabled={loading} sx={{ ...adminPrimaryButtonSx, py: 1.6, mt: 1, borderRadius: '10px' }}>
        {loading ? <CircularProgress size={20} sx={{ color: '#8b7355' }} /> : children}
    </Button>
);

// "Don't have an account? Register" - the link's underline grows on hover.
export const AuthSwitch = ({ question, linkLabel, to }) => (
    <Typography align="center" sx={{ fontFamily: '"Lato", sans-serif', fontSize: '0.9rem', color: '#8b7355' }}>
        {question}{' '}
        <Box
            component={Link}
            to={to}
            sx={{
                color: '#2c2c2c', textDecoration: 'none', fontWeight: 700, position: 'relative',
                '&::after': {
                    content: '""', position: 'absolute', left: 0, bottom: -2, height: '1px', width: '100%',
                    backgroundColor: '#d4b896', transform: 'scaleX(0.35)', transformOrigin: 'left',
                    transition: 'transform 0.35s ease',
                },
                '&:hover::after': { transform: 'scaleX(1)' },
            }}
        >
            {linkLabel}
        </Box>
    </Typography>
);

const AuthLayout = ({ image, imageAlt, quote, eyebrow, titleStart, titleAccent, subtitle, children }) => (
    <Box sx={{ backgroundColor: '#f5f1e8', py: { xs: 3, md: 7 } }}>
        <Container maxWidth="lg">
            <Box sx={{
                ...pageEnterSx,
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1.05fr 1fr' },
                minHeight: { md: 640 },
                backgroundColor: '#ffffff',
                borderRadius: '22px',
                overflow: 'hidden',
                border: '1px solid rgba(212, 184, 150, 0.25)',
                boxShadow: '0 30px 80px rgba(44, 44, 44, 0.12)',
            }}>
                {/* Campaign photo */}
                <Box sx={{ position: 'relative', minHeight: { xs: 190, md: 'auto' }, overflow: 'hidden', '&:hover img': { transform: 'scale(1.04)' } }}>
                    <Box component="img" src={image} alt={imageAlt}
                         sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%', transition: 'transform 1.4s cubic-bezier(0.25, 0.8, 0.25, 1)' }} />
                    <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(28, 22, 16, 0.65) 0%, rgba(28, 22, 16, 0.1) 55%, rgba(28, 22, 16, 0.25) 100%)' }} />
                    <Box sx={{ position: 'absolute', top: { xs: 16, md: 28 }, left: { xs: 20, md: 32 }, display: 'flex', alignItems: 'center', gap: 1.2 }}>
                        <Box component="img" src="/logo.png" alt="" sx={{ height: { xs: 28, md: 36 }, filter: 'brightness(0) invert(1)', opacity: 0.95 }} />
                        <Typography sx={{ fontFamily: '"Tangerine", cursive', fontSize: { xs: '1.8rem', md: '2.4rem' }, color: '#fdfbf5', lineHeight: 1 }}>
                            Maison de Renard
                        </Typography>
                    </Box>
                    <Box sx={{ ...pageEnterDelayedSx(0.25), position: 'absolute', left: { xs: 20, md: 32 }, right: { xs: 20, md: 32 }, bottom: { xs: 18, md: 34 }, color: '#fdfbf5', display: { xs: 'none', sm: 'block' } }}>
                        <Box sx={{ width: 36, height: '1px', backgroundColor: 'rgba(253, 251, 245, 0.7)', mb: 1.5 }} />
                        <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic', fontSize: { sm: '1.4rem', md: '1.75rem' }, lineHeight: 1.3, maxWidth: 420 }}>
                            {quote}
                        </Typography>
                    </Box>
                </Box>

                {/* Form */}
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', px: { xs: 3, sm: 6, md: 7 }, py: { xs: 4, md: 6 } }}>
                    <Box sx={pageEnterDelayedSx(0.1)}>
                        <Typography sx={{ fontFamily: '"Lato", sans-serif', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.3em', color: '#8b7355', mb: 1.5 }}>
                            {eyebrow}
                        </Typography>
                        <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 300, fontSize: { xs: '2.3rem', md: '2.9rem' }, color: '#2c2c2c', lineHeight: 1.1 }}>
                            {titleStart}
                            <Box component="span" sx={{ fontStyle: 'italic', color: '#8b7355' }}>{titleAccent}</Box>
                        </Typography>
                        <Box sx={{ width: 44, height: '1px', backgroundColor: '#d4b896', my: 2.2 }} />
                        <Typography sx={{ fontFamily: '"Lato", sans-serif', fontSize: '0.92rem', color: '#8b7355', mb: 4 }}>
                            {subtitle}
                        </Typography>
                    </Box>
                    <Box sx={pageEnterDelayedSx(0.18)}>
                        {children}
                    </Box>
                </Box>
            </Box>
        </Container>
    </Box>
);

export default AuthLayout;
