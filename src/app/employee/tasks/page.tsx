'use client';
import React from 'react';
import { Box, Typography, Card, Chip, Checkbox, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';

const tasks = [
    { title: 'Update project documentation', project: 'Website Redesign', priority: 'High', due: 'Mar 5', done: false },
    { title: 'Review PR #128', project: 'Mobile App', priority: 'Medium', due: 'Mar 6', done: false },
    { title: 'Deploy staging release', project: 'Website Redesign', priority: 'High', due: 'Mar 7', done: false },
    { title: 'Setup CI/CD pipeline', project: 'API Integration', priority: 'Low', due: 'Mar 7', done: true },
    { title: 'Write unit tests for auth module', project: 'Mobile App', priority: 'Medium', due: 'Mar 8', done: true },
    { title: 'Fix responsive layout issues', project: 'Website Redesign', priority: 'High', due: 'Mar 10', done: false },
];

const pc: Record<string, { bg: string; text: string }> = { High: { bg: '#FEE2E2', text: '#EF4444' }, Medium: { bg: '#FEF3C7', text: '#D97706' }, Low: { bg: '#DCFCE7', text: '#16A34A' } };

export default function EmployeeTasksPage() {
    return (
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B', fontSize: '1.5rem', mb: 0.5 }}>My Tasks</Typography>
            <Typography variant="body2" sx={{ color: '#64748B', mb: 3 }}>{tasks.filter((t) => !t.done).length} pending tasks</Typography>
            <Card sx={{ borderRadius: '14px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                <List disablePadding>
                    {tasks.map((t, i) => (
                        <ListItem key={i} sx={{ px: 2.5, py: 1.5, borderBottom: i < tasks.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                            <ListItemIcon sx={{ minWidth: 36 }}><Checkbox size="small" checked={t.done} sx={{ color: '#CBD5E1', '&.Mui-checked': { color: '#2563EB' } }} /></ListItemIcon>
                            <ListItemText primary={t.title} secondary={`${t.project} • Due ${t.due}`} primaryTypographyProps={{ fontSize: '0.88rem', fontWeight: 500, textDecoration: t.done ? 'line-through' : 'none', color: t.done ? '#94A3B8' : '#1E293B' }} secondaryTypographyProps={{ fontSize: '0.72rem' }} />
                            <Chip label={t.priority} size="small" sx={{ bgcolor: pc[t.priority].bg, color: pc[t.priority].text, fontWeight: 600, fontSize: '0.65rem', height: 22 }} />
                        </ListItem>
                    ))}
                </List>
            </Card>
        </Box>
    );
}
