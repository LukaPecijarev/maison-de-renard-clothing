import React, { useState } from 'react';
import { TextField, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import userRepository from '../repository/userRepository';
import AuthLayout, { authFieldSx, PasswordField, AuthError, AuthSubmitButton, AuthSwitch } from '../components/AuthLayout';
import { showToast } from '../utils/toast';

const RegisterPage = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
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

        setLoading(true);
        try {
            await userRepository.register({
                username: formData.username,
                email: formData.email,
                password: formData.password,
            });
            showToast({ variant: 'success', title: 'Welcome to the Maison', message: 'Your account is ready - please sign in.' });
            setTimeout(() => navigate('/login'), 1200);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
            setLoading(false);
        }
    };

    // Live hint under "Confirm password" once something has been typed there.
    const showMatch = formData.confirmPassword.length > 0;
    const passwordsMatch = formData.password === formData.confirmPassword;

    return (
        <AuthLayout
            image="/products/men/ManOutfit.jpg"
            imageAlt="Maison de Renard - men's look"
            quote="Quiet luxury, made to last - begin your story with the Maison."
            eyebrow="JOIN THE MAISON"
            titleStart="Create an "
            titleAccent="account"
            subtitle="Save your favourites, check out faster and follow your orders."
        >
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {error && <AuthError key={error} message={error} />}
                <TextField fullWidth label="Username" name="username" autoComplete="username"
                           value={formData.username} onChange={handleChange} required sx={authFieldSx} />
                <TextField fullWidth label="Email" name="email" type="email" autoComplete="email"
                           value={formData.email} onChange={handleChange} required sx={authFieldSx} />
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
                    <PasswordField fullWidth label="Password" name="password" autoComplete="new-password"
                                   value={formData.password} onChange={handleChange} required />
                    <PasswordField fullWidth label="Confirm password" name="confirmPassword" autoComplete="new-password"
                                   value={formData.confirmPassword} onChange={handleChange} required />
                </Box>
                {showMatch && (
                    <Typography sx={{
                        display: 'flex', alignItems: 'center', gap: 0.6, mt: -1,
                        fontFamily: '"Lato", sans-serif', fontSize: '0.8rem',
                        color: passwordsMatch ? '#2e7d32' : '#9c4a4a',
                    }}>
                        {passwordsMatch && <CheckRoundedIcon sx={{ fontSize: 16 }} />}
                        {passwordsMatch ? 'Passwords match' : 'Passwords do not match yet'}
                    </Typography>
                )}
                <AuthSubmitButton loading={loading}>CREATE ACCOUNT</AuthSubmitButton>
                <AuthSwitch question="Already have an account?" linkLabel="Sign in" to="/login" />
            </Box>
        </AuthLayout>
    );
};

export default RegisterPage;
