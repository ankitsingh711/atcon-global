'use client';
import React from 'react';
import { Box, Typography, Card, Chip, Avatar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { CheckCircle as ApproveIcon, Cancel as RejectIcon } from '@mui/icons-material';

const approvals = [
    { freelancer: 'Sarah Johnson', project: 'Website Redesign', week: 'Mar 3-7', hours: 42, amount: '$3,990', status: 'Pending' },
    { freelancer: 'Mike Chen', project: 'E-Commerce Platform', week: 'Mar 3-7', hours: 38, amount: '$3,230', status: 'Pending' },
    { freelancer: 'Sarah Johnson', project: 'Website Redesign', week: 'Feb 24-28', hours: 40, amount: '$3,800', status: 'Approved' },
    { freelancer: 'David Kim', project: 'CRM Integration', week: 'Feb 24-28', hours: 20, amount: '$2,000', status: 'Approved' },
];
const st: Record<string, { bg: string; text: string }> = { Pending: { bg: '#FEF3C7', text: '#D97706' }, Approved: { bg: '#DCFCE7', text: '#16A34A' }, Rejected: { bg: '#FEE2E2', text: '#EF4444' } };

export default function ClientApprovalsPage() {
    return (
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B', fontSize: '1.5rem', mb: 0.5 }}>Approvals</Typography>
            <Typography variant="body2" sx={{ color: '#64748B', mb: 3 }}>{approvals.filter((a) => a.status === 'Pending').length} pending approval</Typography>
            <Paper sx={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid #E2E8F0', boxShadow: 'none' }}>
                <TableContainer><Table>
                    <TableHead><TableRow sx={{ bgcolor: '#F8FAFC' }}>
                        <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.78rem' }}>Freelancer</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.78rem' }}>Project</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.78rem' }}>Week</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.78rem' }}>Hours</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.78rem' }}>Amount</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.78rem' }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.78rem' }} align="center">Actions</TableCell>
                    </TableRow></TableHead>
                    <TableBody>{approvals.map((a, i) => (
                        <TableRow key={i} hover>
                            <TableCell><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Avatar sx={{ width: 28, height: 28, fontSize: '0.65rem', bgcolor: '#6366F1' }}>{a.freelancer.split(' ').map((n) => n[0]).join('')}</Avatar><Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.82rem' }}>{a.freelancer}</Typography></Box></TableCell>
                            <TableCell sx={{ color: '#475569', fontSize: '0.82rem' }}>{a.project}</TableCell>
                            <TableCell sx={{ color: '#475569', fontSize: '0.82rem' }}>{a.week}</TableCell>
                            <TableCell sx={{ fontWeight: 600, fontSize: '0.82rem' }}>{a.hours}h</TableCell>
                            <TableCell sx={{ fontWeight: 600, fontSize: '0.82rem' }}>{a.amount}</TableCell>
                            <TableCell><Chip label={a.status} size="small" sx={{ bgcolor: st[a.status].bg, color: st[a.status].text, fontWeight: 600, fontSize: '0.68rem', height: 22 }} /></TableCell>
                            <TableCell align="center">{a.status === 'Pending' && <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}><IconButton size="small" sx={{ color: '#16A34A', bgcolor: '#DCFCE7' }}><ApproveIcon sx={{ fontSize: '1rem' }} /></IconButton><IconButton size="small" sx={{ color: '#EF4444', bgcolor: '#FEE2E2' }}><RejectIcon sx={{ fontSize: '1rem' }} /></IconButton></Box>}</TableCell>
                        </TableRow>
                    ))}</TableBody>
                </Table></TableContainer>
            </Paper>
        </Box>
    );
}
