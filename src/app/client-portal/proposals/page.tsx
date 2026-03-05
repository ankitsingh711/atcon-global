'use client';
import React from 'react';
import { Box, Typography, Card, Chip, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const proposals = [
    { title: 'Marketing Dashboard Redesign', date: 'Mar 4, 2026', value: '$35,000', status: 'Pending Review', timeline: '8 weeks' },
    { title: 'Data Analytics Platform', date: 'Feb 28, 2026', value: '$72,000', status: 'Accepted', timeline: '14 weeks' },
    { title: 'Mobile App v2.0', date: 'Feb 20, 2026', value: '$55,000', status: 'Accepted', timeline: '12 weeks' },
    { title: 'API Gateway Migration', date: 'Feb 15, 2026', value: '$18,000', status: 'Declined', timeline: '4 weeks' },
];
const st: Record<string, { bg: string; text: string }> = { 'Pending Review': { bg: '#FEF3C7', text: '#D97706' }, Accepted: { bg: '#DCFCE7', text: '#16A34A' }, Declined: { bg: '#FEE2E2', text: '#EF4444' } };

export default function ClientProposalsPage() {
    return (
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B', fontSize: '1.5rem', mb: 0.5 }}>Proposals</Typography>
            <Typography variant="body2" sx={{ color: '#64748B', mb: 3 }}>{proposals.length} proposals</Typography>
            <Paper sx={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid #E2E8F0', boxShadow: 'none' }}>
                <TableContainer><Table>
                    <TableHead><TableRow sx={{ bgcolor: '#F8FAFC' }}>
                        <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.78rem' }}>Proposal</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.78rem' }}>Date</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.78rem' }}>Value</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.78rem' }}>Timeline</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.78rem' }}>Status</TableCell>
                    </TableRow></TableHead>
                    <TableBody>{proposals.map((p) => (
                        <TableRow key={p.title} hover>
                            <TableCell sx={{ fontWeight: 600, fontSize: '0.85rem' }}>{p.title}</TableCell>
                            <TableCell sx={{ color: '#94A3B8', fontSize: '0.82rem' }}>{p.date}</TableCell>
                            <TableCell sx={{ fontWeight: 600, fontSize: '0.82rem' }}>{p.value}</TableCell>
                            <TableCell sx={{ color: '#475569', fontSize: '0.82rem' }}>{p.timeline}</TableCell>
                            <TableCell><Chip label={p.status} size="small" sx={{ bgcolor: st[p.status].bg, color: st[p.status].text, fontWeight: 600, fontSize: '0.68rem', height: 22 }} /></TableCell>
                        </TableRow>
                    ))}</TableBody>
                </Table></TableContainer>
            </Paper>
        </Box>
    );
}
