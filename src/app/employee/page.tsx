'use client';

import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Card, Grid, Avatar, Chip, LinearProgress,
    CircularProgress, List, ListItem, ListItemText, ListItemIcon,
} from '@mui/material';
import {
    Assignment as TaskIcon,
    AccessTime as TimesheetIcon,
    CheckCircleOutline as ApprovalIcon,
    FolderOpen as ProjectIcon,
    CalendarToday as CalendarIcon,
    ArrowForward as ArrowIcon,
} from '@mui/icons-material';

interface TaskItem {
    title: string;
    project: string;
    dueDate: string;
    priority: 'High' | 'Medium' | 'Low';
}

interface DashboardData {
    profile: { name: string; role: string };
    stats: { tasksDue: number; timesheetsToSubmit: number; approvalsNeeded: number; activeProjects: number };
    recentTasks: TaskItem[];
    timesheetStatus: string;
    hoursThisWeek: number;
}

const priorityColors: Record<string, string> = {
    High: '#EF4444',
    Medium: '#F59E0B',
    Low: '#22C55E',
};

export default function EmployeeDashboard() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/employee')
            .then((res) => res.json())
            .then((json) => {
                if (json.success) setData(json.data);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress sx={{ color: '#2563EB' }} />
            </Box>
        );
    }

    if (!data) return null;

    const statCards = [
        { label: 'Tasks Due', value: data.stats.tasksDue, icon: <TaskIcon />, color: '#2563EB', bg: '#EFF6FF' },
        { label: 'Timesheets to Submit', value: data.stats.timesheetsToSubmit, icon: <TimesheetIcon />, color: '#F59E0B', bg: '#FFFBEB' },
        { label: 'Approvals Needed', value: data.stats.approvalsNeeded, icon: <ApprovalIcon />, color: '#10B981', bg: '#ECFDF5' },
        { label: 'Active Projects', value: data.stats.activeProjects, icon: <ProjectIcon />, color: '#8B5CF6', bg: '#F5F3FF' },
    ];

    return (
        <Box>
            {/* Welcome Header */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B' }}>
                    Welcome back, {data.profile.name.split(' ')[0]} 👋
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748B', mt: 0.5 }}>
                    Here&apos;s what needs your attention today
                </Typography>
            </Box>

            {/* KPI Stats */}
            <Grid container spacing={2.5} sx={{ mb: 3 }}>
                {statCards.map((stat) => (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.label}>
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
                            <Avatar
                                sx={{
                                    bgcolor: stat.bg,
                                    color: stat.color,
                                    width: 48,
                                    height: 48,
                                }}
                            >
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

            {/* Bottom Section: Tasks + Timesheet */}
            <Grid container spacing={2.5}>
                {/* Tasks Due This Week */}
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
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1E293B' }}>
                                Tasks Due This Week
                            </Typography>
                            <Chip label="View All" size="small" sx={{ fontSize: '0.7rem', cursor: 'pointer' }} />
                        </Box>
                        <List disablePadding>
                            {data.recentTasks.map((task, i) => (
                                <ListItem
                                    key={i}
                                    sx={{
                                        px: 1.5,
                                        py: 1,
                                        borderRadius: '10px',
                                        mb: 0.5,
                                        '&:hover': { bgcolor: '#F8FAFC' },
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: 36 }}>
                                        <TaskIcon sx={{ color: '#94A3B8', fontSize: '1.1rem' }} />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={task.title}
                                        secondary={task.project}
                                        primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 500 }}
                                        secondaryTypographyProps={{ fontSize: '0.7rem' }}
                                    />
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Chip
                                            label={task.priority}
                                            size="small"
                                            sx={{
                                                bgcolor: `${priorityColors[task.priority]}15`,
                                                color: priorityColors[task.priority],
                                                fontWeight: 600,
                                                fontSize: '0.65rem',
                                                height: 22,
                                            }}
                                        />
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                                            <CalendarIcon sx={{ fontSize: '0.75rem', color: '#94A3B8' }} />
                                            <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.7rem' }}>
                                                {task.dueDate}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </ListItem>
                            ))}
                        </List>
                    </Card>
                </Grid>

                {/* Timesheet Status */}
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
                            Timesheet Status
                        </Typography>
                        <Box
                            sx={{
                                bgcolor: '#F8FAFC',
                                borderRadius: '10px',
                                p: 2,
                                mb: 2,
                                textAlign: 'center',
                            }}
                        >
                            <Typography variant="h3" sx={{ fontWeight: 700, color: '#2563EB' }}>
                                {data.hoursThisWeek}h
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#64748B' }}>
                                Logged this week
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.8rem' }}>
                                Weekly target: 40h
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#2563EB', fontWeight: 600, fontSize: '0.8rem' }}>
                                {Math.round((data.hoursThisWeek / 40) * 100)}%
                            </Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={Math.min((data.hoursThisWeek / 40) * 100, 100)}
                            sx={{
                                height: 8,
                                borderRadius: 4,
                                bgcolor: '#E2E8F0',
                                '& .MuiLinearProgress-bar': {
                                    borderRadius: 4,
                                    bgcolor: '#2563EB',
                                },
                            }}
                        />
                        <Chip
                            label={data.timesheetStatus}
                            size="small"
                            sx={{
                                mt: 2,
                                bgcolor: data.timesheetStatus === 'Draft' ? '#FEF3C7' : '#DCFCE7',
                                color: data.timesheetStatus === 'Draft' ? '#D97706' : '#16A34A',
                                fontWeight: 600,
                                fontSize: '0.72rem',
                            }}
                        />
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
