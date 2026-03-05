'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Card, Chip, LinearProgress, CircularProgress, Grid } from '@mui/material';

interface ProjectData { id: string; name: string; client: string; status: string; progress: number; }

const st: Record<string, { bg: string; text: string }> = { 'On Track': { bg: '#DCFCE7', text: '#16A34A' }, 'In Progress': { bg: '#DBEAFE', text: '#2563EB' }, 'On Hold': { bg: '#FEF3C7', text: '#D97706' }, Planning: { bg: '#FEF3C7', text: '#D97706' }, Active: { bg: '#DCFCE7', text: '#16A34A' } };

export default function ClientProjectsPage() {
    const [projects, setProjects] = useState<ProjectData[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try { setLoading(true); const res = await fetch('/api/client-portal'); const json = await res.json(); if (json.success) setProjects(json.data.projects || []); }
        catch { console.error('Failed to load projects'); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}><CircularProgress /></Box>;

    return (
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B', fontSize: '1.5rem', mb: 0.5 }}>Projects</Typography>
            <Typography variant="body2" sx={{ color: '#64748B', mb: 3 }}>{projects.length} active projects</Typography>
            {projects.map((p) => (
                <Card key={p.id} sx={{ p: 2.5, mb: 2, borderRadius: '14px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{p.name}</Typography>
                        <Chip label={p.status} size="small" sx={{ bgcolor: (st[p.status] || st['Active']).bg, color: (st[p.status] || st['Active']).text, fontWeight: 600, fontSize: '0.68rem', height: 22 }} />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}><Typography variant="caption" sx={{ color: '#64748B' }}>Progress</Typography><Typography variant="caption" sx={{ fontWeight: 600 }}>{p.progress}%</Typography></Box>
                    <LinearProgress variant="determinate" value={p.progress} sx={{ height: 6, borderRadius: 3, bgcolor: '#E2E8F0', mb: 1, '& .MuiLinearProgress-bar': { borderRadius: 3, bgcolor: '#4F46E5' } }} />
                    <Typography variant="caption" sx={{ color: '#94A3B8' }}>Client: {p.client}</Typography>
                </Card>
            ))}
            {projects.length === 0 && <Typography variant="body2" sx={{ color: '#94A3B8', textAlign: 'center', py: 4 }}>No projects yet</Typography>}
        </Box>
    );
}
