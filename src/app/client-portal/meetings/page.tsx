'use client';
import React from 'react';
import { Box, Typography, Card, Chip, Avatar, Grid } from '@mui/material';
import { Videocam as VideoIcon, CalendarMonth as CalIcon } from '@mui/icons-material';

const meetings = [
    { title: 'Weekly Standup', date: 'Mar 6, 2026', time: '10:00 AM', duration: '30 min', type: 'Video Call', attendees: ['JD', 'SJ', 'MC'] },
    { title: 'Sprint Review', date: 'Mar 7, 2026', time: '2:00 PM', duration: '1 hour', type: 'Video Call', attendees: ['JD', 'SJ', 'MC', 'DK'] },
    { title: 'Budget Review', date: 'Mar 10, 2026', time: '11:00 AM', duration: '45 min', type: 'In Person', attendees: ['JD', 'LP'] },
    { title: 'Design Review', date: 'Mar 12, 2026', time: '3:00 PM', duration: '1 hour', type: 'Video Call', attendees: ['SJ', 'ER'] },
];

export default function ClientMeetingsPage() {
    return (
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B', fontSize: '1.5rem', mb: 0.5 }}>Meetings</Typography>
            <Typography variant="body2" sx={{ color: '#64748B', mb: 3 }}>{meetings.length} upcoming meetings</Typography>
            <Grid container spacing={2}>
                {meetings.map((m, i) => (
                    <Grid size={{ xs: 12, md: 6 }} key={i}>
                        <Card sx={{ p: 2.5, borderRadius: '14px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '0.9rem' }}>{m.title}</Typography>
                                <Chip label={m.type} size="small" icon={m.type === 'Video Call' ? <VideoIcon sx={{ fontSize: '0.8rem !important' }} /> : undefined} sx={{ bgcolor: m.type === 'Video Call' ? '#EFF6FF' : '#F1F5F9', color: m.type === 'Video Call' ? '#2563EB' : '#475569', fontWeight: 600, fontSize: '0.65rem', height: 22 }} />
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <CalIcon sx={{ fontSize: '0.9rem', color: '#94A3B8' }} />
                                <Typography variant="caption" sx={{ color: '#64748B' }}>{m.date} at {m.time} • {m.duration}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: -0.5 }}>
                                {m.attendees.map((a) => <Avatar key={a} sx={{ width: 26, height: 26, fontSize: '0.6rem', bgcolor: '#6366F1', border: '2px solid #fff' }}>{a}</Avatar>)}
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
