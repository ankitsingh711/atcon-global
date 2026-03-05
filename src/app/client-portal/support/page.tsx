'use client';
import React from 'react';
import { Box, Typography, Chip, List, ListItem, ListItemText, ListItemIcon, Card } from '@mui/material';
import { Circle as DotIcon } from '@mui/icons-material';

const tickets = [
    { title: 'Access issue with project files', status: 'Open', priority: 'High', time: '2 hours ago' },
    { title: 'Invoice discrepancy for January', status: 'Open', priority: 'Medium', time: '1 day ago' },
    { title: 'Cannot download report PDF', status: 'Resolved', priority: 'Low', time: '3 days ago' },
    { title: 'Request for additional user accounts', status: 'Resolved', priority: 'Medium', time: '1 week ago' },
];
const st: Record<string, { bg: string; text: string }> = { Open: { bg: '#FEE2E2', text: '#EF4444' }, Resolved: { bg: '#DCFCE7', text: '#16A34A' } };
const pt: Record<string, string> = { High: '#EF4444', Medium: '#F59E0B', Low: '#16A34A' };

export default function ClientSupportPage() {
    return (
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B', fontSize: '1.5rem', mb: 0.5 }}>Support</Typography>
            <Typography variant="body2" sx={{ color: '#64748B', mb: 3 }}>{tickets.filter((t) => t.status === 'Open').length} open tickets</Typography>
            <Card sx={{ borderRadius: '14px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                <List disablePadding>
                    {tickets.map((t, i) => (
                        <ListItem key={i} sx={{ px: 2.5, py: 1.5, borderBottom: i < tickets.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                            <ListItemIcon sx={{ minWidth: 28 }}><DotIcon sx={{ fontSize: '0.6rem', color: pt[t.priority] }} /></ListItemIcon>
                            <ListItemText primary={t.title} secondary={`${t.status} • ${t.time}`} primaryTypographyProps={{ fontSize: '0.88rem', fontWeight: 500 }} secondaryTypographyProps={{ fontSize: '0.72rem' }} />
                            <Chip label={t.status} size="small" sx={{ bgcolor: st[t.status].bg, color: st[t.status].text, fontWeight: 600, fontSize: '0.65rem', height: 22 }} />
                        </ListItem>
                    ))}
                </List>
            </Card>
        </Box>
    );
}
