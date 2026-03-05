'use client';

import React, { useState } from 'react';
import {
    Box, Typography, Card, Grid, Avatar, Chip, Button, InputBase,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
} from '@mui/material';
import {
    Search as SearchIcon, Add as AddIcon,
    ConfirmationNumber as TicketIcon,
    CheckCircle as ResolvedIcon,
} from '@mui/icons-material';

interface Ticket {
    id: string;
    title: string;
    client: string;
    priority: 'High' | 'Medium' | 'Low';
    status: 'Open' | 'In Progress' | 'Resolved';
    assignee: string;
    created: string;
}

const initialTickets: Ticket[] = [
    { id: 'TK-001', title: 'Access issue with project files', client: 'Acme Corporation', priority: 'High', status: 'Open', assignee: 'John Doe', created: 'Mar 5, 2026' },
    { id: 'TK-002', title: 'Invoice discrepancy for January', client: 'Global Finance Ltd', priority: 'Medium', status: 'In Progress', assignee: 'Lisa Patel', created: 'Mar 4, 2026' },
    { id: 'TK-003', title: 'Deployment failure on staging', client: 'Tech Startup Inc', priority: 'High', status: 'Open', assignee: 'David Kim', created: 'Mar 3, 2026' },
    { id: 'TK-004', title: 'Design feedback pending review', client: 'Creative Agency', priority: 'Low', status: 'In Progress', assignee: 'Emily Rodriguez', created: 'Mar 2, 2026' },
    { id: 'TK-005', title: 'API rate limiting issue', client: 'Acme Corporation', priority: 'Medium', status: 'Resolved', assignee: 'Mike Chen', created: 'Mar 1, 2026' },
    { id: 'TK-006', title: 'Login authentication timeout', client: 'Tech Startup Inc', priority: 'High', status: 'Resolved', assignee: 'James Wilson', created: 'Feb 28, 2026' },
];

const priorityStyles: Record<string, { bg: string; text: string }> = {
    High: { bg: '#FEE2E2', text: '#EF4444' },
    Medium: { bg: '#FEF3C7', text: '#D97706' },
    Low: { bg: '#DCFCE7', text: '#16A34A' },
};

const statusStyles: Record<string, { bg: string; text: string }> = {
    Open: { bg: '#FEE2E2', text: '#EF4444' },
    'In Progress': { bg: '#DBEAFE', text: '#2563EB' },
    Resolved: { bg: '#DCFCE7', text: '#16A34A' },
};

export default function SupportPage() {
    const [tickets, setTickets] = useState(initialTickets);
    const [search, setSearch] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [form, setForm] = useState({ title: '', client: '', priority: 'Medium' as const, assignee: '' });

    const filtered = tickets.filter((t) => t.title.toLowerCase().includes(search.toLowerCase()) || t.client.toLowerCase().includes(search.toLowerCase()));
    const openCount = tickets.filter((t) => t.status === 'Open').length;
    const inProgressCount = tickets.filter((t) => t.status === 'In Progress').length;
    const resolvedCount = tickets.filter((t) => t.status === 'Resolved').length;

    const handleAdd = () => {
        if (!form.title || !form.client) return;
        setTickets((prev) => [...prev, { ...form, id: `TK-${String(prev.length + 1).padStart(3, '0')}`, status: 'Open' as const, assignee: form.assignee || 'Unassigned', created: 'Mar 5, 2026', priority: form.priority as 'High' | 'Medium' | 'Low' }]);
        setForm({ title: '', client: '', priority: 'Medium', assignee: '' });
        setDialogOpen(false);
    };

    return (
        <Box sx={{ px: 3.5, py: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B', fontSize: '1.5rem' }}>Support</Typography>
                    <Typography variant="body2" sx={{ color: '#64748B' }}>{tickets.length} total tickets</Typography>
                </Box>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)} sx={{ bgcolor: '#EF4444', borderRadius: '10px', textTransform: 'none', fontWeight: 600, '&:hover': { bgcolor: '#DC2626' } }}>
                    New Ticket
                </Button>
            </Box>

            <Grid container spacing={2} sx={{ mb: 3 }}>
                {[{ label: 'Open', value: openCount, color: '#EF4444', bg: '#FEF2F2' }, { label: 'In Progress', value: inProgressCount, color: '#2563EB', bg: '#EFF6FF' }, { label: 'Resolved', value: resolvedCount, color: '#16A34A', bg: '#F0FDF4' }].map((s) => (
                    <Grid size={{ xs: 4 }} key={s.label}>
                        <Card sx={{ p: 2, borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: 'none', textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: s.color }}>{s.value}</Typography>
                            <Typography variant="caption" sx={{ color: '#64748B' }}>{s.label}</Typography>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Paper sx={{ display: 'flex', alignItems: 'center', px: 2, py: 0.5, borderRadius: '10px', border: '1px solid #E2E8F0', mb: 3, boxShadow: 'none' }}>
                <SearchIcon sx={{ color: '#94A3B8', mr: 1 }} />
                <InputBase placeholder="Search tickets..." value={search} onChange={(e) => setSearch(e.target.value)} sx={{ flex: 1, fontSize: '0.9rem' }} />
            </Paper>

            <Paper sx={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid #E2E8F0', boxShadow: 'none' }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                                <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.78rem' }}>ID</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.78rem' }}>Title</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.78rem' }}>Client</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.78rem' }}>Priority</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.78rem' }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.78rem' }}>Assignee</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.78rem' }}>Created</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filtered.map((ticket) => (
                                <TableRow key={ticket.id} hover>
                                    <TableCell sx={{ fontWeight: 600, color: '#6366F1', fontSize: '0.82rem' }}>{ticket.id}</TableCell>
                                    <TableCell sx={{ fontWeight: 500, color: '#1E293B', fontSize: '0.82rem' }}>{ticket.title}</TableCell>
                                    <TableCell sx={{ color: '#475569', fontSize: '0.82rem' }}>{ticket.client}</TableCell>
                                    <TableCell><Chip label={ticket.priority} size="small" sx={{ bgcolor: priorityStyles[ticket.priority].bg, color: priorityStyles[ticket.priority].text, fontWeight: 600, fontSize: '0.68rem', height: 22 }} /></TableCell>
                                    <TableCell><Chip label={ticket.status} size="small" sx={{ bgcolor: statusStyles[ticket.status].bg, color: statusStyles[ticket.status].text, fontWeight: 600, fontSize: '0.68rem', height: 22 }} /></TableCell>
                                    <TableCell sx={{ color: '#475569', fontSize: '0.82rem' }}>{ticket.assignee}</TableCell>
                                    <TableCell sx={{ color: '#94A3B8', fontSize: '0.82rem' }}>{ticket.created}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '16px' } }}>
                <DialogTitle sx={{ fontWeight: 700 }}>New Support Ticket</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '8px !important' }}>
                    <TextField label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required size="small" />
                    <TextField label="Client" value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} required size="small" />
                    <TextField select label="Priority" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as 'High' | 'Medium' | 'Low' })} size="small">
                        <MenuItem value="High">High</MenuItem>
                        <MenuItem value="Medium">Medium</MenuItem>
                        <MenuItem value="Low">Low</MenuItem>
                    </TextField>
                    <TextField label="Assignee" value={form.assignee} onChange={(e) => setForm({ ...form, assignee: e.target.value })} size="small" />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setDialogOpen(false)} sx={{ color: '#64748B' }}>Cancel</Button>
                    <Button variant="contained" onClick={handleAdd} sx={{ bgcolor: '#EF4444', '&:hover': { bgcolor: '#DC2626' } }}>Create Ticket</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
