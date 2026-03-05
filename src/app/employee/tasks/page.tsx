'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Card, Chip, Checkbox, List, ListItem, ListItemText, ListItemIcon, CircularProgress } from '@mui/material';

interface TaskData { title: string; project: string; priority: string; due: string; done: boolean; }
const pc: Record<string, { bg: string; text: string }> = { High: { bg: '#FEE2E2', text: '#EF4444' }, Medium: { bg: '#FEF3C7', text: '#D97706' }, Low: { bg: '#DCFCE7', text: '#16A34A' } };

export default function EmployeeTasksPage() {
    const [tasks, setTasks] = useState<TaskData[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try { setLoading(true); const res = await fetch('/api/employee'); const json = await res.json(); if (json.success) setTasks(json.data.tasks || []); }
        catch { console.error('Failed to load tasks'); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleToggle = (index: number) => { setTasks((prev) => prev.map((t, i) => i === index ? { ...t, done: !t.done } : t)); };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}><CircularProgress /></Box>;

    return (
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B', fontSize: '1.5rem', mb: 0.5 }}>My Tasks</Typography>
            <Typography variant="body2" sx={{ color: '#64748B', mb: 3 }}>{tasks.filter((t) => !t.done).length} pending tasks</Typography>
            <Card sx={{ borderRadius: '14px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                <List disablePadding>
                    {tasks.map((t, i) => (
                        <ListItem key={i} sx={{ px: 2.5, py: 1.5, borderBottom: i < tasks.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                            <ListItemIcon sx={{ minWidth: 36 }}><Checkbox size="small" checked={t.done} onChange={() => handleToggle(i)} sx={{ color: '#CBD5E1', '&.Mui-checked': { color: '#2563EB' } }} /></ListItemIcon>
                            <ListItemText primary={t.title} secondary={`${t.project} • Due ${t.due}`} primaryTypographyProps={{ fontSize: '0.88rem', fontWeight: 500, textDecoration: t.done ? 'line-through' : 'none', color: t.done ? '#94A3B8' : '#1E293B' }} secondaryTypographyProps={{ fontSize: '0.72rem' }} />
                            <Chip label={t.priority} size="small" sx={{ bgcolor: (pc[t.priority] || pc['Medium']).bg, color: (pc[t.priority] || pc['Medium']).text, fontWeight: 600, fontSize: '0.65rem', height: 22 }} />
                        </ListItem>
                    ))}
                </List>
            </Card>
        </Box>
    );
}
