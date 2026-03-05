'use client';

import React, { useState } from 'react';
import {
    Box, Typography, Card, Grid, Avatar, Chip, Button,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Tabs, Tab, LinearProgress,
} from '@mui/material';
import {
    AccountBalance as BankIcon,
    TrendingUp as RevenueIcon,
    TrendingDown as ExpenseIcon,
    Receipt as InvoiceIcon,
    AttachMoney as MoneyIcon,
} from '@mui/icons-material';

const invoices = [
    { number: 'INV-2026-001', client: 'Acme Corporation', amount: '$28,500', date: 'Mar 1, 2026', status: 'Paid', dueDate: 'Mar 15, 2026' },
    { number: 'INV-2026-002', client: 'Global Finance Ltd', amount: '$15,200', date: 'Feb 28, 2026', status: 'Pending', dueDate: 'Mar 14, 2026' },
    { number: 'INV-2026-003', client: 'Tech Startup Inc', amount: '$42,000', date: 'Feb 25, 2026', status: 'Overdue', dueDate: 'Mar 10, 2026' },
    { number: 'INV-2025-012', client: 'Creative Agency', amount: '$18,750', date: 'Feb 20, 2026', status: 'Paid', dueDate: 'Mar 5, 2026' },
    { number: 'INV-2025-011', client: 'Acme Corporation', amount: '$33,400', date: 'Feb 15, 2026', status: 'Paid', dueDate: 'Mar 1, 2026' },
];

const expenses = [
    { category: 'Software Licenses', amount: '$4,200', date: 'Mar 2, 2026', status: 'Approved' },
    { category: 'Office Supplies', amount: '$850', date: 'Mar 1, 2026', status: 'Pending' },
    { category: 'Travel', amount: '$2,100', date: 'Feb 28, 2026', status: 'Approved' },
    { category: 'Contractor Payment', amount: '$12,500', date: 'Feb 25, 2026', status: 'Approved' },
];

const statusStyles: Record<string, { bg: string; text: string }> = {
    Paid: { bg: '#DCFCE7', text: '#16A34A' },
    Pending: { bg: '#FEF3C7', text: '#D97706' },
    Overdue: { bg: '#FEE2E2', text: '#EF4444' },
    Approved: { bg: '#DCFCE7', text: '#16A34A' },
};

export default function FinancePage() {
    const [tab, setTab] = useState(0);

    const stats = [
        { label: 'Total Revenue', value: '$248,500', change: '+12.5%', icon: <RevenueIcon />, color: '#16A34A', bg: '#F0FDF4' },
        { label: 'Outstanding', value: '$57,200', change: '3 invoices', icon: <MoneyIcon />, color: '#F59E0B', bg: '#FFFBEB' },
        { label: 'Expenses', value: '$19,650', change: '-8.2%', icon: <ExpenseIcon />, color: '#EF4444', bg: '#FEF2F2' },
        { label: 'Net Profit', value: '$228,850', change: '+15.1%', icon: <BankIcon />, color: '#6366F1', bg: '#EEF2FF' },
    ];

    return (
        <Box sx={{ px: 3.5, py: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B', fontSize: '1.5rem' }}>Finance</Typography>
                    <Typography variant="body2" sx={{ color: '#64748B' }}>Financial overview and invoicing</Typography>
                </Box>
                <Button variant="contained" startIcon={<InvoiceIcon />} sx={{ bgcolor: '#16A34A', borderRadius: '10px', textTransform: 'none', fontWeight: 600, '&:hover': { bgcolor: '#15803D' } }}>
                    Create Invoice
                </Button>
            </Box>

            <Grid container spacing={2.5} sx={{ mb: 3 }}>
                {stats.map((stat) => (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.label}>
                        <Card sx={{ p: 2.5, borderRadius: '14px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar sx={{ bgcolor: stat.bg, color: stat.color, width: 44, height: 44 }}>{stat.icon}</Avatar>
                                <Box>
                                    <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.72rem' }}>{stat.label}</Typography>
                                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#1E293B', lineHeight: 1 }}>{stat.value}</Typography>
                                    <Typography variant="caption" sx={{ color: stat.color, fontWeight: 600, fontSize: '0.7rem' }}>{stat.change}</Typography>
                                </Box>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3, '& .MuiTab-root': { textTransform: 'none', fontWeight: 500, fontSize: '0.85rem' }, '& .Mui-selected': { color: '#16A34A !important' }, '& .MuiTabs-indicator': { bgcolor: '#16A34A' } }}>
                <Tab label="Invoices" />
                <Tab label="Expenses" />
            </Tabs>

            {tab === 0 && (
                <Paper sx={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid #E2E8F0', boxShadow: 'none' }}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                                    <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.78rem' }}>Invoice</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.78rem' }}>Client</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.78rem' }}>Amount</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.78rem' }}>Date</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.78rem' }}>Due Date</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.78rem' }}>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {invoices.map((inv) => (
                                    <TableRow key={inv.number} hover>
                                        <TableCell sx={{ fontWeight: 600, color: '#1E293B', fontSize: '0.82rem' }}>{inv.number}</TableCell>
                                        <TableCell sx={{ color: '#475569', fontSize: '0.82rem' }}>{inv.client}</TableCell>
                                        <TableCell sx={{ fontWeight: 600, color: '#1E293B', fontSize: '0.82rem' }}>{inv.amount}</TableCell>
                                        <TableCell sx={{ color: '#94A3B8', fontSize: '0.82rem' }}>{inv.date}</TableCell>
                                        <TableCell sx={{ color: '#94A3B8', fontSize: '0.82rem' }}>{inv.dueDate}</TableCell>
                                        <TableCell><Chip label={inv.status} size="small" sx={{ bgcolor: statusStyles[inv.status].bg, color: statusStyles[inv.status].text, fontWeight: 600, fontSize: '0.68rem', height: 22 }} /></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}

            {tab === 1 && (
                <Paper sx={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid #E2E8F0', boxShadow: 'none' }}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                                    <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.78rem' }}>Category</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.78rem' }}>Amount</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.78rem' }}>Date</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.78rem' }}>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {expenses.map((exp, i) => (
                                    <TableRow key={i} hover>
                                        <TableCell sx={{ fontWeight: 500, color: '#1E293B', fontSize: '0.82rem' }}>{exp.category}</TableCell>
                                        <TableCell sx={{ fontWeight: 600, color: '#1E293B', fontSize: '0.82rem' }}>{exp.amount}</TableCell>
                                        <TableCell sx={{ color: '#94A3B8', fontSize: '0.82rem' }}>{exp.date}</TableCell>
                                        <TableCell><Chip label={exp.status} size="small" sx={{ bgcolor: statusStyles[exp.status].bg, color: statusStyles[exp.status].text, fontWeight: 600, fontSize: '0.68rem', height: 22 }} /></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}
        </Box>
    );
}
