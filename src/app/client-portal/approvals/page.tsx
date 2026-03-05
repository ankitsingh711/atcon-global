'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Avatar, IconButton } from '@mui/material';
import { CheckCircle as ApproveIcon, Cancel as RejectIcon } from '@mui/icons-material';

interface ApprovalData { _id: string; type: string; title: string; freelancer?: string; project?: string; week?: string; hours?: number; amount?: number; status: string; }

const st: Record<string, { bg: string; text: string }> = { Pending: { bg: '#FEF3C7', text: '#D97706' }, Approved: { bg: '#DCFCE7', text: '#16A34A' }, Rejected: { bg: '#FEE2E2', text: '#EF4444' } };

export default function ClientApprovalsPage() {
    const [approvals, setApprovals] = useState<ApprovalData[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try { setLoading(true); const res = await fetch('/api/approvals'); const json = await res.json(); if (json.success) setApprovals(json.data || []); }
        catch { console.error('Failed to load approvals'); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}><CircularProgress /></Box>;

    return (
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B', fontSize: '1.5rem', mb: 0.5 }}>Approvals</Typography>
            <Typography variant="body2" sx={{ color: '#64748B', mb: 3 }}>{approvals.filter((a) => a.status === 'Pending').length} pending approval</Typography>
            <Paper sx={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid #E2E8F0', boxShadow: 'none' }}>
                <TableContainer><Table>
                    <TableHead><TableRow sx={{ bgcolor: '#F8FAFC' }}>
                        {['Type', 'Title', 'Project', 'Status', 'Actions'].map((h) => <TableCell key={h} sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.78rem' }}>{h}</TableCell>)}
                    </TableRow></TableHead>
                    <TableBody>{approvals.map((a) => (
                        <TableRow key={a._id} hover>
                            <TableCell><Chip label={a.type} size="small" sx={{ bgcolor: '#EEF2FF', color: '#6366F1', fontWeight: 600, fontSize: '0.68rem', height: 22 }} /></TableCell>
                            <TableCell sx={{ fontWeight: 500, fontSize: '0.82rem' }}>{a.title}</TableCell>
                            <TableCell sx={{ color: '#475569', fontSize: '0.82rem' }}>{a.project || '-'}</TableCell>
                            <TableCell><Chip label={a.status} size="small" sx={{ bgcolor: (st[a.status] || st['Pending']).bg, color: (st[a.status] || st['Pending']).text, fontWeight: 600, fontSize: '0.68rem', height: 22 }} /></TableCell>
                            <TableCell>{a.status === 'Pending' && <Box sx={{ display: 'flex', gap: 0.5 }}><IconButton size="small" sx={{ color: '#16A34A', bgcolor: '#DCFCE7' }}><ApproveIcon sx={{ fontSize: '1rem' }} /></IconButton><IconButton size="small" sx={{ color: '#EF4444', bgcolor: '#FEE2E2' }}><RejectIcon sx={{ fontSize: '1rem' }} /></IconButton></Box>}</TableCell>
                        </TableRow>
                    ))}</TableBody>
                </Table></TableContainer>
            </Paper>
        </Box>
    );
}
