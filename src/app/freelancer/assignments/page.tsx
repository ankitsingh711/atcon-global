'use client';
import React from 'react';
import { Box, Typography, Card, Chip, Grid, LinearProgress } from '@mui/material';

const assignments = [
    { name: 'Website Redesign', client: 'Acme Corp', status: 'Active', progress: 65, rate: '$95/hr', dueDate: 'Mar 30, 2026' },
    { name: 'E-Commerce Platform', client: 'Global Finance', status: 'Active', progress: 38, rate: '$90/hr', dueDate: 'Apr 20, 2026' },
    { name: 'Mobile App Development', client: 'Tech Startup', status: 'Planning', progress: 10, rate: '$100/hr', dueDate: 'May 15, 2026' },
];

const st: Record<string, { bg: string; text: string }> = { Active: { bg: '#DCFCE7', text: '#16A34A' }, Planning: { bg: '#FEF3C7', text: '#D97706' } };

export default function FreelancerAssignmentsPage() {
    return (
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B', fontSize: '1.5rem', mb: 0.5 }}>My Assignments</Typography>
            <Typography variant="body2" sx={{ color: '#64748B', mb: 3 }}>{assignments.length} current assignments</Typography>
            <Grid container spacing={2.5}>
                {assignments.map((a) => (
                    <Grid size={{ xs: 12 }} key={a.name}>
                        <Card sx={{ p: 2.5, borderRadius: '14px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Box><Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{a.name}</Typography><Typography variant="caption" sx={{ color: '#64748B' }}>{a.client} • {a.rate}</Typography></Box>
                                <Chip label={a.status} size="small" sx={{ bgcolor: (st[a.status] || st['Planning']).bg, color: (st[a.status] || st['Planning']).text, fontWeight: 600, fontSize: '0.68rem', height: 22 }} />
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}><Typography variant="caption" sx={{ color: '#64748B' }}>Progress</Typography><Typography variant="caption" sx={{ fontWeight: 600 }}>{a.progress}%</Typography></Box>
                            <LinearProgress variant="determinate" value={a.progress} sx={{ height: 6, borderRadius: 3, bgcolor: '#E2E8F0', '& .MuiLinearProgress-bar': { borderRadius: 3, bgcolor: '#16A34A' } }} />
                            <Typography variant="caption" sx={{ color: '#94A3B8', mt: 1, display: 'block' }}>Due: {a.dueDate}</Typography>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
