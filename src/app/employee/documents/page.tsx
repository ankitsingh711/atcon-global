'use client';
import React from 'react';
import { Box, Typography, Card, Avatar, List, ListItem, ListItemText, ListItemIcon, Chip } from '@mui/material';
import { Description as DocIcon, PictureAsPdf as PdfIcon, InsertDriveFile as FileIcon } from '@mui/icons-material';

const documents = [
    { name: 'Employment Contract', type: 'PDF', size: '2.4 MB', date: 'Jan 15, 2024', category: 'HR' },
    { name: 'Company Handbook', type: 'PDF', size: '5.1 MB', date: 'Jan 15, 2024', category: 'HR' },
    { name: 'Tax Declaration 2025', type: 'PDF', size: '1.2 MB', date: 'Jan 5, 2026', category: 'Finance' },
    { name: 'Performance Review Q4', type: 'DOC', size: '340 KB', date: 'Dec 20, 2025', category: 'Review' },
    { name: 'ID Proof', type: 'PDF', size: '890 KB', date: 'Jan 15, 2024', category: 'Personal' },
];

export default function EmployeeDocumentsPage() {
    return (
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B', fontSize: '1.5rem', mb: 0.5 }}>My Documents</Typography>
            <Typography variant="body2" sx={{ color: '#64748B', mb: 3 }}>{documents.length} documents</Typography>
            <Card sx={{ borderRadius: '14px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                <List disablePadding>
                    {documents.map((d, i) => (
                        <ListItem key={i} sx={{ px: 2.5, py: 1.5, borderBottom: i < documents.length - 1 ? '1px solid #F1F5F9' : 'none', '&:hover': { bgcolor: '#FAFAFA' } }}>
                            <ListItemIcon sx={{ minWidth: 40 }}><Avatar sx={{ bgcolor: d.type === 'PDF' ? '#FEE2E2' : '#EFF6FF', color: d.type === 'PDF' ? '#EF4444' : '#3B82F6', width: 32, height: 32 }}>{d.type === 'PDF' ? <PdfIcon sx={{ fontSize: '1rem' }} /> : <FileIcon sx={{ fontSize: '1rem' }} />}</Avatar></ListItemIcon>
                            <ListItemText primary={d.name} secondary={`${d.size} • ${d.date}`} primaryTypographyProps={{ fontSize: '0.88rem', fontWeight: 500 }} secondaryTypographyProps={{ fontSize: '0.72rem' }} />
                            <Chip label={d.category} size="small" sx={{ bgcolor: '#F1F5F9', color: '#475569', fontSize: '0.65rem', height: 22 }} />
                        </ListItem>
                    ))}
                </List>
            </Card>
        </Box>
    );
}
