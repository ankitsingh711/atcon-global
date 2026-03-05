'use client';

import React, { useState } from 'react';
import {
    Box, Typography, Card, Avatar, Chip, Grid, Button, InputBase, IconButton,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
    Tabs, Tab, LinearProgress,
} from '@mui/material';
import {
    Search as SearchIcon, Add as AddIcon, Star as StarIcon,
    WorkOutline as WorkIcon, FilterList as FilterIcon,
} from '@mui/icons-material';

interface TalentPerson {
    name: string;
    role: string;
    skills: string[];
    experience: string;
    rate: string;
    availability: string;
    rating: number;
    avatar: string;
    color: string;
}

const initialTalent: TalentPerson[] = [
    { name: 'Sarah Johnson', role: 'Senior React Developer', skills: ['React', 'TypeScript', 'Node.js'], experience: '8 years', rate: '$95/hr', availability: 'Available', rating: 4.9, avatar: 'SJ', color: '#6366F1' },
    { name: 'Mike Chen', role: 'Full Stack Developer', skills: ['Python', 'Django', 'React'], experience: '6 years', rate: '$85/hr', availability: 'Available', rating: 4.7, avatar: 'MC', color: '#F59E0B' },
    { name: 'Emily Rodriguez', role: 'UI/UX Designer', skills: ['Figma', 'Sketch', 'Adobe XD'], experience: '5 years', rate: '$80/hr', availability: 'On Project', rating: 4.8, avatar: 'ER', color: '#EC4899' },
    { name: 'David Kim', role: 'DevOps Engineer', skills: ['AWS', 'Docker', 'Kubernetes'], experience: '7 years', rate: '$100/hr', availability: 'Available', rating: 4.6, avatar: 'DK', color: '#10B981' },
    { name: 'Lisa Patel', role: 'Data Scientist', skills: ['Python', 'TensorFlow', 'SQL'], experience: '4 years', rate: '$90/hr', availability: 'On Project', rating: 4.5, avatar: 'LP', color: '#8B5CF6' },
    { name: 'James Wilson', role: 'Mobile Developer', skills: ['React Native', 'Swift', 'Kotlin'], experience: '5 years', rate: '$88/hr', availability: 'Available', rating: 4.7, avatar: 'JW', color: '#3B82F6' },
];

export default function TalentPage() {
    const [talent, setTalent] = useState(initialTalent);
    const [search, setSearch] = useState('');
    const [tab, setTab] = useState(0);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [form, setForm] = useState({ name: '', role: '', skills: '', experience: '', rate: '', availability: 'Available' });

    const filtered = talent.filter((t) => {
        const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.role.toLowerCase().includes(search.toLowerCase());
        if (tab === 1) return matchesSearch && t.availability === 'Available';
        if (tab === 2) return matchesSearch && t.availability === 'On Project';
        return matchesSearch;
    });

    const handleAdd = () => {
        if (!form.name || !form.role) return;
        const colors = ['#6366F1', '#F59E0B', '#EC4899', '#10B981', '#8B5CF6', '#3B82F6'];
        setTalent((prev) => [...prev, {
            ...form,
            skills: form.skills.split(',').map((s) => s.trim()),
            rating: 4.5,
            avatar: form.name.split(' ').map((n) => n[0]).join(''),
            color: colors[Math.floor(Math.random() * colors.length)],
        }]);
        setForm({ name: '', role: '', skills: '', experience: '', rate: '', availability: 'Available' });
        setDialogOpen(false);
    };

    return (
        <Box sx={{ px: 3.5, py: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B', fontSize: '1.5rem' }}>Talent Pool</Typography>
                    <Typography variant="body2" sx={{ color: '#64748B' }}>{talent.length} professionals available</Typography>
                </Box>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)} sx={{ bgcolor: '#6366F1', borderRadius: '10px', textTransform: 'none', fontWeight: 600, '&:hover': { bgcolor: '#4F46E5' } }}>
                    Add Talent
                </Button>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Paper sx={{ display: 'flex', alignItems: 'center', px: 2, py: 0.5, borderRadius: '10px', border: '1px solid #E2E8F0', flex: 1, boxShadow: 'none' }}>
                    <SearchIcon sx={{ color: '#94A3B8', mr: 1 }} />
                    <InputBase placeholder="Search talent..." value={search} onChange={(e) => setSearch(e.target.value)} sx={{ flex: 1, fontSize: '0.9rem' }} />
                </Paper>
            </Box>

            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3, '& .MuiTab-root': { textTransform: 'none', fontWeight: 500, fontSize: '0.85rem' }, '& .Mui-selected': { color: '#6366F1 !important' }, '& .MuiTabs-indicator': { bgcolor: '#6366F1' } }}>
                <Tab label={`All (${talent.length})`} />
                <Tab label={`Available (${talent.filter((t) => t.availability === 'Available').length})`} />
                <Tab label={`On Project (${talent.filter((t) => t.availability === 'On Project').length})`} />
            </Tabs>

            <Grid container spacing={2.5}>
                {filtered.map((person, i) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                        <Card sx={{ p: 2.5, borderRadius: '14px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }, transition: 'box-shadow 0.2s' }}>
                            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                <Avatar sx={{ bgcolor: person.color, width: 48, height: 48, fontWeight: 600 }}>{person.avatar}</Avatar>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1E293B', fontSize: '0.9rem' }}>{person.name}</Typography>
                                    <Typography variant="caption" sx={{ color: '#64748B' }}>{person.role}</Typography>
                                </Box>
                                <Chip label={person.availability} size="small" sx={{ bgcolor: person.availability === 'Available' ? '#DCFCE7' : '#FEF3C7', color: person.availability === 'Available' ? '#16A34A' : '#D97706', fontWeight: 600, fontSize: '0.65rem', height: 22 }} />
                            </Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1.5 }}>
                                {person.skills.map((s) => <Chip key={s} label={s} size="small" sx={{ bgcolor: '#F1F5F9', color: '#475569', fontSize: '0.65rem', height: 22 }} />)}
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <StarIcon sx={{ color: '#F59E0B', fontSize: '1rem' }} />
                                    <Typography variant="caption" sx={{ fontWeight: 600 }}>{person.rating}</Typography>
                                </Box>
                                <Typography variant="caption" sx={{ color: '#64748B' }}>{person.experience}</Typography>
                                <Typography variant="caption" sx={{ fontWeight: 700, color: '#1E293B' }}>{person.rate}</Typography>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '16px' } }}>
                <DialogTitle sx={{ fontWeight: 700 }}>Add Talent</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '8px !important' }}>
                    <TextField label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required size="small" />
                    <TextField label="Role / Title" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required size="small" />
                    <TextField label="Skills (comma separated)" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} size="small" />
                    <TextField label="Experience" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} size="small" />
                    <TextField label="Hourly Rate" value={form.rate} onChange={(e) => setForm({ ...form, rate: e.target.value })} size="small" />
                    <TextField select label="Availability" value={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.value })} size="small">
                        <MenuItem value="Available">Available</MenuItem>
                        <MenuItem value="On Project">On Project</MenuItem>
                    </TextField>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setDialogOpen(false)} sx={{ color: '#64748B' }}>Cancel</Button>
                    <Button variant="contained" onClick={handleAdd} sx={{ bgcolor: '#6366F1', '&:hover': { bgcolor: '#4F46E5' } }}>Add</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
