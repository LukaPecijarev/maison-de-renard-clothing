import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import Reveal from '../components/Reveal';

const contactDetails = [
    { icon: MailOutlineIcon, label: 'Email', value: 'concierge@maisonderenard.com', href: 'mailto:concierge@maisonderenard.com' },
    { icon: CallOutlinedIcon, label: 'Phone', value: '+39 02 1234 5678', href: 'tel:+390212345678' },
    { icon: PlaceOutlinedIcon, label: 'Atelier', value: 'Via Monte Napoleone, 20121 Milan, Italy', href: null },
];

const ContactPage = () => (
    <Box sx={{ backgroundColor: '#f5f1e8', minHeight: '100vh', py: 10 }}>
        <Container maxWidth="sm">
            <Reveal>
                <Typography variant="h3" align="center" sx={{
                    fontFamily: '"Cormorant Garamond", serif', fontWeight: 300,
                    letterSpacing: '0.1em', mb: 1, color: '#2c2c2c',
                }}>
                    Get in Touch
                </Typography>
                <Typography align="center" sx={{
                    fontFamily: '"Lato", sans-serif', fontSize: '0.95rem', color: '#666', mb: 6,
                }}>
                    Our concierge team is available to help with orders, private appointments, and
                    anything else the Maison can do for you.
                </Typography>
            </Reveal>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {contactDetails.map(({ icon: Icon, label, value, href }, i) => (
                    <Reveal key={label} delay={i * 0.08}>
                        <Box sx={{
                            display: 'flex', alignItems: 'center', gap: 2.5,
                            p: 3, backgroundColor: '#fdfbf5', borderRadius: '4px',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                        }}>
                            <Icon sx={{ color: '#8b7355', fontSize: 28 }} />
                            <Box>
                                <Typography sx={{
                                    fontFamily: '"Lato", sans-serif', fontSize: '0.75rem',
                                    letterSpacing: '0.1em', color: '#8b7355', textTransform: 'uppercase', mb: 0.3,
                                }}>
                                    {label}
                                </Typography>
                                <Typography
                                    component={href ? 'a' : 'p'}
                                    href={href || undefined}
                                    sx={{
                                        fontFamily: '"Lato", sans-serif', fontSize: '0.95rem',
                                        color: '#2c2c2c', textDecoration: 'none',
                                        '&:hover': href ? { color: '#8b7355' } : {},
                                    }}
                                >
                                    {value}
                                </Typography>
                            </Box>
                        </Box>
                    </Reveal>
                ))}
            </Box>
        </Container>
    </Box>
);

export default ContactPage;
