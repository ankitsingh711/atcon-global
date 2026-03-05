'use client';

import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import theme from '@/theme/theme';
import ReduxProvider from '@/store/provider';
import PortalSidebar, { PORTAL_SIDEBAR_WIDTH } from '@/components/layout/PortalSidebar';

export default function ClientPortalLayout({ children }: { children: React.ReactNode }) {
    return (
        <ReduxProvider>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Box sx={{ display: 'flex', minHeight: '100vh' }}>
                    <PortalSidebar portalType="client" />
                    <Box
                        component="main"
                        sx={{
                            flexGrow: 1,
                            width: `calc(100% - ${PORTAL_SIDEBAR_WIDTH}px)`,
                            minHeight: '100vh',
                            backgroundColor: '#F1F5F9',
                            p: 3,
                        }}
                    >
                        {children}
                    </Box>
                </Box>
            </ThemeProvider>
        </ReduxProvider>
    );
}
