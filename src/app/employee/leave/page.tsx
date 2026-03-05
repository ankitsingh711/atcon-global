'use client';
import React from 'react';
import { Box, Typography, Card, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const leave = [
    { type: 'Annual Leave', from: 'Mar 15, 2026', to: 'Mar 19, 2026', days: 5, status: 'Approved', reason: 'Family vacation' },
    { type: 'Sick Leave', from: 'Feb 10, 2026', to: 'Feb 10, 2026', days: 1, status: 'Approved', reason: 'Feeling unwell' },
    { type: 'Annual Leave', from: 'Apr 1, 2026', to: 'Apr 3, 2026', days: 3, status: 'Pending', reason: 'Personal' },
];

const balances = [
    { type: 'Annual Leave', total: 20, used: 8, remaining: 12 },
    { type: 'Sick Leave', total: 10, used: 2, remaining: 8 },
    { type: 'Personal Leave', total: 5, used: 0, remaining: 5 },
];

const st: Record<string, { bg: string; text: string }> = { Pending: { bg: '#FEF3C7', text: '#D97706' }, Approved: { bg: '#DCFCE7', text: '#16A34A' }, Rejected: { bg: '#FEE2E2', text: '#EF4444' } };

export default function EmployeeLeavePage() {
    return (
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B', fontSize: '1.5rem', mb: 0.5 }}>My Leave</Typography>
            <Typography variant="body2" sx={{ color: '#64748B', mb: 3 }}>Leave balances and requests</Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                {balances.map((b) => (
                    <Card key={b.type} sx={{ p: 2, flex: 1, borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: 'none', textAlign: 'center' }}>
                        <Typography variant="caption" sx={{ color: '#64748B' }}>{b.type}</Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#2563EB' }}>{b.remaining}</Typography>
                        <Typography variant="caption" sx={{ color: '#94A3B8' }}>{b.used} used of {b.total}</Typography>
                    </Card>
                ))}
            </Box>
            <Paper sx={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid #E2E8F0', boxShadow: 'none' }}>
                <TableContainer><Table>
                    <TableHead><TableRow sx={{ bgcolor: '#F8FAFC' }}>
                        <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.78rem' }}>Type</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.78rem' }}>From</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.78rem' }}>To</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.78rem' }}>Days</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.78rem' }}>Reason</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.78rem' }}>Status</TableCell>
                    </TableRow></TableHead>
                    <TableBody>{leave.map((l, i) => (
                        <TableRow key={i} hover>
                            <TableCell sx={{ fontWeight: 500, fontSize: '0.82rem' }}>{l.type}</TableCell>
                            <TableCell sx={{ fontSize: '0.82rem', color: '#475569' }}>{l.from}</TableCell>
                            <TableCell sx={{ fontSize: '0.82rem', color: '#475569' }}>{l.to}</TableCell>
                            <TableCell sx={{ fontWeight: 600, fontSize: '0.82rem' }}>{l.days}</TableCell>
                            <TableCell sx={{ color: '#475569', fontSize: '0.82rem' }}>{l.reason}</TableCell>
                            <TableCell><Chip label={l.status} size="small" sx={{ bgcolor: st[l.status].bg, color: st[l.status].text, fontWeight: 600, fontSize: '0.68rem', height: 22 }} /></TableCell>
                        </TableRow>
                    ))}</TableBody>
                </Table></TableContainer>
            </Paper>
        </Box>
    );
}
