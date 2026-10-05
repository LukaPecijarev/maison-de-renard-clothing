import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { measureGrid, playGridFlip } from '../utils/flipGrid';

// How many products per row the shop grids show (1, 2 or 4), chosen with
// <GridViewToggle />. The choice is remembered across pages and visits; until
// one is made the grid is responsive (2 per row on phones, 4 from md up).
// Phones (below 600px) only offer 1 or 2 - four columns are too small there; a
// saved "4" shows as 2 on a phone without overwriting the saved choice.
//
// `gridSx` and `gridRef` go on the grid Box (a page with several grids gives
// each the same ref). A single column is capped (~560px) and two columns
// (~1040px) and centred, so big screens don't get one huge photo. The ref lets
// the cards glide to their new size and place when the view changes
// (utils/flipGrid).
export const GRID_VIEW_OPTIONS = [1, 2, 4];
const STORAGE_KEY = 'productGridColumns';

const readStored = () => {
    try {
        const value = Number(localStorage.getItem(STORAGE_KEY));
        return GRID_VIEW_OPTIONS.includes(value) ? value : null;
    } catch {
        return null;
    }
};

const MAX_WIDTH = { 1: 560, 2: 1040, 4: 'none' };

const useGridView = () => {
    const theme = useTheme();
    const isWide = useMediaQuery(theme.breakpoints.up('md'));
    const isPhone = useMediaQuery(theme.breakpoints.down('sm'));
    const options = isPhone ? GRID_VIEW_OPTIONS.filter((n) => n !== 4) : GRID_VIEW_OPTIONS;
    const [storedColumns, setColumnsState] = useState(readStored);
    const columns = storedColumns && !options.includes(storedColumns) ? 2 : storedColumns;

    const grids = useRef(new Set());
    const pendingFlip = useRef(null);
    const gridRef = useCallback((node) => { if (node) grids.current.add(node); }, []);

    // What's on screen right now (for highlighting the selector).
    const activeColumns = columns || (isWide ? 4 : 2);

    const setColumns = (value) => {
        if (value !== activeColumns) pendingFlip.current = measureGrid(grids.current);
        setColumnsState(value);
        try { localStorage.setItem(STORAGE_KEY, String(value)); } catch { /* storage unavailable: keep it for this visit */ }
    };

    const gridSx = columns
        ? { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, maxWidth: MAX_WIDTH[columns], mx: 'auto', width: '100%' }
        : { gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', md: 'repeat(4, minmax(0, 1fr))' } };

    // Runs after the new layout is in the DOM but before it's painted.
    useLayoutEffect(() => {
        const first = pendingFlip.current;
        pendingFlip.current = null;
        playGridFlip(first);
        grids.current.forEach((node) => { if (!node.isConnected) grids.current.delete(node); });
    }, [activeColumns]);

    return { columns: activeColumns, options, setColumns, gridSx, gridRef };
};

export default useGridView;
