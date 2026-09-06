import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { useNavigate } from 'react-router-dom';

// Renders a horizontal-scroll product carousel. By default it reads the
// "viewedProducts" trail recorded in localStorage by ProductDetailsPage
// (also used to personalize the chatbot); pass `items` explicitly to reuse
// the same carousel for other lists (e.g. "You May Also Like").
const RecentlyViewed = ({ excludeId, title = 'Recently Viewed', items }) => {
    const navigate = useNavigate();
    const scrollRef = useRef(null);
    const source = items || JSON.parse(localStorage.getItem('viewedProducts') || '[]');
    const viewed = source.filter((p) => p.id !== excludeId);

    // Cursor-follow "drag to scroll" hint, same convention as the VIEW bubble
    // in HomePage's ImageWithHover, themed for horizontal scroll instead.
    const [isHovered, setIsHovered] = useState(false);
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const dragState = useRef(null);

    // Tell the global CustomCursor to stand down while this strip's own
    // SCROLL bubble is showing, so the two don't draw on top of each other.
    useEffect(() => {
        window.dispatchEvent(new CustomEvent('customCursor:localHint', { detail: { active: isHovered } }));
        return () => window.dispatchEvent(new CustomEvent('customCursor:localHint', { detail: { active: false } }));
    }, [isHovered]);

    // Plain mice only send vertical wheel deltas, so without this the strip
    // is only scrollable via trackpad/shift+wheel/drag. Translate vertical
    // wheel movement into horizontal scroll, but only while there's actually
    // room left to scroll that way - otherwise let the page scroll as normal.
    // Rather than jumping scrollLeft straight to the wheel delta (which reads
    // as a jerky step per notch), we ease toward an accumulated target each
    // frame so fast/repeated wheel ticks glide instead of stutter.
    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        let target = el.scrollLeft;
        let raf = null;

        const step = () => {
            const current = el.scrollLeft;
            const diff = target - current;
            if (Math.abs(diff) < 0.5) {
                el.scrollLeft = target;
                raf = null;
                return;
            }
            el.scrollLeft = current + diff * 0.18;
            raf = requestAnimationFrame(step);
        };

        const handleWheel = (e) => {
            if (e.deltaY === 0) return;
            if (!raf) target = el.scrollLeft; // resync if the user scrolled some other way meanwhile
            const maxScroll = el.scrollWidth - el.clientWidth;
            const atStart = target <= 0;
            const atEnd = target >= maxScroll - 1;
            if ((e.deltaY < 0 && atStart) || (e.deltaY > 0 && atEnd)) return;
            e.preventDefault();
            target = Math.max(0, Math.min(maxScroll, target + e.deltaY));
            if (!raf) raf = requestAnimationFrame(step);
        };

        el.addEventListener('wheel', handleWheel, { passive: false });
        return () => {
            el.removeEventListener('wheel', handleWheel);
            if (raf) cancelAnimationFrame(raf);
        };
    }, [viewed.length]);

    // Click-and-drag-to-scroll with the left mouse button, so the cursor-follow
    // hint below is backed by a real drag interaction rather than just decoration.
    //
    // `isDragging` alone can't gate the click handler below: mouseup (which
    // clears it) always fires *before* the resulting click event, so by the
    // time onClick runs isDragging has already gone back to false and the
    // guard never actually blocks anything - every drag-to-scroll ended in
    // an unwanted navigation. `didDrag` tracks whether the pointer actually
    // moved past a small threshold during this press, and only resets on
    // the *next* mousedown, so it's still true when onClick checks it.
    const didDragRef = useRef(false);
    const onPointerDown = (e) => {
        if (e.button !== 0) return; // left click only
        const el = scrollRef.current;
        if (!el) return;
        didDragRef.current = false;
        dragState.current = { startX: e.clientX, startScroll: el.scrollLeft };
        setIsDragging(true);
    };

    useEffect(() => {
        if (!isDragging) return;
        const el = scrollRef.current;

        const onMove = (e) => {
            if (!dragState.current || !el) return;
            const delta = e.clientX - dragState.current.startX;
            if (Math.abs(delta) > 3) didDragRef.current = true;
            el.scrollLeft = dragState.current.startScroll - delta;
        };
        const onUp = () => {
            dragState.current = null;
            setIsDragging(false);
        };

        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
        return () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
        };
    }, [isDragging]);

    if (viewed.length === 0) return null;

    return (
        <Box sx={{ mb: 10 }}>
            <Typography variant="h3" align="center" sx={{
                fontFamily: '"Cormorant Garamond", serif',
                fontWeight: 300, letterSpacing: '0.1em', mb: 5,
            }}>
                {title}
            </Typography>
            <Box
                sx={{ position: 'relative' }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setCursorPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        left: cursorPos.x, top: cursorPos.y,
                        transform: `translate(-50%, -50%) scale(${isHovered ? (isDragging ? 0.88 : 1) : 0.4})`,
                        opacity: isHovered ? 1 : 0,
                        transition: 'opacity 0.2s ease, transform 0.15s ease',
                        pointerEvents: 'none',
                        width: 56, height: 56, borderRadius: '50%',
                        backgroundColor: 'rgba(212, 184, 150, 0.55)',
                        backdropFilter: 'blur(2px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 3,
                    }}
                >
                    <SwapHorizIcon sx={{ fontSize: 26, color: '#2c2c2c' }} />
                </Box>
                <Box
                    ref={scrollRef}
                    onMouseDown={onPointerDown}
                    sx={{
                        display: 'flex',
                        gap: 3,
                        overflowX: 'auto',
                        px: 1,
                        pb: 2,
                        cursor: isHovered ? 'none' : 'default',
                        userSelect: isDragging ? 'none' : 'auto',
                        '&::-webkit-scrollbar': { height: 6 },
                        '&::-webkit-scrollbar-track': { backgroundColor: 'transparent' },
                        '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(212, 184, 150, 0.5)', borderRadius: 3 },
                    }}>
                    {viewed.map((product) => {
                        const images = product.imageUrl ? product.imageUrl.split(',').map((u) => u.trim()) : [];
                        const imageUrl = images[0] || 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400';

                        return (
                            <Box
                                key={product.id}
                                onClick={() => !didDragRef.current && navigate(`/products/${product.id}`)}
                                sx={{ flex: '0 0 auto', width: 220, cursor: isHovered ? 'none' : 'pointer' }}
                            >
                                <Box sx={{
                                    width: '100%', aspectRatio: '3/4', overflow: 'hidden',
                                    backgroundColor: '#f5f1e8', mb: 1.5,
                                }}>
                                    <Box
                                        component="img"
                                        src={imageUrl}
                                        alt={product.name}
                                        draggable={false}
                                        sx={{
                                            width: '100%', height: '100%', objectFit: 'cover',
                                            transition: 'transform 0.5s ease',
                                            '&:hover': { transform: 'scale(1.05)' },
                                        }}
                                    />
                                </Box>
                                <Typography sx={{
                                    fontFamily: '"Lato", sans-serif', fontSize: '0.8rem',
                                    color: '#2c2c2c', mb: 0.3,
                                }}>
                                    {product.name}
                                </Typography>
                                <Typography sx={{
                                    fontFamily: '"Cormorant Garamond", serif', fontSize: '1rem', color: '#8b7355',
                                }}>
                                    €{product.price?.toFixed(0)}
                                </Typography>
                            </Box>
                        );
                    })}
                </Box>
            </Box>
        </Box>
    );
};

export default RecentlyViewed;
