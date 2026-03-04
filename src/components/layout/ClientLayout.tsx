'use client';

import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import theme from '@/theme/theme';
import ReduxProvider from '@/store/provider';
import Sidebar, { SIDEBAR_WIDTH } from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <ReduxProvider>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F1F5F9' }}>
                    <Sidebar />
                    <Box
                        component="main"
                        sx={{
                            flexGrow: 1,
                            width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
                            minHeight: '100vh',
                        }}
                    >
                        <Header />
                        <Box
                            sx={{
                                pt: '64px', // Header height
                                minHeight: '100vh',
                            }}
                        >
                            {children}
                        </Box>
                    </Box>
                </Box>
            </ThemeProvider>
        </ReduxProvider>
    );
}
