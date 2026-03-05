'use client';
import React from 'react';
import { Box, Typography, Card, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const expenses = [
    { description: 'Client dinner - Acme Corp', category: 'Meals', amount: '$125.00', date: 'Mar 3, 2026', status: 'Pending' },
    { description: 'Taxi to client office', category: 'Travel', amount: '$45.00', date: 'Mar 2, 2026', status: 'Approved' },
    { description: 'Software subscription - Figma', category: 'Software', amount: '$15.00', date: 'Mar 1, 2026', status: 'Approved' },
    { description: 'Office supplies', category: 'Supplies', amount: '$82.50', date: 'Feb 28, 2026', status: 'Approved' },
];

const st: Record<string, { bg: string; text: string }> = { Pending: { bg: '#FEF3C7', text: '#D97706' }, Approved: { bg: '#DCFCE7', text: '#16A34A' }, Rejected: { bg: '#FEE2E2', text: '#EF4444' } };

export default function EmployeeExpensesPage() {
    return (
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B', fontSize: '1.5rem', mb: 0.5 }}>My Expenses</Typography>
            <Typography variant="body2" sx={{ color: '#64748B', mb: 3 }}>Expense claims and reimbursements</Typography>
            <Paper sx={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid #E2E8F0', boxShadow: 'none' }}>
                <TableContainer><Table>
                    <TableHead><TableRow sx={{ bgcolor: '#F8FAFC' }}>
                        <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.78rem' }}>Description</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.78rem' }}>Category</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.78rem' }}>Amount</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.78rem' }}>Date</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.78rem' }}>Status</TableCell>
                    </TableRow></TableHead>
                    <TableBody>{expenses.map((e, i) => (
                        <TableRow key={i} hover>
                            <TableCell sx={{ fontWeight: 500, fontSize: '0.82rem' }}>{e.description}</TableCell>
                            <TableCell><Chip label={e.category} size="small" sx={{ bgcolor: '#F1F5F9', color: '#475569', fontSize: '0.68rem', height: 22 }} /></TableCell>
                            <TableCell sx={{ fontWeight: 600, fontSize: '0.82rem' }}>{e.amount}</TableCell>
                            <TableCell sx={{ color: '#94A3B8', fontSize: '0.82rem' }}>{e.date}</TableCell>
                            <TableCell><Chip label={e.status} size="small" sx={{ bgcolor: st[e.status].bg, color: st[e.status].text, fontWeight: 600, fontSize: '0.68rem', height: 22 }} /></TableCell>
                        </TableRow>
                    ))}</TableBody>
                </Table></TableContainer>
            </Paper>
        </Box>
    );
}
