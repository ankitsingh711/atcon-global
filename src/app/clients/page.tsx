'use client';

import React, { useState } from 'react';
import {
    Box, Typography, Card, Avatar, Chip, Button, InputBase, IconButton,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
} from '@mui/material';
import { Search as SearchIcon, Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';

interface Client {
    name: string;
    industry: string;
    contact: string;
    email: string;
    projects: number;
    revenue: string;
    status: string;
    avatar: string;
    color: string;
}

const avatarColors = ['#6366F1', '#16A34A', '#F59E0B', '#EF4444', '#3B82F6', '#7C3AED', '#EC4899', '#14B8A6'];

const initialClients: Client[] = [
    { name: 'Acme Corporation', industry: 'Technology', contact: 'Jennifer Davis', email: 'jennifer@acme.com', projects: 3, revenue: '$158K', status: 'Active', avatar: 'AC', color: '#6366F1' },
    { name: 'Tech Startup Inc', industry: 'SaaS', contact: 'Robert Chen', email: 'robert@techstart.io', projects: 1, revenue: '$85K', status: 'Active', avatar: 'TS', color: '#16A34A' },
    { name: 'Local Retail Co', industry: 'Retail', contact: 'Lisa Martinez', email: 'lisa@retail.com', projects: 2, revenue: '$43K', status: 'Active', avatar: 'LR', color: '#F59E0B' },
    { name: 'Global Finance Ltd', industry: 'Finance', contact: 'David Park', email: 'david@finance.com', projects: 1, revenue: '$120K', status: 'Inactive', avatar: 'GF', color: '#EF4444' },
    { name: 'Creative Agency', industry: 'Design', contact: 'Emma Wilson', email: 'emma@creative.co', projects: 2, revenue: '$50K', status: 'Active', avatar: 'CA', color: '#3B82F6' },
    { name: 'Solutions Corp', industry: 'Consulting', contact: 'James Taylor', email: 'james@solutions.com', projects: 0, revenue: '$0', status: 'Prospect', avatar: 'SC', color: '#7C3AED' },
];

const emptyClient = { name: '', industry: '', contact: '', email: '', status: 'Active' };

export default function ClientsPage() {
    const [clients, setClients] = useState<Client[]>(initialClients);
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState(emptyClient);
    const [search, setSearch] = useState('');

    const filtered = search
        ? clients.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.industry.toLowerCase().includes(search.toLowerCase()) || c.contact.toLowerCase().includes(search.toLowerCase()))
        : clients;

    const handleCreate = () => {
        if (!form.name || !form.email) return;
        const initials = form.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
        const color = avatarColors[clients.length % avatarColors.length];
        setClients((prev) => [...prev, { ...form, projects: 0, revenue: '$0', avatar: initials, color }]);
        setForm(emptyClient);
        setOpen(false);
    };

    return (
        <Box sx={{ px: 3.5, py: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B', fontSize: '1.6rem', mb: 0.5 }}>Clients</Typography>
                    <Typography variant="subtitle1" sx={{ color: '#64748B', fontSize: '0.9rem' }}>Manage your client relationships</Typography>
                </Box>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)} sx={{ backgroundColor: '#16A34A', '&:hover': { backgroundColor: '#15803D' } }}>Add Client</Button>
            </Box>

            {/* Search */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid #E2E8F0', px: 1.5, py: 0.5, maxWidth: 400, '&:focus-within': { borderColor: '#16A34A', boxShadow: '0 0 0 3px rgba(22, 163, 74, 0.1)' } }}>
                <SearchIcon sx={{ color: '#94A3B8', fontSize: '1.2rem', mr: 1 }} />
                <InputBase placeholder="Search clients..." sx={{ fontSize: '0.85rem', flex: 1 }} value={search} onChange={(e) => setSearch(e.target.value)} />
            </Box>

            {/* Client Cards */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 2.5 }}>
                {filtered.map((client, idx) => (
                    <Card
                        key={`${client.name}-${idx}`}
                        sx={{
                            p: 3, cursor: 'pointer', transition: 'all 0.2s ease',
                            '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' },
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Avatar sx={{ width: 44, height: 44, bgcolor: client.color, fontWeight: 600, fontSize: '0.85rem' }}>{client.avatar}</Avatar>
                                <Box>
                                    <Typography variant="body1" sx={{ fontWeight: 700, color: '#1E293B' }}>{client.name}</Typography>
                                    <Typography variant="caption" sx={{ color: '#64748B' }}>{client.industry}</Typography>
                                </Box>
                            </Box>
                            <Chip label={client.status} size="small" sx={{
                                backgroundColor: client.status === 'Active' ? '#DCFCE7' : client.status === 'Prospect' ? '#DBEAFE' : '#F1F5F9',
                                color: client.status === 'Active' ? '#16A34A' : client.status === 'Prospect' ? '#3B82F6' : '#64748B',
                                fontWeight: 600, fontSize: '0.72rem',
                            }} />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderTop: '1px solid #F1F5F9' }}>
                            <Box>
                                <Typography variant="caption" sx={{ color: '#94A3B8' }}>Contact</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 500, color: '#1E293B', fontSize: '0.82rem' }}>{client.contact}</Typography>
                            </Box>
                            <Box sx={{ textAlign: 'right' }}>
                                <Typography variant="caption" sx={{ color: '#94A3B8' }}>Revenue</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 700, color: '#16A34A', fontSize: '0.82rem' }}>{client.revenue}</Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1.5, borderTop: '1px solid #F1F5F9' }}>
                            <Typography variant="caption" sx={{ color: '#64748B' }}>{client.projects} active projects</Typography>
                            <Typography variant="caption" sx={{ color: '#3B82F6' }}>{client.email}</Typography>
                        </Box>
                    </Card>
                ))}
            </Box>

            {/* Create Client Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '16px' } }}>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.2rem' }}>
                    Add New Client
                    <IconButton onClick={() => setOpen(false)} size="small"><CloseIcon /></IconButton>
                </DialogTitle>
                <DialogContent sx={{ pt: '16px !important' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        <TextField label="Company Name" required fullWidth value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Acme Corporation" />
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField label="Industry" fullWidth value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} placeholder="e.g. Technology" />
                            <TextField label="Status" select fullWidth value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                                <MenuItem value="Active">Active</MenuItem>
                                <MenuItem value="Inactive">Inactive</MenuItem>
                                <MenuItem value="Prospect">Prospect</MenuItem>
                            </TextField>
                        </Box>
                        <TextField label="Primary Contact Name" fullWidth value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} placeholder="e.g. Jennifer Davis" />
                        <TextField label="Contact Email" required fullWidth value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="e.g. jennifer@acme.com" type="email" />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
                    <Button onClick={() => setOpen(false)} sx={{ color: '#64748B' }}>Cancel</Button>
                    <Button variant="contained" onClick={handleCreate} disabled={!form.name || !form.email} sx={{ backgroundColor: '#16A34A', '&:hover': { backgroundColor: '#15803D' } }}>Add Client</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
