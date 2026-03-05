'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
    Alert,
    Box,
    Button,
    Card,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    LinearProgress,
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
import { Close as CloseIcon } from '@mui/icons-material';

type DealStage = 'Lead' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Closed Won';

interface Deal {
    _id: string;
    name: string;
    client: string;
    value: number;
    stage: DealStage;
    probability: number;
}

interface DealFormState {
    name: string;
    client: string;
    value: string;
    stage: DealStage;
    probability: number;
}

const stages: DealStage[] = ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won'];
const stageColors: Record<DealStage, { bg: string; color: string }> = {
    Lead: { bg: '#F1F5F9', color: '#64748B' },
    Qualified: { bg: '#FEF3C7', color: '#D97706' },
    Proposal: { bg: '#DBEAFE', color: '#2563EB' },
    Negotiation: { bg: '#EEF2FF', color: '#6366F1' },
    'Closed Won': { bg: '#DCFCE7', color: '#16A34A' },
};

const emptyDeal: DealFormState = {
    name: '',
    client: '',
    value: '',
    stage: 'Lead',
    probability: 20,
};

function formatValue(amount: number): string {
    return `$${amount.toLocaleString()}`;
}

export default function SalesPage() {
    const [deals, setDeals] = useState<Deal[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState<DealFormState>(emptyDeal);

    useEffect(() => {
        let cancelled = false;

        async function loadDeals() {
            try {
                const response = await fetch('/api/deals', { cache: 'no-store' });
                const result = (await response.json()) as {
                    success?: boolean;
                    data?: Deal[];
                    error?: string;
                };

                if (!response.ok || !result.success || !result.data) {
                    throw new Error(result.error || 'Failed to load deals');
                }

                if (!cancelled) {
                    setDeals(result.data);
                    setError(null);
                }
            } catch (loadError) {
                if (!cancelled) {
                    setError(
                        loadError instanceof Error ? loadError.message : 'Failed to load deals'
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadDeals();

        return () => {
            cancelled = true;
        };
    }, []);

    const pipelineStages = useMemo(
        () =>
            stages.map((stage) => ({
                name: stage,
                count: deals.filter((deal) => deal.stage === stage).length,
                value: deals
                    .filter((deal) => deal.stage === stage)
                    .reduce((sum, deal) => sum + deal.value, 0),
                color: stageColors[stage].color,
            })),
        [deals]
    );

    async function handleCreate() {
        if (!form.name || !form.client || !form.value) return;

        setSubmitting(true);
        try {
            const response = await fetch('/api/deals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: form.name,
                    client: form.client,
                    value: Number(form.value),
                    stage: form.stage,
                    probability: form.probability,
                }),
            });

            const result = (await response.json()) as {
                success?: boolean;
                data?: Deal;
                error?: string;
            };

            if (!response.ok || !result.success || !result.data) {
                throw new Error(result.error || 'Failed to create deal');
            }

            setDeals((previous) => [result.data!, ...previous]);
            setForm(emptyDeal);
            setOpen(false);
            setError(null);
        } catch (createError) {
            setError(
                createError instanceof Error ? createError.message : 'Failed to create deal'
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
                        Sales Pipeline
                    </Typography>
                    <Typography variant="subtitle1" sx={{ color: '#64748B', fontSize: '0.9rem' }}>
                        Track and manage your sales opportunities
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    onClick={() => setOpen(true)}
                    sx={{ backgroundColor: '#16A34A', '&:hover': { backgroundColor: '#15803D' } }}
                >
                    + New Deal
                </Button>
            </Box>

            {error ? (
                <Alert severity="error" sx={{ mb: 2.5 }}>
                    {error}
                </Alert>
            ) : null}

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 2, mb: 3 }}>
                {pipelineStages.map((stage) => (
                    <Card key={stage.name} sx={{ p: 2.5, borderTop: `3px solid ${stage.color}` }}>
                        <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.8rem', mb: 0.5 }}>
                            {stage.name}
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1E293B' }}>
                            {stage.count}
                        </Typography>
                        <Typography variant="caption" sx={{ color: stage.color, fontWeight: 600 }}>
                            {formatValue(stage.value)}
                        </Typography>
                    </Card>
                ))}
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress sx={{ color: '#16A34A' }} />
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
                                    <TableCell>Deal Name</TableCell>
                                    <TableCell>Client</TableCell>
                                    <TableCell>Value</TableCell>
                                    <TableCell>Stage</TableCell>
                                    <TableCell>Probability</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {deals.map((deal) => (
                                    <TableRow
                                        key={deal._id}
                                        hover
                                        sx={{
                                            cursor: 'pointer',
                                            '&:hover': { backgroundColor: '#FAFBFC' },
                                        }}
                                    >
                                        <TableCell>
                                            <Typography
                                                variant="body2"
                                                sx={{ fontWeight: 600, color: '#1E293B' }}
                                            >
                                                {deal.name}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ color: '#475569' }}>
                                                {deal.client}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography
                                                variant="body2"
                                                sx={{ fontWeight: 600, color: '#1E293B' }}
                                            >
                                                {formatValue(deal.value)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={deal.stage}
                                                size="small"
                                                sx={{
                                                    backgroundColor: stageColors[deal.stage].bg,
                                                    color: stageColors[deal.stage].color,
                                                    fontWeight: 600,
                                                    fontSize: '0.72rem',
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={deal.probability}
                                                    sx={{
                                                        flex: 1,
                                                        height: 6,
                                                        borderRadius: 3,
                                                        backgroundColor: '#E2E8F0',
                                                        '& .MuiLinearProgress-bar': {
                                                            borderRadius: 3,
                                                            backgroundColor:
                                                                deal.probability > 70
                                                                    ? '#16A34A'
                                                                    : deal.probability > 40
                                                                      ? '#F59E0B'
                                                                      : '#94A3B8',
                                                        },
                                                    }}
                                                />
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        fontWeight: 600,
                                                        fontSize: '0.8rem',
                                                        color: '#475569',
                                                        minWidth: 32,
                                                    }}
                                                >
                                                    {deal.probability}%
                                                </Typography>
                                            </Box>
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
                    Create New Deal
                    <IconButton onClick={() => setOpen(false)} size="small">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ pt: '16px !important' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        <TextField
                            label="Deal Name"
                            required
                            fullWidth
                            value={form.name}
                            onChange={(event) => setForm({ ...form, name: event.target.value })}
                            placeholder="e.g. New Website Project"
                        />
                        <TextField
                            label="Client"
                            required
                            fullWidth
                            value={form.client}
                            onChange={(event) => setForm({ ...form, client: event.target.value })}
                            placeholder="e.g. Acme Corporation"
                        />
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                label="Value ($)"
                                required
                                fullWidth
                                value={form.value}
                                onChange={(event) => setForm({ ...form, value: event.target.value })}
                                type="number"
                            />
                            <TextField
                                label="Probability (%)"
                                fullWidth
                                value={form.probability}
                                onChange={(event) =>
                                    setForm({
                                        ...form,
                                        probability: Math.min(
                                            100,
                                            Math.max(0, parseInt(event.target.value, 10) || 0)
                                        ),
                                    })
                                }
                                type="number"
                                inputProps={{ min: 0, max: 100 }}
                            />
                        </Box>
                        <TextField
                            label="Stage"
                            select
                            fullWidth
                            value={form.stage}
                            onChange={(event) =>
                                setForm({ ...form, stage: event.target.value as DealStage })
                            }
                        >
                            {stages.map((stage) => (
                                <MenuItem key={stage} value={stage}>
                                    {stage}
                                </MenuItem>
                            ))}
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
                        disabled={!form.name || !form.client || !form.value || submitting}
                        sx={{ backgroundColor: '#16A34A', '&:hover': { backgroundColor: '#15803D' } }}
                    >
                        {submitting ? 'Creating...' : 'Create Deal'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
