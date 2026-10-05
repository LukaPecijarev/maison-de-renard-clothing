import React, { useState, useEffect } from 'react';
import {
    AppBar, Toolbar, Typography, Box, Button, InputBase, Badge,
    IconButton, Drawer, List, ListItemButton, ListItemText, Divider,
    useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import useAuth from '../../hooks/useAuth';
import { isAdminUser } from '../../utils/auth';

// Rotating messages in the banner above the header.
const QUOTES = [
    "Book a Private Appointment in Our Exclusive Store in Italy",
    "Timeless Elegance, Crafted with Passion and Dedication to Excellence",
    "Experience the Art of Quiet Luxury and Refined Sophistication",
    "Where Heritage Meets Modern Sophistication in Every Detail"
];

const Header = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();

    // Is this nav link the page we're on? (Same path, and the same ?category=
    // when the link has one.) Drives the persistent underline / drawer highlight.
    const isActive = (to) => {
        const [path, query] = to.split('?');
        if (location.pathname.replace(/\/+$/, '') !== path) return false;
        if (!query) return true;
        const wanted = new URLSearchParams(query).get('category');
        return wanted === null || searchParams.get('category') === wanted;
    };
    const activeProps = (to) => (isActive(to) ? { className: 'nav-active', 'aria-current': 'page' } : {});
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [cartCount, setCartCount] = useState(
        parseInt(localStorage.getItem('cartCount') || '0')
    );
    const [wishlistCount, setWishlistCount] = useState(
        JSON.parse(localStorage.getItem('wishlist') || '[]').length
    );
    const [mobileOpen, setMobileOpen] = useState(false);
    const { isAuthenticated, getUsername, logout } = useAuth();
    const isAdmin = isAdminUser();

    const navLinks = [
        { label: 'Fall/Winter 2026/2027', to: '/products?category=5' },
        { label: 'Essentials', to: '/products?category=4' },
        { label: 'Women', to: '/products?category=1' },
        { label: 'Men', to: '/products?category=2' },
        { label: 'Gifts', to: '/products?category=3' },
        { label: 'Special Offers', to: '/special-offers' },
    ];

    const handleNavigate = (to) => {
        setMobileOpen(false);
        navigate(to);
    };

    const [currentQuote, setCurrentQuote] = useState(0);
    useEffect(() => {
        const updateCount = () => {
            setCartCount(parseInt(localStorage.getItem('cartCount') || '0'));
        };
        window.addEventListener('cartUpdated', updateCount);
        return () => window.removeEventListener('cartUpdated', updateCount);
    }, []);

    useEffect(() => {
        const updateWishlistCount = () => {
            setWishlistCount(JSON.parse(localStorage.getItem('wishlist') || '[]').length);
        };
        window.addEventListener('wishlistUpdated', updateWishlistCount);
        return () => window.removeEventListener('wishlistUpdated', updateWishlistCount);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentQuote((prev) => (prev + 1) % QUOTES.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Nothing to sync when the URL already matches the search box. Without this
        // check the effect re-wrote the URL (with identical params) after every
        // navigation, pushing a duplicate history entry - so Back had to be
        // pressed twice to actually leave a page.
        if ((searchParams.get('search') || '') === searchQuery) return undefined;
        const timer = setTimeout(() => {
            if (searchQuery) {
                const currentParams = Object.fromEntries(searchParams.entries());
                setSearchParams({ ...currentParams, search: searchQuery });
            } else {
                const currentParams = Object.fromEntries(searchParams.entries());
                const { search, ...otherParams } = currentParams;
                setSearchParams(otherParams);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery, searchParams, setSearchParams]);

    // Keep the search box in step with the URL (e.g. after Back/Forward).
    useEffect(() => {
        setSearchQuery(searchParams.get('search') || '');
    }, [searchParams]);

    // Header icon buttons on phones/tablets - a little tighter on the smallest screens.
    const mobileIconSx = { color: '#2c2c2c', p: { xs: 0.75, sm: 1 } };

    const navButtonSx = {
        color: '#2c2c2c',
        fontSize: '0.78rem',
        fontFamily: '"Lato", sans-serif',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        px: 2,
        position: 'relative',
        '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: '1px',
            backgroundColor: '#e6ccb2',
            transition: 'width 0.3s ease',
        },
        '&:hover': { backgroundColor: 'transparent' },
        '&:hover::after': { width: '80%' },
        // The current category keeps its underline, not just on hover.
        '&.nav-active::after': { width: '80%' },
    };

    // Shared count-badge look for the wishlist/cart icons: a muted wine tone
    // (rather than a stock alert-red) with a soft glow so it reads as a
    // considered accent instead of an error/warning indicator.
    const countBadgeSx = {
        '& .MuiBadge-badge': {
            backgroundColor: '#9c4a4a',
            color: '#ffffff',
            // Playfair Display (already loaded in index.css): a high-contrast
            // serif that reads as luxe but, unlike the thin italic Cormorant used
            // before, stays crisp at badge size. Upright, lining (full-height) digits.
            fontFamily: '"Playfair Display", serif',
            fontSize: '0.62rem',
            fontWeight: 600,
            lineHeight: 1,
            fontVariantNumeric: 'lining-nums tabular-nums',
            minWidth: '16px',
            height: '16px',
            padding: '0 3px',
            border: '1px solid #f5f1e8',
            boxShadow: '0 2px 5px rgba(156, 74, 74, 0.45)',
        },
    };

    return (
        <Box>
            {/* Rotating Quotes Banner */}
            <Box sx={{
                backgroundColor: '#f5f1e8',
                py: 1.5,
                overflow: 'hidden',
                position: 'relative',
                height: '45px',
                width: '100%',
                px: 2,
            }}>
                <Box sx={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    {QUOTES.map((quote, index) => {
                        const isActive = currentQuote === index;
                        const isPrevious = currentQuote === (index + 1) % QUOTES.length;
                        return (
                            <Typography key={index} sx={{
                                position: 'absolute',
                                fontSize: { xs: '0.7rem', sm: '0.875rem' },
                                letterSpacing: '0.05em',
                                fontFamily: '"Lato", sans-serif',
                                color: '#2c2c2c',
                                whiteSpace: 'nowrap',
                                left: '50%',
                                transform: isActive
                                    ? 'translateX(-50%)'
                                    : isPrevious
                                        ? 'translateX(calc(100vw - 50%))'
                                        : 'translateX(calc(-100vw - 50%))',
                                opacity: isActive ? 1 : 0,
                                transition: 'all 1.2s ease-in-out',
                            }}>
                                {quote}
                            </Typography>
                        );
                    })}
                </Box>
            </Box>

            {/* Decorative Border */}
            <Box sx={{
                height: '3px',
                background: 'linear-gradient(to right, #8b4513 33%, #a0522d 33%, #a0522d 66%, #8b4513 66%)',
            }} />

            {/* Main Header */}
            <AppBar position="static" elevation={0} sx={{
                backgroundColor: '#f5f1e8',
                borderBottom: '1px solid #e0d5c7',
            }}>
                {/* Logo */}
                <Toolbar sx={{
                    display: 'flex',
                    justifyContent: isMobile ? 'space-between' : 'center',
                    alignItems: 'center',
                    py: 2,
                    px: { xs: 1, sm: 2, md: 3 },
                }}>
                    {isMobile && (
                        <IconButton onClick={() => setMobileOpen(true)} sx={mobileIconSx} aria-label="Open menu">
                            <MenuIcon />
                        </IconButton>
                    )}

                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: { xs: 0.6, sm: 1, md: 2 },
                        cursor: 'pointer',
                        minWidth: 0,
                    }} onClick={() => navigate('/')}>
                        <Box component="img" src="/logo.png" alt="Maison de Renard"
                             sx={{ height: { xs: 30, sm: 36, md: 50 }, width: 'auto' }} />
                        <Typography variant="h5" sx={{
                            fontFamily: '"Tangerine", cursive',
                            // Smaller on the narrowest phones so logo + name + icons fit in 360px.
                            fontSize: { xs: '1.35rem', sm: '1.6rem', md: '2.5rem' },
                            color: '#2c2c2c',
                            fontWeight: 400,
                            whiteSpace: 'nowrap',
                        }}>
                            Maison de Renard
                        </Typography>
                    </Box>

                    {isMobile && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0, sm: 0.5 } }}>
                            <IconButton onClick={() => navigate('/wishlist')} sx={mobileIconSx} aria-label="Wishlist">
                                <Badge badgeContent={wishlistCount} sx={countBadgeSx}>
                                    <FavoriteBorderIcon />
                                </Badge>
                            </IconButton>
                            <IconButton data-cart-icon onClick={() => navigate('/cart')} sx={mobileIconSx} aria-label="Cart">
                                <Badge badgeContent={cartCount} sx={countBadgeSx}>
                                    <ShoppingCartIcon />
                                </Badge>
                            </IconButton>
                            <IconButton
                                onClick={() => navigate(isAuthenticated() ? '/order-history' : '/login')}
                                sx={mobileIconSx}
                                aria-label="Account"
                            >
                                <PersonIcon />
                            </IconButton>
                        </Box>
                    )}
                </Toolbar>

                {/* Navigation Bar - desktop only, mobile uses the drawer instead */}
                {!isMobile && (
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        py: 1.5,
                        px: 4,
                        borderTop: '1px solid #e0d5c7',
                        flexWrap: 'wrap',
                    }}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            gap: { md: 2, lg: 3 },
                        }}>
                            {/* Search */}
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <SearchIcon sx={{ fontSize: 16, color: '#2c2c2c', mr: 1 }} />
                                <InputBase
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    sx={{
                                        width: '150px',
                                        fontSize: '1rem',
                                        fontFamily: '"Cormorant Garamond", serif',
                                        fontStyle: 'italic',
                                        letterSpacing: '0.02em',
                                        color: '#2c2c2c',
                                        '& input': { padding: '4px 0' },
                                        '& input::placeholder': { color: '#8b7355', opacity: 1 },
                                    }}
                                />
                            </Box>

                            {/* Navigation Links */}
                            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0 }}>
                                <Button {...activeProps('/products?category=5')} onClick={() => navigate('/products?category=5')} sx={{
                                    ...navButtonSx,
                                    color: '#8b6f47',
                                    fontWeight: 500,
                                    '&::after': { ...navButtonSx['&::after'], backgroundColor: '#a0826d' },
                                    '&:hover': { backgroundColor: 'transparent', color: '#6d5d3b' },
                                }}>
                                    Fall/Winter 2026/2027
                                </Button>
                                <Button {...activeProps('/products?category=4')} onClick={() => navigate('/products?category=4')} sx={navButtonSx}>
                                    Essentials
                                </Button>
                                <Button {...activeProps('/products?category=1')} onClick={() => navigate('/products?category=1')} sx={navButtonSx}>
                                    Women
                                </Button>
                                <Button {...activeProps('/products?category=2')} onClick={() => navigate('/products?category=2')} sx={navButtonSx}>
                                    Men
                                </Button>
                                <Button {...activeProps('/products?category=3')} onClick={() => navigate('/products?category=3')} sx={navButtonSx}>
                                    Gifts
                                </Button>
                                <Button {...activeProps('/special-offers')} onClick={() => navigate('/special-offers')} sx={{
                                    ...navButtonSx,
                                    color: '#c62828',
                                    fontWeight: 500,
                                    '&::after': { ...navButtonSx['&::after'], backgroundColor: '#d32f2f' },
                                    '&:hover': { backgroundColor: 'transparent', color: '#d32f2f' },
                                }}>
                                    Special Offers
                                </Button>
                            </Box>

                            {/* Icons */}
                            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                                {/* Wishlist */}
                                <Button onClick={() => navigate('/wishlist')} sx={{
                                    color: '#2c2c2c', minWidth: 'auto', p: 0.5,
                                    '&:hover': { backgroundColor: 'transparent' },
                                }}>
                                    <Badge badgeContent={wishlistCount} sx={countBadgeSx}>
                                        <FavoriteBorderIcon />
                                    </Badge>
                                </Button>

                                {/* Cart */}
                                <Button data-cart-icon onClick={() => navigate('/cart')} sx={{
                                    color: '#2c2c2c', minWidth: 'auto', p: 0.5,
                                    '&:hover': { backgroundColor: 'transparent' },
                                }}>
                                    <Badge badgeContent={cartCount} sx={countBadgeSx}>
                                        <ShoppingCartIcon />
                                    </Badge>
                                </Button>

                                {/* Person / Logout */}
                                {isAuthenticated() ? (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                        <Button onClick={() => navigate('/order-history')} sx={{
                                            color: '#2c2c2c', minWidth: 'auto', p: 0.5,
                                            '&:hover': { backgroundColor: 'transparent' },
                                        }}>
                                            <PersonIcon />
                                        </Button>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1 }}>
                                            <Typography sx={{
                                                color: '#8b7355',
                                                fontSize: '0.62rem',
                                                fontFamily: '"Lato", sans-serif',
                                                fontWeight: 700,
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.18em',
                                                whiteSpace: 'nowrap',
                                                mt: '2px',
                                            }}>
                                                Welcome
                                            </Typography>
                                            <Typography sx={{
                                                color: '#2c2c2c',
                                                fontSize: '0.82rem',
                                                fontFamily: '"Cormorant Garamond", serif',
                                                fontStyle: 'italic',
                                                fontWeight: 600,
                                                letterSpacing: '0.02em',
                                                whiteSpace: 'nowrap',
                                                textAlign: 'center',
                                                mt: '-1px',
                                            }}>
                                                {getUsername()}
                                            </Typography>
                                        </Box>
                                        <Button onClick={() => {
                                            logout();
                                            localStorage.setItem('cartCount', '0');
                                            window.dispatchEvent(new Event('cartUpdated'));
                                            navigate('/');
                                        }} sx={{
                                            color: '#6b5640',
                                            fontSize: '1rem',
                                            fontFamily: '"Cormorant Garamond", serif',
                                            fontStyle: 'italic',
                                            fontWeight: 600,
                                            letterSpacing: '0.03em',
                                            minWidth: 'auto',
                                            p: 0.5,
                                            '&:hover': { backgroundColor: 'transparent', color: '#2c2c2c' },
                                        }}>
                                            Logout
                                        </Button>
                                    </Box>
                                ) : (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <Button onClick={() => navigate('/login')} sx={{
                                            color: '#2c2c2c', minWidth: 'auto', p: 0.5,
                                            '&:hover': { backgroundColor: 'transparent' },
                                        }}>
                                            <PersonIcon />
                                        </Button>
                                        <Button onClick={() => navigate('/login')} sx={{
                                            color: '#6b5640',
                                            fontSize: '1rem',
                                            fontFamily: '"Cormorant Garamond", serif',
                                            fontStyle: 'italic',
                                            fontWeight: 600,
                                            letterSpacing: '0.03em',
                                            minWidth: 'auto',
                                            p: 0.5,
                                            '&:hover': { backgroundColor: 'transparent', color: '#2c2c2c' },
                                        }}>
                                            Login
                                        </Button>
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    </Box>
                )}
            </AppBar>

            {/* Mobile Navigation Drawer */}
            <Drawer
                anchor="left"
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                ModalProps={{ keepMounted: true }}
            >
                <Box sx={{ width: 280, backgroundColor: '#f5f1e8', height: '100%', pt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', px: 2, mb: 1 }}>
                        <SearchIcon sx={{ fontSize: 18, color: '#2c2c2c', mr: 1 }} />
                        <InputBase
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            sx={{
                                flex: 1,
                                fontSize: '1.05rem',
                                fontFamily: '"Cormorant Garamond", serif',
                                fontStyle: 'italic',
                                color: '#2c2c2c',
                                '& input': { padding: '6px 0' },
                                '& input::placeholder': { color: '#8b7355', opacity: 1 },
                            }}
                        />
                    </Box>
                    <Divider sx={{ borderColor: '#e0d5c7', mb: 1 }} />
                    <List>
                        {navLinks.map((link) => (
                            <ListItemButton
                                key={link.to}
                                selected={isActive(link.to)}
                                onClick={() => handleNavigate(link.to)}
                                sx={{
                                    borderLeft: '2px solid transparent',
                                    '&.Mui-selected': { backgroundColor: 'rgba(212, 184, 150, 0.16)', borderLeftColor: '#d4b896' },
                                    '&.Mui-selected:hover': { backgroundColor: 'rgba(212, 184, 150, 0.22)' },
                                }}
                            >
                                <ListItemText
                                    primary={link.label}
                                    primaryTypographyProps={{
                                        fontFamily: '"Lato", sans-serif',
                                        fontSize: '0.9rem',
                                        letterSpacing: '0.05em',
                                        textTransform: 'uppercase',
                                        color: link.to === '/special-offers' ? '#c62828' : '#2c2c2c',
                                    }}
                                />
                            </ListItemButton>
                        ))}
                    </List>
                    <Divider sx={{ borderColor: '#e0d5c7', mb: 1 }} />
                    <List>
                        <ListItemButton onClick={() => handleNavigate('/wishlist')}>
                            <ListItemText primary="Wishlist" primaryTypographyProps={{ fontFamily: '"Lato", sans-serif', fontSize: '0.9rem' }} />
                        </ListItemButton>
                        {isAuthenticated() && (
                            <ListItemButton onClick={() => handleNavigate('/order-history')}>
                                <ListItemText primary="Order History" primaryTypographyProps={{ fontFamily: '"Lato", sans-serif', fontSize: '0.9rem' }} />
                            </ListItemButton>
                        )}
                        {isAuthenticated() && isAdmin && (
                            <ListItemButton onClick={() => handleNavigate('/admin/categories')}>
                                <ListItemText primary="Manage Categories" primaryTypographyProps={{ fontFamily: '"Lato", sans-serif', fontSize: '0.9rem' }} />
                            </ListItemButton>
                        )}
                        {isAuthenticated() ? (
                            <ListItemButton onClick={() => {
                                logout();
                                localStorage.setItem('cartCount', '0');
                                window.dispatchEvent(new Event('cartUpdated'));
                                setMobileOpen(false);
                                navigate('/');
                            }}>
                                <ListItemText
                                    primary="Logout"
                                    secondary={getUsername()}
                                    primaryTypographyProps={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic', fontSize: '1.1rem', fontWeight: 600, color: '#6b5640' }}
                                    secondaryTypographyProps={{ fontFamily: '"Lato", sans-serif', fontSize: '0.78rem', color: '#6b5640' }}
                                />
                            </ListItemButton>
                        ) : (
                            <ListItemButton onClick={() => handleNavigate('/login')}>
                                <ListItemText primary="Login" primaryTypographyProps={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic', fontSize: '1.1rem', fontWeight: 600, color: '#6b5640' }} />
                            </ListItemButton>
                        )}
                    </List>
                </Box>
            </Drawer>
        </Box>
    );
};

export default Header;