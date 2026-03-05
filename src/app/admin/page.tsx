'use client';

import React, { useState } from 'react';
import { Box, Typography, Card, Grid, Avatar, Chip, Switch, List, ListItem, ListItemText, ListItemIcon, Divider } from '@mui/material';
import { Security as SecurityIcon, People as UsersIcon, Settings as SettingsIcon, Storage as DataIcon, Notifications as NotifIcon, Palette as ThemeIcon } from '@mui/icons-material';

const settings = [
    { label: 'Two-Factor Authentication', description: 'Require 2FA for all admin accounts', enabled: true, icon: <SecurityIcon /> },
    { label: 'Email Notifications', description: 'Send email alerts for system events', enabled: true, icon: <NotifIcon /> },
    { label: 'Auto-backup Database', description: 'Daily automated database backups', enabled: true, icon: <DataIcon /> },
    { label: 'Dark Mode Default', description: 'Set dark mode as default for all users', enabled: false, icon: <ThemeIcon /> },
    { label: 'User Self-Registration', description: 'Allow users to create their own accounts', enabled: false, icon: <UsersIcon /> },
];

export default function AdminPage() {
    const [toggles, setToggles] = useState(settings.map((s) => s.enabled));
    const stats = [
        { label: 'Total Users', value: '24', color: '#3B82F6', bg: '#EFF6FF', icon: <UsersIcon /> },
        { label: 'Active Sessions', value: '8', color: '#16A34A', bg: '#F0FDF4', icon: <SecurityIcon /> },
        { label: 'Storage Used', value: '2.4 GB', color: '#F59E0B', bg: '#FFFBEB', icon: <DataIcon /> },
        { label: 'System Health', value: '99.9%', color: '#8B5CF6', bg: '#F5F3FF', icon: <SettingsIcon /> },
    ];

    return (
        <Box sx={{ px: 3.5, py: 3 }}>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B', fontSize: '1.5rem' }}>Admin</Typography>
                <Typography variant="body2" sx={{ color: '#64748B' }}>System administration and settings</Typography>
            </Box>
            <Grid container spacing={2.5} sx={{ mb: 3 }}>
                {stats.map((s) => (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={s.label}>
                        <Card sx={{ p: 2.5, borderRadius: '14px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: s.bg, color: s.color, width: 44, height: 44 }}>{s.icon}</Avatar>
                            <Box><Typography variant="h5" sx={{ fontWeight: 700, color: '#1E293B' }}>{s.value}</Typography><Typography variant="caption" sx={{ color: '#64748B' }}>{s.label}</Typography></Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Card sx={{ borderRadius: '14px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                <Box sx={{ px: 3, py: 2 }}><Typography variant="subtitle1" sx={{ fontWeight: 600 }}>System Settings</Typography></Box>
                <Divider />
                <List disablePadding>
                    {settings.map((s, i) => (
                        <ListItem key={s.label} sx={{ px: 3, py: 1.5, '&:hover': { bgcolor: '#F8FAFC' } }} secondaryAction={<Switch checked={toggles[i]} onChange={() => setToggles((p) => p.map((v, j) => (j === i ? !v : v)))} color="primary" />}>
                            <ListItemIcon sx={{ minWidth: 40, color: '#6366F1' }}>{s.icon}</ListItemIcon>
                            <ListItemText primary={s.label} secondary={s.description} primaryTypographyProps={{ fontSize: '0.88rem', fontWeight: 500 }} secondaryTypographyProps={{ fontSize: '0.75rem' }} />
                        </ListItem>
                    ))}
                </List>
            </Card>
        </Box>
    );
}
