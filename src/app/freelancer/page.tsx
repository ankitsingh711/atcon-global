'use client';

import React, { useState } from 'react';
import {
    Box,
    Typography,
    Card,
    Button,
    Chip,
    Grid,
    LinearProgress,
    Avatar,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    IconButton,
} from '@mui/material';
import {
    AccessTime as TimeIcon,
    CalendarToday as CalendarIcon,
    ArrowForward as ArrowIcon,
    Send as SubmitIcon,
    ChevronLeft as PrevIcon,
    ChevronRight as NextIcon,
} from '@mui/icons-material';

const mockProjects = [
    { name: 'Website Redesign', client: 'Acme Corporation', progress: 65, status: 'Active' as const },
    { name: 'Mobile App Development', client: 'Tech Startup Inc', progress: 10, status: 'Planning' as const },
];

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const weekDates = ['Jan 13', 'Jan 14', 'Jan 15', 'Jan 16', 'Jan 17', 'Jan 18', 'Jan 19'];

const defaultTimesheetData = [
    { project: 'Website Redesign', task: 'Frontend Development', hours: [8, 7.5, 8, 6, 8, 4, 0] },
    { project: 'Website Redesign', task: 'Code Review', hours: [0, 0.5, 0, 2, 0, 0, 0] },
    { project: 'Mobile App Dev', task: 'API Integration', hours: [0, 0, 0, 0, 0, 2, 0] },
];

export default function FreelancerPortalPage() {
    const [view, setView] = useState<'dashboard' | 'timesheet'>('dashboard');
    const [timesheetData, setTimesheetData] = useState(defaultTimesheetData);

    const totalHours = timesheetData.reduce((total, row) => total + row.hours.reduce((s, h) => s + h, 0), 0);
    const dailyTotals = daysOfWeek.map((_, idx) => timesheetData.reduce((s, row) => s + row.hours[idx], 0));

    const handleHourChange = (rowIdx: number, dayIdx: number, value: string) => {
        const num = parseFloat(value) || 0;
        setTimesheetData((prev) => {
            const updated = [...prev];
            updated[rowIdx] = { ...updated[rowIdx], hours: [...updated[rowIdx].hours] };
            updated[rowIdx].hours[dayIdx] = num;
            return updated;
        });
    };

    // ========== Dashboard View ==========
    if (view === 'dashboard') {
        return (
            <Box sx={{ px: 3.5, py: 3 }}>
                {/* Header */}
                <Box sx={{ mb: 3 }}>
                    <Chip label="FREELANCER PORTAL" size="small" sx={{ backgroundColor: '#DCFCE7', color: '#16A34A', fontWeight: 700, mb: 1.5 }} />
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B', fontSize: '1.6rem' }}>
                        Welcome back, Alex Thompson
                    </Typography>
                    <Typography variant="subtitle1" sx={{ color: '#64748B', fontSize: '0.9rem' }}>
                        Senior Designer
                    </Typography>
                </Box>

                {/* Stats Cards */}
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2.5, mb: 3 }}>
                    <Card sx={{ p: 2.5 }}>
                        <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.8rem', mb: 0.5 }}>Active Projects</Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#6366F1', fontSize: '2rem' }}>2</Typography>
                    </Card>
                    <Card sx={{ p: 2.5 }}>
                        <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.8rem', mb: 0.5 }}>Hours This Week</Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#16A34A', fontSize: '2rem' }}>{totalHours}h</Typography>
                    </Card>
                    <Card sx={{ p: 2.5 }}>
                        <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.8rem', mb: 0.5 }}>Pending Approvals</Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#F59E0B', fontSize: '2rem' }}>1</Typography>
                    </Card>
                </Box>

                {/* My Projects */}
                <Card sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem', mb: 2 }}>My Projects</Typography>
                    {mockProjects.map((project, idx) => (
                        <Box
                            key={project.name}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                py: 2,
                                borderBottom: idx < mockProjects.length - 1 ? '1px solid #F1F5F9' : 'none',
                            }}
                        >
                            <Box>
                                <Typography variant="body1" sx={{ fontWeight: 600, color: '#1E293B' }}>{project.name}</Typography>
                                <Typography variant="caption" sx={{ color: '#64748B' }}>
                                    {project.client} • {project.progress}% complete
                                </Typography>
                            </Box>
                            <Chip
                                label={project.status}
                                size="small"
                                sx={{
                                    backgroundColor: project.status === 'Active' ? '#DCFCE7' : '#FEF3C7',
                                    color: project.status === 'Active' ? '#16A34A' : '#D97706',
                                    fontWeight: 600,
                                    fontSize: '0.72rem',
                                }}
                            />
                        </Box>
                    ))}
                </Card>

                {/* This Week's Timesheet */}
                <Card sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>This Week&apos;s Timesheet</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1.5, backgroundColor: '#F8FAFC', borderRadius: '12px', mb: 2 }}>
                        <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>Total Hours</Typography>
                            <Typography variant="caption" sx={{ color: '#64748B' }}>Week of Jan 13, 2026 • Draft</Typography>
                        </Box>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#16A34A' }}>{totalHours}h</Typography>
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

    // ========== Timesheet Entry View ==========
    return (
        <Box sx={{ px: 3.5, py: 3 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box>
                    <Chip label="FREELANCER PORTAL" size="small" sx={{ backgroundColor: '#DCFCE7', color: '#16A34A', fontWeight: 700, mb: 1 }} />
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B', fontSize: '1.5rem' }}>
                        Weekly Timesheet
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748B' }}>Log your hours for each project and task</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <Button variant="outlined" onClick={() => setView('dashboard')} sx={{ color: '#475569', borderColor: '#E2E8F0' }}>
                        Back to Dashboard
                    </Button>
                    <Button variant="contained" startIcon={<SubmitIcon />} sx={{ backgroundColor: '#16A34A', '&:hover': { backgroundColor: '#15803D' } }}>
                        Submit Timesheet
                    </Button>
                </Box>
            </Box>

            {/* Week Navigation */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 3 }}>
                <IconButton size="small" sx={{ backgroundColor: '#F1F5F9' }}><PrevIcon /></IconButton>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarIcon sx={{ fontSize: '1.1rem', color: '#64748B' }} />
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>Jan 13 – Jan 19, 2026</Typography>
                </Box>
                <IconButton size="small" sx={{ backgroundColor: '#F1F5F9' }}><NextIcon /></IconButton>
            </Box>

            {/* Timesheet Table */}
            <Paper sx={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #E2E8F0', boxShadow: 'none', mb: 3 }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ minWidth: 180 }}>Project / Task</TableCell>
                                {daysOfWeek.map((day, idx) => (
                                    <TableCell key={day} align="center" sx={{ minWidth: 80 }}>
                                        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>{day}</Typography>
                                        <Typography variant="caption" sx={{ color: '#94A3B8' }}>{weekDates[idx]}</Typography>
                                    </TableCell>
                                ))}
                                <TableCell align="center" sx={{ minWidth: 70 }}>Total</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {timesheetData.map((row, rowIdx) => (
                                <TableRow key={`${row.project}-${row.task}`}>
                                    <TableCell>
                                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#1E293B', fontSize: '0.82rem' }}>{row.project}</Typography>
                                        <Typography variant="caption" sx={{ color: '#64748B' }}>{row.task}</Typography>
                                    </TableCell>
                                    {row.hours.map((h, dayIdx) => (
                                        <TableCell key={dayIdx} align="center" sx={{ px: 0.5 }}>
                                            <TextField
                                                value={h || ''}
                                                onChange={(e) => handleHourChange(rowIdx, dayIdx, e.target.value)}
                                                type="number"
                                                size="small"
                                                inputProps={{ min: 0, max: 24, step: 0.5, style: { textAlign: 'center', padding: '6px 4px', fontSize: '0.85rem' } }}
                                                sx={{
                                                    width: 56,
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '8px',
                                                        backgroundColor: h > 0 ? '#F0FDF4' : '#FFFFFF',
                                                        '& fieldset': { borderColor: h > 0 ? '#BBF7D0' : '#E2E8F0' },
                                                    },
                                                }}
                                            />
                                        </TableCell>
                                    ))}
                                    <TableCell align="center">
                                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#1E293B' }}>
                                            {row.hours.reduce((s, h) => s + h, 0)}h
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {/* Totals Row */}
                            <TableRow sx={{ backgroundColor: '#F8FAFC' }}>
                                <TableCell>
                                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#1E293B' }}>Daily Total</Typography>
                                </TableCell>
                                {dailyTotals.map((total, idx) => (
                                    <TableCell key={idx} align="center">
                                        <Typography variant="body2" sx={{ fontWeight: 700, color: total > 0 ? '#16A34A' : '#94A3B8' }}>
                                            {total}h
                                        </Typography>
                                    </TableCell>
                                ))}
                                <TableCell align="center">
                                    <Typography variant="body2" sx={{ fontWeight: 800, color: '#16A34A', fontSize: '1rem' }}>
                                        {totalHours}h
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Add Row Button */}
            <Button
                fullWidth
                variant="outlined"
                sx={{ borderColor: '#E2E8F0', color: '#64748B', borderStyle: 'dashed', py: 1.5, borderRadius: '12px', mb: 3 }}
            >
                + Add Row
            </Button>

            {/* Summary */}
            <Card sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem', mb: 2 }}>Summary</Typography>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 4 }}>
                        <Typography variant="caption" sx={{ color: '#94A3B8' }}>Total Hours</Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1E293B' }}>{totalHours}h</Typography>
                    </Grid>
                    <Grid size={{ xs: 4 }}>
                        <Typography variant="caption" sx={{ color: '#94A3B8' }}>Billable Hours</Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#16A34A' }}>{(totalHours * 0.9).toFixed(1)}h</Typography>
                    </Grid>
                    <Grid size={{ xs: 4 }}>
                        <Typography variant="caption" sx={{ color: '#94A3B8' }}>Status</Typography>
                        <Chip label="Draft" size="small" sx={{ backgroundColor: '#FEF3C7', color: '#D97706', fontWeight: 600, mt: 0.5 }} />
                    </Grid>
                </Grid>
            </Card>
        </Box>
    );
}
