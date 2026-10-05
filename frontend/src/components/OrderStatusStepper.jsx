import React from 'react';
import { Box, Stepper, Step, StepLabel, Typography } from '@mui/material';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

// Order.status is a plain string on the backend (PENDING/CONFIRMED/CANCELLED,
// see Order.java). Visualizes that as a two-step progression, with a
// distinct look for the cancelled branch since it isn't a forward step.
const STEPS = ['Order Placed', 'Confirmed'];
const GREEN = '#2e7d32';

// Green ring around the step number, for a confirmed order's final step.
const ConfirmedStepIcon = () => (
    <Box sx={{
        width: 24, height: 24, borderRadius: '50%',
        border: `2px solid ${GREEN}`, backgroundColor: 'rgba(46, 125, 50, 0.1)',
        boxShadow: '0 0 0 3px rgba(46, 125, 50, 0.12)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: GREEN, fontFamily: '"Lato", sans-serif', fontSize: '0.75rem', fontWeight: 700,
    }}>
        2
    </Box>
);

const OrderStatusStepper = ({ status }) => {
    if (status === 'CANCELLED') {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#d32f2f' }}>
                <CancelOutlinedIcon sx={{ fontSize: 20 }} />
                <Typography sx={{ fontFamily: '"Lato", sans-serif', fontSize: '0.85rem', fontWeight: 500 }}>
                    Order Cancelled
                </Typography>
            </Box>
        );
    }

    const confirmed = status === 'CONFIRMED';

    return (
        <Stepper activeStep={confirmed ? 2 : 0} alternativeLabel sx={{
            maxWidth: 320,
            '& .MuiStepLabel-label': { fontFamily: '"Lato", sans-serif', fontSize: '0.75rem' },
            '& .MuiStepIcon-root.Mui-active': { color: '#d4b896' },
            '& .MuiStepIcon-root.Mui-completed': { color: '#8b7355' },
            // The line into the confirmed step turns green too.
            ...(confirmed && { '& .MuiStep-root:last-of-type .MuiStepConnector-line': { borderColor: GREEN } }),
        }}>
            {STEPS.map((label, index) => {
                // Confirmed: the final step gets its own green treatment (a green
                // ring around the "2" and "Order Confirmed"), the same way a
                // cancelled order gets its own red "Order Cancelled".
                const isConfirmedStep = confirmed && index === STEPS.length - 1;
                return (
                    <Step key={label}>
                        <StepLabel
                            StepIconComponent={isConfirmedStep ? ConfirmedStepIcon : undefined}
                            sx={isConfirmedStep ? { '& .MuiStepLabel-label.MuiStepLabel-label': { color: GREEN, fontWeight: 700 } } : undefined}
                        >
                            {isConfirmedStep ? 'Order Confirmed' : label}
                        </StepLabel>
                    </Step>
                );
            })}
        </Stepper>
    );
};

export default OrderStatusStepper;
