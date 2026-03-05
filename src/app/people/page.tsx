'use client';

import React, { useState } from 'react';
import {
    Box, Typography, Card, Avatar, Chip, Button, InputBase, IconButton,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Tabs, Tab,
} from '@mui/material';
import { Search as SearchIcon, Add as AddIcon, MoreVert as MoreIcon } from '@mui/icons-material';

interface Person {
    name: string;
    email: string;
    department: string;
    role: string;
    type: 'Employee' | 'Contractor';
    status: 'Active' | 'On Leave' | 'Offboarded';
    joinDate: string;
    avatar: string;
    color: string;
}

const initialPeople: Person[] = [
    { name: 'John Doe', email: 'john@atcon.com', department: 'Engineering', role: 'Senior Developer', type: 'Employee', status: 'Active', joinDate: 'Jan 2024', avatar: 'JD', color: '#3B82F6' },
    { name: 'Sarah Johnson', email: 'sarah@atcon.com', department: 'Design', role: 'Lead Designer', type: 'Contractor', status: 'Active', joinDate: 'Mar 2024', avatar: 'SJ', color: '#EC4899' },
    { name: 'Mike Chen', email: 'mike@atcon.com', department: 'Engineering', role: 'Backend Developer', type: 'Employee', status: 'Active', joinDate: 'Jun 2024', avatar: 'MC', color: '#F59E0B' },
    { name: 'Emily Rodriguez', email: 'emily@atcon.com', department: 'Marketing', role: 'Marketing Manager', type: 'Employee', status: 'On Leave', joinDate: 'Feb 2024', avatar: 'ER', color: '#10B981' },
    { name: 'David Kim', email: 'david@atcon.com', department: 'Operations', role: 'DevOps Lead', type: 'Employee', status: 'Active', joinDate: 'Aug 2023', avatar: 'DK', color: '#8B5CF6' },
    { name: 'Lisa Patel', email: 'lisa@atcon.com', department: 'Finance', role: 'Financial Analyst', type: 'Employee', status: 'Active', joinDate: 'Nov 2024', avatar: 'LP', color: '#6366F1' },
    { name: 'James Wilson', email: 'james@atcon.com', department: 'Engineering', role: 'Mobile Developer', type: 'Contractor', status: 'Active', joinDate: 'Sep 2024', avatar: 'JW', color: '#EF4444' },
];

const statusStyles: Record<string, { bg: string; text: string }> = {
    Active: { bg: '#DCFCE7', text: '#16A34A' },
    'On Leave': { bg: '#FEF3C7', text: '#D97706' },
    Offboarded: { bg: '#F1F5F9', text: '#64748B' },
};

export default function PeoplePage() {
    const [people, setPeople] = useState(initialPeople);
    const [search, setSearch] = useState('');
    const [tab, setTab] = useState(0);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', department: '', role: '', type: 'Employee' as const, status: 'Active' as const });

    const filtered = people.filter((p) => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.department.toLowerCase().includes(search.toLowerCase());
        if (tab === 1) return matchesSearch && p.type === 'Employee';
        if (tab === 2) return matchesSearch && p.type === 'Contractor';
        return matchesSearch;
    });

    const handleAdd = () => {
        if (!form.name || !form.email) return;
        const colors = ['#6366F1', '#3B82F6', '#EC4899', '#10B981', '#F59E0B'];
        setPeople((prev) => [...prev, { ...form, joinDate: 'Mar 2026', avatar: form.name.split(' ').map((n) => n[0]).join(''), color: colors[Math.floor(Math.random() * colors.length)] }]);
        setForm({ name: '', email: '', department: '', role: '', type: 'Employee', status: 'Active' });
        setDialogOpen(false);
    };

    return (
        <Box sx={{ px: 3.5, py: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B', fontSize: '1.5rem' }}>People</Typography>
                    <Typography variant="body2" sx={{ color: '#64748B' }}>{people.length} team members</Typography>
                </Box>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)} sx={{ bgcolor: '#3B82F6', borderRadius: '10px', textTransform: 'none', fontWeight: 600, '&:hover': { bgcolor: '#2563EB' } }}>
                    Add Person
                </Button>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Paper sx={{ display: 'flex', alignItems: 'center', px: 2, py: 0.5, borderRadius: '10px', border: '1px solid #E2E8F0', flex: 1, boxShadow: 'none' }}>
                    <SearchIcon sx={{ color: '#94A3B8', mr: 1 }} />
                    <InputBase placeholder="Search people..." value={search} onChange={(e) => setSearch(e.target.value)} sx={{ flex: 1, fontSize: '0.9rem' }} />
                </Paper>
            </Box>

            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3, '& .MuiTab-root': { textTransform: 'none', fontWeight: 500, fontSize: '0.85rem' }, '& .Mui-selected': { color: '#3B82F6 !important' }, '& .MuiTabs-indicator': { bgcolor: '#3B82F6' } }}>
                <Tab label={`All (${people.length})`} />
                <Tab label={`Employees (${people.filter((p) => p.type === 'Employee').length})`} />
                <Tab label={`Contractors (${people.filter((p) => p.type === 'Contractor').length})`} />
            </Tabs>

            <Paper sx={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid #E2E8F0', boxShadow: 'none' }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                                <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.78rem' }}>Name</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.78rem' }}>Department</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.78rem' }}>Role</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.78rem' }}>Type</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.78rem' }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.78rem' }}>Joined</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filtered.map((person, i) => (
                                <TableRow key={i} hover sx={{ '&:hover': { bgcolor: '#FAFAFA' } }}>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <Avatar sx={{ bgcolor: person.color, width: 34, height: 34, fontSize: '0.75rem', fontWeight: 600 }}>{person.avatar}</Avatar>
                                            <Box>
                                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#1E293B', fontSize: '0.85rem' }}>{person.name}</Typography>
                                                <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.72rem' }}>{person.email}</Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ fontSize: '0.82rem', color: '#475569' }}>{person.department}</TableCell>
                                    <TableCell sx={{ fontSize: '0.82rem', color: '#475569' }}>{person.role}</TableCell>
                                    <TableCell><Chip label={person.type} size="small" sx={{ bgcolor: person.type === 'Employee' ? '#EFF6FF' : '#FEF3C7', color: person.type === 'Employee' ? '#2563EB' : '#D97706', fontWeight: 600, fontSize: '0.68rem', height: 22 }} /></TableCell>
                                    <TableCell><Chip label={person.status} size="small" sx={{ bgcolor: statusStyles[person.status].bg, color: statusStyles[person.status].text, fontWeight: 600, fontSize: '0.68rem', height: 22 }} /></TableCell>
                                    <TableCell sx={{ fontSize: '0.82rem', color: '#94A3B8' }}>{person.joinDate}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '16px' } }}>
                <DialogTitle sx={{ fontWeight: 700 }}>Add Person</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '8px !important' }}>
                    <TextField label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required size="small" />
                    <TextField label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required size="small" />
                    <TextField label="Department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} size="small" />
                    <TextField label="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} size="small" />
                    <TextField select label="Type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as 'Employee' | 'Contractor' })} size="small">
                        <MenuItem value="Employee">Employee</MenuItem>
                        <MenuItem value="Contractor">Contractor</MenuItem>
                    </TextField>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setDialogOpen(false)} sx={{ color: '#64748B' }}>Cancel</Button>
                    <Button variant="contained" onClick={handleAdd} sx={{ bgcolor: '#3B82F6', '&:hover': { bgcolor: '#2563EB' } }}>Add</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
