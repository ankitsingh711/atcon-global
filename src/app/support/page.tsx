'use client';
import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Typography, Card, Grid, Chip, TextField, InputAdornment, Button,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Snackbar, Alert, MenuItem,
} from '@mui/material';
import { Search as SearchIcon, Add as AddIcon } from '@mui/icons-material';

interface Ticket { _id: string; ticketId: string; title: string; client: string; priority: string; status: string; assignee: string; createdAt: string; }

const pst: Record<string, { bg: string; text: string }> = { High: { bg: '#FEE2E2', text: '#EF4444' }, Medium: { bg: '#FEF3C7', text: '#D97706' }, Low: { bg: '#DCFCE7', text: '#16A34A' } };
const sst: Record<string, { bg: string; text: string }> = { Open: { bg: '#FEE2E2', text: '#EF4444' }, 'In Progress': { bg: '#DBEAFE', text: '#2563EB' }, Resolved: { bg: '#DCFCE7', text: '#16A34A' } };

export default function SupportPage() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({ title: '', client: '', priority: 'Medium', assignee: '' });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    const fetchTickets = useCallback(async () => {
        try { setLoading(true); const res = await fetch('/api/support'); const json = await res.json(); if (json.success) setTickets(json.data); }
        catch { setSnackbar({ open: true, message: 'Failed to load tickets', severity: 'error' }); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchTickets(); }, [fetchTickets]);

    const handleCreate = async () => {
        if (!form.title || !form.client) return;
        try {
            const res = await fetch('/api/support', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
            const json = await res.json();
            if (json.success) { setOpen(false); setForm({ title: '', client: '', priority: 'Medium', assignee: '' }); fetchTickets(); setSnackbar({ open: true, message: 'Ticket created', severity: 'success' }); }
        } catch { setSnackbar({ open: true, message: 'Failed to create ticket', severity: 'error' }); }
    };

    const filtered = tickets.filter((t) => !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.client.toLowerCase().includes(search.toLowerCase()));
    const counts = { open: tickets.filter((t) => t.status === 'Open').length, inProgress: tickets.filter((t) => t.status === 'In Progress').length, resolved: tickets.filter((t) => t.status === 'Resolved').length };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}><CircularProgress /></Box>;

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Box><Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B', fontSize: '1.5rem', mb: 0.5 }}>Support</Typography><Typography variant="body2" sx={{ color: '#64748B' }}>{tickets.length} total tickets</Typography></Box>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)} sx={{ bgcolor: '#EF4444', '&:hover': { bgcolor: '#DC2626' }, borderRadius: '10px', textTransform: 'none', fontWeight: 600 }}>Create Ticket</Button>
            </Box>
            <Grid container spacing={2} sx={{ mb: 3 }}>
                {[{ l: 'Open', v: counts.open, c: '#EF4444', bg: '#FEE2E2' }, { l: 'In Progress', v: counts.inProgress, c: '#2563EB', bg: '#DBEAFE' }, { l: 'Resolved', v: counts.resolved, c: '#16A34A', bg: '#DCFCE7' }].map((s) => (
                    <Grid size={{ xs: 12, sm: 4 }} key={s.l}><Card sx={{ p: 2, borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: 'none', textAlign: 'center' }}><Typography variant="caption" sx={{ color: '#64748B' }}>{s.l}</Typography><Typography variant="h4" sx={{ fontWeight: 700, color: s.c }}>{s.v}</Typography></Card></Grid>
                ))}
            </Grid>
            <TextField fullWidth placeholder="Search tickets..." value={search} onChange={(e) => setSearch(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#94A3B8' }} /></InputAdornment> }} sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#fff', '& fieldset': { borderColor: '#E2E8F0' } } }} />
            <Paper sx={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid #E2E8F0', boxShadow: 'none' }}>
                <TableContainer><Table>
                    <TableHead><TableRow sx={{ bgcolor: '#F8FAFC' }}>
                        {['Ticket', 'Title', 'Client', 'Priority', 'Status', 'Assignee'].map((h) => <TableCell key={h} sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.78rem', textTransform: 'uppercase' }}>{h}</TableCell>)}
                    </TableRow></TableHead>
                    <TableBody>{filtered.map((t) => (
                        <TableRow key={t._id} hover>
                            <TableCell sx={{ fontWeight: 600, color: '#6366F1', fontSize: '0.82rem' }}>{t.ticketId}</TableCell>
                            <TableCell sx={{ fontWeight: 500, fontSize: '0.82rem' }}>{t.title}</TableCell>
                            <TableCell sx={{ color: '#475569', fontSize: '0.82rem' }}>{t.client}</TableCell>
                            <TableCell><Chip label={t.priority} size="small" sx={{ bgcolor: (pst[t.priority] || pst['Medium']).bg, color: (pst[t.priority] || pst['Medium']).text, fontWeight: 600, fontSize: '0.68rem', height: 22 }} /></TableCell>
                            <TableCell><Chip label={t.status} size="small" sx={{ bgcolor: (sst[t.status] || sst['Open']).bg, color: (sst[t.status] || sst['Open']).text, fontWeight: 600, fontSize: '0.68rem', height: 22 }} /></TableCell>
                            <TableCell sx={{ color: '#475569', fontSize: '0.82rem' }}>{t.assignee}</TableCell>
                        </TableRow>
                    ))}</TableBody>
                </Table></TableContainer>
            </Paper>
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '16px' } }}>
                <DialogTitle sx={{ fontWeight: 700 }}>Create Support Ticket</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '8px !important' }}>
                    <TextField label="Title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required fullWidth />
                    <TextField label="Client" value={form.client} onChange={(e) => setForm((f) => ({ ...f, client: e.target.value }))} required fullWidth />
                    <TextField select label="Priority" value={form.priority} onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))} fullWidth>
                        <MenuItem value="High">High</MenuItem><MenuItem value="Medium">Medium</MenuItem><MenuItem value="Low">Low</MenuItem>
                    </TextField>
                    <TextField label="Assignee" value={form.assignee} onChange={(e) => setForm((f) => ({ ...f, assignee: e.target.value }))} fullWidth />
                </DialogContent>
                <DialogActions sx={{ p: 2.5 }}>
                    <Button onClick={() => setOpen(false)} sx={{ textTransform: 'none' }}>Cancel</Button>
                    <Button variant="contained" onClick={handleCreate} sx={{ bgcolor: '#EF4444', '&:hover': { bgcolor: '#DC2626' }, textTransform: 'none', borderRadius: '10px' }}>Create</Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar((s) => ({ ...s, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}><Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert></Snackbar>
        </Box>
    );
}
