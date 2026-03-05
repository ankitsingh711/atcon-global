'use client';

import React, { useState } from 'react';
import {
    Box, Typography, Card, Grid, Avatar, Chip, Button, InputBase,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, LinearProgress,
} from '@mui/material';
import {
    Search as SearchIcon, Add as AddIcon,
    Description as FormIcon,
    CheckCircle as CompleteIcon,
    Schedule as PendingIcon,
} from '@mui/icons-material';

const forms = [
    { name: 'Client Onboarding Form', type: 'Intake', submissions: 24, status: 'Active', lastSubmission: 'Mar 5, 2026', completion: 85 },
    { name: 'Project Brief Template', type: 'Brief', submissions: 18, status: 'Active', lastSubmission: 'Mar 4, 2026', completion: 92 },
    { name: 'Freelancer Application', type: 'Application', submissions: 45, status: 'Active', lastSubmission: 'Mar 3, 2026', completion: 78 },
    { name: 'Feedback Survey', type: 'Survey', submissions: 12, status: 'Active', lastSubmission: 'Mar 2, 2026', completion: 65 },
    { name: 'NDA Agreement', type: 'Legal', submissions: 31, status: 'Active', lastSubmission: 'Mar 1, 2026', completion: 100 },
    { name: 'Q1 Performance Review', type: 'Review', submissions: 8, status: 'Draft', lastSubmission: '-', completion: 40 },
];

const sts: Record<string, { bg: string; text: string }> = { Active: { bg: '#DCFCE7', text: '#16A34A' }, Draft: { bg: '#FEF3C7', text: '#D97706' }, Closed: { bg: '#F1F5F9', text: '#64748B' } };

export default function FormsPage() {
    const [search, setSearch] = useState('');
    const filtered = forms.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <Box sx={{ px: 3.5, py: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B', fontSize: '1.5rem' }}>Forms & Intake</Typography>
                    <Typography variant="body2" sx={{ color: '#64748B' }}>{forms.length} forms</Typography>
                </Box>
                <Button variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: '#8B5CF6', borderRadius: '10px', textTransform: 'none', fontWeight: 600, '&:hover': { bgcolor: '#7C3AED' } }}>Create Form</Button>
            </Box>
            <Paper sx={{ display: 'flex', alignItems: 'center', px: 2, py: 0.5, borderRadius: '10px', border: '1px solid #E2E8F0', mb: 3, boxShadow: 'none' }}>
                <SearchIcon sx={{ color: '#94A3B8', mr: 1 }} />
                <InputBase placeholder="Search forms..." value={search} onChange={(e) => setSearch(e.target.value)} sx={{ flex: 1 }} />
            </Paper>
            <Paper sx={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid #E2E8F0', boxShadow: 'none' }}>
                <TableContainer>
                    <Table>
                        <TableHead><TableRow sx={{ bgcolor: '#F8FAFC' }}>
                            <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.78rem' }}>Form Name</TableCell>
                            <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.78rem' }}>Type</TableCell>
                            <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.78rem' }}>Submissions</TableCell>
                            <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.78rem' }}>Completion</TableCell>
                            <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.78rem' }}>Status</TableCell>
                        </TableRow></TableHead>
                        <TableBody>{filtered.map((f) => (
                            <TableRow key={f.name} hover>
                                <TableCell><Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}><Avatar sx={{ bgcolor: '#F5F3FF', color: '#8B5CF6', width: 32, height: 32 }}><FormIcon sx={{ fontSize: '1rem' }} /></Avatar><Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>{f.name}</Typography></Box></TableCell>
                                <TableCell><Chip label={f.type} size="small" sx={{ bgcolor: '#F1F5F9', color: '#475569', fontSize: '0.68rem', height: 22 }} /></TableCell>
                                <TableCell sx={{ fontWeight: 600, fontSize: '0.82rem' }}>{f.submissions}</TableCell>
                                <TableCell><Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: 100 }}><LinearProgress variant="determinate" value={f.completion} sx={{ flex: 1, height: 6, borderRadius: 3, bgcolor: '#E2E8F0', '& .MuiLinearProgress-bar': { borderRadius: 3, bgcolor: '#8B5CF6' } }} /><Typography variant="caption" sx={{ fontSize: '0.7rem', color: '#64748B' }}>{f.completion}%</Typography></Box></TableCell>
                                <TableCell><Chip label={f.status} size="small" sx={{ bgcolor: sts[f.status].bg, color: sts[f.status].text, fontWeight: 600, fontSize: '0.68rem', height: 22 }} /></TableCell>
                            </TableRow>
                        ))}</TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
}
