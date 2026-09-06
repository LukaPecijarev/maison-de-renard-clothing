import React, { useEffect, useRef } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Reveal from '../components/Reveal';

// "Our Story" - the one footer destination that's worth a real, designed
// page rather than the generic InfoPage template, since it's the Maison's
// flagship narrative moment. Reuses the same hero + scroll-scale parallax
// treatment as HomePage for a consistent cinematic feel.
const AboutPage = () => {
    const navigate = useNavigate();
    const heroVideoRef = useRef(null);
    const midVideoRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;

            if (heroVideoRef.current) {
                const scale = 1 + scrollY * 0.0003;
                heroVideoRef.current.style.transform = `scale(${Math.min(scale, 2.35)})`;
            }
            if (midVideoRef.current) {
                const container = document.querySelector('.about-mid-video');
                if (container) {
                    const rect = container.getBoundingClientRect();
                    const offset = (window.innerHeight / 2 - rect.top) * 0.08;
                    const scale = 1 + Math.max(0, offset) * 0.008;
                    midVideoRef.current.style.transform = `scale(${Math.min(scale, 1.08)})`;
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <Box sx={{ backgroundColor: '#f5f1e8' }}>
            {/* Hero Video */}
            <Box sx={{
                position: 'relative', width: '100%', height: '70vh',
                backgroundColor: '#e8dcc8', overflow: 'hidden',
            }}>
                <video
                    ref={heroVideoRef}
                    autoPlay loop muted playsInline
                    style={{
                        width: '100%', height: '100%', objectFit: 'cover',
                        transition: 'transform 0.1s ease-out',
                        transformOrigin: 'center center',
                    }}
                >
                    <source src="/MaisonVideo.mp4" type="video/mp4" />
                </video>
                <Box sx={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.35) 100%)',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', textAlign: 'center', px: 3,
                }}>
                    <Typography sx={{
                        fontFamily: '"Lato", sans-serif', fontSize: '0.8rem',
                        letterSpacing: '0.3em', color: '#f5ebe0', mb: 2, textTransform: 'uppercase',
                    }}>
                        Since the Atelier's First Stitch
                    </Typography>
                    <Typography variant="h2" sx={{
                        fontFamily: '"Cormorant Garamond", serif', fontWeight: 300,
                        letterSpacing: '0.08em', color: '#ffffff',
                        fontSize: { xs: '2.5rem', md: '4rem' },
                    }}>
                        Our Story
                    </Typography>
                </Box>
            </Box>

            <Container maxWidth="md" sx={{ pt: 10, pb: 4 }}>
                <Reveal>
                    <Typography variant="h4" align="center" sx={{
                        fontFamily: '"Cormorant Garamond", serif', fontWeight: 300,
                        letterSpacing: '0.05em', mb: 4, color: '#2c2c2c',
                    }}>
                        A Heritage of Quiet Luxury
                    </Typography>
                </Reveal>
                <Reveal delay={0.1}>
                    <Typography sx={{
                        fontFamily: '"Lato", sans-serif', fontSize: '1rem', lineHeight: 1.9,
                        color: '#555', mb: 3, textAlign: 'center',
                    }}>
                        Maison de Renard began as a single atelier, dedicated to the belief that true
                        luxury speaks softly. What started as a small workshop devoted to precise
                        tailoring and honest materials has grown into a house defined by restraint —
                        every silhouette considered, every seam deliberate, every fabric chosen for how
                        it will feel a decade from now, not just today.
                    </Typography>
                </Reveal>
                <Reveal delay={0.15}>
                    <Typography sx={{
                        fontFamily: '"Lato", sans-serif', fontSize: '1rem', lineHeight: 1.9,
                        color: '#555', textAlign: 'center',
                    }}>
                        We work with a small circle of Italian mills and artisan workshops, most of them
                        family-run for generations. It is a slower way to build a collection, but it is
                        the only way we know that stays true to the Maison's name.
                    </Typography>
                </Reveal>
            </Container>

            {/* Mid Video */}
            <Box
                className="about-mid-video"
                sx={{
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    width: '100%', height: '70vh', my: 8, overflow: 'hidden',
                    backgroundColor: '#f5f1e8',
                }}
            >
                <video
                    ref={midVideoRef}
                    autoPlay loop muted playsInline
                    style={{
                        width: '70%', height: 'auto', maxHeight: '100%', objectFit: 'cover',
                        transition: 'transform 0.1s ease-out',
                        transformOrigin: 'center center',
                    }}
                >
                    <source src="/MaisonHomePage2.mp4" type="video/mp4" />
                </video>
            </Box>

            <Container maxWidth="md" sx={{ pb: 10 }}>
                <Box sx={{
                    display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 6, mb: 8,
                }}>
                    <Reveal>
                        <Typography sx={{
                            fontFamily: '"Lato", sans-serif', fontSize: '0.8rem',
                            letterSpacing: '0.15em', color: '#8b7355', mb: 1.5, textTransform: 'uppercase',
                        }}>
                            Craftsmanship
                        </Typography>
                        <Typography sx={{
                            fontFamily: '"Lato", sans-serif', fontSize: '0.95rem', lineHeight: 1.8, color: '#666',
                        }}>
                            Every piece passes through the hands of artisans who measure their work in
                            hours, not units — hand-finished hems, hand-set buttons, and construction
                            built to be worn, altered, and worn again.
                        </Typography>
                    </Reveal>
                    <Reveal delay={0.1}>
                        <Typography sx={{
                            fontFamily: '"Lato", sans-serif', fontSize: '0.8rem',
                            letterSpacing: '0.15em', color: '#8b7355', mb: 1.5, textTransform: 'uppercase',
                        }}>
                            Sustainability
                        </Typography>
                        <Typography sx={{
                            fontFamily: '"Lato", sans-serif', fontSize: '0.95rem', lineHeight: 1.8, color: '#666',
                        }}>
                            We design for longevity first. Smaller, considered collections; natural and
                            responsibly sourced fibers; and a lasting relationship with every mill we
                            work with.
                        </Typography>
                    </Reveal>
                </Box>

                <Box sx={{ textAlign: 'center' }}>
                    <Button
                        variant="outlined"
                        size="large"
                        onClick={() => navigate('/products')}
                        sx={{
                            color: '#22223b', borderColor: '#e6b8a2', borderWidth: '1px',
                            px: 8, py: 1.8, fontSize: '0.75rem', fontWeight: 400,
                            letterSpacing: '0.15em', fontFamily: '"Lato", sans-serif',
                            backgroundColor: 'transparent',
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            position: 'relative', overflow: 'hidden', borderRadius: '6px',
                            '&::before': {
                                content: '""', position: 'absolute', top: 0, left: '-100%',
                                width: '100%', height: '100%', backgroundColor: '#f5ebe0',
                                transition: 'left 0.4s cubic-bezier(0.4, 0, 0.2, 1)', zIndex: -1,
                            },
                            '&:hover': {
                                color: '#22223b', borderColor: '#f5ebe0',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(193, 154, 107, 0.3)',
                            },
                            '&:hover::before': { left: 0 },
                        }}
                    >
                        DISCOVER THE COLLECTION
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default AboutPage;
