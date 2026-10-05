import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';

// Replaces the old 360 spinner: a lightweight hover-to-zoom magnifier.
// Moving the mouse over the image scales it up around the cursor position;
// touch devices never fire mousemove here, so they just get the plain image.
//
// Changing `src` crossfades to the new image (sliding in slightly from the
// side given by `direction`: 1 = next, -1 = previous, 0 = no slide) instead of
// swapping instantly. The outgoing image stays underneath until the fade ends.
const ProductImageZoom = ({ src, alt, direction = 0 }) => {
    const [zoomed, setZoomed] = useState(false);
    const [origin, setOrigin] = useState('50% 50%');
    const containerRef = useRef(null);
    const nextKey = useRef(1);
    const [layers, setLayers] = useState([{ key: 0, src, direction: 0, animate: false }]);

    useEffect(() => {
        setLayers((prev) => {
            const current = prev[prev.length - 1];
            if (current.src === src) return prev;
            return [current, { key: nextKey.current++, src, direction, animate: true }];
        });
        // `direction` is read only when `src` changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [src]);

    const handleMouseMove = (e) => {
        const el = containerRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setOrigin(`${x}% ${y}%`);
    };

    return (
        <Box
            ref={containerRef}
            onMouseEnter={() => setZoomed(true)}
            onMouseLeave={() => setZoomed(false)}
            onMouseMove={handleMouseMove}
            sx={{ width: '100%', height: '100%', overflow: 'hidden', cursor: 'zoom-in' }}
        >
            <Box sx={{
                position: 'relative', width: '100%', height: '100%',
                transformOrigin: origin,
                transform: zoomed ? 'scale(2)' : 'scale(1)',
                transition: zoomed ? 'transform 0.1s ease-out' : 'transform 0.3s ease',
            }}>
                {layers.map((layer, i) => (
                    <Box
                        key={layer.key}
                        component="img"
                        src={layer.src}
                        alt={i === layers.length - 1 ? alt : ''}
                        onAnimationEnd={() => setLayers((prev) => prev.slice(-1))}
                        sx={{
                            position: 'absolute', inset: 0,
                            width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                            animation: layer.animate ? 'galleryImageIn 0.55s cubic-bezier(0.25, 0.8, 0.25, 1)' : 'none',
                            '--gallery-shift': `${layer.direction * 28}px`,
                            '@keyframes galleryImageIn': {
                                '0%': { opacity: 0, transform: 'translateX(var(--gallery-shift)) scale(1.02)' },
                                '100%': { opacity: 1, transform: 'none' },
                            },
                            '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
                        }}
                    />
                ))}
            </Box>
        </Box>
    );
};

export default ProductImageZoom;
