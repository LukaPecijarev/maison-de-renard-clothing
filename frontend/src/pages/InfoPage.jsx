import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import Reveal from '../components/Reveal';

// Shared template for the lightweight, text-only footer destinations
// (Craftsmanship, Sustainability, Services, Returns, Shipping, Compliance,
// Legal, Privacy). Keeps every one of them on-brand without hand-building
// a bespoke layout for pages that are really just a title + a few
// paragraphs of copy.
const InfoPage = ({ title, subtitle, paragraphs = [] }) => (
    <Box sx={{ backgroundColor: '#f5f1e8', minHeight: '100vh', py: 10 }}>
        <Container maxWidth="md">
            <Reveal>
                <Typography variant="h3" align="center" sx={{
                    fontFamily: '"Cormorant Garamond", serif', fontWeight: 300,
                    letterSpacing: '0.1em', mb: subtitle ? 1 : 5, color: '#2c2c2c',
                }}>
                    {title}
                </Typography>
                {subtitle && (
                    <Typography align="center" sx={{
                        fontFamily: '"Lato", sans-serif', fontSize: '0.8rem',
                        letterSpacing: '0.15em', color: '#8b7355', textTransform: 'uppercase', mb: 5,
                    }}>
                        {subtitle}
                    </Typography>
                )}
            </Reveal>
            {paragraphs.map((p, i) => (
                <Reveal key={i} delay={i * 0.08}>
                    <Typography sx={{
                        fontFamily: '"Lato", sans-serif', fontSize: '1rem', lineHeight: 1.9,
                        color: '#666', mb: 3,
                    }}>
                        {p}
                    </Typography>
                </Reveal>
            ))}
        </Container>
    </Box>
);

export default InfoPage;
