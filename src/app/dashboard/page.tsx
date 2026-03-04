'use client';

import React from 'react';
import {
    Box,
    Typography,
    Card,
    Grid,
    Avatar,
    Chip,
    LinearProgress,
} from '@mui/material';
import {
    BusinessCenter as DealsIcon,
    AttachMoney as RevenueIcon,
    CheckCircle as CompletedIcon,
    People as MembersIcon,
    TrendingUp as TrendIcon,
} from '@mui/icons-material';

const stats = [
    { label: 'Active Deals', value: 24, icon: <DealsIcon />, color: '#6366F1', bgColor: '#EEF2FF', trend: '+12%' },
    { label: 'Monthly Revenue', value: '$485K', icon: <RevenueIcon />, color: '#16A34A', bgColor: '#DCFCE7', trend: '+8%' },
    { label: 'Active Projects', value: 18, icon: <CompletedIcon />, color: '#F59E0B', bgColor: '#FEF3C7', trend: '+3' },
    { label: 'Team Members', value: 42, icon: <MembersIcon />, color: '#3B82F6', bgColor: '#DBEAFE', trend: '+2' },
];

const recentActivity = [
    { user: 'Sarah J.', action: 'New deal created: Acme Corp Website', time: '5 min ago', color: '#6366F1' },
    { user: 'Mike T.', action: 'Project milestone completed: Q1 Launch', time: '1 hour ago', color: '#16A34A' },
    { user: 'Finance', action: 'Invoice #INV-1234 paid', time: '2 hours ago', color: '#F59E0B' },
    { user: 'HR', action: 'New candidate application: Senior Designer', time: '3 hours ago', color: '#EF4444' },
    { user: 'John D.', action: 'Timesheet submitted for Week 3', time: '4 hours ago', color: '#3B82F6' },
];

const pendingApprovals = [
    { type: 'Timesheet', title: 'John Doe - Week 2', due: 'Today', color: '#F59E0B' },
    { type: 'Invoice', title: 'Client Invoice #1245', due: 'Tomorrow', color: '#6366F1' },
    { type: 'Leave', title: 'Sarah Wilson - Annual Leave', due: 'In 2 days', color: '#EF4444' },
];

export default function DashboardPage() {
    return (
        <Box sx={{ px: 3.5, py: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B', fontSize: '1.6rem', mb: 0.5 }}>
                    Dashboard
                </Typography>
                <Typography variant="subtitle1" sx={{ color: '#64748B', fontSize: '0.9rem' }}>
                    Welcome back! Here&apos;s what&apos;s happening today.
                </Typography>
            </Box>

            {/* Summary Cards */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2.5, mb: 3 }}>
                {stats.map((stat) => (
                    <Card
                        key={stat.label}
                        sx={{
                            p: 2.5,
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            transition: 'all 0.2s ease',
                            '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' },
                        }}
                    >
                        <Box>
                            <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 500, mb: 0.8, fontSize: '0.8rem' }}>
                                {stat.label}
                            </Typography>
                            <Typography variant="h5" sx={{ fontWeight: 700, fontSize: '1.5rem', color: stat.color, lineHeight: 1.2 }}>
                                {stat.value}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                                <TrendIcon sx={{ fontSize: '0.9rem', color: '#16A34A' }} />
                                <Typography variant="caption" sx={{ color: '#16A34A', fontWeight: 500 }}>{stat.trend}</Typography>
                            </Box>
                        </Box>
                        <Box sx={{ width: 42, height: 42, borderRadius: '12px', backgroundColor: stat.bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center', '& .MuiSvgIcon-root': { fontSize: '1.3rem', color: stat.color } }}>
                            {stat.icon}
                        </Box>
                    </Card>
                ))}
            </Box>

            <Grid container spacing={3}>
                {/* Recent Activity */}
                <Grid size={{ xs: 12, md: 7 }}>
                    <Card sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem', mb: 2 }}>Recent Activity</Typography>
                        {recentActivity.map((activity, idx) => (
                            <Box
                                key={idx}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    py: 1.5,
                                    borderBottom: idx < recentActivity.length - 1 ? '1px solid #F1F5F9' : 'none',
                                }}
                            >
                                <Avatar sx={{ width: 36, height: 36, fontSize: '0.7rem', bgcolor: activity.color }}>
                                    {activity.user.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                                </Avatar>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                                        <strong>{activity.user}</strong>
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#64748B' }}>{activity.action}</Typography>
                                </Box>
                                <Typography variant="caption" sx={{ color: '#94A3B8', whiteSpace: 'nowrap' }}>{activity.time}</Typography>
                            </Box>
                        ))}
                    </Card>
                </Grid>

                {/* Pending Approvals */}
                <Grid size={{ xs: 12, md: 5 }}>
                    <Card sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem', mb: 2 }}>Pending Approvals</Typography>
                        {pendingApprovals.map((item, idx) => (
                            <Box
                                key={idx}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    py: 1.5,
                                    borderBottom: idx < pendingApprovals.length - 1 ? '1px solid #F1F5F9' : 'none',
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <Chip label={item.type} size="small" sx={{ backgroundColor: item.color + '15', color: item.color, fontWeight: 600, fontSize: '0.68rem' }} />
                                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#1E293B', fontSize: '0.85rem' }}>{item.title}</Typography>
                                </Box>
                                <Typography variant="caption" sx={{ color: '#94A3B8' }}>Due: {item.due}</Typography>
                            </Box>
                        ))}
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
