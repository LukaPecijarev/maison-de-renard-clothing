import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Box, Alert } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import userRepository from '../repository/userRepository';

const fieldSx = {
    '& .MuiOutlinedInput-root': {
        '& fieldset': { borderColor: 'rgba(212, 184, 150, 0.3)' },
        '&:hover fieldset': { borderColor: '#d4b896' },
        '&.Mui-focused fieldset': { borderColor: '#c4a886', borderWidth: '2px' },
    },
    '& .MuiInputLabel-root.Mui-focused': { color: '#8b7355' },
};

const RegisterPage = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            await userRepository.register({
                username: formData.username,
                email: formData.email,
                password: formData.password,
            });
            setSuccess('Account created successfully! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <Box sx={{ backgroundColor: '#f5f1e8', minHeight: '100vh', py: 8 }}>
            <Container maxWidth="sm">
                <Typography variant="h3" align="center" sx={{
                    fontFamily: '"Cormorant Garamond", serif',
                    fontWeight: 300, letterSpacing: '0.15em', mb: 1, color: '#2c2c2c',
                }}>
                    CREATE ACCOUNT
                </Typography>
                <Typography align="center" sx={{
                    color: '#8b7355', mb: 5, fontSize: '0.9rem',
                    fontFamily: '"Lato", sans-serif', letterSpacing: '0.05em',
                }}>
                    Join Maison de Renard
                </Typography>

                <Paper elevation={0} sx={{
                    p: { xs: 3, md: 6 },
                    backgroundColor: '#ffffff',
                    borderRadius: '2px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    border: '1px solid rgba(212, 184, 150, 0.2)',
                }}>
                    {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                    {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

                    <Box component="form" onSubmit={handleSubmit}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <TextField fullWidth label="Username" name="username"
                                       value={formData.username} onChange={handleChange}
                                       required sx={fieldSx} />

                            <TextField fullWidth label="Email" name="email" type="email"
                                       value={formData.email} onChange={handleChange}
                                       required sx={fieldSx} />

                            <TextField fullWidth label="Password" name="password" type="password"
                                       value={formData.password} onChange={handleChange}
                                       required sx={fieldSx} />

                            <TextField fullWidth label="Confirm Password" name="confirmPassword" type="password"
                                       value={formData.confirmPassword} onChange={handleChange}
                                       required sx={fieldSx} />

                            <Button type="submit" fullWidth variant="contained"
                                    sx={{
                                        backgroundColor: '#2c2c2c', color: '#ffffff',
                                        py: 1.8, fontSize: '0.85rem', fontWeight: 500,
                                        letterSpacing: '0.15em', textTransform: 'uppercase',
                                        fontFamily: '"Lato", sans-serif', mt: 1,
                                        '&:hover': { backgroundColor: '#1a1a1a' },
                                    }}>
                                CREATE ACCOUNT
                            </Button>

                            <Typography align="center" sx={{
                                fontFamily: '"Lato", sans-serif',
                                fontSize: '0.9rem', color: '#666',
                            }}>
                                Already have an account?{' '}
                                <Link to="/login" style={{
                                    color: '#8b7355', textDecoration: 'none', fontWeight: 500,
                                }}>
                                    Sign In
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default RegisterPage;