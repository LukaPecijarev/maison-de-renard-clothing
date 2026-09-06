import React, { useState } from 'react';
import { Container, Typography, Box, TextField, Button, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import useOrder from '../hooks/useOrder';
import WalletCard from '../components/WalletCard';
import Reveal from '../components/Reveal';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { confirmOrder, order } = useOrder();
    const [selectedPayment, setSelectedPayment] = useState('visa');
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        country: '',
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: '',
    });
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
        if (!formData.country.trim()) newErrors.country = 'Country is required';
        if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
        if (!formData.cardName.trim()) newErrors.cardName = 'Cardholder name is required';
        if (!formData.expiryDate.trim()) newErrors.expiryDate = 'Expiry date is required';
        if (!formData.cvv.trim()) newErrors.cvv = 'CVV is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const success = await confirmOrder();
                if (success) {
                    alert('Order confirmed successfully! Thank you for your purchase.');
                    navigate('/');
                } else {
                    alert('Failed to process order. Please try again.');
                }
            } catch (error) {
                alert('Failed to process order. Please try again.');
                console.error('Order confirmation error:', error);
            }
        }
    };

    const cartItems = order?.products || [];
    const orderTotal = cartItems.reduce((sum, item) => {
        const discountMatch = item.description?.match(/DISCOUNT:(\d+)/);
        const discount = discountMatch ? parseInt(discountMatch[1]) : 0;
        return sum + item.price * (1 - discount / 100);
    }, 0);

    const textFieldSx = {
        '& .MuiOutlinedInput-root': {
            fontFamily: '"Lato", sans-serif',
            '& fieldset': { borderColor: 'rgba(212, 184, 150, 0.3)' },
            '&:hover fieldset': { borderColor: '#d4b896' },
            '&.Mui-focused fieldset': { borderColor: '#c4a886' },
        },
        '& .MuiInputLabel-root': {
            fontFamily: '"Lato", sans-serif',
            fontSize: '0.9rem',
            '&.Mui-focused': { color: '#8b7355' },
        },
    };

    return (
        <Box sx={{ backgroundColor: '#f5f1e8', minHeight: '100vh', py: 4 }}>
            <Reveal><Container maxWidth="md">
                <Box sx={{ mb: 4, textAlign: 'center' }}>
                    <Typography variant="h3" sx={{
                        fontFamily: '"Cormorant Garamond", serif',
                        fontWeight: 300, letterSpacing: '0.15em', color: '#2c2c2c', mb: 0.5,
                    }}>
                        CHECKOUT
                    </Typography>
                    <Typography variant="body2" sx={{
                        fontFamily: '"Lato", sans-serif', color: '#8b7355', letterSpacing: '0.05em',
                    }}>
                        Complete your purchase with confidence
                    </Typography>
                </Box>

                <Box component="form" onSubmit={handleSubmit}>
                    <Box sx={{
                        backgroundColor: '#ffffff', borderRadius: '2px',
                        border: '1px solid rgba(212, 184, 150, 0.2)',
                        overflow: 'hidden', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    }}>
                        {/* Shipping Information */}
                        <Box sx={{ p: 3, borderBottom: '1px solid rgba(212, 184, 150, 0.15)' }}>
                            <Typography variant="h6" sx={{
                                fontFamily: '"Cormorant Garamond", serif',
                                fontWeight: 400, letterSpacing: '0.1em', color: '#2c2c2c', mb: 2.5,
                            }}>
                                SHIPPING INFORMATION
                            </Typography>
                            <Box sx={{ display: 'grid', gap: 2 }}>
                                <TextField fullWidth label="Full Name" name="fullName"
                                           value={formData.fullName} onChange={handleInputChange}
                                           error={!!errors.fullName} helperText={errors.fullName} sx={textFieldSx} />

                                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                                    <TextField fullWidth label="Email" name="email" type="email"
                                               value={formData.email} onChange={handleInputChange}
                                               error={!!errors.email} helperText={errors.email} sx={textFieldSx} />
                                    <TextField fullWidth label="Phone" name="phone"
                                               value={formData.phone} onChange={handleInputChange}
                                               error={!!errors.phone} helperText={errors.phone} sx={textFieldSx} />
                                </Box>

                                <TextField fullWidth label="Address" name="address"
                                           value={formData.address} onChange={handleInputChange}
                                           error={!!errors.address} helperText={errors.address} sx={textFieldSx} />

                                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2 }}>
                                    <TextField fullWidth label="City" name="city"
                                               value={formData.city} onChange={handleInputChange}
                                               error={!!errors.city} helperText={errors.city} sx={textFieldSx} />
                                    <TextField fullWidth label="Postal Code" name="postalCode"
                                               value={formData.postalCode} onChange={handleInputChange}
                                               error={!!errors.postalCode} helperText={errors.postalCode} sx={textFieldSx} />
                                    <TextField fullWidth label="Country" name="country"
                                               value={formData.country} onChange={handleInputChange}
                                               error={!!errors.country} helperText={errors.country} sx={textFieldSx} />
                                </Box>
                            </Box>
                        </Box>

                        {/* Payment Method */}
                        <Box sx={{ p: 3, borderBottom: '1px solid rgba(212, 184, 150, 0.15)' }}>
                            <Typography variant="h6" sx={{
                                fontFamily: '"Cormorant Garamond", serif',
                                fontWeight: 400, letterSpacing: '0.1em', color: '#2c2c2c', mb: 2.5,
                            }}>
                                PAYMENT METHOD
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: { xs: 2, sm: 3 } }}>
                                <WalletCard
                                    selected={selectedPayment}
                                    onSelect={setSelectedPayment}
                                    total={orderTotal}
                                />
                            </Box>
                        </Box>

                        {/* Card Details */}
                        <Box sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{
                                fontFamily: '"Cormorant Garamond", serif',
                                fontWeight: 400, letterSpacing: '0.1em', color: '#2c2c2c', mb: 2.5,
                            }}>
                                CARD DETAILS
                            </Typography>
                            <Box sx={{ display: 'grid', gap: 2 }}>
                                <TextField fullWidth label="Card Number" name="cardNumber"
                                           placeholder="1234 5678 9012 3456"
                                           value={formData.cardNumber} onChange={handleInputChange}
                                           error={!!errors.cardNumber} helperText={errors.cardNumber}
                                           InputProps={{ startAdornment: <CreditCardIcon sx={{ mr: 1, color: '#8b7355' }} /> }}
                                           sx={textFieldSx} />
                                <TextField fullWidth label="Cardholder Name" name="cardName"
                                           placeholder="JOHN DOE"
                                           value={formData.cardName} onChange={handleInputChange}
                                           error={!!errors.cardName} helperText={errors.cardName} sx={textFieldSx} />
                                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                                    <TextField fullWidth label="Expiry Date" name="expiryDate"
                                               placeholder="MM/YY"
                                               value={formData.expiryDate} onChange={handleInputChange}
                                               error={!!errors.expiryDate} helperText={errors.expiryDate} sx={textFieldSx} />
                                    <TextField fullWidth label="CVV" name="cvv" placeholder="123"
                                               value={formData.cvv} onChange={handleInputChange}
                                               error={!!errors.cvv} helperText={errors.cvv}
                                               InputProps={{ startAdornment: <LockOutlinedIcon sx={{ mr: 1, color: '#8b7355', fontSize: 18 }} /> }}
                                               sx={textFieldSx} />
                                </Box>
                            </Box>
                            <Alert severity="info" sx={{
                                mt: 2, backgroundColor: 'rgba(212, 184, 150, 0.08)',
                                border: '1px solid rgba(212, 184, 150, 0.2)',
                                '& .MuiAlert-icon': { color: '#8b7355' },
                                '& .MuiAlert-message': { fontFamily: '"Lato", sans-serif', fontSize: '0.8rem', color: '#6d5d3b' },
                            }}>
                                Your payment information is encrypted and secure.
                            </Alert>
                        </Box>
                    </Box>

                    {/* Action Buttons */}
                    <Box sx={{
                        display: 'flex', flexDirection: { xs: 'column-reverse', sm: 'row' },
                        gap: 2, mt: 3, justifyContent: 'space-between',
                    }}>
                        <Button variant="outlined" onClick={() => navigate('/cart')} sx={{
                            fontFamily: '"Lato", sans-serif', fontSize: '0.85rem',
                            fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase',
                            color: '#8b7355', borderColor: 'rgba(212, 184, 150, 0.5)', borderWidth: '1.5px',
                            padding: '12px 40px',
                            '&:hover': { borderColor: '#d4b896', backgroundColor: 'rgba(212, 184, 150, 0.08)', borderWidth: '1.5px' },
                        }}>
                            Back to Cart
                        </Button>
                        <Button type="submit" variant="outlined" sx={{
                            fontFamily: '"Lato", sans-serif', fontSize: '0.85rem',
                            fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase',
                            color: '#22223b', borderColor: '#e6b8a2', borderWidth: '1px',
                            backgroundColor: 'transparent', padding: '12px 50px',
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
                            Complete Purchase
                        </Button>
                    </Box>
                </Box>
            </Container></Reveal>
        </Box>
    );
};

export default CheckoutPage;