import React, { useState } from 'react';
import { Container, Typography, Box, TextField, Button, Radio, RadioGroup, FormControlLabel, FormControl, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import useOrder from '../hooks/useOrder';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { confirmOrder } = useOrder(); // ✅ Get confirmOrder from hook
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
        // Clear error when user starts typing
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
                // ✅ Confirm the order on backend
                await confirmOrder();
                alert('Order confirmed successfully! Thank you for your purchase.');
                // Redirect to home page
                navigate('/');
            } catch (error) {
                alert('Failed to process order. Please try again.');
                console.error('Order confirmation error:', error);
            }
        }
    };

    const paymentMethods = [
        { id: 'visa', name: 'Visa', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg' },
        { id: 'mastercard', name: 'Mastercard', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg' },
        { id: 'amex', name: 'American Express', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg' },
        { id: 'discover', name: 'Discover', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/57/Discover_Card_logo.svg' },
    ];

    return (
        <Box sx={{ backgroundColor: '#f5f1e8', minHeight: '100vh', py: 4 }}>
            <Container maxWidth="md">
                {/* Header */}
                <Box sx={{ mb: 4, textAlign: 'center' }}>
                    <Typography
                        variant="h3"
                        sx={{
                            fontFamily: '"Cormorant Garamond", serif',
                            fontWeight: 300,
                            letterSpacing: '0.15em',
                            color: '#2c2c2c',
                            mb: 0.5,
                        }}
                    >
                        CHECKOUT
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            fontFamily: '"Lato", sans-serif',
                            color: '#8b7355',
                            letterSpacing: '0.05em',
                        }}
                    >
                        Complete your purchase with confidence
                    </Typography>
                </Box>

                <form onSubmit={handleSubmit}>
                    {/* Main Content Box */}
                    <Box
                        sx={{
                            backgroundColor: '#ffffff',
                            borderRadius: '2px',
                            border: '1px solid rgba(212, 184, 150, 0.2)',
                            overflow: 'hidden',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                        }}
                    >
                        {/* Shipping Information Section */}
                        <Box sx={{ p: 3, borderBottom: '1px solid rgba(212, 184, 150, 0.15)' }}>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontFamily: '"Cormorant Garamond", serif',
                                    fontWeight: 400,
                                    letterSpacing: '0.1em',
                                    color: '#2c2c2c',
                                    mb: 2.5,
                                }}
                            >
                                SHIPPING INFORMATION
                            </Typography>

                            <Box sx={{ display: 'grid', gap: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Full Name"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    error={!!errors.fullName}
                                    helperText={errors.fullName}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            fontFamily: '"Lato", sans-serif',
                                            '& fieldset': {
                                                borderColor: 'rgba(212, 184, 150, 0.3)',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#d4b896',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#c4a886',
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            fontFamily: '"Lato", sans-serif',
                                            fontSize: '0.9rem',
                                            '&.Mui-focused': {
                                                color: '#8b7355',
                                            },
                                        },
                                    }}
                                />

                                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        error={!!errors.email}
                                        helperText={errors.email}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                fontFamily: '"Lato", sans-serif',
                                                '& fieldset': {
                                                    borderColor: 'rgba(212, 184, 150, 0.3)',
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: '#d4b896',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#c4a886',
                                                },
                                            },
                                            '& .MuiInputLabel-root': {
                                                fontFamily: '"Lato", sans-serif',
                                                fontSize: '0.9rem',
                                                '&.Mui-focused': {
                                                    color: '#8b7355',
                                                },
                                            },
                                        }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        error={!!errors.phone}
                                        helperText={errors.phone}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                fontFamily: '"Lato", sans-serif',
                                                '& fieldset': {
                                                    borderColor: 'rgba(212, 184, 150, 0.3)',
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: '#d4b896',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#c4a886',
                                                },
                                            },
                                            '& .MuiInputLabel-root': {
                                                fontFamily: '"Lato", sans-serif',
                                                fontSize: '0.9rem',
                                                '&.Mui-focused': {
                                                    color: '#8b7355',
                                                },
                                            },
                                        }}
                                    />
                                </Box>

                                <TextField
                                    fullWidth
                                    label="Address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    error={!!errors.address}
                                    helperText={errors.address}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            fontFamily: '"Lato", sans-serif',
                                            '& fieldset': {
                                                borderColor: 'rgba(212, 184, 150, 0.3)',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#d4b896',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#c4a886',
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            fontFamily: '"Lato", sans-serif',
                                            fontSize: '0.9rem',
                                            '&.Mui-focused': {
                                                color: '#8b7355',
                                            },
                                        },
                                    }}
                                />

                                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
                                    <TextField
                                        fullWidth
                                        label="City"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        error={!!errors.city}
                                        helperText={errors.city}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                fontFamily: '"Lato", sans-serif',
                                                '& fieldset': {
                                                    borderColor: 'rgba(212, 184, 150, 0.3)',
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: '#d4b896',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#c4a886',
                                                },
                                            },
                                            '& .MuiInputLabel-root': {
                                                fontFamily: '"Lato", sans-serif',
                                                fontSize: '0.9rem',
                                                '&.Mui-focused': {
                                                    color: '#8b7355',
                                                },
                                            },
                                        }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Postal Code"
                                        name="postalCode"
                                        value={formData.postalCode}
                                        onChange={handleInputChange}
                                        error={!!errors.postalCode}
                                        helperText={errors.postalCode}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                fontFamily: '"Lato", sans-serif',
                                                '& fieldset': {
                                                    borderColor: 'rgba(212, 184, 150, 0.3)',
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: '#d4b896',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#c4a886',
                                                },
                                            },
                                            '& .MuiInputLabel-root': {
                                                fontFamily: '"Lato", sans-serif',
                                                fontSize: '0.9rem',
                                                '&.Mui-focused': {
                                                    color: '#8b7355',
                                                },
                                            },
                                        }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Country"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleInputChange}
                                        error={!!errors.country}
                                        helperText={errors.country}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                fontFamily: '"Lato", sans-serif',
                                                '& fieldset': {
                                                    borderColor: 'rgba(212, 184, 150, 0.3)',
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: '#d4b896',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#c4a886',
                                                },
                                            },
                                            '& .MuiInputLabel-root': {
                                                fontFamily: '"Lato", sans-serif',
                                                fontSize: '0.9rem',
                                                '&.Mui-focused': {
                                                    color: '#8b7355',
                                                },
                                            },
                                        }}
                                    />
                                </Box>
                            </Box>
                        </Box>

                        {/* Payment Method Section */}
                        <Box sx={{ p: 3, borderBottom: '1px solid rgba(212, 184, 150, 0.15)' }}>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontFamily: '"Cormorant Garamond", serif',
                                    fontWeight: 400,
                                    letterSpacing: '0.1em',
                                    color: '#2c2c2c',
                                    mb: 2.5,
                                }}
                            >
                                PAYMENT METHOD
                            </Typography>

                            <FormControl component="fieldset" fullWidth>
                                <RadioGroup
                                    value={selectedPayment}
                                    onChange={(e) => setSelectedPayment(e.target.value)}
                                    sx={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(4, 1fr)',
                                        gap: 1.5,
                                    }}
                                >
                                    {paymentMethods.map((method) => (
                                        <Box
                                            key={method.id}
                                            sx={{
                                                border: selectedPayment === method.id
                                                    ? '2px solid #d4b896'
                                                    : '1px solid rgba(212, 184, 150, 0.2)',
                                                borderRadius: '4px',
                                                p: 1.5,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease',
                                                backgroundColor: selectedPayment === method.id
                                                    ? 'rgba(212, 184, 150, 0.05)'
                                                    : 'transparent',
                                                minHeight: '70px',
                                                '&:hover': {
                                                    borderColor: '#d4b896',
                                                    backgroundColor: 'rgba(212, 184, 150, 0.03)',
                                                },
                                            }}
                                            onClick={() => setSelectedPayment(method.id)}
                                        >
                                            <FormControlLabel
                                                value={method.id}
                                                control={
                                                    <Radio
                                                        sx={{
                                                            color: 'rgba(212, 184, 150, 0.5)',
                                                            padding: 0,
                                                            mb: 0.5,
                                                            '&.Mui-checked': {
                                                                color: '#d4b896',
                                                            },
                                                        }}
                                                    />
                                                }
                                                label=""
                                                sx={{ m: 0 }}
                                            />
                                            <Box
                                                component="img"
                                                src={method.logo}
                                                alt={method.name}
                                                sx={{
                                                    height: 18,
                                                    width: 'auto',
                                                    maxWidth: '60px',
                                                    objectFit: 'contain',
                                                }}
                                            />
                                        </Box>
                                    ))}
                                </RadioGroup>
                            </FormControl>
                        </Box>

                        {/* Card Details Section */}
                        <Box sx={{ p: 3 }}>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontFamily: '"Cormorant Garamond", serif',
                                    fontWeight: 400,
                                    letterSpacing: '0.1em',
                                    color: '#2c2c2c',
                                    mb: 2.5,
                                }}
                            >
                                CARD DETAILS
                            </Typography>

                            <Box sx={{ display: 'grid', gap: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Card Number"
                                    name="cardNumber"
                                    placeholder="1234 5678 9012 3456"
                                    value={formData.cardNumber}
                                    onChange={handleInputChange}
                                    error={!!errors.cardNumber}
                                    helperText={errors.cardNumber}
                                    InputProps={{
                                        startAdornment: <CreditCardIcon sx={{ mr: 1, color: '#8b7355' }} />,
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            fontFamily: '"Lato", sans-serif',
                                            '& fieldset': {
                                                borderColor: 'rgba(212, 184, 150, 0.3)',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#d4b896',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#c4a886',
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            fontFamily: '"Lato", sans-serif',
                                            fontSize: '0.9rem',
                                            '&.Mui-focused': {
                                                color: '#8b7355',
                                            },
                                        },
                                    }}
                                />

                                <TextField
                                    fullWidth
                                    label="Cardholder Name"
                                    name="cardName"
                                    placeholder="JOHN DOE"
                                    value={formData.cardName}
                                    onChange={handleInputChange}
                                    error={!!errors.cardName}
                                    helperText={errors.cardName}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            fontFamily: '"Lato", sans-serif',
                                            '& fieldset': {
                                                borderColor: 'rgba(212, 184, 150, 0.3)',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#d4b896',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#c4a886',
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            fontFamily: '"Lato", sans-serif',
                                            fontSize: '0.9rem',
                                            '&.Mui-focused': {
                                                color: '#8b7355',
                                            },
                                        },
                                    }}
                                />

                                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                                    <TextField
                                        fullWidth
                                        label="Expiry Date"
                                        name="expiryDate"
                                        placeholder="MM/YY"
                                        value={formData.expiryDate}
                                        onChange={handleInputChange}
                                        error={!!errors.expiryDate}
                                        helperText={errors.expiryDate}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                fontFamily: '"Lato", sans-serif',
                                                '& fieldset': {
                                                    borderColor: 'rgba(212, 184, 150, 0.3)',
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: '#d4b896',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#c4a886',
                                                },
                                            },
                                            '& .MuiInputLabel-root': {
                                                fontFamily: '"Lato", sans-serif',
                                                fontSize: '0.9rem',
                                                '&.Mui-focused': {
                                                    color: '#8b7355',
                                                },
                                            },
                                        }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="CVV"
                                        name="cvv"
                                        placeholder="123"
                                        value={formData.cvv}
                                        onChange={handleInputChange}
                                        error={!!errors.cvv}
                                        helperText={errors.cvv}
                                        InputProps={{
                                            startAdornment: <LockOutlinedIcon sx={{ mr: 1, color: '#8b7355', fontSize: 18 }} />,
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                fontFamily: '"Lato", sans-serif',
                                                '& fieldset': {
                                                    borderColor: 'rgba(212, 184, 150, 0.3)',
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: '#d4b896',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#c4a886',
                                                },
                                            },
                                            '& .MuiInputLabel-root': {
                                                fontFamily: '"Lato", sans-serif',
                                                fontSize: '0.9rem',
                                                '&.Mui-focused': {
                                                    color: '#8b7355',
                                                },
                                            },
                                        }}
                                    />
                                </Box>
                            </Box>

                            {/* Security Notice */}
                            <Alert
                                severity="info"
                                sx={{
                                    mt: 2,
                                    backgroundColor: 'rgba(212, 184, 150, 0.08)',
                                    border: '1px solid rgba(212, 184, 150, 0.2)',
                                    '& .MuiAlert-icon': {
                                        color: '#8b7355',
                                    },
                                    '& .MuiAlert-message': {
                                        fontFamily: '"Lato", sans-serif',
                                        fontSize: '0.8rem',
                                        color: '#6d5d3b',
                                    },
                                }}
                            >
                                Your payment information is encrypted and secure.
                            </Alert>
                        </Box>
                    </Box>

                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'space-between' }}>
                        <Button
                            variant="outlined"
                            onClick={() => navigate('/cart')}
                            sx={{
                                fontFamily: '"Lato", sans-serif',
                                fontSize: '0.85rem',
                                fontWeight: 500,
                                letterSpacing: '0.15em',
                                textTransform: 'uppercase',
                                color: '#8b7355',
                                borderColor: 'rgba(212, 184, 150, 0.5)',
                                borderWidth: '1.5px',
                                padding: '12px 40px',
                                '&:hover': {
                                    borderColor: '#d4b896',
                                    backgroundColor: 'rgba(212, 184, 150, 0.08)',
                                    borderWidth: '1.5px',
                                },
                            }}
                        >
                            Back to Cart
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{
                                fontFamily: '"Lato", sans-serif',
                                fontSize: '0.85rem',
                                fontWeight: 500,
                                letterSpacing: '0.15em',
                                textTransform: 'uppercase',
                                backgroundColor: '#d4b896',
                                color: '#ffffff',
                                padding: '12px 50px',
                                boxShadow: '0 4px 12px rgba(212, 184, 150, 0.3)',
                                '&:hover': {
                                    backgroundColor: '#c4a886',
                                    boxShadow: '0 6px 16px rgba(196, 168, 134, 0.4)',
                                },
                            }}
                        >
                            Complete Purchase
                        </Button>
                    </Box>
                </form>
            </Container>
        </Box>
    );
};

export default CheckoutPage;