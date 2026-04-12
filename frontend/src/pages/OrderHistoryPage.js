import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, CircularProgress, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import orderRepository from '../repository/orderRepository';

const OrderHistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            navigate('/login');
            return;
        }

        orderRepository.findHistory()
            .then(response => {
                setOrders(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching order history:', error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', backgroundColor: '#f5f1e8' }}>
                <CircularProgress sx={{ color: '#2c2c2c' }} />
            </Box>
        );
    }

    return (
        <Box sx={{ backgroundColor: '#f5f1e8', minHeight: '100vh', py: 6 }}>
            <Container maxWidth="md">
                {/* Header */}
                <Typography variant="h3" align="center" sx={{
                    fontFamily: '"Cormorant Garamond", serif',
                    fontWeight: 300, letterSpacing: '0.1em', mb: 6, color: '#2c2c2c',
                }}>
                    Order History
                </Typography>

                {orders.length === 0 ? (
                    <Typography align="center" sx={{ color: '#666', fontSize: '1.1rem' }}>
                        No orders yet.
                    </Typography>
                ) : (
                    orders.map((order) => (
                        <Box key={order.id} sx={{
                            backgroundColor: '#ffffff',
                            mb: 3, p: 3,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                            borderRadius: '4px',
                        }}>
                            {/* Order Header */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography sx={{
                                    fontFamily: '"Cormorant Garamond", serif',
                                    fontSize: '1.2rem', color: '#2c2c2c',
                                }}>
                                    Order #{order.id}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 3 }}>
                                    <Typography sx={{
                                        fontSize: '0.85rem', color: '#666',
                                        fontFamily: '"Lato", sans-serif',
                                    }}>
                                        {new Date(order.createdAt).toLocaleDateString('en-GB')}
                                    </Typography>
                                    <Typography sx={{
                                        fontSize: '0.85rem', fontFamily: '"Lato", sans-serif',
                                        color: order.status === 'CONFIRMED' ? '#2e7d32'
                                            : order.status === 'CANCELLED' ? '#d32f2f'
                                                : '#8b7355',
                                        fontWeight: 500,
                                    }}>
                                        {order.status}
                                    </Typography>
                                    <Typography sx={{
                                        fontFamily: '"Cormorant Garamond", serif',
                                        fontSize: '1.1rem', color: '#2c2c2c',
                                    }}>
                                        €{order.totalPrice?.toFixed(0)}
                                    </Typography>
                                </Box>
                            </Box>

                            <Divider sx={{ mb: 2, borderColor: 'rgba(212, 184, 150, 0.3)' }} />

                            {/* Products */}
                            {order.products?.map((product) => {
                                const images = product.imageUrl
                                    ? product.imageUrl.split(',').map(url => url.trim())
                                    : [];
                                const imageUrl = images[0] || 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300';

                                return (
                                    <Box key={product.id} sx={{
                                        display: 'flex', gap: 2, mb: 2,
                                        cursor: 'pointer',
                                        '&:hover': { opacity: 0.8 }
                                    }}
                                         onClick={() => navigate(`/products/${product.id}`)}
                                    >
                                        <Box component="img" src={imageUrl} alt={product.name}
                                             sx={{ width: 70, height: 90, objectFit: 'cover', borderRadius: '2px' }} />
                                        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                            <Typography sx={{
                                                fontFamily: '"Lato", sans-serif',
                                                fontSize: '0.95rem', color: '#2c2c2c', mb: 0.5,
                                            }}>
                                                {product.name}
                                            </Typography>
                                            <Typography sx={{
                                                fontFamily: '"Cormorant Garamond", serif',
                                                fontSize: '1rem', color: '#8b7355',
                                            }}>
                                                €{product.price?.toFixed(0)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                );
                            })}
                        </Box>
                    ))
                )}
            </Container>
        </Box>
    );
};

export default OrderHistoryPage;