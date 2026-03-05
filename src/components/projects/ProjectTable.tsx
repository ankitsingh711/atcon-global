'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Checkbox,
    IconButton,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Typography,
    TableSortLabel,
    Paper,
    Button,
} from '@mui/material';
import {
    MoreVert as MoreIcon,
    Visibility as ViewIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { deleteProject, fetchProjects } from '@/store/slices/projectSlice';
import { openEditDrawer } from '@/store/slices/uiSlice';
import StatusBadge from './StatusBadge';
import ProgressBar from './ProgressBar';
import { IProject } from '@/types';

type SortField =
    | 'name'
    | 'client'
    | 'status'
    | 'projectManager'
    | 'startDate'
    | 'endDate'
    | 'budget'
    | 'spent'
    | 'progress';
type SortDirection = 'asc' | 'desc';

const kanbanColumns: Array<{
    label: IProject['status'];
    bg: string;
    text: string;
}> = [
    { label: 'Planning', bg: '#FEF3C7', text: '#D97706' },
    { label: 'In Progress', bg: '#DBEAFE', text: '#2563EB' },
    { label: 'On Hold', bg: '#F1F5F9', text: '#64748B' },
    { label: 'Completed', bg: '#DCFCE7', text: '#16A34A' },
    { label: 'Cancelled', bg: '#FEE2E2', text: '#DC2626' },
];

export default function ProjectTable() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { projects } = useAppSelector((state) => state.projects);
    const { viewMode } = useAppSelector((state) => state.ui);

    const [selected, setSelected] = useState<string[]>([]);
    const [sortField, setSortField] = useState<SortField>('name');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [menuProjectId, setMenuProjectId] = useState<string | null>(null);

    const sortedProjects = useMemo(() => {
        return [...projects].sort((a, b) => {
            const multiplier = sortDirection === 'asc' ? 1 : -1;
            const aVal = a[sortField];
            const bVal = b[sortField];

            if (typeof aVal === 'string' && typeof bVal === 'string') {
                return multiplier * aVal.localeCompare(bVal);
            }
            if (typeof aVal === 'number' && typeof bVal === 'number') {
                return multiplier * (aVal - bVal);
            }
            return 0;
        });
    }, [projects, sortDirection, sortField]);

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setSelected(sortedProjects.map((project) => project._id));
        } else {
            setSelected([]);
        }
    };

    const handleSelectOne = (id: string) => {
        setSelected((previous) =>
            previous.includes(id) ? previous.filter((selectedId) => selectedId !== id) : [...previous, id]
        );
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, projectId: string) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setMenuProjectId(projectId);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setMenuProjectId(null);
    };

    const handleView = (id: string) => {
        handleMenuClose();
        router.push(`/projects/${id}`);
    };

    const handleEdit = (id: string) => {
        handleMenuClose();
        dispatch(openEditDrawer(id));
    };

    const handleDelete = async (id: string) => {
        handleMenuClose();
        if (window.confirm('Are you sure you want to delete this project?')) {
            await dispatch(deleteProject(id));
            dispatch(fetchProjects());
        }
    };

    const formatDate = (dateStr: string) => {
        try {
            return format(new Date(dateStr), 'MMM d, yyyy');
        } catch {
            return dateStr;
        }
    };

    const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

    const columns: { field: SortField; label: string; width?: string | number }[] = [
        { field: 'name', label: 'Project Name', width: '18%' },
        { field: 'client', label: 'Client', width: '14%' },
        { field: 'status', label: 'Status', width: '10%' },
        { field: 'projectManager', label: 'PM', width: '12%' },
        { field: 'startDate', label: 'Start Date', width: '10%' },
        { field: 'endDate', label: 'End Date', width: '10%' },
        { field: 'budget', label: 'Budget', width: '8%' },
        { field: 'spent', label: 'Spent', width: '8%' },
        { field: 'progress', label: 'Progress', width: '10%' },
    ];

    if (sortedProjects.length === 0) {
        return (
            <Paper
                sx={{
                    borderRadius: '16px',
                    border: '1px solid #E2E8F0',
                    boxShadow: 'none',
                    p: 6,
                    textAlign: 'center',
                }}
            >
                <Typography variant="body1" color="text.secondary">
                    No projects found. Create one to get started!
                </Typography>
            </Paper>
        );
    }

    if (viewMode === 'kanban') {
        return (
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, minmax(220px, 1fr))',
                    gap: 2,
                    alignItems: 'start',
                }}
            >
                {kanbanColumns.map((column) => {
                    const columnProjects = sortedProjects.filter(
                        (project) => project.status === column.label
                    );

                    return (
                        <Paper
                            key={column.label}
                            sx={{
                                borderRadius: '12px',
                                border: '1px solid #E2E8F0',
                                backgroundColor: '#FFFFFF',
                                overflow: 'hidden',
                            }}
                        >
                            <Box
                                sx={{
                                    px: 1.5,
                                    py: 1.25,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    backgroundColor: '#F8FAFC',
                                    borderBottom: '1px solid #E2E8F0',
                                }}
                            >
                                <Typography variant="body2" sx={{ fontWeight: 700, color: '#1E293B' }}>
                                    {column.label}
                                </Typography>
                                <Box
                                    sx={{
                                        minWidth: 24,
                                        height: 22,
                                        borderRadius: '999px',
                                        px: 0.8,
                                        display: 'grid',
                                        placeItems: 'center',
                                        backgroundColor: column.bg,
                                        color: column.text,
                                        fontSize: '0.72rem',
                                        fontWeight: 700,
                                    }}
                                >
                                    {columnProjects.length}
                                </Box>
                            </Box>

                            <Box sx={{ p: 1.2, display: 'grid', gap: 1 }}>
                                {columnProjects.length === 0 ? (
                                    <Typography
                                        variant="caption"
                                        sx={{ color: '#94A3B8', p: 1, display: 'block' }}
                                    >
                                        No projects
                                    </Typography>
                                ) : (
                                    columnProjects.map((project) => (
                                        <Paper
                                            key={project._id}
                                            onClick={() => handleView(project._id)}
                                            sx={{
                                                p: 1.4,
                                                borderRadius: '10px',
                                                border: '1px solid #E2E8F0',
                                                cursor: 'pointer',
                                                boxShadow: 'none',
                                                '&:hover': {
                                                    backgroundColor: '#FAFBFC',
                                                    borderColor: '#CBD5E1',
                                                },
                                            }}
                                        >
                                            <Typography
                                                variant="body2"
                                                sx={{ fontWeight: 700, color: '#1E293B', mb: 0.8 }}
                                            >
                                                {project.name}
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                sx={{ display: 'block', color: '#64748B', mb: 0.8 }}
                                            >
                                                {project.client}
                                            </Typography>
                                            <ProgressBar value={project.progress} />
                                            <Box
                                                sx={{
                                                    mt: 1.2,
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                }}
                                                onClick={(event) => event.stopPropagation()}
                                            >
                                                <Typography
                                                    variant="caption"
                                                    sx={{ color: '#475569' }}
                                                >
                                                    {formatCurrency(project.budget)}
                                                </Typography>
                                                <Box sx={{ display: 'flex', gap: 0.4 }}>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleView(project._id)}
                                                    >
                                                        <ViewIcon sx={{ fontSize: '1rem', color: '#64748B' }} />
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleEdit(project._id)}
                                                    >
                                                        <EditIcon sx={{ fontSize: '1rem', color: '#3B82F6' }} />
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleDelete(project._id)}
                                                    >
                                                        <DeleteIcon sx={{ fontSize: '1rem', color: '#EF4444' }} />
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                        </Paper>
                                    ))
                                )}
                            </Box>
                        </Paper>
                    );
                })}
            </Box>
        );
    }

    if (viewMode === 'grid') {
        return (
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
                    gap: 2,
                }}
            >
                {sortedProjects.map((project) => (
                    <Paper
                        key={project._id}
                        onClick={() => handleView(project._id)}
                        sx={{
                            p: 2.2,
                            borderRadius: '14px',
                            border: '1px solid #E2E8F0',
                            boxShadow: 'none',
                            cursor: 'pointer',
                            '&:hover': {
                                backgroundColor: '#FAFBFC',
                                borderColor: '#CBD5E1',
                            },
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                justifyContent: 'space-between',
                                gap: 1,
                                mb: 1.5,
                            }}
                        >
                            <Box>
                                <Typography
                                    variant="body1"
                                    sx={{ fontWeight: 700, color: '#1E293B', lineHeight: 1.3 }}
                                >
                                    {project.name}
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#64748B' }}>
                                    {project.client}
                                </Typography>
                            </Box>
                            <StatusBadge status={project.status} />
                        </Box>

                        <Box sx={{ mb: 1.4 }}>
                            <ProgressBar value={project.progress} />
                        </Box>

                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: 0.8,
                                mb: 1.4,
                            }}
                        >
                            <Typography variant="caption" sx={{ color: '#64748B' }}>
                                PM: {project.projectManager}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#64748B', textAlign: 'right' }}>
                                {formatDate(project.endDate)}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#1E293B', fontWeight: 600 }}>
                                {formatCurrency(project.budget)}
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{ color: '#475569', textAlign: 'right' }}
                            >
                                Spent {formatCurrency(project.spent)}
                            </Typography>
                        </Box>

                        <Box
                            sx={{ display: 'flex', gap: 1 }}
                            onClick={(event) => event.stopPropagation()}
                        >
                            <Button
                                size="small"
                                variant="outlined"
                                startIcon={<ViewIcon sx={{ fontSize: '0.95rem !important' }} />}
                                onClick={() => handleView(project._id)}
                                sx={{
                                    borderColor: '#E2E8F0',
                                    color: '#475569',
                                    textTransform: 'none',
                                    fontSize: '0.75rem',
                                    '&:hover': { borderColor: '#CBD5E1', backgroundColor: '#F8FAFC' },
                                }}
                            >
                                View
                            </Button>
                            <Button
                                size="small"
                                variant="outlined"
                                startIcon={<EditIcon sx={{ fontSize: '0.95rem !important' }} />}
                                onClick={() => handleEdit(project._id)}
                                sx={{
                                    borderColor: '#DBEAFE',
                                    color: '#2563EB',
                                    textTransform: 'none',
                                    fontSize: '0.75rem',
                                    '&:hover': { borderColor: '#93C5FD', backgroundColor: '#EFF6FF' },
                                }}
                            >
                                Edit
                            </Button>
                            <Button
                                size="small"
                                variant="outlined"
                                startIcon={<DeleteIcon sx={{ fontSize: '0.95rem !important' }} />}
                                onClick={() => handleDelete(project._id)}
                                sx={{
                                    borderColor: '#FECACA',
                                    color: '#DC2626',
                                    textTransform: 'none',
                                    fontSize: '0.75rem',
                                    '&:hover': { borderColor: '#FCA5A5', backgroundColor: '#FEF2F2' },
                                }}
                            >
                                Delete
                            </Button>
                        </Box>
                    </Paper>
                ))}
            </Box>
        );
    }

    return (
        <Paper
            sx={{
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid #E2E8F0',
                boxShadow: 'none',
            }}
        >
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox" sx={{ pl: 2 }}>
                                <Checkbox
                                    size="small"
                                    indeterminate={
                                        selected.length > 0 && selected.length < sortedProjects.length
                                    }
                                    checked={
                                        sortedProjects.length > 0 &&
                                        selected.length === sortedProjects.length
                                    }
                                    onChange={handleSelectAll}
                                    sx={{
                                        color: '#CBD5E1',
                                        '&.Mui-checked': { color: '#16A34A' },
                                        '&.MuiCheckbox-indeterminate': { color: '#16A34A' },
                                    }}
                                />
                            </TableCell>
                            {columns.map((column) => (
                                <TableCell key={column.field} sx={{ width: column.width }}>
                                    <TableSortLabel
                                        active={sortField === column.field}
                                        direction={sortField === column.field ? sortDirection : 'asc'}
                                        onClick={() => handleSort(column.field)}
                                        sx={{
                                            '& .MuiTableSortLabel-icon': {
                                                opacity: 0.5,
                                                fontSize: '1rem',
                                            },
                                        }}
                                    >
                                        {column.label}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                            <TableCell sx={{ width: 48 }} />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedProjects.map((project) => (
                            <TableRow
                                key={project._id}
                                hover
                                sx={{
                                    cursor: 'pointer',
                                    '&:hover': { backgroundColor: '#FAFBFC' },
                                    transition: 'background-color 0.15s ease',
                                }}
                                onClick={() => handleView(project._id)}
                            >
                                <TableCell
                                    padding="checkbox"
                                    sx={{ pl: 2 }}
                                    onClick={(event) => event.stopPropagation()}
                                >
                                    <Checkbox
                                        size="small"
                                        checked={selected.includes(project._id)}
                                        onChange={() => handleSelectOne(project._id)}
                                        sx={{
                                            color: '#CBD5E1',
                                            '&.Mui-checked': { color: '#16A34A' },
                                        }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#1E293B' }}>
                                        {project.name}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" sx={{ color: '#475569' }}>
                                        {project.client}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <StatusBadge status={project.status} />
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" sx={{ color: '#475569' }}>
                                        {project.projectManager}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.8rem' }}>
                                        {formatDate(project.startDate)}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.8rem' }}>
                                        {formatDate(project.endDate)}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#1E293B' }}>
                                        {formatCurrency(project.budget)}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" sx={{ color: '#475569' }}>
                                        {formatCurrency(project.spent)}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <ProgressBar value={project.progress} />
                                </TableCell>
                                <TableCell onClick={(event) => event.stopPropagation()}>
                                    <IconButton
                                        size="small"
                                        onClick={(event) => handleMenuOpen(event, project._id)}
                                    >
                                        <MoreIcon sx={{ fontSize: '1.1rem', color: '#94A3B8' }} />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                sx={{
                    '& .MuiPaper-root': {
                        borderRadius: '10px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        border: '1px solid #E2E8F0',
                        minWidth: 160,
                    },
                }}
            >
                <MenuItem
                    onClick={() => menuProjectId && handleView(menuProjectId)}
                    sx={{ fontSize: '0.85rem', py: 1 }}
                >
                    <ListItemIcon>
                        <ViewIcon fontSize="small" sx={{ color: '#64748B' }} />
                    </ListItemIcon>
                    <ListItemText>View Details</ListItemText>
                </MenuItem>
                <MenuItem
                    onClick={() => menuProjectId && handleEdit(menuProjectId)}
                    sx={{ fontSize: '0.85rem', py: 1 }}
                >
                    <ListItemIcon>
                        <EditIcon fontSize="small" sx={{ color: '#3B82F6' }} />
                    </ListItemIcon>
                    <ListItemText>Edit Project</ListItemText>
                </MenuItem>
                <MenuItem
                    onClick={() => menuProjectId && handleDelete(menuProjectId)}
                    sx={{ fontSize: '0.85rem', py: 1, color: '#EF4444' }}
                >
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" sx={{ color: '#EF4444' }} />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                </MenuItem>
            </Menu>
        </Paper>
    );
}
