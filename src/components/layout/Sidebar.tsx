'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    Avatar,
    Divider,
    Badge,
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    TrendingUp as SalesIcon,
    People as ContactsIcon,
    BusinessCenter as ClientsIcon,
    FolderOpen as ProjectsIcon,
    Settings as SettingsIcon,
    HelpOutline as HelpIcon,
    Logout as LogoutIcon,
} from '@mui/icons-material';

const SIDEBAR_WIDTH = 260;

interface NavItem {
    label: string;
    icon: React.ReactNode;
    path: string;
    badge?: number;
}

const mainNavItems: NavItem[] = [
    { label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { label: 'Sales', icon: <SalesIcon />, path: '/sales' },
    { label: 'Contacts', icon: <ContactsIcon />, path: '/contacts' },
    { label: 'Clients', icon: <ClientsIcon />, path: '/clients' },
    { label: 'Projects', icon: <ProjectsIcon />, path: '/projects', badge: 12 },
];

const bottomNavItems: NavItem[] = [
    { label: 'Settings', icon: <SettingsIcon />, path: '/settings' },
    { label: 'Help & Support', icon: <HelpIcon />, path: '/help' },
];

export default function Sidebar() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname?.startsWith(path);

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: SIDEBAR_WIDTH,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: SIDEBAR_WIDTH,
                    boxSizing: 'border-box',
                    background: 'linear-gradient(180deg, #0F172A 0%, #1E293B 100%)',
                    borderRight: 'none',
                    borderRadius: 0,
                    color: '#CBD5E1',
                },
            }}
        >
            {/* Logo / Brand */}
            <Box sx={{ px: 2.5, py: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                    sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #16A34A 0%, #22C55E 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Typography variant="h6" sx={{ color: '#fff', fontWeight: 800, fontSize: '1rem' }}>
                        O
                    </Typography>
                </Box>
                <Box>
                    <Typography
                        variant="h6"
                        sx={{ color: '#F8FAFC', fontWeight: 700, fontSize: '1rem', lineHeight: 1.2 }}
                    >
                        Operations Hub
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.7rem' }}>
                        Internal Portal
                    </Typography>
                </Box>
            </Box>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mx: 2 }} />

            {/* Main Navigation */}
            <Box sx={{ px: 1.5, py: 1 }}>
                <Typography
                    variant="overline"
                    sx={{
                        color: '#475569',
                        fontSize: '0.65rem',
                        fontWeight: 600,
                        letterSpacing: '0.1em',
                        px: 1.5,
                        py: 1,
                        display: 'block',
                    }}
                >
                    Main Menu
                </Typography>
                <List disablePadding>
                    {mainNavItems.map((item) => (
                        <ListItem key={item.label} disablePadding sx={{ mb: 0.3 }}>
                            <Link href={item.path} passHref style={{ textDecoration: 'none', width: '100%' }}>
                                <ListItemButton
                                    sx={{
                                        borderRadius: '10px',
                                        py: 1,
                                        px: 1.5,
                                        color: isActive(item.path) ? '#FFFFFF' : '#94A3B8',
                                        backgroundColor: isActive(item.path) ? 'rgba(22, 163, 74, 0.15)' : 'transparent',
                                        '&:hover': {
                                            backgroundColor: isActive(item.path)
                                                ? 'rgba(22, 163, 74, 0.2)'
                                                : 'rgba(255,255,255,0.05)',
                                            color: '#FFFFFF',
                                        },
                                        transition: 'all 0.2s ease',
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 36,
                                            color: isActive(item.path) ? '#22C55E' : '#64748B',
                                            '& .MuiSvgIcon-root': { fontSize: '1.25rem' },
                                        }}
                                    >
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.label}
                                        primaryTypographyProps={{
                                            fontSize: '0.85rem',
                                            fontWeight: isActive(item.path) ? 600 : 400,
                                        }}
                                    />
                                    {item.badge && (
                                        <Badge
                                            sx={{
                                                '& .MuiBadge-badge': {
                                                    position: 'static',
                                                    transform: 'none',
                                                    backgroundColor: isActive(item.path)
                                                        ? 'rgba(22, 163, 74, 0.3)'
                                                        : 'rgba(255,255,255,0.1)',
                                                    color: isActive(item.path) ? '#22C55E' : '#94A3B8',
                                                    fontSize: '0.7rem',
                                                    fontWeight: 600,
                                                    minWidth: 24,
                                                    height: 22,
                                                    borderRadius: 6,
                                                },
                                            }}
                                            badgeContent={item.badge}
                                        />
                                    )}
                                </ListItemButton>
                            </Link>
                        </ListItem>
                    ))}
                </List>
            </Box>

            {/* Spacer */}
            <Box sx={{ flexGrow: 1 }} />

            {/* Bottom Navigation */}
            <Box sx={{ px: 1.5, pb: 1 }}>
                <List disablePadding>
                    {bottomNavItems.map((item) => (
                        <ListItem key={item.label} disablePadding sx={{ mb: 0.3 }}>
                            <ListItemButton
                                sx={{
                                    borderRadius: '10px',
                                    py: 1,
                                    px: 1.5,
                                    color: '#94A3B8',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255,255,255,0.05)',
                                        color: '#FFFFFF',
                                    },
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 36,
                                        color: '#64748B',
                                        '& .MuiSvgIcon-root': { fontSize: '1.25rem' },
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.label}
                                    primaryTypographyProps={{ fontSize: '0.85rem' }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mx: 2 }} />

            {/* User Profile */}
            <Box sx={{ px: 2, py: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar
                    sx={{
                        width: 36,
                        height: 36,
                        bgcolor: '#6366F1',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                    }}
                >
                    AS
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                        variant="body2"
                        sx={{ color: '#F1F5F9', fontWeight: 600, fontSize: '0.82rem', lineHeight: 1.3 }}
                    >
                        Ankit Singh
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.7rem' }}>
                        Administrator
                    </Typography>
                </Box>
                <LogoutIcon sx={{ fontSize: '1.1rem', color: '#64748B', cursor: 'pointer' }} />
            </Box>
        </Drawer>
    );
}

export { SIDEBAR_WIDTH };
