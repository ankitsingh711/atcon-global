'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Card, Chip, Grid, LinearProgress, CircularProgress } from '@mui/material';

interface Assignment { id: string; name: string; client: string; status: string; progress: number; }

const st: Record<string, { bg: string; text: string }> = { Active: { bg: '#DCFCE7', text: '#16A34A' }, Planning: { bg: '#FEF3C7', text: '#D97706' } };

export default function FreelancerAssignmentsPage() {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try { setLoading(true); const res = await fetch('/api/freelancer'); const json = await res.json(); if (json.success) setAssignments(json.data.projects || []); }
        catch { console.error('Failed to load assignments'); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}><CircularProgress /></Box>;

    return (
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B', fontSize: '1.5rem', mb: 0.5 }}>My Assignments</Typography>
            <Typography variant="body2" sx={{ color: '#64748B', mb: 3 }}>{assignments.length} current assignments</Typography>
            <Grid container spacing={2.5}>
                {assignments.map((a) => (
                    <Grid size={{ xs: 12 }} key={a.id}>
                        <Card sx={{ p: 2.5, borderRadius: '14px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Box><Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{a.name}</Typography><Typography variant="caption" sx={{ color: '#64748B' }}>{a.client}</Typography></Box>
                                <Chip label={a.status} size="small" sx={{ bgcolor: (st[a.status] || st['Active']).bg, color: (st[a.status] || st['Active']).text, fontWeight: 600, fontSize: '0.68rem', height: 22 }} />
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}><Typography variant="caption" sx={{ color: '#64748B' }}>Progress</Typography><Typography variant="caption" sx={{ fontWeight: 600 }}>{a.progress}%</Typography></Box>
                            <LinearProgress variant="determinate" value={a.progress} sx={{ height: 6, borderRadius: 3, bgcolor: '#E2E8F0', '& .MuiLinearProgress-bar': { borderRadius: 3, bgcolor: '#16A34A' } }} />
                        </Card>
                    </Grid>
                ))}
                {assignments.length === 0 && <Grid size={{ xs: 12 }}><Typography variant="body2" sx={{ color: '#94A3B8', textAlign: 'center', py: 4 }}>No assignments yet</Typography></Grid>}
            </Grid>
        </Box>
    );
}
