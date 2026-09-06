import React from 'react';
import { Container, Typography, Box, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Reveal from '../components/Reveal';

const faqs = [
    {
        q: 'How long does delivery take?',
        a: 'Express delivery takes 2-4 business days across Europe and 5-7 business days internationally. All orders ship free of charge.',
    },
    {
        q: 'Can I return or exchange an item?',
        a: 'Yes - unworn items with original tags may be returned within 30 days of delivery for a full refund. Exchanges are free of charge.',
    },
    {
        q: 'Do you offer alterations?',
        a: 'Every full-price purchase includes one round of complimentary tailoring adjustments at any of our boutiques.',
    },
    {
        q: 'How do I book a private appointment?',
        a: 'Private styling appointments at our atelier in Italy can be requested through the Get in Touch page.',
    },
    {
        q: 'Is my payment information secure?',
        a: 'Yes - all payment information is encrypted end-to-end and is never stored on our servers.',
    },
];

const FaqPage = () => (
    <Box sx={{ backgroundColor: '#f5f1e8', minHeight: '100vh', py: 10 }}>
        <Container maxWidth="md">
            <Reveal>
                <Typography variant="h3" align="center" sx={{
                    fontFamily: '"Cormorant Garamond", serif', fontWeight: 300,
                    letterSpacing: '0.1em', mb: 6, color: '#2c2c2c',
                }}>
                    Frequently Asked Questions
                </Typography>
            </Reveal>

            {faqs.map((item, i) => (
                <Reveal key={item.q} delay={i * 0.06}>
                    <Accordion
                        disableGutters
                        elevation={0}
                        sx={{
                            backgroundColor: 'transparent',
                            borderBottom: '1px solid rgba(212, 184, 150, 0.3)',
                            '&:before': { display: 'none' },
                        }}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon sx={{ color: '#8b7355' }} />}
                            sx={{ px: 0, py: 1 }}
                        >
                            <Typography sx={{
                                fontFamily: '"Cormorant Garamond", serif', fontSize: '1.2rem',
                                color: '#2c2c2c',
                            }}>
                                {item.q}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ px: 0, pb: 2 }}>
                            <Typography sx={{
                                fontFamily: '"Lato", sans-serif', fontSize: '0.95rem',
                                lineHeight: 1.8, color: '#666',
                            }}>
                                {item.a}
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                </Reveal>
            ))}
        </Container>
    </Box>
);

export default FaqPage;
