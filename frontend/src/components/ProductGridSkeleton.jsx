import React from 'react';
import { Box, Skeleton } from '@mui/material';

// Placeholder grid shaped like the real product grid (same responsive
// columns), shown while a category/search request is in flight instead of
// a full-page spinner.
const ProductGridSkeleton = ({ count = 8 }) => (
    <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
        gap: { xs: 1.5, sm: 3 },
    }}>
        {Array.from({ length: count }).map((_, i) => (
            <Box key={i}>
                <Skeleton
                    variant="rectangular"
                    sx={{ width: '100%', aspectRatio: '3/4', backgroundColor: 'rgba(212, 184, 150, 0.15)' }}
                />
                <Skeleton variant="text" width="70%" sx={{ mt: 1.5, backgroundColor: 'rgba(212, 184, 150, 0.15)' }} />
                <Skeleton variant="text" width="40%" sx={{ backgroundColor: 'rgba(212, 184, 150, 0.15)' }} />
            </Box>
        ))}
    </Box>
);

export default ProductGridSkeleton;
