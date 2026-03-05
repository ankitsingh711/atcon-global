'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
    Alert,
    Avatar,
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    InputBase,
    MenuItem,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import { Add as AddIcon, Close as CloseIcon, Search as SearchIcon } from '@mui/icons-material';

interface Contact {
    _id: string;
    name: string;
    email: string;
    phone: string;
    company: string;
    role: string;
    status: 'Active' | 'Inactive';
}

interface ContactFormState {
    name: string;
    email: string;
    phone: string;
    company: string;
    role: string;
    status: 'Active' | 'Inactive';
}

const avatarColors = [
    '#6366F1',
    '#16A34A',
    '#F59E0B',
    '#EF4444',
    '#3B82F6',
    '#7C3AED',
    '#EC4899',
    '#14B8A6',
];

const emptyContact: ContactFormState = {
    name: '',
    email: '',
    phone: '',
    company: '',
    role: '',
    status: 'Active',
};

function getAvatarColor(seed: string): string {
    const hash = seed.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return avatarColors[hash % avatarColors.length];
}

function getInitials(name: string): string {
    return name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

export default function ContactsPage() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState<ContactFormState>(emptyContact);
    const [search, setSearch] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function loadContacts() {
            try {
                const response = await fetch('/api/contacts', { cache: 'no-store' });
                const result = (await response.json()) as {
                    success?: boolean;
                    data?: Contact[];
                    error?: string;
                };

                if (!response.ok || !result.success || !result.data) {
                    throw new Error(result.error || 'Failed to fetch contacts');
                }

                if (!cancelled) {
                    setContacts(result.data);
                    setError(null);
                }
            } catch (loadError) {
                if (!cancelled) {
                    setError(
                        loadError instanceof Error
                            ? loadError.message
                            : 'Failed to fetch contacts'
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadContacts();

        return () => {
            cancelled = true;
        };
    }, []);

    const filtered = useMemo(() => {
        if (!search.trim()) return contacts;
        const query = search.toLowerCase();
        return contacts.filter(
            (contact) =>
                contact.name.toLowerCase().includes(query) ||
                contact.company.toLowerCase().includes(query) ||
                contact.email.toLowerCase().includes(query)
        );
    }, [contacts, search]);

    async function handleCreate() {
        if (!form.name || !form.email) return;

        setSubmitting(true);
        try {
            const response = await fetch('/api/contacts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            const result = (await response.json()) as {
                success?: boolean;
                data?: Contact;
                error?: string;
            };

            if (!response.ok || !result.success || !result.data) {
                throw new Error(result.error || 'Failed to create contact');
            }

            setContacts((previous) => [result.data!, ...previous]);
            setForm(emptyContact);
            setOpen(false);
            setError(null);
        } catch (createError) {
            setError(
                createError instanceof Error
                    ? createError.message
                    : 'Failed to create contact'
            );
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Box sx={{ px: 3.5, py: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography
                        variant="h4"
                        sx={{ fontWeight: 700, color: '#1E293B', fontSize: '1.6rem', mb: 0.5 }}
                    >
                        Contacts
                    </Typography>
                    <Typography variant="subtitle1" sx={{ color: '#64748B', fontSize: '0.9rem' }}>
                        Manage all client and partner contacts
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpen(true)}
                    sx={{ backgroundColor: '#16A34A', '&:hover': { backgroundColor: '#15803D' } }}
                >
                    Add Contact
                </Button>
            </Box>

            {error ? (
                <Alert severity="error" sx={{ mb: 2.5 }}>
                    {error}
                </Alert>
            ) : null}

            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 3,
                    backgroundColor: '#FFFFFF',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                    px: 1.5,
                    py: 0.5,
                    maxWidth: 400,
                    '&:focus-within': {
                        borderColor: '#16A34A',
                        boxShadow: '0 0 0 3px rgba(22, 163, 74, 0.1)',
                    },
                }}
            >
                <SearchIcon sx={{ color: '#94A3B8', fontSize: '1.2rem', mr: 1 }} />
                <InputBase
                    placeholder="Search contacts..."
                    sx={{ fontSize: '0.85rem', flex: 1 }}
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                />
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <Typography variant="body2" sx={{ color: '#64748B' }}>
                        Loading contacts...
                    </Typography>
                </Box>
            ) : (
                <Paper
                    sx={{
                        borderRadius: '16px',
                        overflow: 'hidden',
                        border: '1px solid #E2E8F0',
                        boxShadow: 'none',
                    }}
                >
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
                                {filtered.map((contact) => (
                                    <TableRow
                                        key={contact._id}
                                        hover
                                        sx={{
                                            cursor: 'pointer',
                                            '&:hover': { backgroundColor: '#FAFBFC' },
                                        }}
                                    >
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <Avatar
                                                    sx={{
                                                        width: 36,
                                                        height: 36,
                                                        fontSize: '0.75rem',
                                                        fontWeight: 600,
                                                        bgcolor: getAvatarColor(contact.name),
                                                    }}
                                                >
                                                    {getInitials(contact.name)}
                                                </Avatar>
                                                <Typography
                                                    variant="body2"
                                                    sx={{ fontWeight: 600, color: '#1E293B' }}
                                                >
                                                    {contact.name}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ color: '#475569' }}>
                                                {contact.company || '-'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography
                                                variant="body2"
                                                sx={{ color: '#475569', fontSize: '0.82rem' }}
                                            >
                                                {contact.role || '-'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography
                                                variant="body2"
                                                sx={{ color: '#3B82F6', fontSize: '0.82rem' }}
                                            >
                                                {contact.email}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography
                                                variant="body2"
                                                sx={{ color: '#475569', fontSize: '0.82rem' }}
                                            >
                                                {contact.phone || '-'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={contact.status}
                                                size="small"
                                                sx={{
                                                    backgroundColor:
                                                        contact.status === 'Active'
                                                            ? '#DCFCE7'
                                                            : '#F1F5F9',
                                                    color:
                                                        contact.status === 'Active'
                                                            ? '#16A34A'
                                                            : '#64748B',
                                                    fontWeight: 600,
                                                    fontSize: '0.72rem',
                                                    height: 24,
                                                }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { borderRadius: '16px' } }}
            >
                <DialogTitle
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontWeight: 700,
                        fontSize: '1.2rem',
                    }}
                >
                    Add New Contact
                    <IconButton onClick={() => setOpen(false)} size="small">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ pt: '16px !important' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        <TextField
                            label="Full Name"
                            required
                            fullWidth
                            value={form.name}
                            onChange={(event) => setForm({ ...form, name: event.target.value })}
                        />
                        <TextField
                            label="Email"
                            required
                            fullWidth
                            value={form.email}
                            onChange={(event) => setForm({ ...form, email: event.target.value })}
                            type="email"
                        />
                        <TextField
                            label="Phone"
                            fullWidth
                            value={form.phone}
                            onChange={(event) => setForm({ ...form, phone: event.target.value })}
                        />
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                label="Company"
                                fullWidth
                                value={form.company}
                                onChange={(event) => setForm({ ...form, company: event.target.value })}
                            />
                            <TextField
                                label="Role"
                                fullWidth
                                value={form.role}
                                onChange={(event) => setForm({ ...form, role: event.target.value })}
                            />
                        </Box>
                        <TextField
                            label="Status"
                            select
                            fullWidth
                            value={form.status}
                            onChange={(event) =>
                                setForm({
                                    ...form,
                                    status: event.target.value as 'Active' | 'Inactive',
                                })
                            }
                        >
                            <MenuItem value="Active">Active</MenuItem>
                            <MenuItem value="Inactive">Inactive</MenuItem>
                        </TextField>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
                    <Button onClick={() => setOpen(false)} sx={{ color: '#64748B' }}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleCreate}
                        disabled={!form.name || !form.email || submitting}
                        sx={{ backgroundColor: '#16A34A', '&:hover': { backgroundColor: '#15803D' } }}
                    >
                        {submitting ? 'Adding...' : 'Add Contact'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
