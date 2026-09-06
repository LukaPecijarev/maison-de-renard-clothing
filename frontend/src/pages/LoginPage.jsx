import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Box, Alert } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import userRepository from '../repository/userRepository';

const fieldSx = {
    '& .MuiOutlinedInput-root': {
        '& fieldset': { borderColor: 'rgba(212, 184, 150, 0.3)' },
        '&:hover fieldset': { borderColor: '#d4b896' },
        '&.Mui-focused fieldset': { borderColor: '#c4a886', borderWidth: '2px' },
    },
    '& .MuiInputLabel-root.Mui-focused': { color: '#8b7355' },
};

const LoginPage = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await userRepository.login(formData);
            const { token, username, role } = response.data;
            login(token, username, role);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        }
    };

    return (
        <Box sx={{ backgroundColor: '#f5f1e8', minHeight: '100vh', py: 8 }}>
            <Container maxWidth="sm">
                <Typography variant="h3" align="center" sx={{
                    fontFamily: '"Cormorant Garamond", serif',
                    fontWeight: 300, letterSpacing: '0.15em', mb: 1, color: '#2c2c2c',
                }}>
                    WELCOME BACK
                </Typography>
                <Typography align="center" sx={{
                    color: '#8b7355', mb: 5, fontSize: '0.9rem',
                    fontFamily: '"Lato", sans-serif', letterSpacing: '0.05em',
                }}>
                    Sign in to Maison de Renard
                </Typography>

                <Paper elevation={0} sx={{
                    p: { xs: 3, md: 6 },
                    backgroundColor: '#ffffff',
                    borderRadius: '2px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    border: '1px solid rgba(212, 184, 150, 0.2)',
                }}>
                    {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                    <Box component="form" onSubmit={handleSubmit}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <TextField fullWidth label="Username" name="username"
                                       value={formData.username} onChange={handleChange}
                                       required sx={fieldSx} />

                            <TextField fullWidth label="Password" name="password" type="password"
                                       value={formData.password} onChange={handleChange}
                                       required sx={fieldSx} />

                            <Button type="submit" fullWidth variant="outlined"
                                    sx={{
                                        color: '#22223b', borderColor: '#e6b8a2', borderWidth: '1px',
                                        backgroundColor: 'transparent',
                                        py: 1.8, fontSize: '0.85rem', fontWeight: 500,
                                        letterSpacing: '0.15em', textTransform: 'uppercase',
                                        fontFamily: '"Lato", sans-serif', mt: 1,
                                        position: 'relative', overflow: 'hidden', borderRadius: '6px',
                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
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
                                    }}>
                                Login
                            </Button>

                            <Typography align="center" sx={{
                                fontFamily: '"Lato", sans-serif',
                                fontSize: '0.9rem', color: '#666',
                            }}>
                                Don't have an account?{' '}
                                <Link to="/register" style={{
                                    color: '#8b7355', textDecoration: 'none', fontWeight: 500,
                                }}>
                                    Register
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default LoginPage;
