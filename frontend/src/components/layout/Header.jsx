import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box, Button, InputBase, Badge } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import useAuth from '../../hooks/useAuth';

const Header = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [cartCount, setCartCount] = useState(
        parseInt(localStorage.getItem('cartCount') || '0')
    );
    const { isAuthenticated, logout } = useAuth();

    const [currentQuote, setCurrentQuote] = useState(0);
    const quotes = [
        "Book a Private Appointment in Our Exclusive Store in Italy",
        "Timeless Elegance, Crafted with Passion and Dedication to Excellence",
        "Experience the Art of Quiet Luxury and Refined Sophistication",
        "Where Heritage Meets Modern Sophistication in Every Detail"
    ];

    useEffect(() => {
        const updateCount = () => {
            setCartCount(parseInt(localStorage.getItem('cartCount') || '0'));
        };
        window.addEventListener('cartUpdated', updateCount);
        return () => window.removeEventListener('cartUpdated', updateCount);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentQuote((prev) => (prev + 1) % quotes.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
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

    useEffect(() => {
        const urlSearch = searchParams.get('search');
        if (urlSearch !== searchQuery) {
            setSearchQuery(urlSearch || '');
        }
    }, [searchParams]);

    const navButtonSx = {
        color: '#2c2c2c',
        fontSize: '0.875rem',
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
            }}>
                <Box sx={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    {quotes.map((quote, index) => {
                        const isActive = currentQuote === index;
                        const isPrevious = currentQuote === (index + 1) % quotes.length;
                        return (
                            <Typography key={index} sx={{
                                position: 'absolute',
                                fontSize: '0.875rem',
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
                    justifyContent: 'center',
                    alignItems: 'center',
                    py: 2,
                }}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        cursor: 'pointer',
                    }} onClick={() => navigate('/')}>
                        <Box component="img" src="/logo.png" alt="Maison de Renard"
                             sx={{ height: 50, width: 'auto' }} />
                        <Typography variant="h5" sx={{
                            fontFamily: '"Tangerine", cursive',
                            fontSize: '2.5rem',
                            color: '#2c2c2c',
                            fontWeight: 400,
                        }}>
                            Maison de Renard
                        </Typography>
                    </Box>
                </Toolbar>

                {/* Navigation Bar */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    py: 1.5,
                    px: 4,
                    borderTop: '1px solid #e0d5c7',
                }}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 3,
                        marginLeft: '-78px',
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
                                    fontSize: '0.875rem',
                                    fontFamily: '"Lato", sans-serif',
                                    color: '#2c2c2c',
                                    '& input': { padding: '4px 0' },
                                }}
                            />
                        </Box>

                        {/* Navigation Links */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                            <Button onClick={() => navigate('/products?category=5')} sx={{
                                ...navButtonSx,
                                color: '#8b6f47',
                                fontWeight: 500,
                                '&::after': { ...navButtonSx['&::after'], backgroundColor: '#a0826d' },
                                '&:hover': { backgroundColor: 'transparent', color: '#6d5d3b' },
                            }}>
                                Spring/Summer 2026
                            </Button>
                            <Button onClick={() => navigate('/products?category=4')} sx={navButtonSx}>
                                Essentials
                            </Button>
                            <Button onClick={() => navigate('/products?category=1')} sx={navButtonSx}>
                                Women
                            </Button>
                            <Button onClick={() => navigate('/products?category=2')} sx={navButtonSx}>
                                Men
                            </Button>
                            <Button onClick={() => navigate('/products?category=3')} sx={navButtonSx}>
                                Gifts
                            </Button>
                            <Button onClick={() => navigate('/special-offers')} sx={{
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
                            {/* Cart */}
                            <Button onClick={() => navigate('/cart')} sx={{
                                color: '#2c2c2c', minWidth: 'auto', p: 0.5,
                                '&:hover': { backgroundColor: 'transparent' },
                            }}>
                                <Badge badgeContent={cartCount} sx={{
                                    '& .MuiBadge-badge': {
                                        backgroundColor: '#d32f2f', color: '#ffffff',
                                        fontSize: '0.7rem', minWidth: '18px', height: '18px',
                                    }
                                }}>
                                    <ShoppingCartIcon />
                                </Badge>
                            </Button>

                            {/* Person / Logout */}
                            {isAuthenticated() ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Button onClick={() => navigate('/order-history')} sx={{
                                        color: '#2c2c2c', minWidth: 'auto', p: 0.5,
                                        '&:hover': { backgroundColor: 'transparent' },
                                    }}>
                                        <PersonIcon />
                                    </Button>
                                    <Button onClick={() => {
                                        logout();
                                        localStorage.setItem('cartCount', '0');
                                        window.dispatchEvent(new Event('cartUpdated'));
                                        navigate('/');
                                    }} sx={{
                                        color: '#8b7355',
                                        fontSize: '0.75rem',
                                        fontFamily: '"Lato", sans-serif',
                                        letterSpacing: '0.08em',
                                        textTransform: 'uppercase',
                                        minWidth: 'auto',
                                        p: 0.5,
                                        '&:hover': { backgroundColor: 'transparent', color: '#2c2c2c' },
                                    }}>
                                        Logout
                                    </Button>
                                </Box>
                            ) : (
                                <Button onClick={() => navigate('/login')} sx={{
                                    color: '#2c2c2c', minWidth: 'auto', p: 0.5,
                                    '&:hover': { backgroundColor: 'transparent' },
                                }}>
                                    <PersonIcon />
                                </Button>
                            )}
                        </Box>
                    </Box>
                </Box>
            </AppBar>
        </Box>
    );
};

export default Header;