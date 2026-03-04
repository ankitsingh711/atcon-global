'use client';

import React, { useCallback, useEffect } from 'react';
import { Box, InputBase, Button, IconButton, Tooltip } from '@mui/material';
import {
    Search as SearchIcon,
    FilterList as FilterIcon,
    Settings as ColumnsIcon,
    FileDownload as ExportIcon,
    ViewList as ListIcon,
    ViewColumn as KanbanIcon,
    GridView as GridIcon,
    Add as AddIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setSearchQuery, fetchProjects } from '@/store/slices/projectSlice';
import { openCreateDrawer, setViewMode } from '@/store/slices/uiSlice';
import { ViewMode } from '@/types';

export default function ProjectFilters() {
    const dispatch = useAppDispatch();
    const { searchQuery } = useAppSelector((state) => state.projects);
    const { viewMode } = useAppSelector((state) => state.ui);

    // Debounce search
    const debounceRef = React.useRef<NodeJS.Timeout | null>(null);

    const handleSearchChange = useCallback(
        (value: string) => {
            dispatch(setSearchQuery(value));
            if (debounceRef.current) clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(() => {
                dispatch(fetchProjects());
            }, 400);
        },
        [dispatch]
    );

    useEffect(() => {
        return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    }, []);

    const viewModes: { mode: ViewMode; icon: React.ReactNode; label: string }[] = [
        { mode: 'list', icon: <ListIcon />, label: 'List View' },
        { mode: 'kanban', icon: <KanbanIcon />, label: 'Kanban View' },
        { mode: 'grid', icon: <GridIcon />, label: 'Grid View' },
    ];

    const handleExport = () => {
        // Export to CSV
        const headers = ['Project Name', 'Client', 'Status', 'PM', 'Start Date', 'End Date', 'Budget', 'Spent', 'Progress'];
        const csvContent = headers.join(',') + '\n';
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'projects.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
            {/* Top Row: Title + View Toggle + Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    {/* View Mode Toggle */}
                    <Box
                        sx={{
                            display: 'flex',
                            backgroundColor: '#F1F5F9',
                            borderRadius: '8px',
                            p: 0.4,
                        }}
                    >
                        {viewModes.map(({ mode, icon, label }) => (
                            <Tooltip key={mode} title={label}>
                                <IconButton
                                    size="small"
                                    onClick={() => dispatch(setViewMode(mode))}
                                    sx={{
                                        borderRadius: '6px',
                                        px: 1,
                                        py: 0.5,
                                        backgroundColor: viewMode === mode ? '#FFFFFF' : 'transparent',
                                        boxShadow: viewMode === mode ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                        color: viewMode === mode ? '#1E293B' : '#94A3B8',
                                        '& .MuiSvgIcon-root': { fontSize: '1.15rem' },
                                        '&:hover': { backgroundColor: viewMode === mode ? '#FFFFFF' : '#E2E8F0' },
                                        transition: 'all 0.15s ease',
                                    }}
                                >
                                    {icon}
                                </IconButton>
                            </Tooltip>
                        ))}
                    </Box>

                    <Button
                        variant="outlined"
                        startIcon={<ColumnsIcon sx={{ fontSize: '1rem !important' }} />}
                        sx={{
                            color: '#475569',
                            borderColor: '#E2E8F0',
                            fontSize: '0.82rem',
                            '&:hover': { borderColor: '#CBD5E1', backgroundColor: '#F8FAFC' },
                        }}
                    >
                        Columns
                    </Button>

                    <Button
                        variant="outlined"
                        startIcon={<FilterIcon sx={{ fontSize: '1rem !important' }} />}
                        sx={{
                            color: '#475569',
                            borderColor: '#E2E8F0',
                            fontSize: '0.82rem',
                            '&:hover': { borderColor: '#CBD5E1', backgroundColor: '#F8FAFC' },
                        }}
                    >
                        Filters
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => dispatch(openCreateDrawer())}
                        sx={{
                            backgroundColor: '#16A34A',
                            fontWeight: 600,
                            fontSize: '0.85rem',
                            px: 2.5,
                            '&:hover': { backgroundColor: '#15803D' },
                        }}
                    >
                        New Project
                    </Button>
                </Box>
            </Box>

            {/* Search + Filter Bar */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {/* Search Input */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        flex: 1,
                        maxWidth: 400,
                        backgroundColor: '#FFFFFF',
                        borderRadius: '10px',
                        border: '1px solid #E2E8F0',
                        px: 1.5,
                        py: 0.5,
                        transition: 'all 0.2s ease',
                        '&:focus-within': {
                            borderColor: '#16A34A',
                            boxShadow: '0 0 0 3px rgba(22, 163, 74, 0.1)',
                        },
                    }}
                >
                    <SearchIcon sx={{ color: '#94A3B8', fontSize: '1.2rem', mr: 1 }} />
                    <InputBase
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        sx={{
                            fontSize: '0.85rem',
                            flex: 1,
                            '& ::placeholder': { color: '#94A3B8' },
                        }}
                    />
                </Box>

                <Box sx={{ flexGrow: 1 }} />

                <Button
                    variant="outlined"
                    startIcon={<FilterIcon sx={{ fontSize: '1rem !important' }} />}
                    sx={{
                        color: '#475569',
                        borderColor: '#E2E8F0',
                        fontSize: '0.82rem',
                        '&:hover': { borderColor: '#CBD5E1', backgroundColor: '#F8FAFC' },
                    }}
                >
                    Filter
                </Button>

                <Button
                    variant="outlined"
                    startIcon={<ColumnsIcon sx={{ fontSize: '1rem !important' }} />}
                    sx={{
                        color: '#475569',
                        borderColor: '#E2E8F0',
                        fontSize: '0.82rem',
                        '&:hover': { borderColor: '#CBD5E1', backgroundColor: '#F8FAFC' },
                    }}
                >
                    Columns
                </Button>

                <Button
                    variant="outlined"
                    startIcon={<ExportIcon sx={{ fontSize: '1rem !important' }} />}
                    onClick={handleExport}
                    sx={{
                        color: '#475569',
                        borderColor: '#E2E8F0',
                        fontSize: '0.82rem',
                        '&:hover': { borderColor: '#CBD5E1', backgroundColor: '#F8FAFC' },
                    }}
                >
                    Export
                </Button>
            </Box>
        </Box>
    );
}
