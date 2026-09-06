import React, { useState } from 'react';
import { Box, Typography, Container, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const footerLinkSx = {
    color: '#ffffff',
    textDecoration: 'none',
    fontSize: '0.875rem',
    cursor: 'pointer',
    '&:hover': { opacity: 0.8 },
};

const Footer = () => {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (!/^\S+@\S+\.\S+$/.test(email)) return;
        // No newsletter backend exists yet - this just gives the shopper
        // a confirmation instead of silently doing nothing on submit.
        setSubscribed(true);
        setEmail('');
    };

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
                            {subscribed ? (
                                <Typography
                                    sx={{
                                        fontSize: '0.875rem',
                                        mb: 2,
                                        py: 1,
                                        fontFamily: '"Cormorant Garamond", serif',
                                        fontStyle: 'italic',
                                        opacity: 0,
                                        animation: 'footerFadeIn 0.5s ease forwards',
                                        '@keyframes footerFadeIn': {
                                            from: { opacity: 0, transform: 'translateY(4px)' },
                                            to: { opacity: 1, transform: 'translateY(0)' },
                                        },
                                    }}
                                >
                                    Thank you — you're on the list.
                                </Typography>
                            ) : (
                                <Box
                                    component="form"
                                    onSubmit={handleSubscribe}
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
                                        className="footer-newsletter-input"
                                        placeholder="Your email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
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
                                        type="submit"
                                        sx={{
                                            minWidth: 'auto',
                                            p: 0,
                                            color: '#ffffff',
                                            fontSize: '1.5rem',
                                            transition: 'transform 0.2s ease',
                                            '&:hover': { transform: 'translateX(4px)', backgroundColor: 'transparent' },
                                        }}
                                    >
                                        →
                                    </Button>
                                </Box>
                            )}
                            <style>
                                {`
                                    input::placeholder {
                                        color: rgba(255, 255, 255, 0.7);
                                        opacity: 1;
                                    }
                                    /* Chrome/Edge paint autofilled inputs with an opaque
                                       background no matter what we set inline - this keeps
                                       the field transparent even once the browser fills it. */
                                    .footer-newsletter-input:-webkit-autofill,
                                    .footer-newsletter-input:-webkit-autofill:hover,
                                    .footer-newsletter-input:-webkit-autofill:focus {
                                        -webkit-text-fill-color: #ffffff;
                                        /* A transparent shadow can't paint over the browser's
                                           forced autofill background - it has to be an opaque
                                           color matching the panel behind it (#a67c6d) so the
                                           field still reads as "transparent" against it. */
                                        -webkit-box-shadow: 0 0 0px 1000px #a67c6d inset;
                                        box-shadow: 0 0 0px 1000px #a67c6d inset;
                                        transition: background-color 9999s ease-in-out 0s;
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
                                <Typography component={RouterLink} to="/contact" sx={footerLinkSx}>
                                    Contacts
                                </Typography>
                                <Typography component={RouterLink} to="/faq" sx={footerLinkSx}>
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
                                <Typography component={RouterLink} to="/about" sx={footerLinkSx}>
                                    Our Story
                                </Typography>
                                <Typography component={RouterLink} to="/craftsmanship" sx={footerLinkSx}>
                                    Craftsmanship
                                </Typography>
                                <Typography component={RouterLink} to="/sustainability" sx={footerLinkSx}>
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
                                <Typography component={RouterLink} to="/services" sx={footerLinkSx}>
                                    All services
                                </Typography>
                                <Typography component={RouterLink} to="/returns" sx={footerLinkSx}>
                                    Return & exchange
                                </Typography>
                                <Typography component={RouterLink} to="/shipping" sx={footerLinkSx}>
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
                                <Typography component={RouterLink} to="/compliance" sx={footerLinkSx}>
                                    Compliance
                                </Typography>
                                <Typography component={RouterLink} to="/legal" sx={footerLinkSx}>
                                    Legal
                                </Typography>
                                <Typography component={RouterLink} to="/privacy" sx={footerLinkSx}>
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
                        © {new Date().getFullYear()} Maison de Renard. All rights reserved.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;