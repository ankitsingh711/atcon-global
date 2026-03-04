'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    Box,
    Typography,
    Button,
    Card,
    Chip,
    Grid,
    Divider,
    CircularProgress,
    IconButton,
    LinearProgress,
} from '@mui/material';
import {
    ArrowBack as BackIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    CalendarToday as CalendarIcon,
    AttachMoney as MoneyIcon,
    Person as PersonIcon,
    Business as BusinessIcon,
    Description as DescriptionIcon,
    LocalOffer as TagIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProjectById, deleteProject, fetchProjects } from '@/store/slices/projectSlice';
import { openEditDrawer } from '@/store/slices/uiSlice';
import StatusBadge from '@/components/projects/StatusBadge';
import ProjectDrawer from '@/components/projects/ProjectDrawer';

export default function ProjectDetailPage() {
    const params = useParams();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { selectedProject: project, loading } = useAppSelector((state) => state.projects);

    const projectId = params?.id as string;

    useEffect(() => {
        if (projectId) {
            dispatch(fetchProjectById(projectId));
        }
    }, [projectId, dispatch]);

    const handleEdit = () => {
        if (projectId) {
            dispatch(fetchProjects()).then(() => {
                dispatch(openEditDrawer(projectId));
            });
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
            await dispatch(deleteProject(projectId));
            router.push('/projects');
        }
    };

    const formatDate = (dateStr: string) => {
        try {
            return format(new Date(dateStr), 'MMM d, yyyy');
        } catch {
            return dateStr;
        }
    };

    const formatCurrency = (val: number) => `$${val.toLocaleString()}`;

    if (loading || !project) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress sx={{ color: '#16A34A' }} />
            </Box>
        );
    }

    const budgetUsagePercent = project.budget > 0 ? Math.round((project.spent / project.budget) * 100) : 0;

    return (
        <Box sx={{ px: 3.5, py: 3 }}>
            {/* Back Navigation */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <IconButton
                    onClick={() => router.push('/projects')}
                    sx={{
                        mr: 1.5,
                        backgroundColor: '#F1F5F9',
                        '&:hover': { backgroundColor: '#E2E8F0' },
                    }}
                >
                    <BackIcon sx={{ fontSize: '1.2rem', color: '#475569' }} />
                </IconButton>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B', fontSize: '1.5rem' }}>
                        {project.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748B', mt: 0.3 }}>
                        {project.client}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <Button
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={handleEdit}
                        sx={{
                            color: '#475569',
                            borderColor: '#E2E8F0',
                            '&:hover': { borderColor: '#CBD5E1', backgroundColor: '#F8FAFC' },
                        }}
                    >
                        Edit Project
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<DeleteIcon />}
                        onClick={handleDelete}
                        sx={{
                            color: '#EF4444',
                            borderColor: '#FEE2E2',
                            '&:hover': { borderColor: '#EF4444', backgroundColor: '#FEF2F2' },
                        }}
                    >
                        Delete
                    </Button>
                </Box>
            </Box>

            <Grid container spacing={3}>
                {/* Main Content */}
                <Grid size={{ xs: 12, md: 8 }}>
                    {/* Project Overview Card */}
                    <Card sx={{ p: 3, mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.05rem' }}>
                                Project Overview
                            </Typography>
                            <StatusBadge status={project.status} />
                        </Box>

                        {project.description && (
                            <Box sx={{ mb: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <DescriptionIcon sx={{ fontSize: '1.1rem', color: '#64748B' }} />
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#475569' }}>
                                        Description
                                    </Typography>
                                </Box>
                                <Typography variant="body2" sx={{ color: '#475569', lineHeight: 1.7, pl: 3.5 }}>
                                    {project.description}
                                </Typography>
                            </Box>
                        )}

                        <Divider sx={{ my: 2.5, borderColor: '#F1F5F9' }} />

                        {/* Key Details Grid */}
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 6, sm: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                    <PersonIcon sx={{ fontSize: '1rem', color: '#64748B' }} />
                                    <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 500 }}>
                                        Project Manager
                                    </Typography>
                                </Box>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#1E293B', pl: 3 }}>
                                    {project.projectManager}
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 6, sm: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                    <BusinessIcon sx={{ fontSize: '1rem', color: '#64748B' }} />
                                    <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 500 }}>
                                        Client
                                    </Typography>
                                </Box>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#1E293B', pl: 3 }}>
                                    {project.client}
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 6, sm: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                    <CalendarIcon sx={{ fontSize: '1rem', color: '#64748B' }} />
                                    <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 500 }}>
                                        Start Date
                                    </Typography>
                                </Box>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#1E293B', pl: 3 }}>
                                    {formatDate(project.startDate)}
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 6, sm: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                    <CalendarIcon sx={{ fontSize: '1rem', color: '#64748B' }} />
                                    <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 500 }}>
                                        End Date
                                    </Typography>
                                </Box>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#1E293B', pl: 3 }}>
                                    {formatDate(project.endDate)}
                                </Typography>
                            </Grid>
                        </Grid>

                        {/* Tags */}
                        {project.tags && project.tags.length > 0 && (
                            <Box sx={{ mt: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <TagIcon sx={{ fontSize: '1rem', color: '#64748B' }} />
                                    <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 500 }}>
                                        Tags
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', pl: 3 }}>
                                    {project.tags.map((tag) => (
                                        <Chip
                                            key={tag}
                                            label={tag}
                                            size="small"
                                            sx={{
                                                backgroundColor: '#EEF2FF',
                                                color: '#6366F1',
                                                fontWeight: 500,
                                                fontSize: '0.72rem',
                                            }}
                                        />
                                    ))}
                                </Box>
                            </Box>
                        )}
                    </Card>
                </Grid>

                {/* Side Panel */}
                <Grid size={{ xs: 12, md: 4 }}>
                    {/* Progress Card */}
                    <Card sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem', mb: 2 }}>
                            Progress
                        </Typography>
                        <Box sx={{ textAlign: 'center', mb: 2 }}>
                            <Box
                                sx={{
                                    position: 'relative',
                                    display: 'inline-flex',
                                    width: 120,
                                    height: 120,
                                }}
                            >
                                <CircularProgress
                                    variant="determinate"
                                    value={100}
                                    size={120}
                                    thickness={4}
                                    sx={{ color: '#E2E8F0', position: 'absolute' }}
                                />
                                <CircularProgress
                                    variant="determinate"
                                    value={project.progress}
                                    size={120}
                                    thickness={4}
                                    sx={{
                                        color: project.progress >= 80 ? '#16A34A' : project.progress >= 40 ? '#3B82F6' : '#6366F1',
                                    }}
                                />
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        bottom: 0,
                                        right: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexDirection: 'column',
                                    }}
                                >
                                    <Typography variant="h4" sx={{ fontWeight: 800, fontSize: '1.5rem', color: '#1E293B' }}>
                                        {project.progress}%
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.7rem' }}>
                                        Complete
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Card>

                    {/* Budget Card */}
                    <Card sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem', mb: 2 }}>
                            Budget & Billing
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <MoneyIcon sx={{ fontSize: '1rem', color: '#64748B' }} />
                            <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 500 }}>
                                Billing Type
                            </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#1E293B', mb: 2, pl: 3 }}>
                            {project.billingType}
                        </Typography>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                            <Typography variant="body2" sx={{ color: '#64748B' }}>Budget</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#1E293B' }}>
                                {formatCurrency(project.budget)}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                            <Typography variant="body2" sx={{ color: '#64748B' }}>Spent</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: budgetUsagePercent > 90 ? '#EF4444' : '#1E293B' }}>
                                {formatCurrency(project.spent)}
                            </Typography>
                        </Box>

                        <LinearProgress
                            variant="determinate"
                            value={Math.min(budgetUsagePercent, 100)}
                            sx={{
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: '#E2E8F0',
                                mb: 1,
                                '& .MuiLinearProgress-bar': {
                                    borderRadius: 4,
                                    backgroundColor: budgetUsagePercent > 90 ? '#EF4444' : budgetUsagePercent > 70 ? '#F59E0B' : '#16A34A',
                                },
                            }}
                        />
                        <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                            {budgetUsagePercent}% of budget used
                        </Typography>
                    </Card>

                    {/* Settings Card */}
                    <Card sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem', mb: 2 }}>
                            Project Settings
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                            <Box
                                sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    backgroundColor: project.requireTimesheets ? '#16A34A' : '#CBD5E1',
                                }}
                            />
                            <Typography variant="body2" sx={{ color: '#475569' }}>
                                Timesheets: {project.requireTimesheets ? 'Required' : 'Not Required'}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box
                                sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    backgroundColor: project.clientTimesheetApproval ? '#16A34A' : '#CBD5E1',
                                }}
                            />
                            <Typography variant="body2" sx={{ color: '#475569' }}>
                                Client Approval: {project.clientTimesheetApproval ? 'Enabled' : 'Disabled'}
                            </Typography>
                        </Box>
                    </Card>
                </Grid>
            </Grid>

            <ProjectDrawer />
        </Box>
    );
}
