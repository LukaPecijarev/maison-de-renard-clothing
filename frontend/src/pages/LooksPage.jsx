import React, { useState } from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EastRoundedIcon from '@mui/icons-material/EastRounded';
import Reveal from '../components/Reveal';
import useProducts from '../hooks/useProducts';
import useSharedImageReturn from '../hooks/useSharedImageReturn';
import { startProductTransition, hasBackTransition } from '../utils/sharedImageTransition';
import { pageEnterSx, pageEnterDelayedSx } from '../utils/pageEnter';
import { fillButtonSx } from '../styles/buttons';
import { LOOKS } from '../data/looks';

// "View all looks": both photographed looks, editorial-style. Each look pairs
// its campaign photo (which stays in view while scrolling) with its pieces in a
// staggered two-column layout; a piece opens its product page with the same
// shared-element transition as the rest of the shop.

const discountedPrice = (product) =>
    product.price * (1 - (product.discountPercentage || 0) / 100);

const formatPrice = (value) => `€${Math.round(value).toLocaleString('en-US')}`;

const PieceCard = ({ piece, product, index }) => {
    const navigate = useNavigate();
    const [hovered, setHovered] = useState(false);
    const { ref: imageRef, hidden } = useSharedImageReturn(product?.id, 'looks');
    const src = hovered && piece.hoverImage ? piece.hoverImage : piece.image;
    const discount = product?.discountPercentage || 0;

    const open = () => {
        if (!product) return;
        startProductTransition(product.id, imageRef.current, src, { source: 'looks', fit: 'contain', background: '#ffffff' });
        navigate(`/products/${product.id}`, { state: { preview: product, imageIndex: 0 } });
    };

    return (
        <Box
            onClick={open}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            sx={{ cursor: product ? 'pointer' : 'default' }}
        >
            <Box sx={{
                position: 'relative',
                aspectRatio: '3/4',
                backgroundColor: '#ffffff',
                borderRadius: '14px',
                overflow: 'hidden',
                border: '1px solid rgba(212, 184, 150, 0.25)',
                boxShadow: hovered ? '0 18px 40px rgba(44, 44, 44, 0.12)' : '0 6px 20px rgba(44, 44, 44, 0.05)',
                transform: hovered ? 'translateY(-6px)' : 'none',
                transition: 'box-shadow 0.45s ease, transform 0.45s cubic-bezier(0.25, 0.8, 0.25, 1)',
                p: 2,
            }}>
                <Box
                    component="img"
                    ref={imageRef}
                    src={src}
                    alt={piece.name}
                    draggable={false}
                    sx={{
                        width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'top', display: 'block',
                        transition: 'opacity 0.3s ease, transform 0.6s ease',
                        transform: hovered ? 'scale(1.03)' : 'none',
                        visibility: hidden ? 'hidden' : 'visible',
                    }}
                />
                <Typography sx={{
                    position: 'absolute', top: 12, left: 14,
                    fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic', fontSize: '1.1rem', color: '#c4a886',
                }}>
                    {String(index + 1).padStart(2, '0')}
                </Typography>
                {discount > 0 && (
                    <Box sx={{
                        position: 'absolute', top: 12, right: 12, px: 1.1, py: 0.3, borderRadius: '999px',
                        backgroundColor: '#9c4a4a', color: '#ffffff',
                        fontFamily: '"Lato", sans-serif', fontSize: '0.68rem', fontWeight: 700,
                    }}>
                        -{discount}%
                    </Box>
                )}
                {product && (
                    <Box sx={{
                        position: 'absolute', left: '50%', bottom: 14,
                        transform: `translateX(-50%) translateY(${hovered ? 0 : 10}px)`,
                        opacity: hovered ? 1 : 0,
                        transition: 'opacity 0.35s ease, transform 0.35s ease',
                        display: 'flex', alignItems: 'center', gap: 0.8,
                        px: 1.6, py: 0.6, borderRadius: '999px',
                        backgroundColor: 'rgba(253, 251, 245, 0.92)', backdropFilter: 'blur(6px)',
                        fontFamily: '"Lato", sans-serif', fontSize: '0.68rem', letterSpacing: '0.15em', color: '#6b5640',
                        whiteSpace: 'nowrap',
                        '@media (hover: none)': { display: 'none' },
                    }}>
                        VIEW PIECE <EastRoundedIcon sx={{ fontSize: 14 }} />
                    </Box>
                )}
            </Box>
            <Box sx={{ pt: 1.8, px: 0.5 }}>
                <Typography sx={{
                    fontFamily: '"Lato", sans-serif', fontSize: '0.68rem', letterSpacing: '0.18em',
                    color: '#a0826d', textTransform: 'uppercase', mb: 0.4,
                }}>
                    {piece.subtitle}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 1 }}>
                    <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.25rem', color: '#2c2c2c', lineHeight: 1.2 }}>
                        {piece.name}
                    </Typography>
                    {product && (
                        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.8, flex: '0 0 auto' }}>
                            {discount > 0 && (
                                <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '0.9rem', color: '#a0a0a0', textDecoration: 'line-through' }}>
                                    {formatPrice(product.price)}
                                </Typography>
                            )}
                            <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.1rem', color: discount > 0 ? '#9c4a4a' : '#6b5640' }}>
                                {formatPrice(discountedPrice(product))}
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

const LookSection = ({ look, index }) => {
    const navigate = useNavigate();
    const { products } = useProducts(look.categoryId);
    const pieces = look.pieces.map((piece) => ({
        piece,
        product: products.find((p) => p.name === piece.productName) || null,
    }));
    const found = pieces.filter((p) => p.product);
    const total = found.reduce((sum, p) => sum + discountedPrice(p.product), 0);
    const photoOnRight = index % 2 === 1;

    return (
        <Box id={`look-${look.id}`} component="section" sx={{ scrollMarginTop: 24, mb: { xs: 10, md: 16 } }}>
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: { xs: 5, md: 8 },
                alignItems: 'start',
            }}>
                {/* Campaign photo - stays in view while the pieces scroll past */}
                <Box sx={{ order: { xs: 1, md: photoOnRight ? 2 : 1 }, position: { md: 'sticky' }, top: { md: 24 } }}>
                    <Reveal>
                        <Box sx={{
                            position: 'relative', borderRadius: '18px', overflow: 'hidden',
                            height: { xs: '68vh', md: 'calc(100vh - 48px)' }, maxHeight: 900,
                            boxShadow: '0 24px 60px rgba(44, 44, 44, 0.16)',
                            '&:hover img': { transform: 'scale(1.04)' },
                        }}>
                            <Box component="img" src={look.image} alt={`${look.title}'s look`}
                                 sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 1.2s cubic-bezier(0.25, 0.8, 0.25, 1)' }} />
                            <Box sx={{
                                position: 'absolute', inset: 0,
                                background: 'linear-gradient(to top, rgba(28, 22, 16, 0.55) 0%, rgba(28, 22, 16, 0) 45%)',
                                pointerEvents: 'none',
                            }} />
                            <Box sx={{ position: 'absolute', left: { xs: 22, md: 34 }, bottom: { xs: 22, md: 34 }, color: '#fdfbf5' }}>
                                <Typography sx={{ fontFamily: '"Lato", sans-serif', fontSize: '0.7rem', letterSpacing: '0.3em', opacity: 0.9, mb: 0.5 }}>
                                    LOOK {String(index + 1).padStart(2, '0')}
                                </Typography>
                                <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic', fontSize: { xs: '2.4rem', md: '3.4rem' }, lineHeight: 1 }}>
                                    {look.title}
                                </Typography>
                            </Box>
                        </Box>
                    </Reveal>
                </Box>

                {/* Pieces */}
                <Box sx={{ order: { xs: 2, md: photoOnRight ? 1 : 2 }, pt: { md: 6 } }}>
                    <Reveal>
                        <Typography sx={{
                            fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic',
                            fontSize: { xs: '4rem', md: '5.5rem' }, color: 'rgba(212, 184, 150, 0.55)', lineHeight: 0.8, mb: 1,
                        }}>
                            {String(index + 1).padStart(2, '0')}
                        </Typography>
                        <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 300, fontSize: { xs: '2rem', md: '2.6rem' }, color: '#2c2c2c', lineHeight: 1.15, mb: 2 }}>
                            {look.tagline}
                        </Typography>
                        <Box sx={{ width: 48, height: '1px', backgroundColor: '#d4b896', mb: 2.5 }} />
                        <Typography sx={{ fontFamily: '"Lato", sans-serif', fontSize: '0.95rem', color: '#6b5640', lineHeight: 1.8, maxWidth: 480, mb: { xs: 5, md: 7 } }}>
                            {look.description}
                        </Typography>
                    </Reveal>

                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', columnGap: { xs: 2, md: 4 }, rowGap: { xs: 4, md: 6 } }}>
                        {pieces.map(({ piece, product }, i) => (
                            // The second column sits lower, for a staggered editorial rhythm.
                            <Box key={piece.productName} sx={{ mt: i % 2 === 1 ? { xs: 5, md: 10 } : 0 }}>
                                <Reveal delay={(i % 2) * 0.12} instant={!!product && hasBackTransition(product.id, 'looks')}>
                                    <PieceCard piece={piece} product={product} index={i} />
                                </Reveal>
                            </Box>
                        ))}
                    </Box>

                    {/* Complete the look */}
                    <Reveal>
                        <Box sx={{
                            mt: { xs: 6, md: 9 }, p: { xs: 3, md: 4 }, borderRadius: '16px',
                            backgroundColor: '#ffffff', border: '1px solid rgba(212, 184, 150, 0.3)',
                            boxShadow: '0 10px 30px rgba(44, 44, 44, 0.06)',
                            display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { sm: 'center' }, justifyContent: 'space-between', gap: 2.5,
                        }}>
                            <Box>
                                <Typography sx={{ fontFamily: '"Lato", sans-serif', fontSize: '0.7rem', letterSpacing: '0.2em', color: '#a0826d', mb: 0.5 }}>
                                    COMPLETE THE LOOK · {found.length} {found.length === 1 ? 'PIECE' : 'PIECES'}
                                </Typography>
                                <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2rem', color: '#2c2c2c', lineHeight: 1 }}>
                                    {found.length > 0 ? formatPrice(total) : '—'}
                                </Typography>
                            </Box>
                            <Button
                                endIcon={<EastRoundedIcon />}
                                onClick={() => navigate(`/products?category=${look.categoryId}`, { state: { smoothScrollTop: true } })}
                                sx={{
                                    ...fillButtonSx,
                                    px: 3.5, py: 1.3, borderRadius: '999px',
                                    fontFamily: '"Lato", sans-serif', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em',
                                    '& .MuiButton-endIcon': { transition: 'transform 0.3s ease' },
                                    '&:hover .MuiButton-endIcon': { transform: 'translateX(4px)' },
                                }}
                            >
                                SHOP {look.title.toUpperCase()}
                            </Button>
                        </Box>
                    </Reveal>
                </Box>
            </Box>
        </Box>
    );
};

const LooksPage = () => (
    <Box sx={{ backgroundColor: '#f5f1e8', minHeight: '100vh', py: { xs: 5, md: 8 } }}>
        <Container maxWidth="xl">
            {/* Intro */}
            <Box sx={{ textAlign: 'center', mb: { xs: 8, md: 12 } }}>
                <Typography sx={{
                    ...pageEnterSx,
                    fontFamily: '"Lato", sans-serif', fontSize: '0.72rem', letterSpacing: '0.35em', color: '#8b7355', mb: 2,
                }}>
                    FALL / WINTER 2026–2027
                </Typography>
                <Typography sx={{
                    ...pageEnterDelayedSx(0.08),
                    fontFamily: '"Cormorant Garamond", serif', fontWeight: 300,
                    fontSize: { xs: '3.4rem', md: '5.5rem' }, color: '#2c2c2c', lineHeight: 1,
                }}>
                    The <Box component="span" sx={{ fontStyle: 'italic', color: '#8b7355' }}>Looks</Box>
                </Typography>
                <Box sx={{ ...pageEnterDelayedSx(0.16), width: 56, height: '1px', backgroundColor: '#d4b896', mx: 'auto', my: 3 }} />
                <Typography sx={{
                    ...pageEnterDelayedSx(0.2),
                    fontFamily: '"Lato", sans-serif', fontSize: '1rem', color: '#6b5640', lineHeight: 1.8, maxWidth: 560, mx: 'auto', mb: 4,
                }}>
                    Two outfits from our atelier, styled head to toe. Explore each piece - or take the whole look home.
                </Typography>
                <Box sx={{ ...pageEnterDelayedSx(0.28), display: 'flex', justifyContent: 'center', gap: { xs: 3, md: 5 } }}>
                    {LOOKS.map((look, i) => (
                        <Box
                            key={look.id}
                            component="a"
                            href={`#look-${look.id}`}
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById(`look-${look.id}`)?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            sx={{
                                textDecoration: 'none', color: '#2c2c2c', position: 'relative', pb: 0.5,
                                fontFamily: '"Cormorant Garamond", serif', fontSize: '1.25rem',
                                '&::after': {
                                    content: '""', position: 'absolute', left: 0, bottom: 0, height: '1px', width: '100%',
                                    backgroundColor: '#d4b896', transform: 'scaleX(0)', transformOrigin: 'left',
                                    transition: 'transform 0.35s ease',
                                },
                                '&:hover::after': { transform: 'scaleX(1)' },
                            }}
                        >
                            <Box component="span" sx={{ fontStyle: 'italic', color: '#c4a886', mr: 1 }}>{String(i + 1).padStart(2, '0')}</Box>
                            {look.title}
                        </Box>
                    ))}
                </Box>
            </Box>

            {LOOKS.map((look, i) => <LookSection key={look.id} look={look} index={i} />)}
        </Container>
    </Box>
);

export default LooksPage;
