'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';

interface InvoiceData { _id: string; invoiceNumber: string; client: string; project: string; amount: string; date: string; dueDate: string; status: string; }
const st: Record<string, { bg: string; text: string }> = { Paid: { bg: '#DCFCE7', text: '#16A34A' }, Pending: { bg: '#FEF3C7', text: '#D97706' }, Overdue: { bg: '#FEE2E2', text: '#EF4444' } };

export default function ClientInvoicesPage() {
    const [invoices, setInvoices] = useState<InvoiceData[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try { setLoading(true); const res = await fetch('/api/finance'); const json = await res.json(); if (json.success) setInvoices(json.data.invoices || []); }
        catch { console.error('Failed to load invoices'); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}><CircularProgress /></Box>;

    return (
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B', fontSize: '1.5rem', mb: 0.5 }}>Invoices</Typography>
            <Typography variant="body2" sx={{ color: '#64748B', mb: 3 }}>{invoices.length} invoices</Typography>
            <Paper sx={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid #E2E8F0', boxShadow: 'none' }}>
                <TableContainer><Table>
                    <TableHead><TableRow sx={{ bgcolor: '#F8FAFC' }}>
                        {['Invoice', 'Project', 'Amount', 'Date', 'Due Date', 'Status'].map((h) => <TableCell key={h} sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.78rem' }}>{h}</TableCell>)}
                    </TableRow></TableHead>
                    <TableBody>{invoices.map((inv) => (
                        <TableRow key={inv._id} hover>
                            <TableCell sx={{ fontWeight: 600, color: '#4F46E5', fontSize: '0.82rem' }}>{inv.invoiceNumber}</TableCell>
                            <TableCell sx={{ color: '#475569', fontSize: '0.82rem' }}>{inv.project || inv.client}</TableCell>
                            <TableCell sx={{ fontWeight: 600, fontSize: '0.82rem' }}>{inv.amount}</TableCell>
                            <TableCell sx={{ color: '#94A3B8', fontSize: '0.82rem' }}>{inv.date}</TableCell>
                            <TableCell sx={{ color: '#94A3B8', fontSize: '0.82rem' }}>{inv.dueDate}</TableCell>
                            <TableCell><Chip label={inv.status} size="small" sx={{ bgcolor: (st[inv.status] || st['Pending']).bg, color: (st[inv.status] || st['Pending']).text, fontWeight: 600, fontSize: '0.68rem', height: 22 }} /></TableCell>
                        </TableRow>
                    ))}</TableBody>
                </Table></TableContainer>
            </Paper>
        </Box>
    );
}
