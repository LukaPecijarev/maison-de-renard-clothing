import React from 'react';
import { Box, Stepper, Step, StepLabel, Typography } from '@mui/material';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

// Order.status is a plain string on the backend (PENDING/CONFIRMED/CANCELLED,
// see Order.java). Visualizes that as a two-step progression, with a
// distinct look for the cancelled branch since it isn't a forward step.
const STEPS = ['Order Placed', 'Confirmed'];

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

    const activeStep = status === 'CONFIRMED' ? 1 : 0;

    return (
        <Stepper activeStep={activeStep} alternativeLabel sx={{
            maxWidth: 320,
            '& .MuiStepLabel-label': { fontFamily: '"Lato", sans-serif', fontSize: '0.75rem' },
            '& .MuiStepIcon-root.Mui-active': { color: '#d4b896' },
            '& .MuiStepIcon-root.Mui-completed': { color: '#8b7355' },
        }}>
            {STEPS.map((label) => (
                <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                </Step>
            ))}
        </Stepper>
    );
};

export default OrderStatusStepper;
