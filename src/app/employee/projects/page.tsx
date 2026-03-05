'use client';
import React from 'react';
import { Box, Typography, Card, Grid, Chip, LinearProgress, Avatar } from '@mui/material';

const projects = [
    { name: 'Website Redesign', client: 'Acme Corp', status: 'In Progress', progress: 65, role: 'Frontend Developer', dueDate: 'Mar 30, 2026' },
    { name: 'Mobile App Development', client: 'Tech Startup', status: 'In Progress', progress: 30, role: 'Full Stack Developer', dueDate: 'Apr 15, 2026' },
    { name: 'API Integration', client: 'Global Finance', status: 'Planning', progress: 10, role: 'Backend Developer', dueDate: 'May 1, 2026' },
];

const st: Record<string, { bg: string; text: string }> = { 'In Progress': { bg: '#DBEAFE', text: '#2563EB' }, Planning: { bg: '#FEF3C7', text: '#D97706' } };

export default function EmployeeProjectsPage() {
    return (
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B', fontSize: '1.5rem', mb: 0.5 }}>My Projects</Typography>
            <Typography variant="body2" sx={{ color: '#64748B', mb: 3 }}>{projects.length} assigned projects</Typography>
            <Grid container spacing={2.5}>
                {projects.map((p) => (
                    <Grid size={{ xs: 12 }} key={p.name}>
                        <Card sx={{ p: 2.5, borderRadius: '14px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Box>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{p.name}</Typography>
                                    <Typography variant="caption" sx={{ color: '#64748B' }}>{p.client} • {p.role}</Typography>
                                </Box>
                                <Chip label={p.status} size="small" sx={{ bgcolor: (st[p.status] || st['Planning']).bg, color: (st[p.status] || st['Planning']).text, fontWeight: 600, fontSize: '0.68rem', height: 22 }} />
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                <Typography variant="caption" sx={{ color: '#64748B' }}>Progress</Typography>
                                <Typography variant="caption" sx={{ fontWeight: 600 }}>{p.progress}%</Typography>
                            </Box>
                            <LinearProgress variant="determinate" value={p.progress} sx={{ height: 6, borderRadius: 3, bgcolor: '#E2E8F0', '& .MuiLinearProgress-bar': { borderRadius: 3, bgcolor: '#2563EB' } }} />
                            <Typography variant="caption" sx={{ color: '#94A3B8', mt: 1, display: 'block' }}>Due: {p.dueDate}</Typography>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
