import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box, Button, InputBase } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';

const Header = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

    // Rotating quotes state
    const [currentQuote, setCurrentQuote] = useState(0);
    const quotes = [
        "Book a Private Appointment in Our Exclusive Store in Italy",
        "Timeless Elegance, Crafted with Passion and Dedication to Excellence",
        "Experience the Art of Quiet Luxury and Refined Sophistication",
        "Where Heritage Meets Modern Sophistication in Every Detail"
    ];

    // Rotate quotes every 4 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentQuote((prev) => (prev + 1) % quotes.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    // Debounced search effect
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery) {
                // ✅ Update only the search parameter, stay on current page
                const currentParams = Object.fromEntries(searchParams.entries());
                setSearchParams({ ...currentParams, search: searchQuery });
            } else {
                // Clear search parameter if query is empty
                const currentParams = Object.fromEntries(searchParams.entries());
                const { search, ...otherParams } = currentParams;
                setSearchParams(otherParams);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery, searchParams, setSearchParams]);

    // Update search query when URL changes
    useEffect(() => {
        const urlSearch = searchParams.get('search');
        if (urlSearch !== searchQuery) {
            setSearchQuery(urlSearch || '');
        }
    }, [searchParams]);

    return (
        <Box>
            {/* Rotating Quotes Banner - TOP OF PAGE */}
            <Box
                sx={{
                    backgroundColor: '#f5f1e8',
                    py: 1.5,
                    overflow: 'hidden',
                    position: 'relative',
                    height: '45px',
                    width: '100%',
                }}
            >
                <Box
                    sx={{
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {quotes.map((quote, index) => {
                        const isActive = currentQuote === index;
                        const isPrevious = currentQuote === (index + 1) % quotes.length;

                        return (
                            <Typography
                                key={index}
                                sx={{
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
                                }}
                            >
                                {quote}
                            </Typography>
                        );
                    })}
                </Box>
            </Box>

            {/* Decorative Border */}
            <Box
                sx={{
                    height: '3px',
                    background: 'linear-gradient(to right, #8b4513 33%, #a0522d 33%, #a0522d 66%, #8b4513 66%)',
                }}
            />

            {/* Main Header */}
            <AppBar
                position="static"
                elevation={0}
                sx={{
                    backgroundColor: '#f5f1e8',
                    borderBottom: '1px solid #e0d5c7',
                }}
            >
                {/* Logo Section - Centered */}
                <Toolbar
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        py: 2,
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            cursor: 'pointer',
                        }}
                        onClick={() => navigate('/')}
                    >
                        <Box
                            component="img"
                            src="/logo.png"
                            alt="Maison de Renard"
                            sx={{
                                height: 50,
                                width: 'auto',
                            }}
                        />
                        <Typography
                            variant="h5"
                            sx={{
                                fontFamily: '"Tangerine", cursive',
                                fontSize: '2.5rem',
                                color: '#2c2c2c',
                                fontWeight: 400,
                            }}
                        >
                            Maison de Renard
                        </Typography>
                    </Box>
                </Toolbar>

                {/* Navigation Bar with Search and Icons */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        py: 1.5,
                        px: 4,
                        borderTop: '1px solid #e0d5c7',
                    }}
                >
                    {/* Complete centered group */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 3,
                            marginLeft: '-78px', // ✅ Shift slightly left
                        }}
                    >
                        {/* Search Input - Left */}
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
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
                                    '& input': {
                                        padding: '4px 0',
                                    },
                                }}
                            />
                        </Box>

                        {/* Navigation Links - Center */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                            <Button
                                onClick={() => navigate('/products?season=fw2025')}
                                sx={{
                                    color: '#8b6f47', // ✅ Soft autumn brown
                                    fontSize: '0.875rem',
                                    fontFamily: '"Lato", sans-serif',
                                    letterSpacing: '0.05em',
                                    textTransform: 'uppercase',
                                    px: 2,
                                    position: 'relative',
                                    fontWeight: 500, // ✅ Slightly bolder
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        bottom: 0,
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        width: 0,
                                        height: '1px',
                                        backgroundColor: '#a0826d', // ✅ Warm brown underline
                                        transition: 'width 0.3s ease',
                                    },
                                    '&:hover': {
                                        backgroundColor: 'transparent',
                                        color: '#6d5d3b', // ✅ Darker brown on hover
                                    },
                                    '&:hover::after': {
                                        width: '80%',
                                    },
                                }}
                            >
                                Fall/Winter 2025-2026
                            </Button>
                            <Button
                                onClick={() => navigate('/products?category=4')}
                                sx={{
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
                                    '&:hover': {
                                        backgroundColor: 'transparent',
                                    },
                                    '&:hover::after': {
                                        width: '80%',
                                    },
                                }}
                            >
                                Essentials
                            </Button>
                            <Button
                                onClick={() => navigate('/products?category=1')}
                                sx={{
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
                                    '&:hover': {
                                        backgroundColor: 'transparent',
                                    },
                                    '&:hover::after': {
                                        width: '80%',
                                    },
                                }}
                            >
                                Women
                            </Button>
                            <Button
                                onClick={() => navigate('/products?category=2')}
                                sx={{
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
                                    '&:hover': {
                                        backgroundColor: 'transparent',
                                    },
                                    '&:hover::after': {
                                        width: '80%',
                                    },
                                }}
                            >
                                Men
                            </Button>
                            <Button
                                onClick={() => navigate('/products?category=3')}
                                sx={{
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
                                    '&:hover': {
                                        backgroundColor: 'transparent',
                                    },
                                    '&:hover::after': {
                                        width: '80%',
                                    },
                                }}
                            >
                                Gifts
                            </Button>
                            <Button
                                onClick={() => navigate('/special-offers')}
                                sx={{
                                    color: '#c62828', // ✅ Soft red color
                                    fontSize: '0.875rem',
                                    fontFamily: '"Lato", sans-serif',
                                    letterSpacing: '0.05em',
                                    textTransform: 'uppercase',
                                    px: 2,
                                    position: 'relative',
                                    fontWeight: 500, // ✅ Slightly bolder
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        bottom: 0,
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        width: 0,
                                        height: '1px',
                                        backgroundColor: '#d32f2f', // ✅ Red underline
                                        transition: 'width 0.3s ease',
                                    },
                                    '&:hover': {
                                        backgroundColor: 'transparent',
                                        color: '#d32f2f', // ✅ Brighter red on hover
                                    },
                                    '&:hover::after': {
                                        width: '80%',
                                    },
                                }}
                            >
                                Special Offers
                            </Button>
                        </Box>

                        {/* Icons - Right */}
                        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                            <Button
                                onClick={() => navigate('/cart')}
                                sx={{
                                    color: '#2c2c2c',
                                    minWidth: 'auto',
                                    p: 0.5,
                                    '&:hover': {
                                        backgroundColor: 'transparent',
                                    },
                                }}
                            >
                                <ShoppingCartIcon />
                            </Button>
                            <Button
                                onClick={() => navigate('/login')}
                                sx={{
                                    color: '#2c2c2c',
                                    minWidth: 'auto',
                                    p: 0.5,
                                    '&:hover': {
                                        backgroundColor: 'transparent',
                                    },
                                }}
                            >
                                <PersonIcon />
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </AppBar>
        </Box>
    );
};

export default Header;