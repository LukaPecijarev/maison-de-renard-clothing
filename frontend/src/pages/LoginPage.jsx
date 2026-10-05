import React, { useState } from 'react';
import { TextField, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import userRepository from '../repository/userRepository';
import AuthLayout, { authFieldSx, PasswordField, AuthError, AuthSubmitButton, AuthSwitch } from '../components/AuthLayout';

const LoginPage = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await userRepository.login(formData);
            const { token, username, role } = response.data;
            login(token, username, role);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            image="/products/women/WomenFullLook.jpg"
            imageAlt="Maison de Renard - women's look"
            quote="Timeless pieces, crafted slowly - welcome back to the Maison."
            eyebrow="WELCOME BACK"
            titleStart="Sign "
            titleAccent="in"
            subtitle="Access your orders, wishlist and personal recommendations."
        >
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {error && <AuthError key={error} message={error} />}
                <TextField fullWidth label="Username" name="username" autoComplete="username"
                           value={formData.username} onChange={handleChange} required sx={authFieldSx} />
                <PasswordField fullWidth label="Password" name="password" autoComplete="current-password"
                               value={formData.password} onChange={handleChange} required />
                <AuthSubmitButton loading={loading}>SIGN IN</AuthSubmitButton>
                <AuthSwitch question="Don't have an account?" linkLabel="Create one" to="/register" />
            </Box>
        </AuthLayout>
    );
};

export default LoginPage;
