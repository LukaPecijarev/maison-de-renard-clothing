import React, { useRef, useState } from 'react';
import { Box } from '@mui/material';

// Replaces the old 360 spinner: a lightweight hover-to-zoom magnifier.
// Moving the mouse over the image scales it up around the cursor position;
// touch devices never fire mousemove here, so they just get the plain image.
const ProductImageZoom = ({ src, alt }) => {
    const [zoomed, setZoomed] = useState(false);
    const [origin, setOrigin] = useState('50% 50%');
    const containerRef = useRef(null);

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
            <Box
                component="img"
                src={src}
                alt={alt}
                sx={{
                    width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                    transformOrigin: origin,
                    transform: zoomed ? 'scale(2)' : 'scale(1)',
                    transition: zoomed ? 'transform 0.1s ease-out' : 'transform 0.3s ease',
                }}
            />
        </Box>
    );
};

export default ProductImageZoom;
