'use client';

import React from 'react';
import {
    Box,
    AppBar,
    Toolbar,
    InputBase,
    IconButton,
    Badge,
    Avatar,
    Typography,
} from '@mui/material';
import {
    Search as SearchIcon,
    NotificationsNoneOutlined as NotificationIcon,
    ChatBubbleOutline as ChatIcon,
} from '@mui/icons-material';
import { SIDEBAR_WIDTH } from './Sidebar';

export default function Header() {
    return (
        <AppBar
            position="fixed"
            elevation={0}
            sx={{
                width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
                ml: `${SIDEBAR_WIDTH}px`,
                backgroundColor: '#FFFFFF',
                borderBottom: '1px solid #E2E8F0',
                zIndex: (theme) => theme.zIndex.drawer - 1,
            }}
        >
            <Toolbar sx={{ justifyContent: 'space-between', minHeight: '64px !important', px: 3 }}>
                {/* Global Search */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: '#F8FAFC',
                        borderRadius: '10px',
                        border: '1px solid #E2E8F0',
                        px: 1.5,
                        py: 0.5,
                        width: 320,
                        transition: 'all 0.2s ease',
                        '&:focus-within': {
                            borderColor: '#16A34A',
                            boxShadow: '0 0 0 3px rgba(22, 163, 74, 0.1)',
                        },
                    }}
                >
                    <SearchIcon sx={{ color: '#94A3B8', fontSize: '1.2rem', mr: 1 }} />
                    <InputBase
                        placeholder="Search anything..."
                        sx={{
                            fontSize: '0.85rem',
                            color: '#1E293B',
                            flex: 1,
                            '& ::placeholder': { color: '#94A3B8' },
                        }}
                    />
                    <Typography
                        variant="caption"
                        sx={{
                            backgroundColor: '#E2E8F0',
                            color: '#64748B',
                            px: 0.8,
                            py: 0.2,
                            borderRadius: 1,
                            fontSize: '0.65rem',
                            fontWeight: 500,
                        }}
                    >
                        ⌘K
                    </Typography>
                </Box>

                {/* Right Actions */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton
                        size="small"
                        sx={{
                            color: '#64748B',
                            '&:hover': { backgroundColor: '#F1F5F9' },
                        }}
                    >
                        <Badge
                            variant="dot"
                            color="error"
                            sx={{ '& .MuiBadge-badge': { width: 8, height: 8, minWidth: 8 } }}
                        >
                            <NotificationIcon sx={{ fontSize: '1.3rem' }} />
                        </Badge>
                    </IconButton>

                    <IconButton
                        size="small"
                        sx={{
                            color: '#64748B',
                            '&:hover': { backgroundColor: '#F1F5F9' },
                        }}
                    >
                        <ChatIcon sx={{ fontSize: '1.25rem' }} />
                    </IconButton>

                    <Box sx={{ ml: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar
                            sx={{
                                width: 34,
                                height: 34,
                                bgcolor: '#6366F1',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                            }}
                        >
                            AS
                        </Avatar>
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
