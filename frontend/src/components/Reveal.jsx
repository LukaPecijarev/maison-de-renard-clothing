import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';

// Fades/slides children in the first time they cross into the viewport.
// No animation library needed - just IntersectionObserver + a CSS transition,
// so it's cheap to sprinkle across grids for a staggered reveal effect.
// `instant` skips the fade-in (e.g. for the card a shared-element transition is
// landing on, which must already be in place).
const Reveal = ({ children, delay = 0, sx = {}, instant = false }) => {
    const ref = useRef(null);
    const [visible, setVisible] = useState(instant);

    useEffect(() => {
        const node = ref.current;
        if (!node || visible) return undefined;

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
    }, [visible]);

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
