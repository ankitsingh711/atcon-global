'use client';

import React from 'react';
import { Chip } from '@mui/material';
import { ProjectStatus } from '@/types';

interface StatusBadgeProps {
    status: ProjectStatus;
}

const statusConfig: Record<ProjectStatus, { bg: string; color: string }> = {
    'In Progress': { bg: '#DCFCE7', color: '#16A34A' },
    Planning: { bg: '#FEF3C7', color: '#D97706' },
    Completed: { bg: '#F1F5F9', color: '#64748B' },
    'On Hold': { bg: '#FEE2E2', color: '#EF4444' },
    Cancelled: { bg: '#FEE2E2', color: '#DC2626' },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
    const config = statusConfig[status] || statusConfig.Planning;

    return (
        <Chip
            label={status}
            size="small"
            sx={{
                backgroundColor: config.bg,
                color: config.color,
                fontWeight: 600,
                fontSize: '0.72rem',
                height: 26,
                border: 'none',
            }}
        />
    );
}
