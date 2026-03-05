'use client';
import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Typography, Card, Chip, TextField, InputAdornment, LinearProgress,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

interface FormData { _id: string; name: string; type: string; submissions: number; status: string; completion: number; lastSubmission: string; }

const fst: Record<string, { bg: string; text: string }> = { Active: { bg: '#DCFCE7', text: '#16A34A' }, Draft: { bg: '#F1F5F9', text: '#64748B' }, Closed: { bg: '#FEE2E2', text: '#EF4444' } };

export default function FormsPage() {
    const [forms, setForms] = useState<FormData[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchForms = useCallback(async () => {
        try { setLoading(true); const res = await fetch('/api/forms'); const json = await res.json(); if (json.success) setForms(json.data); }
        catch { console.error('Failed to load forms'); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchForms(); }, [fetchForms]);

    const filtered = forms.filter((f) => !search || f.name.toLowerCase().includes(search.toLowerCase()));

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}><CircularProgress /></Box>;

    return (
        <Box>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B', fontSize: '1.5rem', mb: 0.5 }}>Forms & Intake</Typography>
                <Typography variant="body2" sx={{ color: '#64748B' }}>{forms.length} forms</Typography>
            </Box>
            <TextField fullWidth placeholder="Search forms..." value={search} onChange={(e) => setSearch(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#94A3B8' }} /></InputAdornment> }} sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#fff', '& fieldset': { borderColor: '#E2E8F0' } } }} />
            <Paper sx={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid #E2E8F0', boxShadow: 'none' }}>
                <TableContainer><Table>
                    <TableHead><TableRow sx={{ bgcolor: '#F8FAFC' }}>
                        {['Form', 'Type', 'Submissions', 'Completion', 'Last Submission', 'Status'].map((h) => <TableCell key={h} sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.78rem', textTransform: 'uppercase' }}>{h}</TableCell>)}
                    </TableRow></TableHead>
                    <TableBody>{filtered.map((f) => (
                        <TableRow key={f._id} hover>
                            <TableCell sx={{ fontWeight: 600, fontSize: '0.85rem' }}>{f.name}</TableCell>
                            <TableCell><Chip label={f.type} size="small" sx={{ bgcolor: '#EEF2FF', color: '#6366F1', fontWeight: 600, fontSize: '0.68rem', height: 22 }} /></TableCell>
                            <TableCell sx={{ fontWeight: 600, fontSize: '0.82rem' }}>{f.submissions}</TableCell>
                            <TableCell><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><LinearProgress variant="determinate" value={f.completion} sx={{ flex: 1, height: 6, borderRadius: 3, bgcolor: '#E2E8F0', '& .MuiLinearProgress-bar': { borderRadius: 3, bgcolor: f.completion === 100 ? '#16A34A' : '#6366F1' } }} /><Typography variant="caption" sx={{ fontWeight: 600 }}>{f.completion}%</Typography></Box></TableCell>
                            <TableCell sx={{ color: '#94A3B8', fontSize: '0.82rem' }}>{f.lastSubmission}</TableCell>
                            <TableCell><Chip label={f.status} size="small" sx={{ bgcolor: (fst[f.status] || fst['Active']).bg, color: (fst[f.status] || fst['Active']).text, fontWeight: 600, fontSize: '0.68rem', height: 22 }} /></TableCell>
                        </TableRow>
                    ))}</TableBody>
                </Table></TableContainer>
            </Paper>
        </Box>
    );
}
