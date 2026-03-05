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
    Divider,
} from '@mui/material';
import {
    Home as HomeIcon,
    FolderOpen as ProjectsIcon,
    Assignment as TasksIcon,
    AccessTime as TimesheetIcon,
    AccountBalanceWallet as ExpensesIcon,
    EventNote as LeaveIcon,
    Description as DocumentsIcon,
    WorkOutline as AssignmentsIcon,
    Article as ProposalsIcon,
    CheckCircleOutline as ApprovalsIcon,
    Receipt as InvoicesIcon,
    Groups as MeetingsIcon,
    SupportAgent as SupportIcon,
    DynamicForm as FormsIcon,
} from '@mui/icons-material';

const PORTAL_SIDEBAR_WIDTH = 220;

interface NavItem {
    label: string;
    icon: React.ReactNode;
    path: string;
}

const employeeNavItems: NavItem[] = [
    { label: 'Home', icon: <HomeIcon />, path: '/employee' },
    { label: 'My Projects', icon: <ProjectsIcon />, path: '/employee/projects' },
    { label: 'My Tasks', icon: <TasksIcon />, path: '/employee/tasks' },
    { label: 'My Timesheets', icon: <TimesheetIcon />, path: '/employee/timesheets' },
    { label: 'My Expenses', icon: <ExpensesIcon />, path: '/employee/expenses' },
    { label: 'My Leave', icon: <LeaveIcon />, path: '/employee/leave' },
    { label: 'My Documents', icon: <DocumentsIcon />, path: '/employee/documents' },
];

const freelancerNavItems: NavItem[] = [
    { label: 'Home', icon: <HomeIcon />, path: '/freelancer' },
    { label: 'My Assignments', icon: <AssignmentsIcon />, path: '/freelancer/assignments' },
    { label: 'My Tasks', icon: <TasksIcon />, path: '/freelancer/tasks' },
    { label: 'My Timesheets', icon: <TimesheetIcon />, path: '/freelancer/timesheets' },
    { label: 'My Expenses', icon: <ExpensesIcon />, path: '/freelancer/expenses' },
    { label: 'My Documents', icon: <DocumentsIcon />, path: '/freelancer/documents' },
];

const clientNavItems: NavItem[] = [
    { label: 'Home', icon: <HomeIcon />, path: '/client-portal' },
    { label: 'Projects', icon: <ProjectsIcon />, path: '/client-portal/projects' },
    { label: 'Proposals', icon: <ProposalsIcon />, path: '/client-portal/proposals' },
    { label: 'Approvals', icon: <ApprovalsIcon />, path: '/client-portal/approvals' },
    { label: 'Invoices', icon: <InvoicesIcon />, path: '/client-portal/invoices' },
    { label: 'Documents', icon: <DocumentsIcon />, path: '/client-portal/documents' },
    { label: 'Meetings', icon: <MeetingsIcon />, path: '/client-portal/meetings' },
    { label: 'Support', icon: <SupportIcon />, path: '/client-portal/support' },
    { label: 'Forms', icon: <FormsIcon />, path: '/client-portal/forms' },
];

const themes = {
    employee: {
        gradient: 'linear-gradient(180deg, #1E40AF 0%, #2563EB 100%)',
        activeBackground: 'rgba(255, 255, 255, 0.2)',
        hoverBackground: 'rgba(255, 255, 255, 0.1)',
        portalLabel: 'Employee Portal',
        subLabel: 'John Doe',
    },
    freelancer: {
        gradient: 'linear-gradient(180deg, #166534 0%, #16A34A 100%)',
        activeBackground: 'rgba(255, 255, 255, 0.2)',
        hoverBackground: 'rgba(255, 255, 255, 0.1)',
        portalLabel: 'Freelancer Portal',
        subLabel: 'Sarah Johnson',
    },
    client: {
        gradient: 'linear-gradient(180deg, #312E81 0%, #4F46E5 100%)',
        activeBackground: 'rgba(255, 255, 255, 0.2)',
        hoverBackground: 'rgba(255, 255, 255, 0.1)',
        portalLabel: 'Client Portal',
        subLabel: 'Acme Corporation',
    },
};

const navItemsMap = {
    employee: employeeNavItems,
    freelancer: freelancerNavItems,
    client: clientNavItems,
};

const homeRoutes = ['/employee', '/freelancer', '/client-portal'];

interface PortalSidebarProps {
    portalType: 'employee' | 'freelancer' | 'client';
    subLabel?: string;
}

export default function PortalSidebar({ portalType, subLabel }: PortalSidebarProps) {
    const pathname = usePathname();
    const theme = themes[portalType];
    const navItems = navItemsMap[portalType];
    const displaySubLabel = subLabel || theme.subLabel;

    const isActive = (path: string) => {
        if (homeRoutes.includes(path)) {
            return pathname === path;
        }
        return pathname?.startsWith(path);
    };

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: PORTAL_SIDEBAR_WIDTH,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: PORTAL_SIDEBAR_WIDTH,
                    boxSizing: 'border-box',
                    background: theme.gradient,
                    borderRight: 'none',
                    color: '#FFFFFF',
                },
            }}
        >
            {/* Portal Header */}
            <Box sx={{ px: 2.5, py: 2.5 }}>
                <Typography
                    variant="h6"
                    sx={{
                        color: '#FFFFFF',
                        fontWeight: 800,
                        fontSize: '1rem',
                        lineHeight: 1.3,
                    }}
                >
                    {theme.portalLabel}
                </Typography>
                <Typography
                    variant="caption"
                    sx={{
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: '0.75rem',
                    }}
                >
                    {displaySubLabel}
                </Typography>
            </Box>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.15)', mx: 1.5 }} />

            {/* Navigation */}
            <Box sx={{ px: 1, py: 1 }}>
                <List disablePadding>
                    {navItems.map((item) => {
                        const active = isActive(item.path);
                        return (
                            <ListItem key={item.label} disablePadding sx={{ mb: 0.3 }}>
                                <Link href={item.path} passHref style={{ textDecoration: 'none', width: '100%' }}>
                                    <ListItemButton
                                        sx={{
                                            borderRadius: '8px',
                                            py: 0.9,
                                            px: 1.5,
                                            color: '#FFFFFF',
                                            backgroundColor: active ? theme.activeBackground : 'transparent',
                                            '&:hover': {
                                                backgroundColor: active
                                                    ? theme.activeBackground
                                                    : theme.hoverBackground,
                                            },
                                            transition: 'all 0.15s ease',
                                        }}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                minWidth: 32,
                                                color: '#FFFFFF',
                                                '& .MuiSvgIcon-root': { fontSize: '1.15rem' },
                                            }}
                                        >
                                            {item.icon}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={item.label}
                                            primaryTypographyProps={{
                                                fontSize: '0.82rem',
                                                fontWeight: active ? 600 : 400,
                                            }}
                                        />
                                    </ListItemButton>
                                </Link>
                            </ListItem>
                        );
                    })}
                </List>
            </Box>
        </Drawer>
    );
}

export { PORTAL_SIDEBAR_WIDTH };
