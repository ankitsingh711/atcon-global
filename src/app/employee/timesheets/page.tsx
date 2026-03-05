'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';

interface TimesheetData { week: string; project: string; hours: number; status: string; }
const st: Record<string, { bg: string; text: string }> = { Submitted: { bg: '#FEF3C7', text: '#D97706' }, Approved: { bg: '#DCFCE7', text: '#16A34A' }, Draft: { bg: '#F1F5F9', text: '#64748B' } };

export default function EmployeeTimesheetsPage() {
    const [timesheets, setTimesheets] = useState<TimesheetData[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try { setLoading(true); const res = await fetch('/api/employee'); const json = await res.json(); if (json.success) setTimesheets(json.data.timesheets || []); }
        catch { console.error('Failed to load timesheets'); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}><CircularProgress /></Box>;

    return (
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B', fontSize: '1.5rem', mb: 0.5 }}>My Timesheets</Typography>
            <Typography variant="body2" sx={{ color: '#64748B', mb: 3 }}>Weekly timesheet records</Typography>
            <Paper sx={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid #E2E8F0', boxShadow: 'none' }}>
                <TableContainer><Table>
                    <TableHead><TableRow sx={{ bgcolor: '#F8FAFC' }}>
                        {['Week', 'Project', 'Hours', 'Status'].map((h) => <TableCell key={h} sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.78rem' }}>{h}</TableCell>)}
                    </TableRow></TableHead>
                    <TableBody>{timesheets.map((t, i) => (
                        <TableRow key={i} hover>
                            <TableCell sx={{ fontWeight: 500, fontSize: '0.82rem' }}>{t.week}</TableCell>
                            <TableCell sx={{ fontSize: '0.82rem', color: '#475569' }}>{t.project}</TableCell>
                            <TableCell sx={{ fontWeight: 600, fontSize: '0.82rem' }}>{t.hours}h</TableCell>
                            <TableCell><Chip label={t.status} size="small" sx={{ bgcolor: (st[t.status] || st['Draft']).bg, color: (st[t.status] || st['Draft']).text, fontWeight: 600, fontSize: '0.68rem', height: 22 }} /></TableCell>
                        </TableRow>
                    ))}</TableBody>
                </Table></TableContainer>
            </Paper>
        </Box>
    );
}
