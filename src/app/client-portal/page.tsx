'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    Chip,
    Grid,
    IconButton,
    LinearProgress,
    Paper,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    Typography,
} from '@mui/material';
import {
    Cancel as RejectIcon,
    CheckCircle as ApproveIcon,
    AccessTime as TimeIcon,
    Visibility as ViewIcon,
} from '@mui/icons-material';

interface ClientProject {
    id: string;
    name: string;
    startDate: string;
    progress: number;
    status: 'In Progress' | 'Planning' | 'Completed' | 'On Hold' | 'Cancelled';
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
    amount: number;
    status: 'Pending' | 'Approved' | 'Rejected';
}

interface ClientPortalResponseData {
    clientName: string;
    contactName: string;
    projects: ClientProject[];
    pendingApprovals: PendingApproval[];
}

export default function ClientPortalPage() {
    const [activeTab, setActiveTab] = useState(0);
    const [data, setData] = useState<ClientPortalResponseData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updatingApprovalId, setUpdatingApprovalId] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function loadPortalData() {
            try {
                const response = await fetch('/api/client-portal', { cache: 'no-store' });
                const result = (await response.json()) as {
                    success?: boolean;
                    data?: ClientPortalResponseData;
                    error?: string;
                };

                if (!response.ok || !result.success || !result.data) {
                    throw new Error(result.error || 'Failed to load client portal data');
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
                            : 'Failed to load client portal data'
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadPortalData();

        return () => {
            cancelled = true;
        };
    }, []);

    const pendingCount = useMemo(
        () => data?.pendingApprovals.filter((approval) => approval.status === 'Pending').length ?? 0,
        [data]
    );

    async function updateApprovalStatus(id: string, status: 'Approved' | 'Rejected') {
        setUpdatingApprovalId(id);
        try {
            const response = await fetch(`/api/approvals/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });

            const result = (await response.json()) as { success?: boolean; error?: string };
            if (!response.ok || !result.success) {
                throw new Error(result.error || 'Failed to update approval');
            }

            setData((previous) =>
                previous
                    ? {
                          ...previous,
                          pendingApprovals: previous.pendingApprovals.map((approval) =>
                              approval.id === id ? { ...approval, status } : approval
                          ),
                      }
                    : previous
            );
            setError(null);
        } catch (updateError) {
            setError(
                updateError instanceof Error
                    ? updateError.message
                    : 'Failed to update approval'
            );
        } finally {
            setUpdatingApprovalId(null);
        }
    }

    if (loading) {
        return (
            <Box sx={{ px: 3.5, py: 6 }}>
                <Typography variant="body2" sx={{ color: '#64748B', textAlign: 'center' }}>
                    Loading client portal data...
                </Typography>
            </Box>
        );
    }

    if (!data) {
        return (
            <Box sx={{ px: 3.5, py: 6 }}>
                <Alert severity="error">{error || 'Client portal data not available'}</Alert>
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

            <Box sx={{ mb: 3 }}>
                <Chip
                    label="CLIENT PORTAL"
                    size="small"
                    sx={{ backgroundColor: '#EEF2FF', color: '#6366F1', fontWeight: 700, mb: 1.5 }}
                />
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B', fontSize: '1.6rem' }}>
                    {data.clientName} Portal
                </Typography>
                <Typography variant="subtitle1" sx={{ color: '#64748B', fontSize: '0.9rem' }}>
                    Welcome back, {data.contactName}
                </Typography>
            </Box>

            <Box sx={{ borderBottom: 1, borderColor: '#E2E8F0', mb: 3 }}>
                <Tabs
                    value={activeTab}
                    onChange={(_, value) => setActiveTab(value)}
                    sx={{
                        '& .MuiTab-root': {
                            textTransform: 'none',
                            fontWeight: 500,
                            fontSize: '0.9rem',
                            color: '#64748B',
                            minHeight: 48,
                        },
                        '& .Mui-selected': { color: '#6366F1 !important', fontWeight: 600 },
                        '& .MuiTabs-indicator': {
                            backgroundColor: '#6366F1',
                            height: 3,
                            borderRadius: '3px 3px 0 0',
                        },
                    }}
                >
                    <Tab label="CPP-01: My Projects" />
                    <Tab label={`CPP-03: Pending Approvals (${pendingCount})`} />
                </Tabs>
            </Box>

            {activeTab === 0 && (
                <Box>
                    {data.projects.map((project) => (
                        <Card key={project.id} sx={{ p: 3, mb: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                                <Box>
                                    <Typography
                                        variant="h5"
                                        sx={{ fontWeight: 700, color: '#1E293B', fontSize: '1.3rem' }}
                                    >
                                        {project.name}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#64748B', mt: 0.3 }}>
                                        Started {new Date(project.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </Typography>
                                </Box>
                                <Chip
                                    label={project.status}
                                    size="small"
                                    sx={{
                                        backgroundColor:
                                            project.status === 'In Progress'
                                                ? '#DCFCE7'
                                                : project.status === 'Planning'
                                                  ? '#FEF3C7'
                                                  : '#F1F5F9',
                                        color:
                                            project.status === 'In Progress'
                                                ? '#16A34A'
                                                : project.status === 'Planning'
                                                  ? '#D97706'
                                                  : '#64748B',
                                        fontWeight: 600,
                                        fontSize: '0.78rem',
                                        height: 28,
                                    }}
                                />
                            </Box>

                            <Box sx={{ mb: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                                    <Typography variant="body2" sx={{ color: '#64748B' }}>
                                        Progress
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#1E293B' }}>
                                        {project.progress}%
                                    </Typography>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={project.progress}
                                    sx={{
                                        height: 10,
                                        borderRadius: 5,
                                        backgroundColor: '#E2E8F0',
                                        '& .MuiLinearProgress-bar': {
                                            borderRadius: 5,
                                            backgroundColor: '#16A34A',
                                        },
                                    }}
                                />
                            </Box>

                            <Grid container spacing={3}>
                                <Grid size={{ xs: 4 }}>
                                    <Card variant="outlined" sx={{ p: 2, textAlign: 'center', borderColor: '#E2E8F0', borderRadius: '12px' }}>
                                        <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 0.5 }}>
                                            Budget
                                        </Typography>
                                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1E293B' }}>
                                            ${project.budget.toLocaleString()}
                                        </Typography>
                                    </Card>
                                </Grid>
                                <Grid size={{ xs: 4 }}>
                                    <Card variant="outlined" sx={{ p: 2, textAlign: 'center', borderColor: '#E2E8F0', borderRadius: '12px' }}>
                                        <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 0.5 }}>
                                            Hours Logged
                                        </Typography>
                                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1E293B' }}>
                                            {project.hoursLogged}h
                                        </Typography>
                                    </Card>
                                </Grid>
                                <Grid size={{ xs: 4 }}>
                                    <Card variant="outlined" sx={{ p: 2, textAlign: 'center', borderColor: '#E2E8F0', borderRadius: '12px' }}>
                                        <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 0.5 }}>
                                            Team Size
                                        </Typography>
                                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1E293B' }}>
                                            {project.teamSize} members
                                        </Typography>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Card>
                    ))}
                </Box>
            )}

            {activeTab === 1 && (
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
                        <Typography variant="body2" sx={{ color: '#64748B' }}>
                            <TimeIcon sx={{ fontSize: '1rem', verticalAlign: 'middle', mr: 0.5 }} />
                            {pendingCount} timesheets pending your review
                        </Typography>
                        <Button
                            variant="outlined"
                            size="small"
                            sx={{
                                color: '#16A34A',
                                borderColor: '#DCFCE7',
                                '&:hover': { borderColor: '#16A34A' },
                            }}
                            disabled={pendingCount === 0 || Boolean(updatingApprovalId)}
                            onClick={() => {
                                const firstPending = data.pendingApprovals.find(
                                    (approval) => approval.status === 'Pending'
                                );
                                if (firstPending) {
                                    updateApprovalStatus(firstPending.id, 'Approved');
                                }
                            }}
                        >
                            Approve Next
                        </Button>
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
                                    {data.pendingApprovals.map((approval) => (
                                        <TableRow key={approval.id} hover>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                    <Avatar sx={{ width: 32, height: 32, fontSize: '0.7rem', bgcolor: '#6366F1' }}>
                                                        {approval.freelancer.split(' ').map((name) => name[0]).join('')}
                                                    </Avatar>
                                                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#1E293B' }}>
                                                        {approval.freelancer}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" sx={{ color: '#475569' }}>
                                                    {approval.project}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.82rem' }}>
                                                    {approval.week}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#1E293B' }}>
                                                    {approval.hours}h
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#1E293B' }}>
                                                    ${approval.amount.toLocaleString()}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={approval.status}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor:
                                                            approval.status === 'Approved'
                                                                ? '#DCFCE7'
                                                                : approval.status === 'Rejected'
                                                                  ? '#FEE2E2'
                                                                  : '#FEF3C7',
                                                        color:
                                                            approval.status === 'Approved'
                                                                ? '#16A34A'
                                                                : approval.status === 'Rejected'
                                                                  ? '#DC2626'
                                                                  : '#D97706',
                                                        fontWeight: 600,
                                                        fontSize: '0.72rem',
                                                        height: 24,
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                                                    <IconButton
                                                        size="small"
                                                        disabled={
                                                            approval.status !== 'Pending' ||
                                                            updatingApprovalId === approval.id
                                                        }
                                                        onClick={() => updateApprovalStatus(approval.id, 'Approved')}
                                                        sx={{ color: '#16A34A', backgroundColor: '#DCFCE7', '&:hover': { backgroundColor: '#BBF7D0' } }}
                                                    >
                                                        <ApproveIcon sx={{ fontSize: '1.1rem' }} />
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        disabled={
                                                            approval.status !== 'Pending' ||
                                                            updatingApprovalId === approval.id
                                                        }
                                                        onClick={() => updateApprovalStatus(approval.id, 'Rejected')}
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
