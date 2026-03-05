'use client';
import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Typography, Card, Grid, Switch, List, ListItem, ListItemText, ListItemSecondaryAction,
    CircularProgress, Divider, Avatar,
} from '@mui/material';
import { People as PeopleIcon, FolderOpen as ProjectsIcon, BusinessCenter as ClientsIcon, TrendingUp as SalesIcon } from '@mui/icons-material';

interface Stats { users: number; projects: number; clients: number; deals: number; }

const settings = [
    { id: 'notifications', label: 'Email Notifications', desc: 'Send email alerts for important events', defaultOn: true },
    { id: 'twoFactor', label: 'Two-Factor Authentication', desc: 'Require 2FA for all users', defaultOn: false },
    { id: 'autoBackup', label: 'Automatic Backups', desc: 'Run daily backups at midnight', defaultOn: true },
    { id: 'maintenance', label: 'Maintenance Mode', desc: 'Put the system in maintenance mode', defaultOn: false },
    { id: 'analytics', label: 'Usage Analytics', desc: 'Track platform usage and trends', defaultOn: true },
    { id: 'audit', label: 'Audit Logging', desc: 'Log all administrative actions', defaultOn: true },
];

export default function AdminPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [toggles, setToggles] = useState<Record<string, boolean>>(() => Object.fromEntries(settings.map((s) => [s.id, s.defaultOn])));

    const fetchStats = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/dashboard');
            const json = await res.json();
            if (json.success) {
                setStats({
                    users: json.data?.teamMembers ?? 0,
                    projects: json.data?.activeProjects ?? 0,
                    clients: json.data?.totalClients ?? 0,
                    deals: json.data?.activeDeals ?? 0,
                });
            }
        } catch { console.error('Failed to load admin stats'); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchStats(); }, [fetchStats]);

    if (loading || !stats) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}><CircularProgress /></Box>;

    const statCards = [
        { label: 'Users', value: stats.users, icon: <PeopleIcon />, bg: '#EFF6FF', color: '#2563EB' },
        { label: 'Projects', value: stats.projects, icon: <ProjectsIcon />, bg: '#F0FDF4', color: '#16A34A' },
        { label: 'Clients', value: stats.clients, icon: <ClientsIcon />, bg: '#FEF3C7', color: '#D97706' },
        { label: 'Deals', value: stats.deals, icon: <SalesIcon />, bg: '#EEF2FF', color: '#6366F1' },
    ];

    return (
        <Box>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B', fontSize: '1.5rem', mb: 0.5 }}>Admin</Typography>
                <Typography variant="body2" sx={{ color: '#64748B' }}>System administration and settings</Typography>
            </Box>
            <Grid container spacing={2} sx={{ mb: 3 }}>
                {statCards.map((s) => (
                    <Grid size={{ xs: 6, md: 3 }} key={s.label}>
                        <Card sx={{ p: 2.5, borderRadius: '14px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', textAlign: 'center' }}>
                            <Avatar sx={{ bgcolor: s.bg, color: s.color, mx: 'auto', mb: 1 }}>{s.icon}</Avatar>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B' }}>{s.value}</Typography>
                            <Typography variant="caption" sx={{ color: '#64748B' }}>{s.label}</Typography>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Card sx={{ borderRadius: '14px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                <Box sx={{ p: 2.5 }}><Typography variant="subtitle1" sx={{ fontWeight: 600 }}>System Settings</Typography></Box>
                <Divider />
                <List disablePadding>
                    {settings.map((s, i) => (
                        <ListItem key={s.id} sx={{ px: 2.5, py: 1.5, borderBottom: i < settings.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                            <ListItemText primary={s.label} secondary={s.desc} primaryTypographyProps={{ fontWeight: 500, fontSize: '0.88rem' }} secondaryTypographyProps={{ fontSize: '0.72rem' }} />
                            <ListItemSecondaryAction><Switch checked={toggles[s.id]} onChange={() => setToggles((prev) => ({ ...prev, [s.id]: !prev[s.id] }))} sx={{ '& .Mui-checked': { color: '#16A34A' }, '& .Mui-checked + .MuiSwitch-track': { backgroundColor: '#16A34A' } }} /></ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            </Card>
        </Box>
    );
}
