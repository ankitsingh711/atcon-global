'use client';

import React, { useMemo } from 'react';
import { Box, Card, Typography } from '@mui/material';
import {
    FolderOpen as FolderIcon,
    PlayCircleOutline as InProgressIcon,
    EditNote as PlanningIcon,
    AttachMoney as BudgetIcon,
    Receipt as SpentIcon,
} from '@mui/icons-material';
import { useAppSelector } from '@/store/hooks';

interface SummaryCard {
    label: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
}

export default function SummaryCards() {
    const { projects } = useAppSelector((state) => state.projects);

    const summaryData = useMemo(() => {
        const totalProjects = projects.length;
        const inProgress = projects.filter((p) => p.status === 'In Progress').length;
        const planning = projects.filter((p) => p.status === 'Planning').length;
        const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
        const totalSpent = projects.reduce((sum, p) => sum + (p.spent || 0), 0);

        const formatCurrency = (val: number) => {
            if (val >= 1000) return `$${(val / 1000).toFixed(val % 1000 === 0 ? 0 : 1)}K`;
            return `$${val.toLocaleString()}`;
        };

        return [
            {
                label: 'Total Projects',
                value: totalProjects,
                icon: <FolderIcon />,
                color: '#6366F1',
                bgColor: '#EEF2FF',
            },
            {
                label: 'In Progress',
                value: inProgress,
                icon: <InProgressIcon />,
                color: '#16A34A',
                bgColor: '#DCFCE7',
            },
            {
                label: 'Planning',
                value: planning,
                icon: <PlanningIcon />,
                color: '#F59E0B',
                bgColor: '#FEF3C7',
            },
            {
                label: 'Total Budget',
                value: formatCurrency(totalBudget),
                icon: <BudgetIcon />,
                color: '#0891B2',
                bgColor: '#CFFAFE',
            },
            {
                label: 'Total Spent',
                value: formatCurrency(totalSpent),
                icon: <SpentIcon />,
                color: '#7C3AED',
                bgColor: '#EDE9FE',
            },
        ] as SummaryCard[];
    }, [projects]);

    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: 2.5,
                mb: 3,
            }}
        >
            {summaryData.map((card) => (
                <Card
                    key={card.label}
                    sx={{
                        p: 2.5,
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        cursor: 'default',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        },
                    }}
                >
                    <Box>
                        <Typography
                            variant="body2"
                            sx={{ color: 'text.secondary', fontWeight: 500, mb: 0.8, fontSize: '0.8rem' }}
                        >
                            {card.label}
                        </Typography>
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 700,
                                fontSize: '1.5rem',
                                color: card.color,
                                lineHeight: 1.2,
                            }}
                        >
                            {card.value}
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            width: 42,
                            height: 42,
                            borderRadius: '12px',
                            backgroundColor: card.bgColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            '& .MuiSvgIcon-root': {
                                fontSize: '1.3rem',
                                color: card.color,
                            },
                        }}
                    >
                        {card.icon}
                    </Box>
                </Card>
            ))}
        </Box>
    );
}
