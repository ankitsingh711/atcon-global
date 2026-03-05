'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';

interface ExpenseData { description: string; category: string; amount: string; date: string; status: string; }
const st: Record<string, { bg: string; text: string }> = { Pending: { bg: '#FEF3C7', text: '#D97706' }, Approved: { bg: '#DCFCE7', text: '#16A34A' }, Rejected: { bg: '#FEE2E2', text: '#EF4444' } };

export default function EmployeeExpensesPage() {
    const [expenses, setExpenses] = useState<ExpenseData[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try { setLoading(true); const res = await fetch('/api/employee'); const json = await res.json(); if (json.success) setExpenses(json.data.expenses || []); }
        catch { console.error('Failed to load expenses'); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}><CircularProgress /></Box>;

    return (
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B', fontSize: '1.5rem', mb: 0.5 }}>My Expenses</Typography>
            <Typography variant="body2" sx={{ color: '#64748B', mb: 3 }}>Expense claims and reimbursements</Typography>
            <Paper sx={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid #E2E8F0', boxShadow: 'none' }}>
                <TableContainer><Table>
                    <TableHead><TableRow sx={{ bgcolor: '#F8FAFC' }}>
                        {['Description', 'Category', 'Amount', 'Date', 'Status'].map((h) => <TableCell key={h} sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.78rem' }}>{h}</TableCell>)}
                    </TableRow></TableHead>
                    <TableBody>{expenses.map((e, i) => (
                        <TableRow key={i} hover>
                            <TableCell sx={{ fontWeight: 500, fontSize: '0.82rem' }}>{e.description}</TableCell>
                            <TableCell><Chip label={e.category} size="small" sx={{ bgcolor: '#F1F5F9', color: '#475569', fontSize: '0.68rem', height: 22 }} /></TableCell>
                            <TableCell sx={{ fontWeight: 600, fontSize: '0.82rem' }}>{e.amount}</TableCell>
                            <TableCell sx={{ color: '#94A3B8', fontSize: '0.82rem' }}>{e.date}</TableCell>
                            <TableCell><Chip label={e.status} size="small" sx={{ bgcolor: (st[e.status] || st['Pending']).bg, color: (st[e.status] || st['Pending']).text, fontWeight: 600, fontSize: '0.68rem', height: 22 }} /></TableCell>
                        </TableRow>
                    ))}</TableBody>
                </Table></TableContainer>
            </Paper>
        </Box>
    );
}
