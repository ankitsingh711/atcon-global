'use client';

import React, { useState } from 'react';
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

type SortField = 'name' | 'client' | 'status' | 'projectManager' | 'startDate' | 'endDate' | 'budget' | 'spent' | 'progress';
type SortDirection = 'asc' | 'desc';

export default function ProjectTable() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { projects } = useAppSelector((state) => state.projects);

    const [selected, setSelected] = useState<string[]>([]);
    const [sortField, setSortField] = useState<SortField>('name');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [menuProjectId, setMenuProjectId] = useState<string | null>(null);

    // Sort projects locally
    const sortedProjects = [...projects].sort((a, b) => {
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
            setSelected(sortedProjects.map((p) => p._id));
        } else {
            setSelected([]);
        }
    };

    const handleSelectOne = (id: string) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
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

    const formatCurrency = (val: number) => {
        return `$${val.toLocaleString()}`;
    };

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

    return (
        <Paper sx={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #E2E8F0', boxShadow: 'none' }}>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox" sx={{ pl: 2 }}>
                                <Checkbox
                                    size="small"
                                    indeterminate={selected.length > 0 && selected.length < sortedProjects.length}
                                    checked={sortedProjects.length > 0 && selected.length === sortedProjects.length}
                                    onChange={handleSelectAll}
                                    sx={{
                                        color: '#CBD5E1',
                                        '&.Mui-checked': { color: '#16A34A' },
                                        '&.MuiCheckbox-indeterminate': { color: '#16A34A' },
                                    }}
                                />
                            </TableCell>
                            {columns.map((col) => (
                                <TableCell key={col.field} sx={{ width: col.width }}>
                                    <TableSortLabel
                                        active={sortField === col.field}
                                        direction={sortField === col.field ? sortDirection : 'asc'}
                                        onClick={() => handleSort(col.field)}
                                        sx={{
                                            '& .MuiTableSortLabel-icon': {
                                                opacity: 0.5,
                                                fontSize: '1rem',
                                            },
                                        }}
                                    >
                                        {col.label}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                            <TableCell sx={{ width: 48 }} />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedProjects.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={11} align="center" sx={{ py: 8 }}>
                                    <Typography variant="body1" color="text.secondary">
                                        No projects found. Create one to get started!
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            sortedProjects.map((project: IProject) => (
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
                                    <TableCell padding="checkbox" sx={{ pl: 2 }} onClick={(e) => e.stopPropagation()}>
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
                                    <TableCell onClick={(e) => e.stopPropagation()}>
                                        <IconButton size="small" onClick={(e) => handleMenuOpen(e, project._id)}>
                                            <MoreIcon sx={{ fontSize: '1.1rem', color: '#94A3B8' }} />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Actions Menu */}
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
