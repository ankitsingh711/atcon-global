'use client';

import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Card, Grid, Avatar, Chip, LinearProgress,
    CircularProgress, List, ListItem, ListItemText, ListItemIcon,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    TextField,
} from '@mui/material';
import {
    WorkOutline as AssignmentIcon,
    Assignment as TaskIcon,
    AccessTime as TimesheetIcon,
    CalendarToday as CalendarIcon,
} from '@mui/icons-material';

interface AssignmentItem {
    id: string;
    name: string;
    client: string;
    progress: number;
    status: string;
}

interface TimesheetRow {
    project: string;
    task: string;
    hours: number[];
}

interface FreelancerDashData {
    profile: { name: string; role: string };
    stats: { activeProjects: number; hoursThisWeek: number; pendingApprovals: number };
    projects: AssignmentItem[];
    timesheet: {
        weekLabel: string;
        status: string;
        rows: TimesheetRow[];
        dailyTotals: number[];
        totalHours: number;
        billableHours: number;
    };
}

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function FreelancerDashboard() {
    const [data, setData] = useState<FreelancerDashData | null>(null);
    const [loading, setLoading] = useState(true);
    const [rows, setRows] = useState<TimesheetRow[]>([]);

    useEffect(() => {
        fetch('/api/freelancer')
            .then((res) => res.json())
            .then((json) => {
                if (json.success) {
                    setData(json.data);
                    setRows(json.data.timesheet.rows);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleHourChange = (rowIndex: number, dayIndex: number, value: string) => {
        const num = parseFloat(value) || 0;
        setRows((prev) => {
            const updated = [...prev];
            updated[rowIndex] = { ...updated[rowIndex], hours: [...updated[rowIndex].hours] };
            updated[rowIndex].hours[dayIndex] = Math.min(Math.max(num, 0), 24);
            return updated;
        });
    };

    const computeTotalHours = () => rows.reduce((sum, r) => sum + r.hours.reduce((a, b) => a + b, 0), 0);
    const computeDailyTotals = () =>
        Array.from({ length: 7 }, (_, i) => rows.reduce((sum, r) => sum + (r.hours[i] || 0), 0));

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress sx={{ color: '#16A34A' }} />
            </Box>
        );
    }

    if (!data) return null;

    const totalHours = computeTotalHours();
    const dailyTotals = computeDailyTotals();

    const statCards = [
        { label: 'Active Assignments', value: data.stats.activeProjects, icon: <AssignmentIcon />, color: '#16A34A', bg: '#F0FDF4' },
        { label: 'Hours This Week', value: totalHours.toFixed(1), icon: <TimesheetIcon />, color: '#F59E0B', bg: '#FFFBEB' },
        { label: 'Pending Approvals', value: data.stats.pendingApprovals, icon: <TaskIcon />, color: '#8B5CF6', bg: '#F5F3FF' },
    ];

    const statusColors: Record<string, string> = {
        Active: '#16A34A',
        Planning: '#3B82F6',
        'In Progress': '#F59E0B',
    };

    return (
        <Box>
            {/* Welcome Header */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B' }}>
                    Welcome back, {data.profile.name.split(' ')[0]} 👋
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748B', mt: 0.5 }}>
                    {data.profile.role} — Here&apos;s your freelance overview
                </Typography>
            </Box>

            {/* KPI Stats */}
            <Grid container spacing={2.5} sx={{ mb: 3 }}>
                {statCards.map((stat) => (
                    <Grid size={{ xs: 12, sm: 4 }} key={stat.label}>
                        <Card
                            sx={{
                                p: 2.5,
                                borderRadius: '14px',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                                border: '1px solid #E2E8F0',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                            }}
                        >
                            <Avatar sx={{ bgcolor: stat.bg, color: stat.color, width: 48, height: 48 }}>
                                {stat.icon}
                            </Avatar>
                            <Box>
                                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B', lineHeight: 1 }}>
                                    {stat.value}
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.75rem' }}>
                                    {stat.label}
                                </Typography>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Bottom: Assignments + Timesheet */}
            <Grid container spacing={2.5}>
                {/* Current Assignments */}
                <Grid size={{ xs: 12, md: 5 }}>
                    <Card
                        sx={{
                            borderRadius: '14px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                            border: '1px solid #E2E8F0',
                            p: 2.5,
                        }}
                    >
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1E293B', mb: 2 }}>
                            Current Assignments
                        </Typography>
                        <List disablePadding>
                            {data.projects.map((proj) => (
                                <ListItem
                                    key={proj.id}
                                    sx={{
                                        px: 1.5,
                                        py: 1.2,
                                        borderRadius: '10px',
                                        mb: 0.5,
                                        '&:hover': { bgcolor: '#F8FAFC' },
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: 36 }}>
                                        <AssignmentIcon sx={{ color: '#16A34A', fontSize: '1.1rem' }} />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={proj.name}
                                        secondary={proj.client}
                                        primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 500 }}
                                        secondaryTypographyProps={{ fontSize: '0.7rem' }}
                                    />
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
                                        <Chip
                                            label={proj.status}
                                            size="small"
                                            sx={{
                                                bgcolor: `${statusColors[proj.status] || '#94A3B8'}15`,
                                                color: statusColors[proj.status] || '#94A3B8',
                                                fontWeight: 600,
                                                fontSize: '0.65rem',
                                                height: 22,
                                            }}
                                        />
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, width: 80 }}>
                                            <LinearProgress
                                                variant="determinate"
                                                value={proj.progress}
                                                sx={{
                                                    flex: 1,
                                                    height: 5,
                                                    borderRadius: 3,
                                                    bgcolor: '#E2E8F0',
                                                    '& .MuiLinearProgress-bar': { borderRadius: 3, bgcolor: '#16A34A' },
                                                }}
                                            />
                                            <Typography variant="caption" sx={{ fontSize: '0.65rem', color: '#64748B' }}>
                                                {proj.progress}%
                                            </Typography>
                                        </Box>
                                    </Box>
                                </ListItem>
                            ))}
                        </List>
                    </Card>
                </Grid>

                {/* Timesheet Grid */}
                <Grid size={{ xs: 12, md: 7 }}>
                    <Card
                        sx={{
                            borderRadius: '14px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                            border: '1px solid #E2E8F0',
                            p: 2.5,
                        }}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1E293B' }}>
                                    Weekly Timesheet
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.3 }}>
                                    <CalendarIcon sx={{ fontSize: '0.8rem', color: '#64748B' }} />
                                    <Typography variant="caption" sx={{ color: '#64748B' }}>
                                        {data.timesheet.weekLabel}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Chip
                                    label={data.timesheet.status}
                                    size="small"
                                    sx={{
                                        bgcolor: data.timesheet.status === 'Draft' ? '#FEF3C7' : '#DCFCE7',
                                        color: data.timesheet.status === 'Draft' ? '#D97706' : '#16A34A',
                                        fontWeight: 600,
                                        fontSize: '0.72rem',
                                    }}
                                />
                                <Chip
                                    label={`${totalHours.toFixed(1)}h total`}
                                    size="small"
                                    sx={{ bgcolor: '#F0FDF4', color: '#16A34A', fontWeight: 600, fontSize: '0.72rem' }}
                                />
                            </Box>
                        </Box>

                        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '10px' }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#64748B' }}>Project</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#64748B' }}>Task</TableCell>
                                        {days.map((d) => (
                                            <TableCell key={d} align="center" sx={{ fontWeight: 600, fontSize: '0.72rem', color: '#64748B', width: 55 }}>
                                                {d}
                                            </TableCell>
                                        ))}
                                        <TableCell align="center" sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#1E293B' }}>Total</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map((row, ri) => (
                                        <TableRow key={ri} sx={{ '&:hover': { bgcolor: '#FAFAFA' } }}>
                                            <TableCell sx={{ fontSize: '0.78rem', fontWeight: 500 }}>{row.project}</TableCell>
                                            <TableCell sx={{ fontSize: '0.75rem', color: '#64748B' }}>{row.task}</TableCell>
                                            {row.hours.map((h, di) => (
                                                <TableCell key={di} align="center" sx={{ p: 0.5 }}>
                                                    <TextField
                                                        size="small"
                                                        value={h || ''}
                                                        onChange={(e) => handleHourChange(ri, di, e.target.value)}
                                                        sx={{
                                                            width: 44,
                                                            '& .MuiOutlinedInput-root': {
                                                                borderRadius: '6px',
                                                                '& input': { textAlign: 'center', fontSize: '0.78rem', p: '4px' },
                                                            },
                                                        }}
                                                    />
                                                </TableCell>
                                            ))}
                                            <TableCell align="center" sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#16A34A' }}>
                                                {row.hours.reduce((a, b) => a + b, 0).toFixed(1)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {/* Daily totals row */}
                                    <TableRow sx={{ bgcolor: '#F0FDF4' }}>
                                        <TableCell colSpan={2} sx={{ fontWeight: 600, fontSize: '0.78rem', color: '#1E293B' }}>
                                            Daily Total
                                        </TableCell>
                                        {dailyTotals.map((t, i) => (
                                            <TableCell key={i} align="center" sx={{ fontWeight: 600, fontSize: '0.78rem', color: '#16A34A' }}>
                                                {t.toFixed(1)}
                                            </TableCell>
                                        ))}
                                        <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#166534' }}>
                                            {totalHours.toFixed(1)}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
