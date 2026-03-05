'use client';
import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Typography, Card, Chip, Avatar, TextField, InputAdornment, Button, Tabs, Tab,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Snackbar, Alert, MenuItem,
} from '@mui/material';
import { Search as SearchIcon, Add as AddIcon } from '@mui/icons-material';

interface Person { _id: string; name: string; email: string; department: string; role: string; type: string; status: string; joinDate: string; color: string; }

const st: Record<string, { bg: string; text: string }> = { Active: { bg: '#DCFCE7', text: '#16A34A' }, 'On Leave': { bg: '#FEF3C7', text: '#D97706' }, Offboarded: { bg: '#FEE2E2', text: '#EF4444' } };

export default function PeoplePage() {
    const [people, setPeople] = useState<Person[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [tab, setTab] = useState(0);
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', department: '', role: '', type: 'Employee' });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    const fetchPeople = useCallback(async () => {
        try { setLoading(true); const res = await fetch('/api/people'); const json = await res.json(); if (json.success) setPeople(json.data); }
        catch { setSnackbar({ open: true, message: 'Failed to load people', severity: 'error' }); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchPeople(); }, [fetchPeople]);

    const handleCreate = async () => {
        if (!form.name || !form.email) return;
        try {
            const res = await fetch('/api/people', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
            const json = await res.json();
            if (json.success) { setOpen(false); setForm({ name: '', email: '', department: '', role: '', type: 'Employee' }); fetchPeople(); setSnackbar({ open: true, message: 'Person added', severity: 'success' }); }
        } catch { setSnackbar({ open: true, message: 'Failed to add person', severity: 'error' }); }
    };

    const filtered = people.filter((p) => {
        const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.email.toLowerCase().includes(search.toLowerCase());
        const matchesTab = tab === 0 || (tab === 1 && p.type === 'Employee') || (tab === 2 && p.type === 'Contractor');
        return matchesSearch && matchesTab;
    });
    const counts = { all: people.length, employees: people.filter((p) => p.type === 'Employee').length, contractors: people.filter((p) => p.type === 'Contractor').length };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}><CircularProgress /></Box>;

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Box><Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B', fontSize: '1.5rem', mb: 0.5 }}>People</Typography><Typography variant="body2" sx={{ color: '#64748B' }}>{counts.all} team members</Typography></Box>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)} sx={{ bgcolor: '#2563EB', '&:hover': { bgcolor: '#1D4ED8' }, borderRadius: '10px', textTransform: 'none', fontWeight: 600 }}>Add Person</Button>
            </Box>
            <TextField fullWidth placeholder="Search people..." value={search} onChange={(e) => setSearch(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#94A3B8' }} /></InputAdornment> }} sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#fff', '& fieldset': { borderColor: '#E2E8F0' } } }} />
            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3, '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '0.85rem' }, '& .Mui-selected': { color: '#2563EB' }, '& .MuiTabs-indicator': { backgroundColor: '#2563EB' } }}>
                <Tab label={`All (${counts.all})`} /><Tab label={`Employees (${counts.employees})`} /><Tab label={`Contractors (${counts.contractors})`} />
            </Tabs>
            <Paper sx={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid #E2E8F0', boxShadow: 'none' }}>
                <TableContainer><Table>
                    <TableHead><TableRow sx={{ bgcolor: '#F8FAFC' }}>
                        {['Name', 'Department', 'Role', 'Type', 'Status'].map((h) => <TableCell key={h} sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.78rem', textTransform: 'uppercase' }}>{h}</TableCell>)}
                    </TableRow></TableHead>
                    <TableBody>{filtered.map((p) => (
                        <TableRow key={p._id} hover>
                            <TableCell><Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}><Avatar sx={{ bgcolor: p.color, width: 32, height: 32, fontSize: '0.75rem', fontWeight: 600 }}>{p.name.split(' ').map((n) => n[0]).join('')}</Avatar><Box><Typography variant="body2" sx={{ fontWeight: 500 }}>{p.name}</Typography><Typography variant="caption" sx={{ color: '#94A3B8' }}>{p.email}</Typography></Box></Box></TableCell>
                            <TableCell sx={{ color: '#475569', fontSize: '0.82rem' }}>{p.department}</TableCell>
                            <TableCell sx={{ color: '#475569', fontSize: '0.82rem' }}>{p.role}</TableCell>
                            <TableCell><Chip label={p.type} size="small" sx={{ bgcolor: p.type === 'Employee' ? '#DBEAFE' : '#EDE9FE', color: p.type === 'Employee' ? '#2563EB' : '#7C3AED', fontWeight: 600, fontSize: '0.68rem', height: 22 }} /></TableCell>
                            <TableCell><Chip label={p.status} size="small" sx={{ bgcolor: (st[p.status] || st['Active']).bg, color: (st[p.status] || st['Active']).text, fontWeight: 600, fontSize: '0.68rem', height: 22 }} /></TableCell>
                        </TableRow>
                    ))}</TableBody>
                </Table></TableContainer>
            </Paper>
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '16px' } }}>
                <DialogTitle sx={{ fontWeight: 700 }}>Add Person</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '8px !important' }}>
                    <TextField label="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required fullWidth />
                    <TextField label="Email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required fullWidth />
                    <TextField label="Department" value={form.department} onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))} fullWidth />
                    <TextField label="Role" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} fullWidth />
                    <TextField select label="Type" value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))} fullWidth>
                        <MenuItem value="Employee">Employee</MenuItem><MenuItem value="Contractor">Contractor</MenuItem>
                    </TextField>
                </DialogContent>
                <DialogActions sx={{ p: 2.5 }}>
                    <Button onClick={() => setOpen(false)} sx={{ textTransform: 'none' }}>Cancel</Button>
                    <Button variant="contained" onClick={handleCreate} sx={{ bgcolor: '#2563EB', '&:hover': { bgcolor: '#1D4ED8' }, textTransform: 'none', borderRadius: '10px' }}>Add</Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar((s) => ({ ...s, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}><Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert></Snackbar>
        </Box>
    );
}
