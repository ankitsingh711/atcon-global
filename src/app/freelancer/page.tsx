'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
    Alert,
    Box,
    Button,
    Card,
    Chip,
    Grid,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import {
    CalendarToday as CalendarIcon,
    ChevronLeft as PrevIcon,
    ChevronRight as NextIcon,
    Send as SubmitIcon,
} from '@mui/icons-material';

interface FreelancerProject {
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

interface FreelancerResponseData {
    profile: {
        name: string;
        role: string;
    };
    stats: {
        activeProjects: number;
        hoursThisWeek: number;
        pendingApprovals: number;
    };
    projects: FreelancerProject[];
    timesheet: {
        weekStart: string;
        weekEnd: string;
        weekLabel: string;
        status: 'Draft' | 'Submitted' | 'Approved';
        rows: TimesheetRow[];
        dailyTotals: number[];
        totalHours: number;
        billableHours: number;
    };
}

type ViewMode = 'dashboard' | 'timesheet';

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function buildWeekDateLabels(weekStart: string): string[] {
    const startDate = new Date(weekStart);
    return Array.from({ length: 7 }, (_, index) => {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + index);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
}

function calculateTotals(rows: TimesheetRow[]) {
    const totalHours = rows.reduce(
        (grandTotal, row) => grandTotal + row.hours.reduce((sum, hours) => sum + hours, 0),
        0
    );

    const dailyTotals = Array.from({ length: 7 }, (_, dayIndex) =>
        rows.reduce((sum, row) => sum + (row.hours[dayIndex] || 0), 0)
    );

    return {
        totalHours,
        dailyTotals,
        billableHours: Number((totalHours * 0.9).toFixed(1)),
    };
}

export default function FreelancerPortalPage() {
    const [view, setView] = useState<ViewMode>('dashboard');
    const [data, setData] = useState<FreelancerResponseData | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function loadFreelancerData() {
            try {
                const response = await fetch('/api/freelancer', { cache: 'no-store' });
                const result = (await response.json()) as {
                    success?: boolean;
                    data?: FreelancerResponseData;
                    error?: string;
                };

                if (!response.ok || !result.success || !result.data) {
                    throw new Error(result.error || 'Failed to load freelancer data');
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
                            : 'Failed to load freelancer data'
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadFreelancerData();

        return () => {
            cancelled = true;
        };
    }, []);

    const weekDates = useMemo(
        () => (data ? buildWeekDateLabels(data.timesheet.weekStart) : daysOfWeek),
        [data]
    );

    const totals = useMemo(
        () => (data ? calculateTotals(data.timesheet.rows) : { totalHours: 0, dailyTotals: [], billableHours: 0 }),
        [data]
    );

    function handleHourChange(rowIndex: number, dayIndex: number, value: string) {
        const numericHours = Math.min(24, Math.max(0, parseFloat(value) || 0));

        setData((previous) => {
            if (!previous) return previous;

            const rows = [...previous.timesheet.rows];
            rows[rowIndex] = { ...rows[rowIndex], hours: [...rows[rowIndex].hours] };
            rows[rowIndex].hours[dayIndex] = numericHours;

            const nextTotals = calculateTotals(rows);

            return {
                ...previous,
                stats: {
                    ...previous.stats,
                    hoursThisWeek: nextTotals.totalHours,
                },
                timesheet: {
                    ...previous.timesheet,
                    rows,
                    dailyTotals: nextTotals.dailyTotals,
                    totalHours: nextTotals.totalHours,
                    billableHours: nextTotals.billableHours,
                    status: 'Draft',
                },
            };
        });
    }

    async function handleSubmitTimesheet() {
        if (!data) return;

        setSaving(true);
        try {
            const response = await fetch('/api/freelancer', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    rows: data.timesheet.rows,
                    status: 'Submitted',
                }),
            });

            const result = (await response.json()) as { success?: boolean; error?: string };
            if (!response.ok || !result.success) {
                throw new Error(result.error || 'Failed to submit timesheet');
            }

            setData((previous) =>
                previous
                    ? {
                          ...previous,
                          timesheet: {
                              ...previous.timesheet,
                              status: 'Submitted',
                          },
                      }
                    : previous
            );
            setError(null);
        } catch (submitError) {
            setError(
                submitError instanceof Error
                    ? submitError.message
                    : 'Failed to submit timesheet'
            );
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <Box sx={{ px: 3.5, py: 6 }}>
                <Typography variant="body2" sx={{ color: '#64748B', textAlign: 'center' }}>
                    Loading freelancer data...
                </Typography>
            </Box>
        );
    }

    if (!data) {
        return (
            <Box sx={{ px: 3.5, py: 6 }}>
                <Alert severity="error">{error || 'Freelancer data not available'}</Alert>
            </Box>
        );
    }

    if (view === 'dashboard') {
        return (
            <Box sx={{ px: 3.5, py: 3 }}>
                {error ? (
                    <Alert severity="error" sx={{ mb: 2.5 }}>
                        {error}
                    </Alert>
                ) : null}

                <Box sx={{ mb: 3 }}>
                    <Chip
                        label="FREELANCER PORTAL"
                        size="small"
                        sx={{ backgroundColor: '#DCFCE7', color: '#16A34A', fontWeight: 700, mb: 1.5 }}
                    />
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B', fontSize: '1.6rem' }}>
                        Welcome back, {data.profile.name}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ color: '#64748B', fontSize: '0.9rem' }}>
                        {data.profile.role}
                    </Typography>
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2.5, mb: 3 }}>
                    <Card sx={{ p: 2.5 }}>
                        <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.8rem', mb: 0.5 }}>
                            Active Projects
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#6366F1', fontSize: '2rem' }}>
                            {data.stats.activeProjects}
                        </Typography>
                    </Card>
                    <Card sx={{ p: 2.5 }}>
                        <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.8rem', mb: 0.5 }}>
                            Hours This Week
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#16A34A', fontSize: '2rem' }}>
                            {data.stats.hoursThisWeek}h
                        </Typography>
                    </Card>
                    <Card sx={{ p: 2.5 }}>
                        <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.8rem', mb: 0.5 }}>
                            Pending Approvals
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#F59E0B', fontSize: '2rem' }}>
                            {data.stats.pendingApprovals}
                        </Typography>
                    </Card>
                </Box>

                <Card sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem', mb: 2 }}>
                        My Projects
                    </Typography>
                    {data.projects.map((project, index) => (
                        <Box
                            key={project.id}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                py: 2,
                                borderBottom:
                                    index < data.projects.length - 1 ? '1px solid #F1F5F9' : 'none',
                            }}
                        >
                            <Box>
                                <Typography variant="body1" sx={{ fontWeight: 600, color: '#1E293B' }}>
                                    {project.name}
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#64748B' }}>
                                    {project.client} • {project.progress}% complete
                                </Typography>
                            </Box>
                            <Chip
                                label={project.status}
                                size="small"
                                sx={{
                                    backgroundColor:
                                        project.status === 'Active' ? '#DCFCE7' : '#FEF3C7',
                                    color:
                                        project.status === 'Active' ? '#16A34A' : '#D97706',
                                    fontWeight: 600,
                                    fontSize: '0.72rem',
                                }}
                            />
                        </Box>
                    ))}
                </Card>

                <Card sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem', mb: 2 }}>
                        This Week&apos;s Timesheet
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            px: 2,
                            py: 1.5,
                            backgroundColor: '#F8FAFC',
                            borderRadius: '12px',
                            mb: 2,
                        }}
                    >
                        <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                Total Hours
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#64748B' }}>
                                {data.timesheet.weekLabel} • {data.timesheet.status}
                            </Typography>
                        </Box>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#16A34A' }}>
                            {data.timesheet.totalHours}h
                        </Typography>
                    </Box>
                    <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        onClick={() => setView('timesheet')}
                        sx={{
                            backgroundColor: '#16A34A',
                            py: 1.5,
                            fontSize: '1rem',
                            fontWeight: 600,
                            borderRadius: '12px',
                            '&:hover': { backgroundColor: '#15803D' },
                        }}
                    >
                        View & Submit Timesheet
                    </Button>
                </Card>
            </Box>
        );
    }

    return (
        <Box sx={{ px: 3.5, py: 3 }}>
            {error ? (
                <Alert severity="error" sx={{ mb: 2.5 }}>
                    {error}
                </Alert>
            ) : null}

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box>
                    <Chip
                        label="FREELANCER PORTAL"
                        size="small"
                        sx={{ backgroundColor: '#DCFCE7', color: '#16A34A', fontWeight: 700, mb: 1 }}
                    />
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B', fontSize: '1.5rem' }}>
                        Weekly Timesheet
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748B' }}>
                        Log your hours for each project and task
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <Button
                        variant="outlined"
                        onClick={() => setView('dashboard')}
                        sx={{ color: '#475569', borderColor: '#E2E8F0' }}
                    >
                        Back to Dashboard
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<SubmitIcon />}
                        onClick={handleSubmitTimesheet}
                        disabled={saving}
                        sx={{ backgroundColor: '#16A34A', '&:hover': { backgroundColor: '#15803D' } }}
                    >
                        {saving ? 'Submitting...' : 'Submit Timesheet'}
                    </Button>
                </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 3 }}>
                <IconButton size="small" sx={{ backgroundColor: '#F1F5F9' }}>
                    <PrevIcon />
                </IconButton>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarIcon sx={{ fontSize: '1.1rem', color: '#64748B' }} />
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {data.timesheet.weekLabel}
                    </Typography>
                </Box>
                <IconButton size="small" sx={{ backgroundColor: '#F1F5F9' }}>
                    <NextIcon />
                </IconButton>
            </Box>

            <Paper
                sx={{
                    borderRadius: '16px',
                    overflow: 'hidden',
                    border: '1px solid #E2E8F0',
                    boxShadow: 'none',
                    mb: 3,
                }}
            >
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ minWidth: 180 }}>Project / Task</TableCell>
                                {daysOfWeek.map((day, index) => (
                                    <TableCell key={day} align="center" sx={{ minWidth: 80 }}>
                                        <Typography
                                            variant="body2"
                                            sx={{ fontWeight: 600, fontSize: '0.8rem' }}
                                        >
                                            {day}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                                            {weekDates[index]}
                                        </Typography>
                                    </TableCell>
                                ))}
                                <TableCell align="center" sx={{ minWidth: 70 }}>
                                    Total
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.timesheet.rows.map((row, rowIndex) => (
                                <TableRow key={`${row.project}-${row.task}`}>
                                    <TableCell>
                                        <Typography
                                            variant="body2"
                                            sx={{ fontWeight: 600, color: '#1E293B', fontSize: '0.82rem' }}
                                        >
                                            {row.project}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#64748B' }}>
                                            {row.task}
                                        </Typography>
                                    </TableCell>
                                    {row.hours.map((hours, dayIndex) => (
                                        <TableCell key={dayIndex} align="center" sx={{ px: 0.5 }}>
                                            <TextField
                                                value={hours || ''}
                                                onChange={(event) =>
                                                    handleHourChange(rowIndex, dayIndex, event.target.value)
                                                }
                                                type="number"
                                                size="small"
                                                inputProps={{
                                                    min: 0,
                                                    max: 24,
                                                    step: 0.5,
                                                    style: {
                                                        textAlign: 'center',
                                                        padding: '6px 4px',
                                                        fontSize: '0.85rem',
                                                    },
                                                }}
                                                sx={{
                                                    width: 56,
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '8px',
                                                        backgroundColor: hours > 0 ? '#F0FDF4' : '#FFFFFF',
                                                        '& fieldset': {
                                                            borderColor: hours > 0 ? '#BBF7D0' : '#E2E8F0',
                                                        },
                                                    },
                                                }}
                                            />
                                        </TableCell>
                                    ))}
                                    <TableCell align="center">
                                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#1E293B' }}>
                                            {row.hours.reduce((sum, hours) => sum + hours, 0)}h
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ))}

                            <TableRow sx={{ backgroundColor: '#F8FAFC' }}>
                                <TableCell>
                                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#1E293B' }}>
                                        Daily Total
                                    </Typography>
                                </TableCell>
                                {totals.dailyTotals.map((dailyTotal, index) => (
                                    <TableCell key={index} align="center">
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontWeight: 700,
                                                color: dailyTotal > 0 ? '#16A34A' : '#94A3B8',
                                            }}
                                        >
                                            {dailyTotal}h
                                        </Typography>
                                    </TableCell>
                                ))}
                                <TableCell align="center">
                                    <Typography
                                        variant="body2"
                                        sx={{ fontWeight: 800, color: '#16A34A', fontSize: '1rem' }}
                                    >
                                        {totals.totalHours}h
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Card sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem', mb: 2 }}>
                    Summary
                </Typography>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 4 }}>
                        <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                            Total Hours
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1E293B' }}>
                            {totals.totalHours}h
                        </Typography>
                    </Grid>
                    <Grid size={{ xs: 4 }}>
                        <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                            Billable Hours
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#16A34A' }}>
                            {totals.billableHours}h
                        </Typography>
                    </Grid>
                    <Grid size={{ xs: 4 }}>
                        <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                            Status
                        </Typography>
                        <Chip
                            label={data.timesheet.status}
                            size="small"
                            sx={{
                                backgroundColor:
                                    data.timesheet.status === 'Approved'
                                        ? '#DCFCE7'
                                        : data.timesheet.status === 'Submitted'
                                          ? '#DBEAFE'
                                          : '#FEF3C7',
                                color:
                                    data.timesheet.status === 'Approved'
                                        ? '#16A34A'
                                        : data.timesheet.status === 'Submitted'
                                          ? '#2563EB'
                                          : '#D97706',
                                fontWeight: 600,
                                mt: 0.5,
                            }}
                        />
                    </Grid>
                </Grid>
            </Card>
        </Box>
    );
}
