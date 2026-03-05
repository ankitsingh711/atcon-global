'use client';

import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Card, Grid, Avatar, Chip, LinearProgress,
    CircularProgress, List, ListItem, ListItemText, ListItemIcon,
} from '@mui/material';
import {
    FolderOpen as ProjectIcon,
    AccessTime as TimesheetIcon,
    ConfirmationNumber as TicketIcon,
    Receipt as InvoiceIcon,
    Circle as DotIcon,
    People as TalentIcon,
} from '@mui/icons-material';

interface ProjectItem {
    id: string;
    name: string;
    status: string;
    progress: number;
}

interface SupportTicket {
    title: string;
    status: string;
    time: string;
}

interface InvoiceItem {
    number: string;
    amount: string;
    status: string;
}

interface TalentItem {
    role: string;
    candidates: number;
}

interface ClientDashData {
    clientName: string;
    contactName: string;
    stats: {
        activeProjects: number;
        pendingTimesheets: number;
        openTickets: number;
        recentInvoices: number;
    };
    projects: ProjectItem[];
    supportTickets: SupportTicket[];
    invoices: InvoiceItem[];
    talentShortlists: TalentItem[];
}

export default function ClientPortalPage() {
    const [data, setData] = useState<ClientDashData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/client-portal')
            .then((res) => res.json())
            .then((json) => {
                if (json.success) setData(json.data);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress sx={{ color: '#4F46E5' }} />
            </Box>
        );
    }

    if (!data) return null;

    const statCards = [
        { label: 'Active Projects', value: data.stats.activeProjects, icon: <ProjectIcon />, color: '#4F46E5', bg: '#EEF2FF' },
        { label: 'Pending Timesheets', value: data.stats.pendingTimesheets, icon: <TimesheetIcon />, color: '#F59E0B', bg: '#FFFBEB' },
        { label: 'Open Tickets', value: data.stats.openTickets, icon: <TicketIcon />, color: '#EF4444', bg: '#FEF2F2' },
        { label: 'Recent Invoices', value: data.stats.recentInvoices, icon: <InvoiceIcon />, color: '#16A34A', bg: '#F0FDF4' },
    ];

    const statusColors: Record<string, { bg: string; text: string }> = {
        'On Track': { bg: '#DCFCE7', text: '#16A34A' },
        'In Progress': { bg: '#DBEAFE', text: '#2563EB' },
        Active: { bg: '#DCFCE7', text: '#16A34A' },
        Planning: { bg: '#FEF3C7', text: '#D97706' },
        Open: { bg: '#FEF2F2', text: '#EF4444' },
        Paid: { bg: '#DCFCE7', text: '#16A34A' },
        Pending: { bg: '#FEF3C7', text: '#D97706' },
    };

    return (
        <Box>
            {/* Welcome Header */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B' }}>
                    Welcome back, {data.clientName}
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748B', mt: 0.5 }}>
                    {data.contactName} — Here&apos;s your portal overview
                </Typography>
            </Box>

            {/* KPI Stats */}
            <Grid container spacing={2.5} sx={{ mb: 3 }}>
                {statCards.map((stat) => (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.label}>
                        <Card
                            sx={{
                                p: 2.5,
                                borderRadius: '14px',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                                border: '1px solid #E2E8F0',
                            }}
                        >
                            <Typography variant="caption" sx={{ color: stat.color, fontWeight: 600, fontSize: '0.72rem' }}>
                                {stat.label}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 0.5 }}>
                                <Avatar sx={{ bgcolor: stat.bg, color: stat.color, width: 40, height: 40 }}>
                                    {stat.icon}
                                </Avatar>
                                <Typography variant="h3" sx={{ fontWeight: 700, color: '#1E293B' }}>
                                    {stat.value}
                                </Typography>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Middle Row: Active Projects + Support Tickets */}
            <Grid container spacing={2.5} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card
                        sx={{
                            borderRadius: '14px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                            border: '1px solid #E2E8F0',
                            p: 2.5,
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <Avatar sx={{ bgcolor: '#EEF2FF', color: '#4F46E5', width: 36, height: 36 }}>
                                <ProjectIcon sx={{ fontSize: '1.1rem' }} />
                            </Avatar>
                            <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1E293B', lineHeight: 1.2 }}>
                                    Active Projects
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#64748B' }}>
                                    {data.projects.length} ongoing projects
                                </Typography>
                            </Box>
                        </Box>
                        <List disablePadding>
                            {data.projects.map((proj) => (
                                <ListItem
                                    key={proj.id}
                                    sx={{
                                        px: 1.5,
                                        py: 1,
                                        borderRadius: '10px',
                                        mb: 0.5,
                                        '&:hover': { bgcolor: '#F8FAFC' },
                                    }}
                                >
                                    <ListItemText
                                        primary={proj.name}
                                        secondary={`${proj.status} • ${proj.progress}% complete`}
                                        primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 500 }}
                                        secondaryTypographyProps={{ fontSize: '0.72rem' }}
                                    />
                                    <Chip
                                        label={proj.status}
                                        size="small"
                                        sx={{
                                            bgcolor: (statusColors[proj.status] || statusColors['Active']).bg,
                                            color: (statusColors[proj.status] || statusColors['Active']).text,
                                            fontWeight: 600,
                                            fontSize: '0.65rem',
                                            height: 22,
                                        }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <Card
                        sx={{
                            borderRadius: '14px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                            border: '1px solid #E2E8F0',
                            p: 2.5,
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <Avatar sx={{ bgcolor: '#FEF2F2', color: '#EF4444', width: 36, height: 36 }}>
                                <TicketIcon sx={{ fontSize: '1.1rem' }} />
                            </Avatar>
                            <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1E293B', lineHeight: 1.2 }}>
                                    Support Tickets
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#64748B' }}>
                                    {data.supportTickets.length} open tickets
                                </Typography>
                            </Box>
                        </Box>
                        <List disablePadding>
                            {data.supportTickets.map((ticket, i) => (
                                <ListItem
                                    key={i}
                                    sx={{
                                        px: 1.5,
                                        py: 1,
                                        borderRadius: '10px',
                                        mb: 0.5,
                                        bgcolor: i === 0 ? '#FEF2F2' : 'transparent',
                                        '&:hover': { bgcolor: '#F8FAFC' },
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: 28 }}>
                                        <DotIcon sx={{ fontSize: '0.6rem', color: ticket.status === 'Open' ? '#EF4444' : '#F59E0B' }} />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={ticket.title}
                                        secondary={`${ticket.status} • ${ticket.time}`}
                                        primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 500 }}
                                        secondaryTypographyProps={{ fontSize: '0.72rem' }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Card>
                </Grid>
            </Grid>

            {/* Bottom Row: Recent Invoices + Talent Shortlists */}
            <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card
                        sx={{
                            borderRadius: '14px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                            border: '1px solid #E2E8F0',
                            p: 2.5,
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <Avatar sx={{ bgcolor: '#F0FDF4', color: '#16A34A', width: 36, height: 36 }}>
                                <InvoiceIcon sx={{ fontSize: '1.1rem' }} />
                            </Avatar>
                            <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1E293B', lineHeight: 1.2 }}>
                                    Recent Invoices
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#64748B' }}>
                                    {data.invoices.filter((inv) => inv.status === 'Pending').length} pending payment
                                </Typography>
                            </Box>
                        </Box>
                        <List disablePadding>
                            {data.invoices.map((inv, i) => (
                                <ListItem
                                    key={i}
                                    sx={{
                                        px: 1.5,
                                        py: 1,
                                        borderRadius: '10px',
                                        mb: 0.5,
                                        '&:hover': { bgcolor: '#F8FAFC' },
                                    }}
                                >
                                    <ListItemText
                                        primary={`${inv.number} • ${inv.amount}`}
                                        primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 500 }}
                                    />
                                    <Chip
                                        label={inv.status}
                                        size="small"
                                        sx={{
                                            bgcolor: (statusColors[inv.status] || statusColors['Pending']).bg,
                                            color: (statusColors[inv.status] || statusColors['Pending']).text,
                                            fontWeight: 600,
                                            fontSize: '0.65rem',
                                            height: 22,
                                        }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <Card
                        sx={{
                            borderRadius: '14px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                            border: '1px solid #E2E8F0',
                            p: 2.5,
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <Avatar sx={{ bgcolor: '#F5F3FF', color: '#8B5CF6', width: 36, height: 36 }}>
                                <TalentIcon sx={{ fontSize: '1.1rem' }} />
                            </Avatar>
                            <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1E293B', lineHeight: 1.2 }}>
                                    Talent Shortlists
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#64748B' }}>
                                    {data.talentShortlists.reduce((sum, t) => sum + t.candidates, 0)} candidates to review
                                </Typography>
                            </Box>
                        </Box>
                        <List disablePadding>
                            {data.talentShortlists.map((talent, i) => (
                                <ListItem
                                    key={i}
                                    sx={{
                                        px: 1.5,
                                        py: 1,
                                        borderRadius: '10px',
                                        mb: 0.5,
                                        '&:hover': { bgcolor: '#F8FAFC' },
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: 28 }}>
                                        <TalentIcon sx={{ fontSize: '1rem', color: '#8B5CF6' }} />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={talent.role}
                                        primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 500 }}
                                    />
                                    <Chip
                                        label={`${talent.candidates} candidates`}
                                        size="small"
                                        sx={{
                                            bgcolor: '#F5F3FF',
                                            color: '#8B5CF6',
                                            fontWeight: 600,
                                            fontSize: '0.65rem',
                                            height: 22,
                                        }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
