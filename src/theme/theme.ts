'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#16A34A',
            light: '#22C55E',
            dark: '#15803D',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: '#6366F1',
            light: '#818CF8',
            dark: '#4F46E5',
        },
        background: {
            default: '#F1F5F9',
            paper: '#FFFFFF',
        },
        text: {
            primary: '#1E293B',
            secondary: '#64748B',
        },
        grey: {
            50: '#F8FAFC',
            100: '#F1F5F9',
            200: '#E2E8F0',
            300: '#CBD5E1',
            400: '#94A3B8',
            500: '#64748B',
            600: '#475569',
            700: '#334155',
            800: '#1E293B',
            900: '#0F172A',
        },
        success: {
            main: '#16A34A',
            light: '#DCFCE7',
        },
        warning: {
            main: '#F59E0B',
            light: '#FEF3C7',
        },
        error: {
            main: '#EF4444',
            light: '#FEE2E2',
        },
        info: {
            main: '#3B82F6',
            light: '#DBEAFE',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h4: {
            fontWeight: 700,
            fontSize: '1.75rem',
            lineHeight: 1.3,
        },
        h5: {
            fontWeight: 600,
            fontSize: '1.25rem',
        },
        h6: {
            fontWeight: 600,
            fontSize: '1.125rem',
        },
        subtitle1: {
            fontSize: '0.95rem',
            color: '#64748B',
        },
        subtitle2: {
            fontSize: '0.85rem',
            fontWeight: 500,
            color: '#64748B',
        },
        body1: {
            fontSize: '0.9rem',
        },
        body2: {
            fontSize: '0.8rem',
        },
        button: {
            textTransform: 'none',
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: '8px 20px',
                    fontSize: '0.875rem',
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: 'none',
                    },
                },
                contained: {
                    '&:hover': {
                        boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03)',
                    border: '1px solid #E2E8F0',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderBottom: '1px solid #F1F5F9',
                    padding: '14px 16px',
                },
                head: {
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: '#64748B',
                    backgroundColor: '#FAFBFC',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 10,
                        '& fieldset': {
                            borderColor: '#E2E8F0',
                        },
                        '&:hover fieldset': {
                            borderColor: '#94A3B8',
                        },
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 6,
                    fontWeight: 500,
                    fontSize: '0.75rem',
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    borderRadius: '16px 0 0 16px',
                },
            },
        },
    },
});

export default theme;
