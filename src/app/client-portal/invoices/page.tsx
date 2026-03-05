'use client';
import React from 'react';
import { Box, Typography, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const invoices = [
    { number: 'INV-2026-001', date: 'Mar 1, 2026', amount: '$28,500', project: 'Website Redesign', dueDate: 'Mar 15, 2026', status: 'Pending' },
    { number: 'INV-2026-002', date: 'Feb 28, 2026', amount: '$15,200', project: 'E-Commerce Platform', dueDate: 'Mar 14, 2026', status: 'Paid' },
    { number: 'INV-2025-012', date: 'Feb 15, 2026', amount: '$42,000', project: 'CRM Integration', dueDate: 'Mar 1, 2026', status: 'Paid' },
    { number: 'INV-2025-011', date: 'Feb 1, 2026', amount: '$18,750', project: 'Website Redesign', dueDate: 'Feb 15, 2026', status: 'Paid' },
];
const st: Record<string, { bg: string; text: string }> = { Paid: { bg: '#DCFCE7', text: '#16A34A' }, Pending: { bg: '#FEF3C7', text: '#D97706' }, Overdue: { bg: '#FEE2E2', text: '#EF4444' } };

export default function ClientInvoicesPage() {
    return (
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B', fontSize: '1.5rem', mb: 0.5 }}>Invoices</Typography>
            <Typography variant="body2" sx={{ color: '#64748B', mb: 3 }}>{invoices.length} invoices</Typography>
            <Paper sx={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid #E2E8F0', boxShadow: 'none' }}>
                <TableContainer><Table>
                    <TableHead><TableRow sx={{ bgcolor: '#F8FAFC' }}>
                        <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.78rem' }}>Invoice</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.78rem' }}>Project</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.78rem' }}>Amount</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.78rem' }}>Date</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.78rem' }}>Due Date</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.78rem' }}>Status</TableCell>
                    </TableRow></TableHead>
                    <TableBody>{invoices.map((inv) => (
                        <TableRow key={inv.number} hover>
                            <TableCell sx={{ fontWeight: 600, color: '#4F46E5', fontSize: '0.82rem' }}>{inv.number}</TableCell>
                            <TableCell sx={{ color: '#475569', fontSize: '0.82rem' }}>{inv.project}</TableCell>
                            <TableCell sx={{ fontWeight: 600, fontSize: '0.82rem' }}>{inv.amount}</TableCell>
                            <TableCell sx={{ color: '#94A3B8', fontSize: '0.82rem' }}>{inv.date}</TableCell>
                            <TableCell sx={{ color: '#94A3B8', fontSize: '0.82rem' }}>{inv.dueDate}</TableCell>
                            <TableCell><Chip label={inv.status} size="small" sx={{ bgcolor: st[inv.status].bg, color: st[inv.status].text, fontWeight: 600, fontSize: '0.68rem', height: 22 }} /></TableCell>
                        </TableRow>
                    ))}</TableBody>
                </Table></TableContainer>
            </Paper>
        </Box>
    );
}
