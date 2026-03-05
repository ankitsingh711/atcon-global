'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Avatar, Box, Card, CircularProgress, Grid, Typography } from '@mui/material';
import {
    AttachMoney as RevenueIcon,
    BusinessCenter as DealsIcon,
    CheckCircle as CompletedIcon,
    People as MembersIcon,
    TrendingUp as TrendIcon,
} from '@mui/icons-material';

interface DashboardStats {
    activeDeals: number;
    monthlyRevenue: number;
    activeProjects: number;
    teamMembers: number;
}

interface ActivityItem {
    id: string;
    user: string;
    action: string;
    time: string;
    color: string;
}

interface ApprovalItem {
    id: string;
    type: 'Timesheet' | 'Invoice' | 'Leave';
    title: string;
    due: string;
}

interface DashboardResponseData {
    stats: DashboardStats;
    recentActivity: ActivityItem[];
    pendingApprovals: ApprovalItem[];
}

function formatCurrency(amount: number): string {
    if (amount >= 1000) {
        return `$${Math.round(amount / 1000)}K`;
    }
    return `$${amount.toLocaleString()}`;
}

export default function DashboardPage() {
    const [data, setData] = useState<DashboardResponseData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function loadDashboard() {
            try {
                const response = await fetch('/api/dashboard', { cache: 'no-store' });
                const result = (await response.json()) as {
                    success?: boolean;
                    data?: DashboardResponseData;
                    error?: string;
                };

                if (!response.ok || !result.success || !result.data) {
                    throw new Error(result.error || 'Failed to load dashboard data');
                }

                if (!cancelled) {
                    setData(result.data);
                    setError(null);
                }
            } catch (loadError) {
                if (!cancelled) {
                    setError(
                        loadError instanceof Error
                            ? loadError.message
                            : 'Failed to load dashboard data'
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadDashboard();

        return () => {
            cancelled = true;
        };
    }, []);

    const stats = useMemo(() => {
        if (!data) return [];

        return [
            {
                label: 'Active Deals',
                value: data.stats.activeDeals,
                icon: <DealsIcon />,
                color: '#6366F1',
                bgColor: '#EEF2FF',
            },
            {
                label: 'Monthly Revenue',
                value: formatCurrency(data.stats.monthlyRevenue),
                icon: <RevenueIcon />,
                color: '#16A34A',
                bgColor: '#DCFCE7',
            },
            {
                label: 'Active Projects',
                value: data.stats.activeProjects,
                icon: <CompletedIcon />,
                color: '#F59E0B',
                bgColor: '#FEF3C7',
            },
            {
                label: 'Team Members',
                value: data.stats.teamMembers,
                icon: <MembersIcon />,
                color: '#3B82F6',
                bgColor: '#DBEAFE',
            },
        ];
    }, [data]);

    return (
        <Box sx={{ px: 3.5, py: 3 }}>
            <Box sx={{ mb: 3 }}>
                <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: '#1E293B', fontSize: '1.6rem', mb: 0.5 }}
                >
                    Dashboard
                </Typography>
                <Typography variant="subtitle1" sx={{ color: '#64748B', fontSize: '0.9rem' }}>
                    Welcome back! Here&apos;s what&apos;s happening today.
                </Typography>
            </Box>

            {error ? (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            ) : null}

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress sx={{ color: '#16A34A' }} />
                </Box>
            ) : (
                <>
                    <Box
                        sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2.5, mb: 3 }}
                    >
                        {stats.map((stat) => (
                            <Card
                                key={stat.label}
                                sx={{
                                    p: 2.5,
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Box>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: '#64748B',
                                            fontWeight: 500,
                                            mb: 0.8,
                                            fontSize: '0.8rem',
                                        }}
                                    >
                                        {stat.label}
                                    </Typography>
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            fontWeight: 700,
                                            fontSize: '1.5rem',
                                            color: stat.color,
                                            lineHeight: 1.2,
                                        }}
                                    >
                                        {stat.value}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                                        <TrendIcon sx={{ fontSize: '0.9rem', color: '#16A34A' }} />
                                        <Typography variant="caption" sx={{ color: '#16A34A', fontWeight: 500 }}>
                                            Live
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box
                                    sx={{
                                        width: 42,
                                        height: 42,
                                        borderRadius: '12px',
                                        backgroundColor: stat.bgColor,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        '& .MuiSvgIcon-root': {
                                            fontSize: '1.3rem',
                                            color: stat.color,
                                        },
                                    }}
                                >
                                    {stat.icon}
                                </Box>
                            </Card>
                        ))}
                    </Box>

                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 7 }}>
                            <Card sx={{ p: 3 }}>
                                <Typography
                                    variant="h6"
                                    sx={{ fontWeight: 700, fontSize: '1.1rem', mb: 2 }}
                                >
                                    Recent Activity
                                </Typography>
                                {data?.recentActivity.map((activity, index) => (
                                    <Box
                                        key={activity.id}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2,
                                            py: 1.5,
                                            borderBottom:
                                                index < data.recentActivity.length - 1
                                                    ? '1px solid #F1F5F9'
                                                    : 'none',
                                        }}
                                    >
                                        <Avatar
                                            sx={{
                                                width: 36,
                                                height: 36,
                                                fontSize: '0.7rem',
                                                bgcolor: activity.color,
                                            }}
                                        >
                                            {activity.user
                                                .split(' ')
                                                .map((name) => name[0])
                                                .join('')
                                                .slice(0, 2)}
                                        </Avatar>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                                                <strong>{activity.user}</strong>
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: '#64748B' }}>
                                                {activity.action}
                                            </Typography>
                                        </Box>
                                        <Typography
                                            variant="caption"
                                            sx={{ color: '#94A3B8', whiteSpace: 'nowrap' }}
                                        >
                                            {activity.time}
                                        </Typography>
                                    </Box>
                                ))}
                            </Card>
                        </Grid>

                        <Grid size={{ xs: 12, md: 5 }}>
                            <Card sx={{ p: 3 }}>
                                <Typography
                                    variant="h6"
                                    sx={{ fontWeight: 700, fontSize: '1.1rem', mb: 2 }}
                                >
                                    Pending Approvals
                                </Typography>
                                {data?.pendingApprovals.map((item, index) => (
                                    <Box
                                        key={item.id}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            py: 1.5,
                                            borderBottom:
                                                index < data.pendingApprovals.length - 1
                                                    ? '1px solid #F1F5F9'
                                                    : 'none',
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <Box
                                                sx={{
                                                    px: 1,
                                                    py: 0.35,
                                                    borderRadius: 1,
                                                    backgroundColor:
                                                        item.type === 'Timesheet'
                                                            ? '#FEF3C7'
                                                            : item.type === 'Invoice'
                                                              ? '#EEF2FF'
                                                              : '#FEE2E2',
                                                    color:
                                                        item.type === 'Timesheet'
                                                            ? '#D97706'
                                                            : item.type === 'Invoice'
                                                              ? '#6366F1'
                                                              : '#DC2626',
                                                    fontSize: '0.7rem',
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {item.type}
                                            </Box>
                                            <Typography
                                                variant="body2"
                                                sx={{ fontWeight: 500, color: '#1E293B', fontSize: '0.85rem' }}
                                            >
                                                {item.title}
                                            </Typography>
                                        </Box>
                                        <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                                            Due: {item.due}
                                        </Typography>
                                    </Box>
                                ))}
                            </Card>
                        </Grid>
                    </Grid>
                </>
            )}
        </Box>
    );
}
