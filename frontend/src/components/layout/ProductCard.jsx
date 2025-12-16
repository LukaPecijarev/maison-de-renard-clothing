// import React from 'react';
// import { Card, CardMedia, CardContent, Typography, CardActions, Button, Box } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
// import useAuth from '../../hooks/useAuth';
//
// const ProductCard = ({ product, onEdit, onDelete, onAddToCart }) => {
//     const navigate = useNavigate();
//     const { isAdmin, isAuthenticated } = useAuth();
//
//     const handleViewDetails = () => {
//         navigate(`/products/${product.id}`);
//     };
//
//     return (
//         <Card
//             sx={{
//                 height: '100%',
//                 display: 'flex',
//                 flexDirection: 'column',
//                 transition: 'transform 0.2s',
//                 '&:hover': {
//                     transform: 'scale(1.02)',
//                     boxShadow: 6,
//                 },
//             }}
//         >
//             <CardMedia
//                 component="img"
//                 height="300"
//                 image={product.imageUrl || 'https://via.placeholder.com/300'}
//                 alt={product.name}
//                 sx={{ objectFit: 'cover', cursor: 'pointer' }}
//                 onClick={handleViewDetails}
//             />
//             <CardContent sx={{ flexGrow: 1 }}>
//                 <Typography gutterBottom variant="h6" component="div">
//                     {product.name}
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary" noWrap>
//                     {product.description}
//                 </Typography>
//                 <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
//                     ${product.price}
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">
//                     Category: {product.categoryName}
//                 </Typography>
//                 <Typography variant="body2" color={product.quantity > 0 ? 'success.main' : 'error.main'}>
//                     {product.quantity > 0 ? `In Stock (${product.quantity})` : 'Out of Stock'}
//                 </Typography>
//             </CardContent>
//             <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
//                 {isAdmin() ? (
//                     <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
//                         <Button
//                             size="small"
//                             variant="outlined"
//                             color="primary"
//                             onClick={() => onEdit(product)}
//                             fullWidth
//                         >
//                             Edit
//                         </Button>
//                         <Button
//                             size="small"
//                             variant="outlined"
//                             color="error"
//                             onClick={() => onDelete(product)}
//                             fullWidth
//                         >
//                             Delete
//                         </Button>
//                     </Box>
//                 ) : (
//                     <>
//                         <Button
//                             size="small"
//                             variant="outlined"
//                             onClick={handleViewDetails}
//                         >
//                             View Details
//                         </Button>
//                         {isAuthenticated() && (
//                             <Button
//                                 size="small"
//                                 variant="contained"
//                                 onClick={() => onAddToCart(product.id)}
//                                 disabled={product.quantity === 0}
//                             >
//                                 Add to Cart
//                             </Button>
//                         )}
//                     </>
//                 )}
//             </CardActions>
//         </Card>
//     );
// };
//
// export default ProductCard;