import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';

// Fades/slides children in the first time they cross into the viewport.
// No animation library needed - just IntersectionObserver + a CSS transition,
// so it's cheap to sprinkle across grids for a staggered reveal effect.
const Reveal = ({ children, delay = 0, sx = {} }) => {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return undefined;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.unobserve(node);
                }
            },
            { threshold: 0.15 }
        );
        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    return (
        <Box
            ref={ref}
            sx={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(30px)',
                transition: `opacity 0.7s ease ${delay}s, transform 0.7s cubic-bezier(0.25, 0.8, 0.25, 1) ${delay}s`,
                ...sx,
            }}
        >
            {children}
        </Box>
    );
};

export default Reveal;
