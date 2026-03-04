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
    Tabs,
    Tab,
    IconButton,
} from '@mui/material';
import {
    CheckCircle as ApproveIcon,
    Cancel as RejectIcon,
    AccessTime as TimeIcon,
    Visibility as ViewIcon,
} from '@mui/icons-material';

interface ClientProject {
    name: string;
    startDate: string;
    progress: number;
    status: 'In Progress' | 'Planning' | 'Completed';
    budget: number;
    hoursLogged: number;
    teamSize: number;
}

interface PendingApproval {
    id: string;
    freelancer: string;
    project: string;
    week: string;
    hours: number;
    amount: string;
    status: 'Pending';
}

const clientProjects: ClientProject[] = [
    { name: 'Website Redesign', startDate: 'Jan 5, 2026', progress: 65, status: 'In Progress', budget: 45000, hoursLogged: 190, teamSize: 5 },
];

const pendingApprovals: PendingApproval[] = [
    { id: '1', freelancer: 'John Doe', project: 'Website Redesign', week: 'Jan 13 - 19, 2026', hours: 42, amount: '$3,150', status: 'Pending' },
    { id: '2', freelancer: 'Sarah Wilson', project: 'Website Redesign', week: 'Jan 13 - 19, 2026', hours: 38, amount: '$2,850', status: 'Pending' },
];

export default function ClientPortalPage() {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <Box sx={{ px: 3.5, py: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Chip label="CLIENT PORTAL" size="small" sx={{ backgroundColor: '#EEF2FF', color: '#6366F1', fontWeight: 700, mb: 1.5 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B', fontSize: '1.6rem' }}>
                    Acme Corporation Portal
                </Typography>
                <Typography variant="subtitle1" sx={{ color: '#64748B', fontSize: '0.9rem' }}>
                    Welcome back, Jennifer Davis
                </Typography>
            </Box>

            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: '#E2E8F0', mb: 3 }}>
                <Tabs
                    value={activeTab}
                    onChange={(_, v) => setActiveTab(v)}
                    sx={{
                        '& .MuiTab-root': { textTransform: 'none', fontWeight: 500, fontSize: '0.9rem', color: '#64748B', minHeight: 48 },
                        '& .Mui-selected': { color: '#6366F1 !important', fontWeight: 600 },
                        '& .MuiTabs-indicator': { backgroundColor: '#6366F1', height: 3, borderRadius: '3px 3px 0 0' },
                    }}
                >
                    <Tab label="CPP-01: My Projects" />
                    <Tab label={`CPP-03: Pending Approvals (${pendingApprovals.length})`} />
                </Tabs>
            </Box>

            {/* ========== MY PROJECTS TAB ========== */}
            {activeTab === 0 && (
                <Box>
                    {clientProjects.map((project) => (
                        <Card key={project.name} sx={{ p: 3, mb: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                                <Box>
                                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#1E293B', fontSize: '1.3rem' }}>
                                        {project.name}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#64748B', mt: 0.3 }}>
                                        Started {project.startDate}
                                    </Typography>
                                </Box>
                                <Chip
                                    label={project.status}
                                    size="small"
                                    sx={{
                                        backgroundColor: project.status === 'In Progress' ? '#DCFCE7' : project.status === 'Planning' ? '#FEF3C7' : '#F1F5F9',
                                        color: project.status === 'In Progress' ? '#16A34A' : project.status === 'Planning' ? '#D97706' : '#64748B',
                                        fontWeight: 600,
                                        fontSize: '0.78rem',
                                        height: 28,
                                    }}
                                />
                            </Box>

                            {/* Progress */}
                            <Box sx={{ mb: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                                    <Typography variant="body2" sx={{ color: '#64748B' }}>Progress</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#1E293B' }}>{project.progress}%</Typography>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={project.progress}
                                    sx={{
                                        height: 10,
                                        borderRadius: 5,
                                        backgroundColor: '#E2E8F0',
                                        '& .MuiLinearProgress-bar': { borderRadius: 5, backgroundColor: '#16A34A' },
                                    }}
                                />
                            </Box>

                            {/* Stats */}
                            <Grid container spacing={3}>
                                <Grid size={{ xs: 4 }}>
                                    <Card variant="outlined" sx={{ p: 2, textAlign: 'center', borderColor: '#E2E8F0', borderRadius: '12px' }}>
                                        <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 0.5 }}>Budget</Typography>
                                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1E293B' }}>${project.budget.toLocaleString()}</Typography>
                                    </Card>
                                </Grid>
                                <Grid size={{ xs: 4 }}>
                                    <Card variant="outlined" sx={{ p: 2, textAlign: 'center', borderColor: '#E2E8F0', borderRadius: '12px' }}>
                                        <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 0.5 }}>Hours Logged</Typography>
                                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1E293B' }}>{project.hoursLogged}h</Typography>
                                    </Card>
                                </Grid>
                                <Grid size={{ xs: 4 }}>
                                    <Card variant="outlined" sx={{ p: 2, textAlign: 'center', borderColor: '#E2E8F0', borderRadius: '12px' }}>
                                        <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 0.5 }}>Team Size</Typography>
                                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1E293B' }}>{project.teamSize} members</Typography>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Card>
                    ))}
                </Box>
            )}

            {/* ========== PENDING APPROVALS TAB ========== */}
            {activeTab === 1 && (
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
                        <Typography variant="body2" sx={{ color: '#64748B' }}>
                            <TimeIcon sx={{ fontSize: '1rem', verticalAlign: 'middle', mr: 0.5 }} />
                            {pendingApprovals.length} timesheets pending your review
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button variant="outlined" size="small" sx={{ color: '#16A34A', borderColor: '#DCFCE7', '&:hover': { borderColor: '#16A34A' } }}>
                                Approve All
                            </Button>
                        </Box>
                    </Box>

                    <Paper sx={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #E2E8F0', boxShadow: 'none' }}>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Freelancer</TableCell>
                                        <TableCell>Project</TableCell>
                                        <TableCell>Week</TableCell>
                                        <TableCell>Hours</TableCell>
                                        <TableCell>Amount</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell align="center">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {pendingApprovals.map((approval) => (
                                        <TableRow key={approval.id} hover>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                    <Avatar sx={{ width: 32, height: 32, fontSize: '0.7rem', bgcolor: '#6366F1' }}>
                                                        {approval.freelancer.split(' ').map((n) => n[0]).join('')}
                                                    </Avatar>
                                                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#1E293B' }}>{approval.freelancer}</Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" sx={{ color: '#475569' }}>{approval.project}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.82rem' }}>{approval.week}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#1E293B' }}>{approval.hours}h</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#1E293B' }}>{approval.amount}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip label="Pending" size="small" sx={{ backgroundColor: '#FEF3C7', color: '#D97706', fontWeight: 600, fontSize: '0.72rem', height: 24 }} />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                                                    <IconButton
                                                        size="small"
                                                        sx={{ color: '#16A34A', backgroundColor: '#DCFCE7', '&:hover': { backgroundColor: '#BBF7D0' } }}
                                                    >
                                                        <ApproveIcon sx={{ fontSize: '1.1rem' }} />
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        sx={{ color: '#EF4444', backgroundColor: '#FEE2E2', '&:hover': { backgroundColor: '#FECACA' } }}
                                                    >
                                                        <RejectIcon sx={{ fontSize: '1.1rem' }} />
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        sx={{ color: '#64748B', backgroundColor: '#F1F5F9', '&:hover': { backgroundColor: '#E2E8F0' } }}
                                                    >
                                                        <ViewIcon sx={{ fontSize: '1.1rem' }} />
                                                    </IconButton>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Box>
            )}
        </Box>
    );
}
