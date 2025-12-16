import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Box, Alert } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import userRepository from '../repository/userRepository';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        try {
            await userRepository.register(formData);
            setSuccess(true);
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
                <Typography variant="h4" component="h1" gutterBottom align="center">
                    Register
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        Registration successful! Redirecting to login...
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Register
                    </Button>
                    <Typography align="center">
                        Already have an account?{' '}
                        <Link to="/login" style={{ textDecoration: 'none' }}>
                            Login
                        </Link>
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default RegisterPage;