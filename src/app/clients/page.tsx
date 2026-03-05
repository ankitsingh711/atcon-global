'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    InputBase,
    MenuItem,
    TextField,
    Typography,
} from '@mui/material';
import { Add as AddIcon, Close as CloseIcon, Search as SearchIcon } from '@mui/icons-material';

type ClientStatus = 'Active' | 'Inactive' | 'Prospect';

interface Client {
    _id: string;
    name: string;
    industry: string;
    contact: string;
    email: string;
    projects: number;
    revenue: number;
    status: ClientStatus;
}

interface ClientFormState {
    name: string;
    industry: string;
    contact: string;
    email: string;
    status: ClientStatus;
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

const emptyClient: ClientFormState = {
    name: '',
    industry: '',
    contact: '',
    email: '',
    status: 'Active',
};

function getInitials(name: string): string {
    return name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

function getAvatarColor(seed: string): string {
    const hash = seed.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return avatarColors[hash % avatarColors.length];
}

function formatRevenue(value: number): string {
    if (value >= 1000) {
        return `$${Math.round(value / 1000)}K`;
    }
    return `$${value.toLocaleString()}`;
}

export default function ClientsPage() {
    const [clients, setClients] = useState<Client[]>([]);
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState<ClientFormState>(emptyClient);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function loadClients() {
            try {
                const response = await fetch('/api/clients', { cache: 'no-store' });
                const result = (await response.json()) as {
                    success?: boolean;
                    data?: Client[];
                    error?: string;
                };

                if (!response.ok || !result.success || !result.data) {
                    throw new Error(result.error || 'Failed to fetch clients');
                }

                if (!cancelled) {
                    setClients(result.data);
                    setError(null);
                }
            } catch (loadError) {
                if (!cancelled) {
                    setError(
                        loadError instanceof Error ? loadError.message : 'Failed to fetch clients'
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadClients();

        return () => {
            cancelled = true;
        };
    }, []);

    const filtered = useMemo(() => {
        if (!search.trim()) return clients;
        const query = search.toLowerCase();
        return clients.filter(
            (client) =>
                client.name.toLowerCase().includes(query) ||
                client.industry.toLowerCase().includes(query) ||
                client.contact.toLowerCase().includes(query)
        );
    }, [clients, search]);

    async function handleCreate() {
        if (!form.name || !form.email) return;

        setSubmitting(true);
        try {
            const response = await fetch('/api/clients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            const result = (await response.json()) as {
                success?: boolean;
                data?: Client;
                error?: string;
            };

            if (!response.ok || !result.success || !result.data) {
                throw new Error(result.error || 'Failed to create client');
            }

            setClients((previous) => [result.data!, ...previous]);
            setForm(emptyClient);
            setOpen(false);
            setError(null);
        } catch (createError) {
            setError(
                createError instanceof Error ? createError.message : 'Failed to create client'
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
                        Clients
                    </Typography>
                    <Typography variant="subtitle1" sx={{ color: '#64748B', fontSize: '0.9rem' }}>
                        Manage your client relationships
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpen(true)}
                    sx={{ backgroundColor: '#16A34A', '&:hover': { backgroundColor: '#15803D' } }}
                >
                    Add Client
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
                    placeholder="Search clients..."
                    sx={{ fontSize: '0.85rem', flex: 1 }}
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                />
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <Typography variant="body2" sx={{ color: '#64748B' }}>
                        Loading clients...
                    </Typography>
                </Box>
            ) : (
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                        gap: 2.5,
                    }}
                >
                    {filtered.map((client) => (
                        <Card
                            key={client._id}
                            sx={{
                                p: 3,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                                },
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    mb: 2,
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <Avatar
                                        sx={{
                                            width: 44,
                                            height: 44,
                                            bgcolor: getAvatarColor(client.name),
                                            fontWeight: 600,
                                            fontSize: '0.85rem',
                                        }}
                                    >
                                        {getInitials(client.name)}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="body1" sx={{ fontWeight: 700, color: '#1E293B' }}>
                                            {client.name}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#64748B' }}>
                                            {client.industry || 'General'}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Chip
                                    label={client.status}
                                    size="small"
                                    sx={{
                                        backgroundColor:
                                            client.status === 'Active'
                                                ? '#DCFCE7'
                                                : client.status === 'Prospect'
                                                  ? '#DBEAFE'
                                                  : '#F1F5F9',
                                        color:
                                            client.status === 'Active'
                                                ? '#16A34A'
                                                : client.status === 'Prospect'
                                                  ? '#3B82F6'
                                                  : '#64748B',
                                        fontWeight: 600,
                                        fontSize: '0.72rem',
                                    }}
                                />
                            </Box>

                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    py: 1.5,
                                    borderTop: '1px solid #F1F5F9',
                                }}
                            >
                                <Box>
                                    <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                                        Contact
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{ fontWeight: 500, color: '#1E293B', fontSize: '0.82rem' }}
                                    >
                                        {client.contact || '-'}
                                    </Typography>
                                </Box>
                                <Box sx={{ textAlign: 'right' }}>
                                    <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                                        Revenue
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{ fontWeight: 700, color: '#16A34A', fontSize: '0.82rem' }}
                                    >
                                        {formatRevenue(client.revenue || 0)}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    pt: 1.5,
                                    borderTop: '1px solid #F1F5F9',
                                }}
                            >
                                <Typography variant="caption" sx={{ color: '#64748B' }}>
                                    {client.projects || 0} active projects
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#3B82F6' }}>
                                    {client.email}
                                </Typography>
                            </Box>
                        </Card>
                    ))}
                </Box>
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
                    Add New Client
                    <IconButton onClick={() => setOpen(false)} size="small">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ pt: '16px !important' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        <TextField
                            label="Company Name"
                            required
                            fullWidth
                            value={form.name}
                            onChange={(event) => setForm({ ...form, name: event.target.value })}
                        />
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                label="Industry"
                                fullWidth
                                value={form.industry}
                                onChange={(event) =>
                                    setForm({ ...form, industry: event.target.value })
                                }
                            />
                            <TextField
                                label="Status"
                                select
                                fullWidth
                                value={form.status}
                                onChange={(event) =>
                                    setForm({ ...form, status: event.target.value as ClientStatus })
                                }
                            >
                                <MenuItem value="Active">Active</MenuItem>
                                <MenuItem value="Inactive">Inactive</MenuItem>
                                <MenuItem value="Prospect">Prospect</MenuItem>
                            </TextField>
                        </Box>
                        <TextField
                            label="Primary Contact Name"
                            fullWidth
                            value={form.contact}
                            onChange={(event) => setForm({ ...form, contact: event.target.value })}
                        />
                        <TextField
                            label="Contact Email"
                            required
                            fullWidth
                            value={form.email}
                            onChange={(event) => setForm({ ...form, email: event.target.value })}
                            type="email"
                        />
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
                        {submitting ? 'Adding...' : 'Add Client'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
