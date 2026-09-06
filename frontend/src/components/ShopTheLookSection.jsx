import React, { useState } from 'react';
import { Box, Typography, IconButton, Button } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

const CARD_WIDTH = 240;
const CARD_GAP = 24;
const VIEWPORT_WIDTH = CARD_WIDTH + 90; // shows one full card plus a clear peek of the next, hinting it scrolls

// Editorial "Shop the Look" banner: a full-bleed lifestyle photo paired with
// a peeking, scrollable product carousel - the convention campaign pages
// like Loro Piana's "The looks" module use to sell a whole outfit at once.
// The structure (photo left, scrollable item picker right, progress dots,
// "view all" CTA) follows that convention closely; the fonts/colors are
// pulled from this site's own palette (index.css) rather than copied.
const ShopTheLookSection = ({
    title, image, imageAlt, products = [], onImageClick, imageOnRight = false,
    onViewAllClick, viewAllLabel = 'View all looks', onProductClick,
}) => {
    const [index, setIndex] = useState(0);
    const [hoveredCard, setHoveredCard] = useState(null);
    const maxIndex = Math.max(0, products.length - 1);

    // Scrolling straight to `index * (CARD_WIDTH + CARD_GAP)` walks the last
    // card flush to the viewport's left edge, so on the final item there's
    // nothing peeking on the right (nothing to peek - it's the end) *and*
    // nothing peeking on the left either, since that formula never holds
    // back the extra VIEWPORT_WIDTH margin. Clamping to the track's actual
    // max scroll keeps that margin in reserve for the last card, which is
    // exactly the previous card's peek.
    const trackWidth = products.length * CARD_WIDTH + Math.max(0, products.length - 1) * CARD_GAP;
    const maxScroll = Math.max(0, trackWidth - VIEWPORT_WIDTH);
    const scrollX = Math.min(index * (CARD_WIDTH + CARD_GAP), maxScroll);

    const photo = (
        <Box
            onClick={onImageClick}
            sx={{
                flex: { xs: '0 0 auto', md: '1 1 50%' },
                height: { xs: '60vh', md: 'auto' },
                overflow: 'hidden',
                cursor: onImageClick ? 'pointer' : 'default',
                position: 'relative',
            }}
        >
            <Box
                component="img"
                src={image}
                alt={imageAlt}
                sx={{
                    width: '100%', height: '100%', objectFit: 'cover',
                    display: 'block', transition: 'transform 0.8s ease',
                    '&:hover': onImageClick ? { transform: 'scale(1.03)' } : {},
                }}
            />
        </Box>
    );

    const panel = (
        <Box sx={{
            flex: { xs: '0 0 auto', md: '1 1 50%' },
            backgroundColor: '#f5f1e8',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            py: { xs: 6, md: 0 }, px: 3,
        }}>
            <Typography sx={{
                fontFamily: '"Lato", sans-serif', fontWeight: 400,
                fontSize: '0.7rem', letterSpacing: '0.25em', color: '#8b7355',
                textTransform: 'uppercase', mb: 1,
            }}>
                {title}
            </Typography>
            <Typography sx={{
                fontFamily: '"Cormorant Garamond", serif', fontWeight: 300,
                fontSize: '2rem', color: '#2c2c2c', mb: 1.5,
            }}>
                The <Box component="span" sx={{ fontStyle: 'italic' }}>looks</Box>
            </Typography>
            <Box sx={{ width: 0, height: 28, borderLeft: '1px dashed #d4b896', mb: 5 }} />

            <Box sx={{ position: 'relative', width: VIEWPORT_WIDTH, maxWidth: '100%', overflow: 'hidden' }}>
                <Box sx={{
                    display: 'flex', gap: `${CARD_GAP}px`,
                    transform: `translateX(-${scrollX}px)`,
                    transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                }}>
                    {products.map((product, i) => (
                        <Box
                            key={i}
                            onClick={() => (onProductClick ? onProductClick(product, i) : setIndex(i))}
                            onMouseEnter={() => setHoveredCard(i)}
                            onMouseLeave={() => setHoveredCard(null)}
                            sx={{ flex: `0 0 ${CARD_WIDTH}px`, cursor: 'pointer' }}
                        >
                            <Box sx={{
                                width: CARD_WIDTH, aspectRatio: '3/4', overflow: 'hidden',
                                backgroundColor: '#ffffff', mb: 2, p: 1.5,
                                boxShadow: i === index ? '0 8px 24px rgba(44, 44, 44, 0.14)' : '0 6px 20px rgba(44, 44, 44, 0.08)',
                                outline: i === index ? '1px solid #d4b896' : '1px solid transparent',
                                outlineOffset: '-1px',
                                transition: 'box-shadow 0.3s ease, outline-color 0.3s ease',
                            }}>
                                {/* These are full-figure campaign shots, not isolated flat-lay product
                                    photos, so "contain" (not "cover") keeps each garment whole instead
                                    of cropping it down to an arbitrary center slice. Swap to a second
                                    shot of the same piece on hover, so the carousel surfaces more than
                                    just the first photo out of each item's set. */}
                                <Box component="img"
                                     src={hoveredCard === i && product.hoverImage ? product.hoverImage : product.image}
                                     alt={product.name}
                                     sx={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'top', transition: 'opacity 0.2s ease' }} />
                            </Box>
                            <Typography sx={{
                                fontFamily: '"Lato", sans-serif', fontSize: '0.75rem',
                                letterSpacing: '0.1em', color: '#8b7355', textTransform: 'uppercase', mb: 0.5,
                            }}>
                                {product.name}
                            </Typography>
                            <Typography sx={{
                                fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic',
                                fontSize: '1.05rem', color: '#2c2c2c',
                            }}>
                                {product.subtitle}
                            </Typography>
                        </Box>
                    ))}
                </Box>

                {index > 0 && (
                    <IconButton
                        onClick={() => setIndex((i) => Math.max(0, i - 1))}
                        sx={{
                            position: 'absolute', left: 8, top: '35%', transform: 'translateY(-50%)',
                            backgroundColor: '#f5ebe0', width: 40, height: 40,
                            border: '1px solid #d4b896',
                            boxShadow: '0 4px 14px rgba(139, 115, 85, 0.2)',
                            transition: 'background-color 0.3s ease, transform 0.3s ease',
                            '&:hover': { backgroundColor: '#e6ccb2', transform: 'translateY(-50%) scale(1.06)' },
                        }}
                    >
                        <ChevronLeftIcon sx={{ color: '#8b7355' }} />
                    </IconButton>
                )}
                {index < maxIndex && (
                    <IconButton
                        onClick={() => setIndex((i) => Math.min(maxIndex, i + 1))}
                        sx={{
                            position: 'absolute', right: 8, top: '35%', transform: 'translateY(-50%)',
                            backgroundColor: '#f5ebe0', width: 40, height: 40,
                            border: '1px solid #d4b896',
                            boxShadow: '0 4px 14px rgba(139, 115, 85, 0.2)',
                            transition: 'background-color 0.3s ease, transform 0.3s ease',
                            '&:hover': { backgroundColor: '#e6ccb2', transform: 'translateY(-50%) scale(1.06)' },
                        }}
                    >
                        <ChevronRightIcon sx={{ color: '#8b7355' }} />
                    </IconButton>
                )}
            </Box>

            {products.length > 1 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 4 }}>
                    {products.map((_, i) => (
                        <Box
                            key={i}
                            onClick={() => setIndex(i)}
                            sx={{
                                cursor: 'pointer', height: 2, borderRadius: 1,
                                width: i === index ? 20 : 8,
                                backgroundColor: i === index ? '#8b7355' : '#d4b896',
                                transition: 'width 0.3s ease, background-color 0.3s ease',
                            }}
                        />
                    ))}
                </Box>
            )}

            {onViewAllClick && (
                <Button
                    variant="outlined"
                    onClick={onViewAllClick}
                    sx={{
                        mt: 4, color: '#2c2c2c', borderColor: '#2c2c2c', borderWidth: '1px',
                        px: 4, py: 1, fontSize: '0.7rem', fontWeight: 400,
                        letterSpacing: '0.15em', fontFamily: '"Lato", sans-serif',
                        borderRadius: '4px',
                        '&:hover': { borderColor: '#8b7355', backgroundColor: 'rgba(139, 115, 85, 0.06)' },
                    }}
                >
                    {viewAllLabel}
                </Button>
            )}
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: imageOnRight ? 'row-reverse' : 'row' } }}>
            {photo}
            {panel}
        </Box>
    );
};

export default ShopTheLookSection;
