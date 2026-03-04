'use client';

import React, { useState } from 'react';
import {
    Box, Typography, Card, Chip, LinearProgress, Button,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface Deal {
    name: string;
    client: string;
    value: string;
    stage: string;
    probability: number;
}

const initialDeals: Deal[] = [
    { name: 'Acme Corp Website Redesign', client: 'Acme Corporation', value: '$45,000', stage: 'Proposal', probability: 75 },
    { name: 'TechStart SaaS Platform', client: 'Tech Startup Inc', value: '$85,000', stage: 'Qualified', probability: 40 },
    { name: 'Retail Analytics Dashboard', client: 'Local Retail Co', value: '$28,000', stage: 'Negotiation', probability: 90 },
    { name: 'Finance App Revamp', client: 'Global Finance Ltd', value: '$120,000', stage: 'Lead', probability: 20 },
    { name: 'Creative Brand Package', client: 'Creative Agency', value: '$15,000', stage: 'Closed Won', probability: 100 },
];

const stages = ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won'];
const stageColors: Record<string, { bg: string; color: string }> = {
    Lead: { bg: '#F1F5F9', color: '#64748B' },
    Qualified: { bg: '#FEF3C7', color: '#D97706' },
    Proposal: { bg: '#DBEAFE', color: '#2563EB' },
    Negotiation: { bg: '#EEF2FF', color: '#6366F1' },
    'Closed Won': { bg: '#DCFCE7', color: '#16A34A' },
};

const emptyDeal = { name: '', client: '', value: '', stage: 'Lead', probability: 20 };

export default function SalesPage() {
    const [deals, setDeals] = useState<Deal[]>(initialDeals);
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState(emptyDeal);

    const pipelineStages = stages.map((s) => ({
        name: s,
        count: deals.filter((d) => d.stage === s).length,
        value: '$' + Math.round(deals.filter((d) => d.stage === s).reduce((sum, d) => sum + parseInt(d.value.replace(/[$,]/g, '') || '0'), 0) / 1000) + 'K',
        color: stageColors[s].color,
    }));

    const handleCreate = () => {
        if (!form.name || !form.client || !form.value) return;
        const formatted = form.value.startsWith('$') ? form.value : '$' + parseInt(form.value).toLocaleString();
        setDeals((prev) => [...prev, { ...form, value: formatted }]);
        setForm(emptyDeal);
        setOpen(false);
    };

    return (
        <Box sx={{ px: 3.5, py: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B', fontSize: '1.6rem', mb: 0.5 }}>Sales Pipeline</Typography>
                    <Typography variant="subtitle1" sx={{ color: '#64748B', fontSize: '0.9rem' }}>Track and manage your sales opportunities</Typography>
                </Box>
                <Button variant="contained" onClick={() => setOpen(true)} sx={{ backgroundColor: '#16A34A', '&:hover': { backgroundColor: '#15803D' } }}>+ New Deal</Button>
            </Box>

            {/* Pipeline Stages */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 2, mb: 3 }}>
                {pipelineStages.map((stage) => (
                    <Card key={stage.name} sx={{ p: 2.5, borderTop: `3px solid ${stage.color}` }}>
                        <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.8rem', mb: 0.5 }}>{stage.name}</Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1E293B' }}>{stage.count}</Typography>
                        <Typography variant="caption" sx={{ color: stage.color, fontWeight: 600 }}>{stage.value}</Typography>
                    </Card>
                ))}
            </Box>

            {/* Deals Table */}
            <Paper sx={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #E2E8F0', boxShadow: 'none' }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Deal Name</TableCell>
                                <TableCell>Client</TableCell>
                                <TableCell>Value</TableCell>
                                <TableCell>Stage</TableCell>
                                <TableCell>Probability</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {deals.map((deal, idx) => (
                                <TableRow key={`${deal.name}-${idx}`} hover sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#FAFBFC' } }}>
                                    <TableCell><Typography variant="body2" sx={{ fontWeight: 600, color: '#1E293B' }}>{deal.name}</Typography></TableCell>
                                    <TableCell><Typography variant="body2" sx={{ color: '#475569' }}>{deal.client}</Typography></TableCell>
                                    <TableCell><Typography variant="body2" sx={{ fontWeight: 600, color: '#1E293B' }}>{deal.value}</Typography></TableCell>
                                    <TableCell>
                                        <Chip label={deal.stage} size="small" sx={{
                                            backgroundColor: stageColors[deal.stage]?.bg || '#F1F5F9',
                                            color: stageColors[deal.stage]?.color || '#64748B',
                                            fontWeight: 600, fontSize: '0.72rem',
                                        }} />
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <LinearProgress variant="determinate" value={deal.probability} sx={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: '#E2E8F0', '& .MuiLinearProgress-bar': { borderRadius: 3, backgroundColor: deal.probability > 70 ? '#16A34A' : deal.probability > 40 ? '#F59E0B' : '#94A3B8' } }} />
                                            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#475569', minWidth: 32 }}>{deal.probability}%</Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Create Deal Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '16px' } }}>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.2rem' }}>
                    Create New Deal
                    <IconButton onClick={() => setOpen(false)} size="small"><CloseIcon /></IconButton>
                </DialogTitle>
                <DialogContent sx={{ pt: '16px !important' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        <TextField label="Deal Name" required fullWidth value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. New Website Project" />
                        <TextField label="Client" required fullWidth value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} placeholder="e.g. Acme Corporation" />
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField label="Value ($)" required fullWidth value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} placeholder="e.g. 50000" type="number" />
                            <TextField label="Probability (%)" fullWidth value={form.probability} onChange={(e) => setForm({ ...form, probability: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) })} type="number" inputProps={{ min: 0, max: 100 }} />
                        </Box>
                        <TextField label="Stage" select fullWidth value={form.stage} onChange={(e) => setForm({ ...form, stage: e.target.value })}>
                            {stages.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                        </TextField>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
                    <Button onClick={() => setOpen(false)} sx={{ color: '#64748B' }}>Cancel</Button>
                    <Button variant="contained" onClick={handleCreate} disabled={!form.name || !form.client || !form.value} sx={{ backgroundColor: '#16A34A', '&:hover': { backgroundColor: '#15803D' } }}>Create Deal</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
