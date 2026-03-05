'use client';
import React from 'react';
import { Box, Typography, Card, Avatar, List, ListItem, ListItemText, ListItemIcon, Chip } from '@mui/material';
import { PictureAsPdf as PdfIcon, InsertDriveFile as FileIcon } from '@mui/icons-material';

const documents = [
    { name: 'Master Services Agreement', type: 'PDF', size: '3.2 MB', date: 'Jan 2024', category: 'Contract' },
    { name: 'Statement of Work - Website', type: 'PDF', size: '1.5 MB', date: 'Feb 2024', category: 'SOW' },
    { name: 'Brand Guidelines', type: 'PDF', size: '8.4 MB', date: 'Jan 2024', category: 'Branding' },
    { name: 'Project Timeline', type: 'XLS', size: '420 KB', date: 'Mar 2026', category: 'Planning' },
    { name: 'Meeting Notes - Kickoff', type: 'DOC', size: '180 KB', date: 'Feb 2024', category: 'Notes' },
];

export default function ClientDocumentsPage() {
    return (
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B', fontSize: '1.5rem', mb: 0.5 }}>Documents</Typography>
            <Typography variant="body2" sx={{ color: '#64748B', mb: 3 }}>{documents.length} shared documents</Typography>
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
