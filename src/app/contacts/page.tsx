'use client';

import React, { useState } from 'react';
import {
    Box, Typography, Avatar, Chip, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Button, InputBase, IconButton,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
} from '@mui/material';
import { Search as SearchIcon, Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';

interface Contact {
    name: string;
    email: string;
    phone: string;
    company: string;
    role: string;
    status: string;
    avatar: string;
    color: string;
}

const avatarColors = ['#6366F1', '#16A34A', '#F59E0B', '#EF4444', '#3B82F6', '#7C3AED', '#EC4899', '#14B8A6'];

const initialContacts: Contact[] = [
    { name: 'Jennifer Davis', email: 'jennifer@acme.com', phone: '+1 (555) 123-4567', company: 'Acme Corporation', role: 'CEO', status: 'Active', avatar: 'JD', color: '#6366F1' },
    { name: 'Robert Chen', email: 'robert@techstart.io', phone: '+1 (555) 234-5678', company: 'Tech Startup Inc', role: 'CTO', status: 'Active', avatar: 'RC', color: '#16A34A' },
    { name: 'Lisa Martinez', email: 'lisa@retail.com', phone: '+1 (555) 345-6789', company: 'Local Retail Co', role: 'Marketing Director', status: 'Active', avatar: 'LM', color: '#F59E0B' },
    { name: 'David Park', email: 'david@finance.com', phone: '+1 (555) 456-7890', company: 'Global Finance Ltd', role: 'VP Operations', status: 'Inactive', avatar: 'DP', color: '#EF4444' },
    { name: 'Emma Wilson', email: 'emma@creative.co', phone: '+1 (555) 567-8901', company: 'Creative Agency', role: 'Creative Director', status: 'Active', avatar: 'EW', color: '#3B82F6' },
    { name: 'James Taylor', email: 'james@solutions.com', phone: '+1 (555) 678-9012', company: 'Solutions Corp', role: 'Project Lead', status: 'Active', avatar: 'JT', color: '#7C3AED' },
];

const emptyContact = { name: '', email: '', phone: '', company: '', role: '', status: 'Active' };

export default function ContactsPage() {
    const [contacts, setContacts] = useState<Contact[]>(initialContacts);
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState(emptyContact);
    const [search, setSearch] = useState('');

    const filtered = search
        ? contacts.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.company.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()))
        : contacts;

    const handleCreate = () => {
        if (!form.name || !form.email) return;
        const initials = form.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
        const color = avatarColors[contacts.length % avatarColors.length];
        setContacts((prev) => [...prev, { ...form, avatar: initials, color }]);
        setForm(emptyContact);
        setOpen(false);
    };

    return (
        <Box sx={{ px: 3.5, py: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B', fontSize: '1.6rem', mb: 0.5 }}>Contacts</Typography>
                    <Typography variant="subtitle1" sx={{ color: '#64748B', fontSize: '0.9rem' }}>Manage all client and partner contacts</Typography>
                </Box>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)} sx={{ backgroundColor: '#16A34A', '&:hover': { backgroundColor: '#15803D' } }}>Add Contact</Button>
            </Box>

            {/* Search */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid #E2E8F0', px: 1.5, py: 0.5, maxWidth: 400, '&:focus-within': { borderColor: '#16A34A', boxShadow: '0 0 0 3px rgba(22, 163, 74, 0.1)' } }}>
                <SearchIcon sx={{ color: '#94A3B8', fontSize: '1.2rem', mr: 1 }} />
                <InputBase placeholder="Search contacts..." sx={{ fontSize: '0.85rem', flex: 1 }} value={search} onChange={(e) => setSearch(e.target.value)} />
            </Box>

            <Paper sx={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #E2E8F0', boxShadow: 'none' }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Company</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Phone</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filtered.map((contact, idx) => (
                                <TableRow key={`${contact.name}-${idx}`} hover sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#FAFBFC' } }}>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <Avatar sx={{ width: 36, height: 36, fontSize: '0.75rem', fontWeight: 600, bgcolor: contact.color }}>{contact.avatar}</Avatar>
                                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#1E293B' }}>{contact.name}</Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell><Typography variant="body2" sx={{ color: '#475569' }}>{contact.company}</Typography></TableCell>
                                    <TableCell><Typography variant="body2" sx={{ color: '#475569', fontSize: '0.82rem' }}>{contact.role}</Typography></TableCell>
                                    <TableCell><Typography variant="body2" sx={{ color: '#3B82F6', fontSize: '0.82rem' }}>{contact.email}</Typography></TableCell>
                                    <TableCell><Typography variant="body2" sx={{ color: '#475569', fontSize: '0.82rem' }}>{contact.phone}</Typography></TableCell>
                                    <TableCell>
                                        <Chip label={contact.status} size="small" sx={{
                                            backgroundColor: contact.status === 'Active' ? '#DCFCE7' : '#F1F5F9',
                                            color: contact.status === 'Active' ? '#16A34A' : '#64748B',
                                            fontWeight: 600, fontSize: '0.72rem', height: 24,
                                        }} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Create Contact Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '16px' } }}>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.2rem' }}>
                    Add New Contact
                    <IconButton onClick={() => setOpen(false)} size="small"><CloseIcon /></IconButton>
                </DialogTitle>
                <DialogContent sx={{ pt: '16px !important' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        <TextField label="Full Name" required fullWidth value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. John Doe" />
                        <TextField label="Email" required fullWidth value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="e.g. john@company.com" type="email" />
                        <TextField label="Phone" fullWidth value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="e.g. +1 (555) 000-0000" />
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField label="Company" fullWidth value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="e.g. Acme Corp" />
                            <TextField label="Role" fullWidth value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="e.g. CEO" />
                        </Box>
                        <TextField label="Status" select fullWidth value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                            <MenuItem value="Active">Active</MenuItem>
                            <MenuItem value="Inactive">Inactive</MenuItem>
                        </TextField>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
                    <Button onClick={() => setOpen(false)} sx={{ color: '#64748B' }}>Cancel</Button>
                    <Button variant="contained" onClick={handleCreate} disabled={!form.name || !form.email} sx={{ backgroundColor: '#16A34A', '&:hover': { backgroundColor: '#15803D' } }}>Add Contact</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
