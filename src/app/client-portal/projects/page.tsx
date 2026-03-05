'use client';
import React from 'react';
import { Box, Typography, Card, Chip, Grid, LinearProgress } from '@mui/material';

const projects = [
    { name: 'Website Redesign', status: 'On Track', progress: 65, budget: '$45,000', spent: '$29,250', team: 4 },
    { name: 'Mobile App Development', status: 'In Progress', progress: 30, budget: '$60,000', spent: '$18,000', team: 3 },
    { name: 'CRM Integration', status: 'On Hold', progress: 25, budget: '$20,000', spent: '$5,000', team: 2 },
];
const st: Record<string, { bg: string; text: string }> = { 'On Track': { bg: '#DCFCE7', text: '#16A34A' }, 'In Progress': { bg: '#DBEAFE', text: '#2563EB' }, 'On Hold': { bg: '#FEF3C7', text: '#D97706' } };

export default function ClientProjectsPage() {
    return (
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B', fontSize: '1.5rem', mb: 0.5 }}>Projects</Typography>
            <Typography variant="body2" sx={{ color: '#64748B', mb: 3 }}>{projects.length} active projects</Typography>
            {projects.map((p) => (
                <Card key={p.name} sx={{ p: 2.5, mb: 2, borderRadius: '14px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{p.name}</Typography>
                        <Chip label={p.status} size="small" sx={{ bgcolor: (st[p.status] || st['On Track']).bg, color: (st[p.status] || st['On Track']).text, fontWeight: 600, fontSize: '0.68rem', height: 22 }} />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}><Typography variant="caption" sx={{ color: '#64748B' }}>Progress</Typography><Typography variant="caption" sx={{ fontWeight: 600 }}>{p.progress}%</Typography></Box>
                    <LinearProgress variant="determinate" value={p.progress} sx={{ height: 6, borderRadius: 3, bgcolor: '#E2E8F0', mb: 2, '& .MuiLinearProgress-bar': { borderRadius: 3, bgcolor: '#4F46E5' } }} />
                    <Grid container spacing={2}>
                        {[{ l: 'Budget', v: p.budget }, { l: 'Spent', v: p.spent }, { l: 'Team', v: `${p.team} members` }].map((s) => (
                            <Grid size={{ xs: 4 }} key={s.l}><Card variant="outlined" sx={{ p: 1.5, textAlign: 'center', borderRadius: '10px', borderColor: '#E2E8F0' }}><Typography variant="caption" sx={{ color: '#94A3B8' }}>{s.l}</Typography><Typography variant="body2" sx={{ fontWeight: 700 }}>{s.v}</Typography></Card></Grid>
                        ))}
                    </Grid>
                </Card>
            ))}
        </Box>
    );
}
