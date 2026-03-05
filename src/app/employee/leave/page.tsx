'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Card, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';

interface LeaveBalance { type: string; total: number; used: number; remaining: number; }
interface LeaveRequest { type: string; from: string; to: string; days: number; reason: string; status: string; }
const st: Record<string, { bg: string; text: string }> = { Pending: { bg: '#FEF3C7', text: '#D97706' }, Approved: { bg: '#DCFCE7', text: '#16A34A' }, Rejected: { bg: '#FEE2E2', text: '#EF4444' } };

export default function EmployeeLeavePage() {
    const [balances, setBalances] = useState<LeaveBalance[]>([]);
    const [requests, setRequests] = useState<LeaveRequest[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try { setLoading(true); const res = await fetch('/api/employee'); const json = await res.json(); if (json.success) { setBalances(json.data.leave?.balances || []); setRequests(json.data.leave?.requests || []); } }
        catch { console.error('Failed to load leave data'); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}><CircularProgress /></Box>;

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
                        {['Type', 'From', 'To', 'Days', 'Reason', 'Status'].map((h) => <TableCell key={h} sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.78rem' }}>{h}</TableCell>)}
                    </TableRow></TableHead>
                    <TableBody>{requests.map((l, i) => (
                        <TableRow key={i} hover>
                            <TableCell sx={{ fontWeight: 500, fontSize: '0.82rem' }}>{l.type}</TableCell>
                            <TableCell sx={{ fontSize: '0.82rem', color: '#475569' }}>{l.from}</TableCell>
                            <TableCell sx={{ fontSize: '0.82rem', color: '#475569' }}>{l.to}</TableCell>
                            <TableCell sx={{ fontWeight: 600, fontSize: '0.82rem' }}>{l.days}</TableCell>
                            <TableCell sx={{ color: '#475569', fontSize: '0.82rem' }}>{l.reason}</TableCell>
                            <TableCell><Chip label={l.status} size="small" sx={{ bgcolor: (st[l.status] || st['Pending']).bg, color: (st[l.status] || st['Pending']).text, fontWeight: 600, fontSize: '0.68rem', height: 22 }} /></TableCell>
                        </TableRow>
                    ))}</TableBody>
                </Table></TableContainer>
            </Paper>
        </Box>
    );
}
