'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Card, Grid, Chip, LinearProgress, CircularProgress } from '@mui/material';

interface ProjectData { id: string; name: string; client: string; status: string; progress: number; role: string; dueDate: string; }

const st: Record<string, { bg: string; text: string }> = { 'In Progress': { bg: '#DBEAFE', text: '#2563EB' }, Planning: { bg: '#FEF3C7', text: '#D97706' }, Completed: { bg: '#DCFCE7', text: '#16A34A' } };

export default function EmployeeProjectsPage() {
    const [projects, setProjects] = useState<ProjectData[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try { setLoading(true); const res = await fetch('/api/employee'); const json = await res.json(); if (json.success) setProjects(json.data.projects || []); }
        catch { console.error('Failed to load projects'); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}><CircularProgress /></Box>;

    return (
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B', fontSize: '1.5rem', mb: 0.5 }}>My Projects</Typography>
            <Typography variant="body2" sx={{ color: '#64748B', mb: 3 }}>{projects.length} assigned projects</Typography>
            <Grid container spacing={2.5}>
                {projects.map((p) => (
                    <Grid size={{ xs: 12 }} key={p.id}>
                        <Card sx={{ p: 2.5, borderRadius: '14px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Box><Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{p.name}</Typography><Typography variant="caption" sx={{ color: '#64748B' }}>{p.client} • {p.role}</Typography></Box>
                                <Chip label={p.status} size="small" sx={{ bgcolor: (st[p.status] || st['Planning']).bg, color: (st[p.status] || st['Planning']).text, fontWeight: 600, fontSize: '0.68rem', height: 22 }} />
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}><Typography variant="caption" sx={{ color: '#64748B' }}>Progress</Typography><Typography variant="caption" sx={{ fontWeight: 600 }}>{p.progress}%</Typography></Box>
                            <LinearProgress variant="determinate" value={p.progress} sx={{ height: 6, borderRadius: 3, bgcolor: '#E2E8F0', '& .MuiLinearProgress-bar': { borderRadius: 3, bgcolor: '#2563EB' } }} />
                            <Typography variant="caption" sx={{ color: '#94A3B8', mt: 1, display: 'block' }}>Due: {p.dueDate}</Typography>
                        </Card>
                    </Grid>
                ))}
                {projects.length === 0 && <Grid size={{ xs: 12 }}><Typography variant="body2" sx={{ color: '#94A3B8', textAlign: 'center', py: 4 }}>No projects assigned yet</Typography></Grid>}
            </Grid>
        </Box>
    );
}
