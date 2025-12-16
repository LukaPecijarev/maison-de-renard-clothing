import React from 'react';
import { Card, CardMedia, CardContent, Typography, CardActions, Button, Box, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import useAuth from '../../hooks/useAuth';

const ProductCard = ({ product, onEdit, onDelete, onAddToCart }) => {
    const navigate = useNavigate();
    const { isAdmin, isAuthenticated } = useAuth();

    const handleViewDetails = () => {
        navigate(`/products/${product.id}`);
    };

    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#ffffff',
                border: 'none',
                boxShadow: 'none',
                transition: 'transform 0.3s ease',
                cursor: 'pointer',
                '&:hover': {
                    transform: 'translateY(-5px)',
                },
            }}
            onClick={handleViewDetails}
        >
            <Box sx={{ position: 'relative', paddingTop: '133%', overflow: 'hidden' }}>
                <CardMedia
                    component="img"
                    image={product.imageUrl || 'https://via.placeholder.com/400x533'}
                    alt={product.name}
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                    }}
                />
                {!isAdmin() && isAuthenticated() && (
                    <IconButton
                        onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart(product.id);
                        }}
                        disabled={product.quantity === 0}
                        sx={{
                            position: 'absolute',
                            bottom: 16,
                            right: 16,
                            backgroundColor: '#ffffff',
                            '&:hover': {
                                backgroundColor: '#2c2c2c',
                                color: '#ffffff',
                            },
                        }}
                    >
                        <ShoppingBagOutlinedIcon />
                    </IconButton>
                )}
            </Box>
            <CardContent sx={{ flexGrow: 1, p: 2, textAlign: 'center' }}>
                <Typography
                    variant="h6"
                    sx={{
                        fontFamily: '"Cormorant Garamond", serif',
                        fontWeight: 400,
                        fontSize: '1.1rem',
                        mb: 0.5,
                        letterSpacing: '0.02em',
                    }}
                >
                    {product.name}
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        color: '#666',
                        fontSize: '0.875rem',
                        mb: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: 1.5,
                    }}
                >
                    {product.description}
                </Typography>
                <Typography
                    variant="h6"
                    sx={{
                        color: '#2c2c2c',
                        fontWeight: 400,
                        fontSize: '1rem',
                        mt: 1,
                    }}
                >
                    ${product.price.toFixed(2)}
                </Typography>
                {product.quantity === 0 && (
                    <Typography
                        variant="caption"
                        sx={{
                            color: '#999',
                            fontSize: '0.75rem',
                            fontStyle: 'italic',
                        }}
                    >
                        Out of Stock
                    </Typography>
                )}
            </CardContent>
            {isAdmin() && (
                <CardActions
                    sx={{
                        justifyContent: 'center',
                        px: 2,
                        pb: 2,
                        gap: 1,
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <Button
                        size="small"
                        variant="outlined"
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(product);
                        }}
                        sx={{
                            borderColor: '#2c2c2c',
                            color: '#2c2c2c',
                            fontSize: '0.75rem',
                            '&:hover': {
                                borderColor: '#2c2c2c',
                                backgroundColor: '#2c2c2c',
                                color: '#ffffff',
                            },
                        }}
                    >
                        Edit
                    </Button>
                    <Button
                        size="small"
                        variant="outlined"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(product);
                        }}
                        sx={{
                            borderColor: '#c44536',
                            color: '#c44536',
                            fontSize: '0.75rem',
                            '&:hover': {
                                borderColor: '#c44536',
                                backgroundColor: '#c44536',
                                color: '#ffffff',
                            },
                        }}
                    >
                        Delete
                    </Button>
                </CardActions>
            )}
        </Card>
    );
};

export default ProductCard;