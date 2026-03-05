'use client';
import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Typography, Card, Grid, Chip, Avatar, TextField, InputAdornment, Button, Tabs, Tab,
    Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Snackbar, Alert,
} from '@mui/material';
import { Search as SearchIcon, Add as AddIcon, Star as StarIcon } from '@mui/icons-material';

interface Talent {
    _id: string; name: string; role: string; skills: string[]; experience: string;
    rate: string; availability: string; rating: number; color: string;
}

export default function TalentPage() {
    const [talent, setTalent] = useState<Talent[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [tab, setTab] = useState(0);
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({ name: '', role: '', skills: '', experience: '', rate: '' });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    const fetchTalent = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/talent');
            const json = await res.json();
            if (json.success) setTalent(json.data);
        } catch { setSnackbar({ open: true, message: 'Failed to load talent', severity: 'error' }); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchTalent(); }, [fetchTalent]);

    const handleCreate = async () => {
        if (!form.name || !form.role) return;
        try {
            const res = await fetch('/api/talent', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
            const json = await res.json();
            if (json.success) { setOpen(false); setForm({ name: '', role: '', skills: '', experience: '', rate: '' }); fetchTalent(); setSnackbar({ open: true, message: 'Talent added successfully', severity: 'success' }); }
        } catch { setSnackbar({ open: true, message: 'Failed to add talent', severity: 'error' }); }
    };

    const filtered = talent.filter((t) => {
        const matchesSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.role.toLowerCase().includes(search.toLowerCase());
        const matchesTab = tab === 0 || (tab === 1 && t.availability === 'Available') || (tab === 2 && t.availability === 'On Project');
        return matchesSearch && matchesTab;
    });

    const counts = { all: talent.length, available: talent.filter((t) => t.availability === 'Available').length, onProject: talent.filter((t) => t.availability === 'On Project').length };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}><CircularProgress /></Box>;

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Box><Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B', fontSize: '1.5rem', mb: 0.5 }}>Talent Pool</Typography><Typography variant="body2" sx={{ color: '#64748B' }}>{counts.all} professionals available</Typography></Box>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)} sx={{ bgcolor: '#2563EB', '&:hover': { bgcolor: '#1D4ED8' }, borderRadius: '10px', textTransform: 'none', fontWeight: 600 }}>Add Talent</Button>
            </Box>
            <TextField fullWidth placeholder="Search talent..." value={search} onChange={(e) => setSearch(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#94A3B8' }} /></InputAdornment> }} sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#fff', '& fieldset': { borderColor: '#E2E8F0' } } }} />
            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3, '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '0.85rem' }, '& .Mui-selected': { color: '#2563EB' }, '& .MuiTabs-indicator': { backgroundColor: '#2563EB' } }}>
                <Tab label={`All (${counts.all})`} /><Tab label={`Available (${counts.available})`} /><Tab label={`On Project (${counts.onProject})`} />
            </Tabs>
            <Grid container spacing={2.5}>
                {filtered.map((t) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={t._id}>
                        <Card sx={{ p: 2.5, borderRadius: '14px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }, transition: 'box-shadow 0.2s' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <Avatar sx={{ bgcolor: t.color, width: 40, height: 40, fontWeight: 600, fontSize: '0.85rem' }}>{t.name.split(' ').map((n) => n[0]).join('')}</Avatar>
                                    <Box><Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{t.name}</Typography><Typography variant="caption" sx={{ color: '#64748B' }}>{t.role}</Typography></Box>
                                </Box>
                                <Chip label={t.availability} size="small" sx={{ bgcolor: t.availability === 'Available' ? '#DCFCE7' : '#FEF3C7', color: t.availability === 'Available' ? '#16A34A' : '#D97706', fontWeight: 600, fontSize: '0.65rem', height: 22 }} />
                            </Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>{t.skills.map((s) => <Chip key={s} label={s} size="small" sx={{ bgcolor: '#F1F5F9', fontSize: '0.68rem', height: 22 }} />)}</Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><StarIcon sx={{ fontSize: '0.9rem', color: '#F59E0B' }} /><Typography variant="caption" sx={{ fontWeight: 600 }}>{t.rating}</Typography><Typography variant="caption" sx={{ color: '#94A3B8', ml: 1 }}>{t.experience}</Typography></Box>
                                <Typography variant="body2" sx={{ fontWeight: 700 }}>{t.rate}</Typography>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '16px' } }}>
                <DialogTitle sx={{ fontWeight: 700 }}>Add Talent</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '8px !important' }}>
                    <TextField label="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required fullWidth />
                    <TextField label="Role" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} required fullWidth />
                    <TextField label="Skills (comma separated)" value={form.skills} onChange={(e) => setForm((f) => ({ ...f, skills: e.target.value }))} fullWidth />
                    <TextField label="Experience" value={form.experience} onChange={(e) => setForm((f) => ({ ...f, experience: e.target.value }))} fullWidth placeholder="e.g., 5 years" />
                    <TextField label="Rate" value={form.rate} onChange={(e) => setForm((f) => ({ ...f, rate: e.target.value }))} fullWidth placeholder="e.g., $80/hr" />
                </DialogContent>
                <DialogActions sx={{ p: 2.5 }}>
                    <Button onClick={() => setOpen(false)} sx={{ textTransform: 'none' }}>Cancel</Button>
                    <Button variant="contained" onClick={handleCreate} sx={{ bgcolor: '#2563EB', '&:hover': { bgcolor: '#1D4ED8' }, textTransform: 'none', borderRadius: '10px' }}>Add</Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar((s) => ({ ...s, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
            </Snackbar>
        </Box>
    );
}
