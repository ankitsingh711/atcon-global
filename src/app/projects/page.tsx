'use client';

import React, { useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProjects } from '@/store/slices/projectSlice';
import SummaryCards from '@/components/projects/SummaryCards';
import ProjectFilters from '@/components/projects/ProjectFilters';
import ProjectTable from '@/components/projects/ProjectTable';
import ProjectDrawer from '@/components/projects/ProjectDrawer';

export default function ProjectsPage() {
    const dispatch = useAppDispatch();
    const { loading, error, projects } = useAppSelector((state) => state.projects);

    useEffect(() => {
        dispatch(fetchProjects());
    }, [dispatch]);

    // Auto-seed if no projects exist
    useEffect(() => {
        if (!loading && projects.length === 0 && !error) {
            const seedData = async () => {
                try {
                    const res = await fetch('/api/seed', { method: 'POST' });
                    const data = await res.json();
                    if (data.success) {
                        dispatch(fetchProjects());
                    }
                } catch (err) {
                    console.error('Seed failed:', err);
                }
            };
            // Small delay to avoid race with initial load
            const timer = setTimeout(seedData, 1000);
            return () => clearTimeout(timer);
        }
    }, [loading, projects.length, error, dispatch]);

    return (
        <Box sx={{ px: 3.5, py: 3 }}>
            {/* Page Header */}
            <Box sx={{ mb: 3 }}>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                        color: '#1E293B',
                        fontSize: '1.6rem',
                        mb: 0.5,
                    }}
                >
                    Projects
                </Typography>
                <Typography variant="subtitle1" sx={{ color: '#64748B', fontSize: '0.9rem' }}>
                    Manage all projects, tasks, and timesheets
                </Typography>
            </Box>

            {/* Summary Cards */}
            <SummaryCards />

            {/* Filters & Controls */}
            <ProjectFilters />

            {/* Error Alert */}
            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 2, borderRadius: '12px' }}
                    onClose={() => dispatch(fetchProjects())}
                >
                    {error}
                </Alert>
            )}

            {/* Loading State */}
            {loading && projects.length === 0 ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress sx={{ color: '#16A34A' }} />
                </Box>
            ) : (
                /* Projects Table */
                <ProjectTable />
            )}

            {/* Create/Edit Drawer */}
            <ProjectDrawer />
        </Box>
    );
}
