import React, { useEffect } from 'react';
import { Container, Typography, Box, Button, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import RecentlyViewed from '../components/RecentlyViewed';
import Reveal from '../components/Reveal';
import ShopTheLookSection from '../components/ShopTheLookSection';
import useProducts from '../hooks/useProducts';

const HomePage = () => {
    const navigate = useNavigate();
    const heroVideoRef = React.useRef(null);
    const midVideo1Ref = React.useRef(null);
    const midVideo2Ref = React.useRef(null);

    // The "Shop the Look" pieces below are matched to their real product by
    // name (rather than a hardcoded id) so a card click can route straight
    // to that product's page - ids aren't stable across reseeds, but names
    // are what DataInitializer's existsByName guard keys off already.
    const { products: menCategoryProducts } = useProducts(2);
    const { products: womenCategoryProducts } = useProducts(1);
    const { products: giftsCategoryProducts } = useProducts(3);
    const goToOutfitPiece = (categoryProducts, productName) => {
        const match = categoryProducts.find((p) => p.name === productName);
        if (match) {
            navigate(`/products/${match.id}`);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;

            if (heroVideoRef.current) {
                const scale = 1 + scrollY * 0.0003;
                heroVideoRef.current.style.transform = `scale(${Math.min(scale, 2.35)})`;
            }
            if (midVideo1Ref.current) {
                const container = document.querySelector('.mid-video-1');
                if (container) {
                    const rect = container.getBoundingClientRect();
                    const offset = (window.innerHeight / 2 - rect.top) * 0.08;
                    const scale = 1 + Math.max(0, offset) * 0.008;
                    midVideo1Ref.current.style.transform = `scale(${Math.min(scale, 1.08)})`;
                }
            }
            if (midVideo2Ref.current) {
                const container = document.querySelector('.mid-video-2');
                if (container) {
                    const rect = container.getBoundingClientRect();
                    const offset = (window.innerHeight / 2 - rect.top) * 0.05;
                    const scale = 1 + Math.max(0, offset) * 0.005;
                    midVideo2Ref.current.style.transform = `scale(${Math.min(scale, 1.08)})`;
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const ImageWithHover = ({ images, alt, name, price, onClick, categoryUrl }) => {
        const [isHovered, setIsHovered] = React.useState(false);
        const [cursorPos, setCursorPos] = React.useState({ x: 0, y: 0 });
        const [overIcon, setOverIcon] = React.useState(false);
        const showCursorHint = isHovered && !overIcon;

        // Tell the global CustomCursor to stand down while this tile's own
        // VIEW bubble is showing, so the two don't draw on top of each other.
        React.useEffect(() => {
            window.dispatchEvent(new CustomEvent('customCursor:localHint', { detail: { active: showCursorHint } }));
            return () => window.dispatchEvent(new CustomEvent('customCursor:localHint', { detail: { active: false } }));
        }, [showCursorHint]);

        return (
            <Box
                sx={{
                    width: '100%',
                    aspectRatio: '3/4',
                    overflow: 'hidden',
                    cursor: showCursorHint ? 'none' : 'pointer',
                    position: 'relative',
                    backgroundColor: '#f5f1e8',
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setCursorPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                }}
                onClick={onClick}
            >
                {/* Custom cursor-follow "VIEW" hint, replacing the system pointer while hovering -
                    hidden over the shopping bag icon so the real cursor shows through instead */}
                <Box
                    sx={{
                        position: 'absolute',
                        left: cursorPos.x, top: cursorPos.y,
                        transform: `translate(-50%, -50%) scale(${showCursorHint ? 1 : 0.4})`,
                        opacity: showCursorHint ? 1 : 0,
                        transition: 'opacity 0.2s ease, transform 0.2s ease',
                        pointerEvents: 'none',
                        width: 62, height: 62, borderRadius: '50%',
                        backgroundColor: 'rgba(230, 204, 178, 0.55)',
                        backdropFilter: 'blur(2px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 3,
                    }}
                >
                    <Typography sx={{
                        fontFamily: '"Lato", sans-serif', fontSize: '0.65rem',
                        color: '#2c2c2c', letterSpacing: '0.1em',
                    }}>
                        VIEW
                    </Typography>
                </Box>
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

                <IconButton
                    onMouseEnter={() => setOverIcon(true)}
                    onMouseLeave={() => setOverIcon(false)}
                    sx={{
                        position: 'absolute',
                        top: { xs: 6, sm: 12 },
                        right: { xs: 6, sm: 12 },
                        backgroundColor: 'transparent',
                        width: { xs: 28, sm: 36 },
                        height: { xs: 28, sm: 36 },
                        cursor: 'pointer',
                        opacity: isHovered ? 1 : 0,
                        transition: 'opacity 0.3s ease',
                        '@media (hover: none)': { opacity: 1 },
                        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(categoryUrl);
                    }}
                >
                    <ShoppingBagOutlinedIcon sx={{ fontSize: { xs: 15, sm: 20 }, color: '#ffffff' }} />
                </IconButton>

                <Box
                    sx={{
                        position: 'absolute',
                        bottom: { xs: 8, sm: 16 },
                        left: '50%',
                        transform: { xs: 'translate(-50%, 0)', sm: isHovered ? 'translate(-50%, 0)' : 'translate(-50%, 20px)' },
                        opacity: isHovered ? 1 : 0,
                        transition: 'all 0.4s ease',
                        '@media (hover: none)': { opacity: 1 },
                        backgroundColor: '#f5ebe0',
                        padding: { xs: '5px 10px', sm: '8px 20px' },
                        borderRadius: '4px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                        pointerEvents: 'none',
                        minWidth: { xs: '100px', sm: '140px' },
                        maxWidth: { xs: '90%', sm: 'none' },
                        textAlign: 'center',
                    }}
                >
                    <Typography sx={{
                        fontFamily: '"Lato", sans-serif',
                        fontSize: { xs: '0.55rem', sm: '0.7rem' }, fontWeight: 400,
                        color: 'rgba(44, 44, 44, 0.7)',
                        letterSpacing: '0.05em', mb: 0.3,
                        textTransform: 'uppercase',
                        whiteSpace: { xs: 'nowrap', sm: 'normal' },
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}>
                        {name}
                    </Typography>
                    <Typography sx={{
                        fontFamily: '"Cormorant Garamond", serif',
                        fontSize: { xs: '0.85rem', sm: '1rem' }, fontWeight: 500,
                        color: '#2c2c2c', letterSpacing: '0.05em',
                    }}>
                        {price}
                    </Typography>
                </Box>
            </Box>
        );
    };

    // The 4-tile grids below show real catalog products pulled from each
    // category (fetched above via useProducts), rather than placeholder
    // stock photos - each tile routes straight to that specific product's
    // page on click, not the category listing. The outfit pieces already
    // featured in the "Shop the Look" carousels are excluded here so
    // nothing's shown twice on the same page.
    const OUTFIT_PIECE_NAMES = new Set([
        'Navy Wool Overcoat', 'Cable Knit Wool Cardigan', 'Classic Cotton Shirt',
        'Pleated Wool Trousers', 'Wool Flat Cap',
        'Tweed Stand-Collar Jacket', 'Wide-Brim Wool Hat',
        'Wide-Leg Checked Wool Trousers', 'Leopard Print Bow Loafers',
    ]);
    const toTile = (product) => {
        const images = product.imageUrl ? product.imageUrl.split(',').map((u) => u.trim()) : [];
        return {
            id: product.id,
            images: [images[0], images[1] || images[0]],
            name: product.name,
            price: `€${Math.round(product.price)}`,
        };
    };
    const menProducts = menCategoryProducts
        .filter((p) => !OUTFIT_PIECE_NAMES.has(p.name))
        .slice(0, 4)
        .map(toTile);
    const womenProducts = womenCategoryProducts
        .filter((p) => !OUTFIT_PIECE_NAMES.has(p.name))
        .slice(0, 4)
        .map(toTile);
    const giftsProducts = giftsCategoryProducts.slice(0, 4).map(toTile);

    // Carousel content for the Men "Shop the Look" banner - these 5 pieces
    // from the photographed outfit. A person wearing the piece should only
    // ever appear in the full banner photo (ManOutfit.jpg) - every card here,
    // default AND hover, uses a plain, isolated shot of the item alone (the
    // same defaults the product grid/detail pages use, plus a second
    // isolated angle for the hover swap). `name` is the shortened display
    // label; `productName` is the exact DataInitializer product name (they
    // differ for a few pieces) and is what goToOutfitPiece() matches on to
    // find the real product and route to it.
    const manOutfitPieces = [
        { image: '/products/men/ManCoat5.jpg', hoverImage: '/products/men/ManCoat6.jpg', name: 'Navy Wool Overcoat', productName: 'Navy Wool Overcoat', subtitle: 'Virgin Wool' },
        { image: '/products/men/ManCardigan5.jpg', hoverImage: '/products/men/ManCardigan6.jpg', name: 'Cable Knit Cardigan', productName: 'Cable Knit Wool Cardigan', subtitle: 'Wool' },
        { image: '/products/men/ManShirt5.jpg', hoverImage: '/products/men/ManShirt6.jpg', name: 'Classic Cotton Shirt', productName: 'Classic Cotton Shirt', subtitle: 'Cotton' },
        { image: '/products/men/ManTrousers5.jpg', hoverImage: '/products/men/ManTrousers6.jpg', name: 'Pleated Trousers', productName: 'Pleated Wool Trousers', subtitle: 'Wool' },
        { image: '/products/men/ManHat2.jpg', hoverImage: '/products/men/ManHat4.jpg', name: 'Wool Flat Cap', productName: 'Wool Flat Cap', subtitle: 'Wool' },
    ];

    // Carousel content for the Women "Shop the Look" banner - same
    // convention as manOutfitPieces above: plain isolated shots only, a
    // person only ever shows up in the WomenFullLook.jpg banner photo.
    // See manOutfitPieces above for why `productName` is separate from `name`.
    const womanOutfitPieces = [
        { image: '/products/women/WomanCoat5.jpg', hoverImage: '/products/women/WomanCoat6.jpg', name: 'Tweed Stand-Collar Jacket', productName: 'Tweed Stand-Collar Jacket', subtitle: 'Wool Tweed' },
        { image: '/products/women/WomanHat2.jpg', hoverImage: '/products/women/WomanHat3.jpg', name: 'Wide-Brim Wool Hat', productName: 'Wide-Brim Wool Hat', subtitle: 'Wool Felt' },
        { image: '/products/women/WomanTrousers5.jpg', hoverImage: '/products/women/WomanTrousers6.jpg', name: 'Wide-Leg Trousers', productName: 'Wide-Leg Checked Wool Trousers', subtitle: 'Wool' },
        { image: '/products/women/WomanShoes4.jpg', hoverImage: '/products/women/WomanShoes6.jpg', name: 'Leopard Bow Loafers', productName: 'Leopard Print Bow Loafers', subtitle: 'Silk' },
    ];


    return (
        <Box sx={{ backgroundColor: '#f5f1e8' }}>
            {/* Hero Video */}
            <Box sx={{
                position: 'relative', width: '100%', height: '70vh',
                backgroundColor: '#e8dcc8', overflow: 'hidden',
            }}>
                <video
                    ref={heroVideoRef}
                    autoPlay loop muted playsInline
                    style={{
                        width: '100%', height: '100%', objectFit: 'cover',
                        transition: 'transform 0.1s ease-out',
                        transformOrigin: 'center center',
                    }}
                >
                    <source src="/MaisonVideo.mp4" type="video/mp4" />
                </video>
            </Box>

            <Container maxWidth="xl" sx={{ pt: 8, pb: 3 }}>
                {/* Men Section */}
                <Box sx={{ mb: 10 }}>
                    <Box sx={{ mb: 6 }}>
                        <ShopTheLookSection
                            title="Men"
                            image="/products/men/ManOutfit.jpg"
                            imageAlt="Men's look"
                            imageOnRight
                            onImageClick={() => navigate('/products?category=2')}
                            onViewAllClick={() => navigate('/products?category=2')}
                            onProductClick={(product) => goToOutfitPiece(menCategoryProducts, product.productName)}
                            products={manOutfitPieces}
                        />
                    </Box>
                    <Typography variant="h3" align="center" sx={{
                        fontFamily: '"Cormorant Garamond", serif',
                        fontWeight: 300, letterSpacing: '0.1em', mb: 3,
                    }}>
                        Men
                    </Typography>
                    <Typography variant="body1" align="center" sx={{
                        maxWidth: 800, mx: 'auto', mb: 6, lineHeight: 1.8, color: '#666', fontSize: '0.95rem',
                    }}>
                        Born from a heritage of craftsmanship, Maison de Renard's menswear embodies
                        timeless sophistication through impeccable tailoring and noble materials. From
                        the finest merino wools and cashmeres to silks of understated brilliance, each
                        piece reflects the Maison's devotion to quiet luxury. Every garment is shaped
                        with masterful precision, offering an effortless elegance and tactile refinement
                        that are unmistakably Maison de Renard.
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: { xs: 1.5, sm: 3 } }}>
                        {menProducts.map((product, index) => (
                            <Reveal key={product.id} delay={index * 0.08}>
                                <ImageWithHover
                                    images={product.images}
                                    name={product.name}
                                    price={product.price}
                                    alt={product.name}
                                    categoryUrl={`/products/${product.id}`}
                                    onClick={() => navigate(`/products/${product.id}`)}
                                />
                            </Reveal>
                        ))}
                    </Box>
                </Box>

                {/* Mid Video 1 */}
                <Box
                    className="mid-video-1"
                    sx={{
                        display: 'flex', justifyContent: 'center', alignItems: 'center',
                        width: '100%', height: '80vh', mb: 10, overflow: 'hidden',
                        backgroundColor: '#f5f1e8',
                    }}
                >
                    <video
                        ref={midVideo1Ref}
                        autoPlay loop muted playsInline
                        style={{
                            width: '70%', height: 'auto', maxHeight: '100%', objectFit: 'cover',
                            transition: 'transform 0.1s ease-out',
                            transformOrigin: 'center center',
                        }}
                    >
                        <source src="/MaisonHomePage3.mp4" type="video/mp4" />
                    </video>
                </Box>

                {/* Women Section */}
                <Box sx={{ mb: 10 }}>
                    <Box sx={{ mb: 6 }}>
                        <ShopTheLookSection
                            title="Women"
                            image="/products/women/WomenFullLook.jpg"
                            imageAlt="Women's look"
                            onImageClick={() => navigate('/products?category=1')}
                            onViewAllClick={() => navigate('/products?category=1')}
                            onProductClick={(product) => goToOutfitPiece(womenCategoryProducts, product.productName)}
                            products={womanOutfitPieces}
                        />
                    </Box>
                    <Typography variant="h3" align="center" sx={{
                        fontFamily: '"Cormorant Garamond", serif',
                        fontWeight: 300, letterSpacing: '0.1em', mb: 3,
                    }}>
                        Women
                    </Typography>
                    <Typography variant="body1" align="center" sx={{
                        maxWidth: 800, mx: 'auto', mb: 6, lineHeight: 1.8, color: '#666', fontSize: '0.95rem',
                    }}>
                        Maison de Renard's womenswear celebrates elegance and grace through the finest
                        craftsmanship and exceptional materials. From sumptuous cashmeres and delicate
                        silks to exclusive wools with a whisper of sheen, each creation is thoughtfully
                        designed to drape and move with effortless refinement. Every detail is
                        meticulously considered, offering a sensorial experience and a signature
                        sophistication that is uniquely Maison de Renard.
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: { xs: 1.5, sm: 3 } }}>
                        {womenProducts.map((product, index) => (
                            <Reveal key={product.id} delay={index * 0.08}>
                                <ImageWithHover
                                    images={product.images}
                                    name={product.name}
                                    price={product.price}
                                    alt={product.name}
                                    categoryUrl={`/products/${product.id}`}
                                    onClick={() => navigate(`/products/${product.id}`)}
                                />
                            </Reveal>
                        ))}
                    </Box>
                </Box>

                {/* Mid Video 2 */}
                <Box
                    className="mid-video-2"
                    sx={{
                        display: 'flex', justifyContent: 'center', alignItems: 'center',
                        width: '100%', height: '80vh', mb: 10, overflow: 'hidden',
                        backgroundColor: '#f5f1e8',
                    }}
                >
                    <video
                        ref={midVideo2Ref}
                        autoPlay loop muted playsInline
                        style={{
                            width: '70%', height: 'auto', maxHeight: '100%', objectFit: 'cover',
                            transition: 'transform 0.1s ease-out',
                            transformOrigin: 'center center',
                        }}
                    >
                        <source src="/MaisonHomePage2.mp4" type="video/mp4" />
                    </video>
                </Box>

                {/* Gifts Section */}
                <Box sx={{ mb: 10 }}>
                    <Typography variant="h3" align="center" sx={{
                        fontFamily: '"Cormorant Garamond", serif',
                        fontWeight: 300, letterSpacing: '0.1em', mb: 3,
                    }}>
                        Gifts
                    </Typography>
                    <Typography variant="body1" align="center" sx={{
                        maxWidth: 800, mx: 'auto', mb: 6, lineHeight: 1.8, color: '#666', fontSize: '0.95rem',
                    }}>
                        Maison de Renard's curated selection of gifts embodies timeless elegance and
                        understated luxury. From exquisitely crafted scarves and cashmere accessories to
                        refined leather pieces and delicate silks, each item is designed to delight the
                        senses and leave a lasting impression. Thoughtfully presented, these treasures
                        reflect the Maison's dedication to artistry, making every gift a gesture of
                        refined taste and enduring sophistication.
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: { xs: 1.5, sm: 3 } }}>
                        {giftsProducts.map((product, index) => (
                            <Reveal key={product.id} delay={index * 0.08}>
                                <ImageWithHover
                                    images={product.images}
                                    name={product.name}
                                    price={product.price}
                                    alt={product.name}
                                    categoryUrl={`/products/${product.id}`}
                                    onClick={() => navigate(`/products/${product.id}`)}
                                />
                            </Reveal>
                        ))}
                    </Box>
                </Box>

                {/* CTA */}
                <Box sx={{ textAlign: 'center', py: 2, mb: 10 }}>
                    <Typography variant="h4" sx={{
                        fontFamily: '"Cormorant Garamond", serif',
                        fontWeight: 300, letterSpacing: '0.1em', mb: 3,
                    }}>
                        Discover Our Collection
                    </Typography>
                    <Button
                        variant="outlined"
                        size="large"
                        onClick={() => navigate('/products')}
                        sx={{
                            color: '#22223b', borderColor: '#e6b8a2', borderWidth: '1px',
                            px: 8, py: 1.8, fontSize: '0.75rem', fontWeight: 400,
                            letterSpacing: '0.15em', fontFamily: '"Lato", sans-serif',
                            backgroundColor: 'transparent',
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            position: 'relative', overflow: 'hidden', borderRadius: '6px',
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
                        }}
                    >
                        SHOP NOW
                    </Button>
                </Box>

                {/* Recently Viewed - below the collection CTA */}
                <RecentlyViewed />
            </Container>
        </Box>
    );
};

export default HomePage;