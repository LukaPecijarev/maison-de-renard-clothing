import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Box, Alert } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import userRepository from '../repository/userRepository';

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
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
                <Typography variant="h4" component="h1" gutterBottom align="center">
                    Login
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
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
                        Login
                    </Button>
                    <Typography align="center">
                        Don't have an account?{' '}
                        <Link to="/register" style={{ textDecoration: 'none' }}>
                            Register
                        </Link>
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default LoginPage;