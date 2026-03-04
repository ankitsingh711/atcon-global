'use client';

import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';

interface ProgressBarProps {
    value: number;
}

export default function ProgressBar({ value }: ProgressBarProps) {
    const getColor = (val: number) => {
        if (val >= 80) return '#16A34A';
        if (val >= 40) return '#3B82F6';
        if (val > 0) return '#6366F1';
        return '#CBD5E1';
    };

    const color = getColor(value);

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 120 }}>
            <LinearProgress
                variant="determinate"
                value={value}
                sx={{
                    flex: 1,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: '#E2E8F0',
                    '& .MuiLinearProgress-bar': {
                        borderRadius: 3,
                        backgroundColor: color,
                    },
                }}
            />
            <Typography
                variant="body2"
                sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#475569', minWidth: 32 }}
            >
                {value}%
            </Typography>
        </Box>
    );
}
