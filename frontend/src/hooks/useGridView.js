import { useState } from 'react';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// How many products per row the shop grids show (1, 2 or 4), chosen with
// <GridViewToggle />. The choice is remembered across pages and visits; until
// one is made the grid is responsive (2 per row on phones, 4 from md up).
// Phones (below 600px) only offer 1 or 2 - four columns are too small there; a
// saved "4" shows as 2 on a phone without overwriting the saved choice.
//
// `gridSx` goes on the grid Box. A single column is capped (~560px) and two
// columns (~1040px) and centred, so big screens don't get one huge photo.
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

    const setColumns = (value) => {
        setColumnsState(value);
        try { localStorage.setItem(STORAGE_KEY, String(value)); } catch { /* storage unavailable: keep it for this visit */ }
    };

    const gridSx = columns
        ? { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, maxWidth: MAX_WIDTH[columns], mx: 'auto', width: '100%' }
        : { gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', md: 'repeat(4, minmax(0, 1fr))' } };

    // What's on screen right now (for highlighting the selector).
    const activeColumns = columns || (isWide ? 4 : 2);

    return { columns: activeColumns, options, setColumns, gridSx };
};

export default useGridView;
