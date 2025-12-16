import React from 'react';
import { Container, Typography, Box, Button, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';

const HomePage = () => {
    const navigate = useNavigate();

    // Component for image with hover effect
    const ImageWithHover = ({ images, alt, name, price, onClick }) => {
        const [isHovered, setIsHovered] = React.useState(false);

        return (
            <Box
                sx={{
                    width: '100%',
                    aspectRatio: '3/4',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    position: 'relative',
                    backgroundColor: '#f5f1e8',
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={onClick}
            >
                <Box
                    component="img"
                    src={isHovered ? images[1] : images[0]}
                    alt={alt}
                    sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'all 0.6s ease',
                        transform: isHovered ? 'scale(1.03)' : 'scale(1)',
                        display: 'block',
                        filter: 'brightness(0.98) contrast(1.02)',
                        mixBlendMode: 'multiply',
                    }}
                />

                {/* Shopping Bag Icon */}
                <IconButton
                    component="a"
                    href="/cart"
                    sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        backgroundColor: 'transparent',
                        width: 36,
                        height: 36,
                        opacity: isHovered ? 1 : 0,
                        transition: 'opacity 0.3s ease',
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        },
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate('/cart');
                    }}
                >
                    <ShoppingBagOutlinedIcon sx={{ fontSize: 20, color: '#ffffff' }} />
                </IconButton>

                {/* Price Popup - Shows on Hover */}
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 16,
                        left: '50%',
                        transform: isHovered ? 'translate(-50%, 0)' : 'translate(-50%, 20px)',
                        opacity: isHovered ? 1 : 0,
                        transition: 'all 0.4s ease',
                        backgroundColor: '#f5ebe0',
                        padding: '8px 20px',
                        borderRadius: '4px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                        pointerEvents: 'none',
                        minWidth: '140px',
                        textAlign: 'center',
                    }}
                >
                    <Typography
                        sx={{
                            fontFamily: '"Lato", sans-serif',
                            fontSize: '0.7rem',
                            fontWeight: 400,
                            color: 'rgba(44, 44, 44, 0.7)',
                            letterSpacing: '0.05em',
                            mb: 0.3,
                            textTransform: 'uppercase',
                        }}
                    >
                        {name}
                    </Typography>
                    <Typography
                        sx={{
                            fontFamily: '"Cormorant Garamond", serif',
                            fontSize: '1rem',
                            fontWeight: 500,
                            color: '#2c2c2c',
                            letterSpacing: '0.05em',
                        }}
                    >
                        {price}
                    </Typography>
                </Box>
            </Box>
        );
    };

    // Example image URLs with names and prices
    const menProducts = [
        {
            images: ['https://media.loropiana.com/HYBRIS/FAQ/FAQ0839/F3A31F28-EEB5-446C-AF81-2FF122E5399E/FAQ0839_D0VB_MEDIUM.jpg?sw=500&sh=700', 'https://media.loropiana.com/HYBRIS/FAQ/FAQ0839/5A9F478F-89D6-4DDD-ADC7-2C913A6FBD09/FAQ0839_D0VB_MEDIUM.jpg'],
            name: 'Cable Knit Sweater',
            price: '€1299'
        },
        {
            images: ['https://media.loropiana.com/HYBRIS/FAQ/FAQ2674/4C15C42C-7EBA-4347-BFBA-492B6E42C8D9/FAQ2674_F7NK_MEDIUM.jpg?sw=500&sh=700', 'https://media.loropiana.com/HYBRIS/FAQ/FAQ2674/E7507378-83E2-4122-B51C-292A595E0AC7/FAQ2674_F7NK_MEDIUM.jpg'],
            name: 'Merino Wool Polo',
            price: '€599'
        },
        {
            images: ['https://media.loropiana.com/HYBRIS/FAO/FAO3172/9BFFA412-D914-43DE-9152-26AB24FEE3A0/FAO3172_W000_MEDIUM.jpg?sw=500&sh=700', 'https://media.loropiana.com/HYBRIS/FAO/FAO3172/C89239A3-F9CC-4A00-9B37-9BA1996B85FF/FAO3172_W000_MEDIUM.jpg'],
            name: 'Cashmere Overcoat',
            price: '€3499'
        },
        {
            images: ['https://media.loropiana.com/HYBRIS/FAQ/FAQ3010/6CC34349-A543-421A-8B19-53C1ED71FEAB/FAQ3010_51EG_MEDIUM.jpg?sw=500&sh=700', 'https://media.loropiana.com/HYBRIS/FAQ/FAQ3010/A05EA408-6D59-4F85-B8F5-CEAD9B95B01B/FAQ3010_51EG_MEDIUM.jpg'],
            name: 'Suede Field Jacket',
            price: '€2899'
        },
    ];

    const womenProducts = [
        {
            images: ['https://media.loropiana.com/HYBRIS/FAP/FAP5979/D1C00CB8-B96A-45C0-8437-2A7015ACBC71/FAP5979_H10W_MEDIUM.jpg?sw=500&sh=700', 'https://media.loropiana.com/HYBRIS/FAP/FAP5979/13B45339-E3F8-46F5-B9B3-80BD2C234900/FAP5979_H10W_MEDIUM.jpg'],
            name: 'Cashmere Polo',
            price: '€1199'
        },
        {
            images: ['https://media.loropiana.com/HYBRIS/FAP/FAP9489/9189C7C7-13BC-47F0-9BB1-87DF6D3F28B6/FAP9489_A014_MEDIUM.jpg?sw=500&sh=700', 'https://media.loropiana.com/HYBRIS/FAP/FAP9489/E51CE160-3908-4286-93C7-C26A41B1E937/FAP9489_A014_MEDIUM.jpg'],
            name: 'Ski Salopettes',
            price: '€1799'
        },
        {
            images: ['https://media.loropiana.com/HYBRIS/FAP/FAP7058/55F28EEC-94B9-40A0-B7C8-3860D2052DCB/FAP7058_H0QI_MEDIUM.jpg?sw=500&sh=700', 'https://media.loropiana.com/HYBRIS/FAP/FAP7058/C5E18F29-C23B-4DE3-8C83-A1B489DFCDD6/FAP7058_H0QI_MEDIUM.jpg'],
            name: 'Cashmere Trench',
            price: '€3299'
        },
        {
            images: ['https://media.loropiana.com/PRODUCTS/HYBRIS/FAP/FAP6985/F7AN/FR/D1866377-298C-46F8-826F-0F413FB47639_FAP6985_F7AN_MEDIUM.jpg?sw=500&sh=700', 'https://media.loropiana.com/PRODUCTS/HYBRIS/FAP/FAP6985/F7AN/L3/E3E2DE6D-D8E4-4C5A-A675-F974C53D41AE_FAP6985_F7AN_MEDIUM.jpg'],
            name: 'Ribbed Cardigan',
            price: '€1399'
        },
    ];

    const giftsProducts = [
        {
            images: ['https://media.loropiana.com/HYBRIS/FAQ/FAQ0627/8CB810A7-3A45-4DBA-967D-4EEA41B6CCB3/FAQ0627_T1SS_MEDIUM.jpg', 'https://media.loropiana.com/HYBRIS/FAQ/FAQ0627/3B091BE1-CD87-4091-B3F1-0DA38006B77D/FAQ0627_T1SS_MEDIUM.jpg'],
            name: 'Vintage Car Print',
            price: '€599'
        },
        {
            images: ['https://media.loropiana.com/HYBRIS/FAQ/FAQ2841/9117F3EE-B78E-42FE-ABA0-62D040935E1F/FAQ2841_B5NA_MEDIUM.jpg', 'https://media.loropiana.com/HYBRIS/FAQ/FAQ2841/A1A1AD17-CF12-4B33-8F5F-D1BA91174CA2/FAQ2841_B5NA_MEDIUM.jpg?sw=500&sh=700'],
            name: 'Leather Travel Case',
            price: '€899'
        },
        {
            images: ['https://media.loropiana.com/HYBRIS/FAO/FAO5321/E0DC56C0-F976-411F-A51A-0D9CB1B51F6E/FAO5321_F6KX_MEDIUM.jpg', 'https://media.loropiana.com/PRODUCTS/HYBRIS/FAO/FAO5321/F6KX/D3/DEC74A3D-D8E1-4534-8505-2C4E0AE81A6B_FAO5321_F6KX_MEDIUM.jpg'],
            name: 'Cashmere Socks',
            price: '€299'
        },
        {
            images: ['https://media.loropiana.com/PRODUCTS/HYBRIS/FAP/FAP5328/H16Y/FR/FE19A6D6-59EB-46EA-AE50-638A05317716_FAP5328_H16Y_MEDIUM.jpg', 'https://media.loropiana.com/HYBRIS/FAP/FAP5328/97FEDA37-D6A5-447B-B2BC-FAAFB97B3E13/FAP5328_H16Y_MEDIUM.jpg'],
            name: 'Leather Backpack',
            price: '€1299'
        },
    ];

    return (
        <Box sx={{ backgroundColor: '#f5f1e8' }}>
            {/* Hero Video Section */}
            <Box
                sx={{
                    position: 'relative',
                    width: '100%',
                    height: '70vh',
                    backgroundColor: '#e8dcc8',
                    overflow: 'hidden',
                }}
            >
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                    }}
                >
                    <source src="/MaisonVideo.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </Box>

            {/* Category Sections */}
            <Container maxWidth="xl" sx={{ pt: 8, pb: 3 }}>
                {/* Men Section */}
                <Box sx={{ mb: 10 }}>
                    <Typography
                        variant="h3"
                        align="center"
                        sx={{
                            fontFamily: '"Cormorant Garamond", serif',
                            fontWeight: 300,
                            letterSpacing: '0.1em',
                            mb: 3,
                        }}
                    >
                        Men
                    </Typography>
                    <Typography
                        variant="body1"
                        align="center"
                        sx={{
                            maxWidth: 800,
                            mx: 'auto',
                            mb: 6,
                            lineHeight: 1.8,
                            color: '#666',
                            fontSize: '0.95rem',
                        }}
                    >
                        Born from a heritage of craftsmanship, Maison de Renard's menswear embodies
                        timeless sophistication through impeccable tailoring and noble materials. From
                        the finest merino wools and cashmeres to silks of understated brilliance, each
                        piece reflects the Maison's devotion to quiet luxury. Every garment is shaped
                        with masterful precision, offering an effortless elegance and tactile refinement
                        that are unmistakably Maison de Renard.
                    </Typography>
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                            gap: 3,
                        }}
                    >
                        {menProducts.map((product, index) => (
                            <ImageWithHover
                                key={index}
                                images={product.images}
                                name={product.name}
                                price={product.price}
                                alt={`Men's product ${index + 1}`}
                                onClick={() => navigate('/products?category=2')}
                            />
                        ))}
                    </Box>
                </Box>

                {/* Mid-Page Video Section - Vertical */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        height: '80vh',
                        mb: 10,
                        overflow: 'hidden',
                        backgroundColor: '#f5f1e8',
                    }}
                >
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        style={{
                            width: '60%',
                            height: 'auto',
                            maxHeight: '100%',
                            objectFit: 'cover',
                        }}
                    >
                        <source src="/MaisonHomePage2.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </Box>

                {/* Women Section */}
                <Box sx={{ mb: 10 }}>
                    <Typography
                        variant="h3"
                        align="center"
                        sx={{
                            fontFamily: '"Cormorant Garamond", serif',
                            fontWeight: 300,
                            letterSpacing: '0.1em',
                            mb: 3,
                        }}
                    >
                        Women
                    </Typography>
                    <Typography
                        variant="body1"
                        align="center"
                        sx={{
                            maxWidth: 800,
                            mx: 'auto',
                            mb: 6,
                            lineHeight: 1.8,
                            color: '#666',
                            fontSize: '0.95rem',
                        }}
                    >
                        Maison de Renard's womenswear celebrates elegance and grace through the finest
                        craftsmanship and exceptional materials. From sumptuous cashmeres and delicate
                        silks to exclusive wools with a whisper of sheen, each creation is thoughtfully
                        designed to drape and move with effortless refinement. Every detail is
                        meticulously considered, offering a sensorial experience and a signature
                        sophistication that is uniquely Maison de Renard.
                    </Typography>
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                            gap: 3,
                        }}
                    >
                        {womenProducts.map((product, index) => (
                            <ImageWithHover
                                key={index}
                                images={product.images}
                                name={product.name}
                                price={product.price}
                                alt={`Women's product ${index + 1}`}
                                onClick={() => navigate('/products?category=1')}
                            />
                        ))}
                    </Box>
                </Box>

                {/* Mid-Page Video Section 2 - Vertical */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        height: '80vh',
                        mb: 10,
                        overflow: 'hidden',
                        backgroundColor: '#f5f1e8',
                    }}
                >
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        style={{
                            width: '60%',
                            height: 'auto',
                            maxHeight: '100%',
                            objectFit: 'cover',
                        }}
                    >
                        <source src="/MaisonHomePage3.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </Box>

                {/* Gifts Section */}
                <Box sx={{ mb: 10 }}>
                    <Typography
                        variant="h3"
                        align="center"
                        sx={{
                            fontFamily: '"Cormorant Garamond", serif',
                            fontWeight: 300,
                            letterSpacing: '0.1em',
                            mb: 3,
                        }}
                    >
                        Gifts
                    </Typography>
                    <Typography
                        variant="body1"
                        align="center"
                        sx={{
                            maxWidth: 800,
                            mx: 'auto',
                            mb: 6,
                            lineHeight: 1.8,
                            color: '#666',
                            fontSize: '0.95rem',
                        }}
                    >
                        Maison de Renard's curated selection of gifts embodies timeless elegance and
                        understated luxury. From exquisitely crafted scarves and cashmere accessories to
                        refined leather pieces and delicate silks, each item is designed to delight the
                        senses and leave a lasting impression. Thoughtfully presented, these treasures
                        reflect the Maison's dedication to artistry, making every gift a gesture of
                        refined taste and enduring sophistication.
                    </Typography>
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                            gap: 3,
                        }}
                    >
                        {giftsProducts.map((product, index) => (
                            <ImageWithHover
                                key={index}
                                images={product.images}
                                name={product.name}
                                price={product.price}
                                alt={`Gift product ${index + 1}`}
                                onClick={() => navigate('/products?category=3')}
                            />
                        ))}
                    </Box>
                </Box>

                {/* CTA Section */}
                <Box
                    sx={{
                        textAlign: 'center',
                        py: 2,
                        mb: 0,
                    }}
                >
                    <Typography
                        variant="h4"
                        sx={{
                            fontFamily: '"Cormorant Garamond", serif',
                            fontWeight: 300,
                            letterSpacing: '0.1em',
                            mb: 3,
                        }}
                    >
                        Discover Our Collection
                    </Typography>
                    <Button
                        variant="outlined"
                        size="large"
                        onClick={() => navigate('/products')}
                        sx={{
                            color: '#22223b',
                            borderColor: '#e6b8a2',
                            borderWidth: '1px',
                            px: 8,
                            py: 1.8,
                            fontSize: '0.75rem',
                            fontWeight: 400,
                            letterSpacing: '0.15em',
                            fontFamily: '"Lato", sans-serif',
                            backgroundColor: 'transparent',
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            position: 'relative',
                            overflow: 'hidden',
                            borderRadius: '6px',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: '-100%',
                                width: '100%',
                                height: '100%',
                                backgroundColor: '#f5ebe0',
                                transition: 'left 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                zIndex: -1,
                            },
                            '&:hover': {
                                color: '#22223b',
                                borderColor: '#f5ebe0',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(193, 154, 107, 0.3)',
                            },
                            '&:hover::before': {
                                left: 0,
                            },
                        }}
                    >
                        SHOP NOW
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default HomePage;