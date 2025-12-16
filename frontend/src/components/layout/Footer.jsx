import React from 'react';
import { Box, Typography, Container, Button } from '@mui/material';

const Footer = () => {
    return (
        <Box sx={{ backgroundColor: '#f5f1e8', pt: 6, pb: 4 }}>
            <Container maxWidth="xl">
                {/* Main Footer Content with Colored Background */}
                <Box
                    sx={{
                        backgroundColor: '#a67c6d',
                        color: '#ffffff',
                        px: { xs: 4, md: 6 },
                        py: { xs: 4, md: 6 },
                    }}
                >
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr 1fr 1fr' },
                            gap: { xs: 4, md: 4 },
                        }}
                    >
                        {/* Newsletter Section */}
                        <Box>
                            <Typography
                                sx={{
                                    fontFamily: '"Cormorant Garamond", serif',
                                    fontWeight: 400,
                                    fontSize: '1.3rem',
                                    mb: 2,
                                    letterSpacing: '0.05em',
                                }}
                            >
                                NEWSLETTER
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: '0.875rem',
                                    mb: 3,
                                    lineHeight: 1.6,
                                    opacity: 0.95,
                                }}
                            >
                                Subscribe to receive updates on new arrivals and exclusive offers.
                            </Typography>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    borderBottom: '1px solid rgba(255, 255, 255, 0.5)',
                                    pb: 1,
                                    mb: 2,
                                }}
                            >
                                <input
                                    type="email"
                                    placeholder="Your email address"
                                    style={{
                                        flex: 1,
                                        border: 'none',
                                        outline: 'none',
                                        backgroundColor: 'transparent',
                                        color: '#ffffff',
                                        fontSize: '0.875rem',
                                        fontFamily: '"Lato", sans-serif',
                                    }}
                                />
                                <Button
                                    sx={{
                                        minWidth: 'auto',
                                        p: 0,
                                        color: '#ffffff',
                                        fontSize: '1.5rem',
                                    }}
                                >
                                    →
                                </Button>
                            </Box>
                            <style>
                                {`
                                    input::placeholder {
                                        color: rgba(255, 255, 255, 0.7);
                                        opacity: 1;
                                    }
                                `}
                            </style>
                            <Typography
                                sx={{
                                    fontSize: '0.7rem',
                                    opacity: 0.8,
                                    lineHeight: 1.5,
                                }}
                            >
                                I acknowledge that my email address will be processed by Maison de Renard in accordance with the provisions of the Privacy Policy.
                            </Typography>
                        </Box>

                        {/* Get in Touch */}
                        <Box>
                            <Typography
                                sx={{
                                    fontFamily: '"Cormorant Garamond", serif',
                                    fontSize: '1rem',
                                    mb: 2,
                                    fontWeight: 500,
                                    letterSpacing: '0.05em',
                                }}
                            >
                                Get in touch
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                <Typography
                                    component="a"
                                    href="/contact"
                                    sx={{
                                        color: '#ffffff',
                                        textDecoration: 'none',
                                        fontSize: '0.875rem',
                                        cursor: 'pointer',
                                        '&:hover': { opacity: 0.8 },
                                    }}
                                >
                                    Contacts
                                </Typography>
                                <Typography
                                    component="a"
                                    href="/faq"
                                    sx={{
                                        color: '#ffffff',
                                        textDecoration: 'none',
                                        fontSize: '0.875rem',
                                        cursor: 'pointer',
                                        '&:hover': { opacity: 0.8 },
                                    }}
                                >
                                    FAQ
                                </Typography>
                            </Box>
                        </Box>

                        {/* Company */}
                        <Box>
                            <Typography
                                sx={{
                                    fontFamily: '"Cormorant Garamond", serif',
                                    fontSize: '1rem',
                                    mb: 2,
                                    fontWeight: 500,
                                    letterSpacing: '0.05em',
                                }}
                            >
                                Company
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                <Typography
                                    component="a"
                                    href="/about"
                                    sx={{
                                        color: '#ffffff',
                                        textDecoration: 'none',
                                        fontSize: '0.875rem',
                                        cursor: 'pointer',
                                        '&:hover': { opacity: 0.8 },
                                    }}
                                >
                                    Our Story
                                </Typography>
                                <Typography
                                    component="a"
                                    href="/craftsmanship"
                                    sx={{
                                        color: '#ffffff',
                                        textDecoration: 'none',
                                        fontSize: '0.875rem',
                                        cursor: 'pointer',
                                        '&:hover': { opacity: 0.8 },
                                    }}
                                >
                                    Craftsmanship
                                </Typography>
                                <Typography
                                    component="a"
                                    href="/sustainability"
                                    sx={{
                                        color: '#ffffff',
                                        textDecoration: 'none',
                                        fontSize: '0.875rem',
                                        cursor: 'pointer',
                                        '&:hover': { opacity: 0.8 },
                                    }}
                                >
                                    Sustainability
                                </Typography>
                            </Box>
                        </Box>

                        {/* Services */}
                        <Box>
                            <Typography
                                sx={{
                                    fontFamily: '"Cormorant Garamond", serif',
                                    fontSize: '1rem',
                                    mb: 2,
                                    fontWeight: 500,
                                    letterSpacing: '0.05em',
                                }}
                            >
                                Services
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                <Typography
                                    component="a"
                                    href="/services"
                                    sx={{
                                        color: '#ffffff',
                                        textDecoration: 'none',
                                        fontSize: '0.875rem',
                                        cursor: 'pointer',
                                        '&:hover': { opacity: 0.8 },
                                    }}
                                >
                                    All services
                                </Typography>
                                <Typography
                                    component="a"
                                    href="/returns"
                                    sx={{
                                        color: '#ffffff',
                                        textDecoration: 'none',
                                        fontSize: '0.875rem',
                                        cursor: 'pointer',
                                        '&:hover': { opacity: 0.8 },
                                    }}
                                >
                                    Return & exchange
                                </Typography>
                                <Typography
                                    component="a"
                                    href="/shipping"
                                    sx={{
                                        color: '#ffffff',
                                        textDecoration: 'none',
                                        fontSize: '0.875rem',
                                        cursor: 'pointer',
                                        '&:hover': { opacity: 0.8 },
                                    }}
                                >
                                    Delivery & shipping
                                </Typography>
                            </Box>
                        </Box>

                        {/* Legal & Cookies */}
                        <Box>
                            <Typography
                                sx={{
                                    fontFamily: '"Cormorant Garamond", serif',
                                    fontSize: '1rem',
                                    mb: 2,
                                    fontWeight: 500,
                                    letterSpacing: '0.05em',
                                }}
                            >
                                Legal & Cookies
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                <Typography
                                    component="a"
                                    href="/compliance"
                                    sx={{
                                        color: '#ffffff',
                                        textDecoration: 'none',
                                        fontSize: '0.875rem',
                                        cursor: 'pointer',
                                        '&:hover': { opacity: 0.8 },
                                    }}
                                >
                                    Compliance
                                </Typography>
                                <Typography
                                    component="a"
                                    href="/legal"
                                    sx={{
                                        color: '#ffffff',
                                        textDecoration: 'none',
                                        fontSize: '0.875rem',
                                        cursor: 'pointer',
                                        '&:hover': { opacity: 0.8 },
                                    }}
                                >
                                    Legal
                                </Typography>
                                <Typography
                                    component="a"
                                    href="/privacy"
                                    sx={{
                                        color: '#ffffff',
                                        textDecoration: 'none',
                                        fontSize: '0.875rem',
                                        cursor: 'pointer',
                                        '&:hover': { opacity: 0.8 },
                                    }}
                                >
                                    Privacy & Cookie notice
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    {/* Copyright */}
                    <Typography
                        align="center"
                        sx={{
                            fontSize: '0.75rem',
                            color: 'rgba(255, 255, 255, 0.7)',
                            pt: 4,
                            mt: 2,
                            borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                        }}
                    >
                        © 2025 Maison de Renard. All rights reserved.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;