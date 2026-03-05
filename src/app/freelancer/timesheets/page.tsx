'use client';
import React from 'react';
import { Box, Typography, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const timesheets = [
    { week: 'Mar 3 - Mar 7', project: 'Website Redesign', task: 'Frontend Dev', hours: 42, status: 'Submitted' },
    { week: 'Feb 24 - Feb 28', project: 'Website Redesign', task: 'Code Review', hours: 12.5, status: 'Approved' },
    { week: 'Feb 24 - Feb 28', project: 'E-Commerce Platform', task: 'API Integration', hours: 24, status: 'Approved' },
    { week: 'Feb 17 - Feb 21', project: 'Website Redesign', task: 'Frontend Dev', hours: 40, status: 'Approved' },
];
const st: Record<string, { bg: string; text: string }> = { Submitted: { bg: '#FEF3C7', text: '#D97706' }, Approved: { bg: '#DCFCE7', text: '#16A34A' } };

export default function FreelancerTimesheetsPage() {
    return (
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B', fontSize: '1.5rem', mb: 0.5 }}>My Timesheets</Typography>
            <Typography variant="body2" sx={{ color: '#64748B', mb: 3 }}>Weekly timesheet records</Typography>
            <Paper sx={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid #E2E8F0', boxShadow: 'none' }}>
                <TableContainer><Table>
                    <TableHead><TableRow sx={{ bgcolor: '#F8FAFC' }}>
                        <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.78rem' }}>Week</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.78rem' }}>Project</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.78rem' }}>Task</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.78rem' }}>Hours</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.78rem' }}>Status</TableCell>
                    </TableRow></TableHead>
                    <TableBody>{timesheets.map((t, i) => (
                        <TableRow key={i} hover>
                            <TableCell sx={{ fontWeight: 500, fontSize: '0.82rem' }}>{t.week}</TableCell>
                            <TableCell sx={{ color: '#475569', fontSize: '0.82rem' }}>{t.project}</TableCell>
                            <TableCell sx={{ color: '#475569', fontSize: '0.82rem' }}>{t.task}</TableCell>
                            <TableCell sx={{ fontWeight: 600, fontSize: '0.82rem' }}>{t.hours}h</TableCell>
                            <TableCell><Chip label={t.status} size="small" sx={{ bgcolor: st[t.status].bg, color: st[t.status].text, fontWeight: 600, fontSize: '0.68rem', height: 22 }} /></TableCell>
                        </TableRow>
                    ))}</TableBody>
                </Table></TableContainer>
            </Paper>
        </Box>
    );
}
