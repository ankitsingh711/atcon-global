'use client';
import React from 'react';
import { Box, Typography, Card, Chip, Avatar, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import { Description as FormIcon } from '@mui/icons-material';

const forms = [
    { name: 'Project Brief Submission', status: 'Active', submissions: 3, lastUpdated: 'Mar 4, 2026' },
    { name: 'Feedback Form', status: 'Active', submissions: 8, lastUpdated: 'Mar 2, 2026' },
    { name: 'Change Request Form', status: 'Active', submissions: 2, lastUpdated: 'Feb 28, 2026' },
    { name: 'Onboarding Questionnaire', status: 'Completed', submissions: 1, lastUpdated: 'Jan 15, 2024' },
];
const st: Record<string, { bg: string; text: string }> = { Active: { bg: '#DCFCE7', text: '#16A34A' }, Completed: { bg: '#F1F5F9', text: '#64748B' } };

export default function ClientFormsPage() {
    return (
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B', fontSize: '1.5rem', mb: 0.5 }}>Forms</Typography>
            <Typography variant="body2" sx={{ color: '#64748B', mb: 3 }}>{forms.filter((f) => f.status === 'Active').length} active forms</Typography>
            <Card sx={{ borderRadius: '14px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                <List disablePadding>
                    {forms.map((f, i) => (
                        <ListItem key={i} sx={{ px: 2.5, py: 1.5, borderBottom: i < forms.length - 1 ? '1px solid #F1F5F9' : 'none', '&:hover': { bgcolor: '#FAFAFA' } }}>
                            <ListItemIcon sx={{ minWidth: 40 }}><Avatar sx={{ bgcolor: '#EEF2FF', color: '#4F46E5', width: 32, height: 32 }}><FormIcon sx={{ fontSize: '1rem' }} /></Avatar></ListItemIcon>
                            <ListItemText primary={f.name} secondary={`${f.submissions} submissions • Last updated ${f.lastUpdated}`} primaryTypographyProps={{ fontSize: '0.88rem', fontWeight: 500 }} secondaryTypographyProps={{ fontSize: '0.72rem' }} />
                            <Chip label={f.status} size="small" sx={{ bgcolor: st[f.status].bg, color: st[f.status].text, fontWeight: 600, fontSize: '0.65rem', height: 22 }} />
                        </ListItem>
                    ))}
                </List>
            </Card>
        </Box>
    );
}
