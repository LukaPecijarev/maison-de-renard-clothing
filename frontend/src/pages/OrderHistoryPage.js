import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, CircularProgress, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import orderRepository from '../repository/orderRepository';
import OrderStatusStepper from '../components/OrderStatusStepper';
import Reveal from '../components/Reveal';
import useSharedImageReturn from '../hooks/useSharedImageReturn';
import { startProductTransition, hasBackTransition } from '../utils/sharedImageTransition';
import { getProductImages, FALLBACK_PRODUCT_IMAGE } from '../utils/productImages';

// One product line in an order - its own component so the thumbnail can take
// part in the shared-element transition to/from ProductDetailsPage. The source
// includes the order id, so with the same product in several orders the image
// flies back to the line that was actually clicked.
const OrderProductRow = ({ product, orderId }) => {
    const navigate = useNavigate();
    const source = `orders:${orderId}`;
    const { ref: imageRef, hidden } = useSharedImageReturn(product.id, source);
    const images = getProductImages(product);
    const imageUrl = images[0] || FALLBACK_PRODUCT_IMAGE;

    // A product deleted after this order was placed: the line still shows what
    // was bought (from the order's snapshot) but has no page to open any more.
    const available = product.id != null;

    const openDetails = () => {
        if (!available) return;
        startProductTransition(product.id, imageRef.current, imageUrl, { source });
        navigate(`/products/${product.id}`, { state: { preview: product, imageIndex: 0 } });
    };

    return (
        <Box sx={{
            display: 'flex', gap: 2, mb: 2,
            cursor: available ? 'pointer' : 'default',
            '&:hover': available ? { opacity: 0.8 } : {},
        }}
             onClick={openDetails}
        >
            <Box component="img" ref={imageRef} src={imageUrl} alt={product.name}
                 sx={{
                     width: 70, height: 90, objectFit: 'cover', borderRadius: '2px',
                     visibility: hidden ? 'hidden' : 'visible',
                 }} />
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
                {!available && (
                    <Typography sx={{
                        fontFamily: '"Lato", sans-serif', fontSize: '0.72rem',
                        color: '#a0826d', fontStyle: 'italic', mt: 0.3,
                    }}>
                        No longer available
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

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
    }, [navigate]);

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
                    orders.map((order, index) => (
                        <Reveal
                            key={order.id}
                            delay={index * 0.06}
                            instant={!!order.products?.some((p) => hasBackTransition(p.id, `orders:${order.id}`))}
                        >
                        <Box sx={{
                            backgroundColor: '#fdfbf5',
                            mb: 3, p: 3,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                            borderRadius: '4px',
                        }}>
                            {/* Order Header */}
                            <Box sx={{
                                display: 'flex', flexDirection: { xs: 'column', sm: 'row' },
                                justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' },
                                gap: 1, mb: 2,
                            }}>
                                <Typography sx={{
                                    fontFamily: '"Cormorant Garamond", serif',
                                    fontSize: '1.2rem', color: '#2c2c2c',
                                }}>
                                    Order #{order.id}
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
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

                            <Box sx={{ mb: 3 }}>
                                <OrderStatusStepper status={order.status} />
                            </Box>

                            <Divider sx={{ mb: 2, borderColor: 'rgba(212, 184, 150, 0.3)' }} />

                            {/* Products */}
                            {order.products?.map((product, i) => (
                                <OrderProductRow key={`${product.id ?? 'deleted'}-${i}`} product={product} orderId={order.id} />
                            ))}
                        </Box>
                        </Reveal>
                    ))
                )}
            </Container>
        </Box>
    );
};

export default OrderHistoryPage;