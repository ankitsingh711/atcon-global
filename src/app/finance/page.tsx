'use client';
import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Typography, Card, Grid, Chip, Tabs, Tab, Button, Avatar,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Snackbar, Alert,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
} from '@mui/material';
import { TrendingUp as UpIcon, TrendingDown as DownIcon, AttachMoney as MoneyIcon, AccountBalance as BankIcon, NoteAdd as InvoiceIcon } from '@mui/icons-material';

interface InvoiceData { _id: string; invoiceNumber: string; client: string; project: string; amount: string; date: string; dueDate: string; status: string; }
interface FinanceStats { totalRevenue: number; outstanding: number; expenses: number; netProfit: number; outstandingCount: number; activeProjects: number; }

const ist: Record<string, { bg: string; text: string }> = { Paid: { bg: '#DCFCE7', text: '#16A34A' }, Pending: { bg: '#FEF3C7', text: '#D97706' }, Overdue: { bg: '#FEE2E2', text: '#EF4444' } };

export default function FinancePage() {
    const [stats, setStats] = useState<FinanceStats | null>(null);
    const [invoices, setInvoices] = useState<InvoiceData[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState(0);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' as 'error' | 'success' });
    const [modalOpen, setModalOpen] = useState(false);
    const [formData, setFormData] = useState({ client: '', amount: '', status: 'Pending', dueDate: '' });

    const fetchFinance = useCallback(async () => {
        try { setLoading(true); const res = await fetch('/api/finance'); const json = await res.json(); if (json.success) { setStats(json.data.stats); setInvoices(json.data.invoices); } }
        catch { setSnackbar({ open: true, message: 'Failed to load finance data', severity: 'error' }); }
        finally { setLoading(false); }
    }, []);

    const handleCreateInvoice = async () => {
        if (!formData.client || !formData.amount || !formData.dueDate) {
            setSnackbar({ open: true, message: 'Please fill all required fields.', severity: 'error' });
            return;
        }
        try {
            const res = await fetch('/api/invoices', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const json = await res.json();
            if (json.success) {
                setSnackbar({ open: true, message: 'Invoice created successfully!', severity: 'success' });
                setModalOpen(false);
                setFormData({ client: '', amount: '', status: 'Pending', dueDate: '' });
                fetchFinance();
            } else {
                setSnackbar({ open: true, message: json.error || 'Failed to create invoice.', severity: 'error' });
            }
        } catch (error) {
            setSnackbar({ open: true, message: 'An error occurred.', severity: 'error' });
        }
    };

    useEffect(() => { fetchFinance(); }, [fetchFinance]);

    if (loading || !stats) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}><CircularProgress /></Box>;

    const statCards = [
        { label: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, change: '+12.5%', icon: <UpIcon />, changeColor: '#16A34A', bg: '#DCFCE7', iconColor: '#16A34A' },
        { label: 'Outstanding', value: `$${stats.outstanding.toLocaleString()}`, change: `${stats.outstandingCount} invoices`, icon: <MoneyIcon />, changeColor: '#D97706', bg: '#FEF3C7', iconColor: '#D97706' },
        { label: 'Expenses', value: `$${stats.expenses.toLocaleString()}`, change: '-8.2%', icon: <DownIcon />, changeColor: '#EF4444', bg: '#FEE2E2', iconColor: '#EF4444' },
        { label: 'Net Profit', value: `$${stats.netProfit.toLocaleString()}`, change: '+15.1%', icon: <BankIcon />, changeColor: '#16A34A', bg: '#EEF2FF', iconColor: '#6366F1' },
    ];

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Box><Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B', fontSize: '1.5rem', mb: 0.5 }}>Finance</Typography><Typography variant="body2" sx={{ color: '#64748B' }}>Financial overview and invoicing</Typography></Box>
                <Button onClick={() => setModalOpen(true)} variant="contained" startIcon={<InvoiceIcon />} sx={{ bgcolor: '#16A34A', '&:hover': { bgcolor: '#15803D' }, borderRadius: '10px', textTransform: 'none', fontWeight: 600 }}>Create Invoice</Button>
            </Box>
            <Grid container spacing={2} sx={{ mb: 3 }}>
                {statCards.map((s) => (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={s.label}>
                        <Card sx={{ p: 2.5, borderRadius: '14px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Box><Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.72rem' }}>{s.label}</Typography><Typography variant="h5" sx={{ fontWeight: 700, color: '#1E293B', lineHeight: 1.3 }}>{s.value}</Typography><Typography variant="caption" sx={{ color: s.changeColor, fontWeight: 600, fontSize: '0.7rem' }}>{s.change}</Typography></Box>
                                <Avatar sx={{ bgcolor: s.bg, color: s.iconColor, width: 40, height: 40 }}>{s.icon}</Avatar>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2, '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '0.85rem' }, '& .Mui-selected': { color: '#16A34A' }, '& .MuiTabs-indicator': { backgroundColor: '#16A34A' } }}>
                <Tab label="Invoices" /><Tab label="Expenses" />
            </Tabs>
            <Paper sx={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid #E2E8F0', boxShadow: 'none' }}>
                <TableContainer><Table>
                    <TableHead><TableRow sx={{ bgcolor: '#F8FAFC' }}>
                        {['Invoice', 'Client', 'Amount', 'Date', 'Due Date', 'Status'].map((h) => <TableCell key={h} sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.78rem', textTransform: 'uppercase' }}>{h}</TableCell>)}
                    </TableRow></TableHead>
                    <TableBody>{invoices.map((inv) => (
                        <TableRow key={inv._id} hover>
                            <TableCell sx={{ fontWeight: 600, fontSize: '0.82rem' }}>{inv.invoiceNumber}</TableCell>
                            <TableCell sx={{ color: '#475569', fontSize: '0.82rem' }}>{inv.client}</TableCell>
                            <TableCell sx={{ fontWeight: 600, fontSize: '0.82rem' }}>{inv.amount}</TableCell>
                            <TableCell sx={{ color: '#94A3B8', fontSize: '0.82rem' }}>{inv.date}</TableCell>
                            <TableCell sx={{ color: '#94A3B8', fontSize: '0.82rem' }}>{inv.dueDate}</TableCell>
                            <TableCell><Chip label={inv.status} size="small" sx={{ bgcolor: (ist[inv.status] || ist['Pending']).bg, color: (ist[inv.status] || ist['Pending']).text, fontWeight: 600, fontSize: '0.68rem', height: 22 }} /></TableCell>
                        </TableRow>
                    ))}</TableBody>
                </Table></TableContainer>
            </Paper>

            <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>Create New Invoice</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                    <TextField label="Client Name" fullWidth size="small" value={formData.client} onChange={(e) => setFormData({ ...formData, client: e.target.value })} required />
                    <TextField label="Amount ($)" type="number" fullWidth size="small" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} required />
                    <TextField label="Due Date" type="date" fullWidth size="small" slotProps={{ inputLabel: { shrink: true } }} value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} required />
                    <TextField select label="Status" fullWidth size="small" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="Paid">Paid</MenuItem>
                        <MenuItem value="Overdue">Overdue</MenuItem>
                    </TextField>
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 0 }}>
                    <Button onClick={() => setModalOpen(false)} sx={{ color: '#64748B' }}>Cancel</Button>
                    <Button onClick={handleCreateInvoice} variant="contained" sx={{ bgcolor: '#16A34A', '&:hover': { bgcolor: '#15803D' } }}>Create</Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar((s) => ({ ...s, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}><Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert></Snackbar>
        </Box>
    );
}
