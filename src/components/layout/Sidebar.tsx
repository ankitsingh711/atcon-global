'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
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
    IconButton,
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
    Person as PersonIcon,
    Language as PortalIcon,
    Groups as TalentIcon,
    PeopleAlt as PeopleIcon,
    AttachMoney as FinanceIcon,
    SupportAgent as SupportIcon,
    DynamicForm as FormsIcon,
    AdminPanelSettings as AdminIcon,
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
    { label: 'Talent', icon: <TalentIcon />, path: '/talent' },
    { label: 'People', icon: <PeopleIcon />, path: '/people' },
    { label: 'Finance', icon: <FinanceIcon />, path: '/finance' },
    { label: 'Support', icon: <SupportIcon />, path: '/support' },
    { label: 'Forms & Intake', icon: <FormsIcon />, path: '/forms' },
    { label: 'Admin', icon: <AdminIcon />, path: '/admin' },
];

const portalNavItems: NavItem[] = [
    { label: 'Client Portal', icon: <PortalIcon />, path: '/client-portal' },
    { label: 'Employee Portal', icon: <PersonIcon />, path: '/employee' },
    { label: 'Freelancer Portal', icon: <PersonIcon />, path: '/freelancer' },
];

const bottomNavItems: NavItem[] = [
    { label: 'Settings', icon: <SettingsIcon />, path: '/settings' },
    { label: 'Help & Support', icon: <HelpIcon />, path: '/help' },
];


export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const isActive = (path: string) => pathname?.startsWith(path);

    async function handleLogout() {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
        } catch {
            // Ignore network errors and force logout flow on client side.
        } finally {
            router.push('/login');
            router.refresh();
        }
    }

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
                    color: '#FFFFFF',
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
                    <Typography variant="caption" sx={{ color: '#FFFFFF', fontSize: '0.7rem' }}>
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
                        color: '#FFFFFF',
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
                                        color: '#FFFFFF',
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
                                            color: '#FFFFFF',
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
                                                    color: '#FFFFFF',
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

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mx: 2, my: 0.5 }} />

            {/* Portal links */}
            <Box sx={{ px: 1.5, py: 0.5 }}>
                <Typography variant="overline" sx={{ color: '#FFFFFF', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.1em', px: 1.5, py: 0.5, display: 'block' }}>
                    Switch to Portal View:
                </Typography>
                <List disablePadding>
                    {portalNavItems.map((item) => (
                        <ListItem key={item.label} disablePadding sx={{ mb: 0.2 }}>
                            <Link href={item.path} passHref style={{ textDecoration: 'none', width: '100%' }}>
                                <ListItemButton sx={{ borderRadius: '10px', py: 0.7, px: 1.5, color: '#FFFFFF', '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' } }}>
                                    <ListItemIcon sx={{ minWidth: 32, color: '#FFFFFF', '& .MuiSvgIcon-root': { fontSize: '1.1rem' } }}>{item.icon}</ListItemIcon>
                                    <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: '0.78rem' }} />
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
                                    color: '#FFFFFF',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255,255,255,0.05)',
                                        color: '#FFFFFF',
                                    },
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 36,
                                        color: '#FFFFFF',
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
                        sx={{ color: '#FFFFFF', fontWeight: 600, fontSize: '0.82rem', lineHeight: 1.3 }}
                    >
                        Ankit Singh
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#FFFFFF', fontSize: '0.7rem' }}>
                        Administrator
                    </Typography>
                </Box>
                <IconButton
                    size="small"
                    onClick={handleLogout}
                    sx={{
                        color: '#FFFFFF',
                        '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' },
                    }}
                    aria-label="Log out"
                >
                    <LogoutIcon sx={{ fontSize: '1.1rem' }} />
                </IconButton>
            </Box>
        </Drawer>
    );
}

export { SIDEBAR_WIDTH };
