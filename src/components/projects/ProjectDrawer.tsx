'use client';

import React, { useEffect, useState } from 'react';
import {
    Drawer,
    Box,
    Typography,
    TextField,
    Button,
    IconButton,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    FormControlLabel,
    Checkbox,
    Divider,
    CircularProgress,
    Alert,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { closeDrawer } from '@/store/slices/uiSlice';
import {
    createProject,
    updateProject,
    fetchProjects,
    fetchClients,
} from '@/store/slices/projectSlice';
import { ProjectFormData, ProjectStatus, BillingType } from '@/types';

const DRAWER_WIDTH = 520;

const statusOptions: ProjectStatus[] = ['Planning', 'In Progress', 'Completed', 'On Hold', 'Cancelled'];
const billingOptions: BillingType[] = ['Fixed Price', 'Hourly', 'Retainer'];
const pmOptions = ['John Doe', 'Jane Smith', 'Sarah Wilson', 'Mike Johnson', 'Emily Davis'];

const defaultFormData: ProjectFormData = {
    name: '',
    client: '',
    status: 'Planning',
    projectManager: '',
    description: '',
    startDate: '',
    endDate: '',
    billingType: 'Fixed Price',
    budget: 0,
    spent: 0,
    progress: 0,
    requireTimesheets: false,
    clientTimesheetApproval: false,
    tags: [],
};

export default function ProjectDrawer() {
    const dispatch = useAppDispatch();
    const { drawerOpen, drawerMode, editingProjectId } = useAppSelector((state) => state.ui);
    const { projects, clients, loading } = useAppSelector((state) => state.projects);

    const [formData, setFormData] = useState<ProjectFormData>(defaultFormData);
    const [tagsInput, setTagsInput] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitError, setSubmitError] = useState('');

    useEffect(() => {
        if (drawerOpen) {
            dispatch(fetchClients());
        }
    }, [drawerOpen, dispatch]);

    // Populate form when editing
    useEffect(() => {
        if (drawerMode === 'edit' && editingProjectId) {
            const project = projects.find((p) => p._id === editingProjectId);
            if (project) {
                setFormData({
                    name: project.name,
                    client: project.client,
                    status: project.status,
                    projectManager: project.projectManager,
                    description: project.description || '',
                    startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
                    endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : '',
                    billingType: project.billingType,
                    budget: project.budget,
                    spent: project.spent,
                    progress: project.progress,
                    requireTimesheets: project.requireTimesheets,
                    clientTimesheetApproval: project.clientTimesheetApproval,
                    tags: project.tags || [],
                });
                setTagsInput((project.tags || []).join(', '));
            }
        } else {
            setFormData(defaultFormData);
            setTagsInput('');
        }
        setErrors({});
        setSubmitError('');
    }, [drawerMode, editingProjectId, projects, drawerOpen]);

    const handleChange = (field: keyof ProjectFormData, value: unknown) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next[field];
                return next;
            });
        }
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) newErrors.name = 'Project name is required';
        if (!formData.client.trim()) newErrors.client = 'Client is required';
        if (!formData.projectManager.trim()) newErrors.projectManager = 'Project manager is required';
        if (!formData.startDate) newErrors.startDate = 'Start date is required';
        if (!formData.endDate) newErrors.endDate = 'End date is required';
        if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
            newErrors.endDate = 'End date must be after start date';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        setSubmitError('');

        const tags = tagsInput
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean);

        const payload = { ...formData, tags };

        try {
            if (drawerMode === 'edit' && editingProjectId) {
                await dispatch(updateProject({ id: editingProjectId, projectData: payload })).unwrap();
            } else {
                await dispatch(createProject(payload)).unwrap();
            }
            dispatch(closeDrawer());
            dispatch(fetchProjects());
        } catch {
            setSubmitError('Failed to save project. Please try again.');
        }
    };

    const handleClose = () => {
        dispatch(closeDrawer());
    };

    return (
        <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={handleClose}
            sx={{
                '& .MuiDrawer-paper': {
                    width: DRAWER_WIDTH,
                    borderRadius: '16px 0 0 16px',
                    boxShadow: '-4px 0 24px rgba(0,0,0,0.1)',
                },
                '& .MuiBackdrop-root': {
                    backgroundColor: 'rgba(15, 23, 42, 0.4)',
                },
            }}
        >
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Header */}
                <Box
                    sx={{
                        px: 3,
                        py: 2.5,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        borderBottom: '1px solid #E2E8F0',
                    }}
                >
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1E293B', fontSize: '1.3rem' }}>
                            {drawerMode === 'create' ? 'Create New Project' : 'Edit Project'}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#64748B', mt: 0.3 }}>
                            {drawerMode === 'create'
                                ? 'Set up project details and team'
                                : 'Update project information'}
                        </Typography>
                    </Box>
                    <IconButton onClick={handleClose} size="small" sx={{ color: '#94A3B8', mt: 0.5 }}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                {/* Form Body */}
                <Box sx={{ flex: 1, overflow: 'auto', px: 3, py: 3 }}>
                    {submitError && (
                        <Alert severity="error" sx={{ mb: 2, borderRadius: '10px' }} onClose={() => setSubmitError('')}>
                            {submitError}
                        </Alert>
                    )}

                    {/* Basic Information */}
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontSize: '1rem', color: '#1E293B' }}>
                        Basic Information
                    </Typography>

                    <TextField
                        fullWidth
                        label="Project Name"
                        placeholder="Website Redesign"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        error={!!errors.name}
                        helperText={errors.name}
                        sx={{ mb: 2.5 }}
                        size="small"
                    />

                    <Box sx={{ display: 'flex', gap: 2, mb: 2.5 }}>
                        <FormControl fullWidth size="small" error={!!errors.client}>
                            <InputLabel>Client</InputLabel>
                            <Select
                                value={formData.client}
                                label="Client"
                                onChange={(e) => handleChange('client', e.target.value)}
                                sx={{ borderRadius: '10px' }}
                            >
                                {clients.map((c) => (
                                    <MenuItem key={c._id} value={c.name}>
                                        {c.name}
                                    </MenuItem>
                                ))}
                                {/* Allow custom client names too */}
                                {!clients.find((c) => c.name === formData.client) && formData.client && (
                                    <MenuItem value={formData.client}>{formData.client}</MenuItem>
                                )}
                            </Select>
                            {errors.client && (
                                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                                    {errors.client}
                                </Typography>
                            )}
                        </FormControl>

                        <FormControl fullWidth size="small">
                            <InputLabel>Status *</InputLabel>
                            <Select
                                value={formData.status}
                                label="Status *"
                                onChange={(e) => handleChange('status', e.target.value)}
                                sx={{ borderRadius: '10px' }}
                            >
                                {statusOptions.map((s) => (
                                    <MenuItem key={s} value={s}>
                                        {s}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    <FormControl fullWidth size="small" sx={{ mb: 2.5 }} error={!!errors.projectManager}>
                        <InputLabel>Project Manager</InputLabel>
                        <Select
                            value={formData.projectManager}
                            label="Project Manager"
                            onChange={(e) => handleChange('projectManager', e.target.value)}
                            sx={{ borderRadius: '10px' }}
                        >
                            {pmOptions.map((pm) => (
                                <MenuItem key={pm} value={pm}>
                                    {pm}
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.projectManager && (
                            <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                                {errors.projectManager}
                            </Typography>
                        )}
                    </FormControl>

                    <Divider sx={{ my: 2.5, borderColor: '#F1F5F9' }} />

                    {/* Description */}
                    <Box
                        sx={{
                            border: '1px solid #16A34A',
                            borderRadius: '12px',
                            p: 2,
                            mb: 2.5,
                            backgroundColor: '#F0FDF4',
                        }}
                    >
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#16A34A', mb: 0.5, fontSize: '0.85rem' }}>
                            Project Description *
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#16A34A', display: 'block', mb: 1.5 }}>
                            Provide a clear overview of project goals, deliverables, and success criteria
                        </Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            placeholder="Describe the project objectives, scope, deliverables, and key milestones..."
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    backgroundColor: '#FFFFFF',
                                    borderRadius: '10px',
                                },
                            }}
                            size="small"
                        />
                    </Box>

                    <Divider sx={{ my: 2.5, borderColor: '#F1F5F9' }} />

                    {/* Timeline */}
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontSize: '1rem', color: '#1E293B' }}>
                        Timeline
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2, mb: 2.5 }}>
                        <TextField
                            fullWidth
                            label="Start Date"
                            type="date"
                            value={formData.startDate}
                            onChange={(e) => handleChange('startDate', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            error={!!errors.startDate}
                            helperText={errors.startDate}
                            size="small"
                        />
                        <TextField
                            fullWidth
                            label="End Date"
                            type="date"
                            value={formData.endDate}
                            onChange={(e) => handleChange('endDate', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            error={!!errors.endDate}
                            helperText={errors.endDate}
                            size="small"
                        />
                    </Box>

                    <Divider sx={{ my: 2.5, borderColor: '#F1F5F9' }} />

                    {/* Budget & Billing */}
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontSize: '1rem', color: '#1E293B' }}>
                        Budget & Billing
                    </Typography>

                    <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                        <InputLabel>Billing Type *</InputLabel>
                        <Select
                            value={formData.billingType}
                            label="Billing Type *"
                            onChange={(e) => handleChange('billingType', e.target.value)}
                            sx={{ borderRadius: '10px' }}
                        >
                            {billingOptions.map((bt) => (
                                <MenuItem key={bt} value={bt}>
                                    {bt}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Box sx={{ display: 'flex', gap: 2, mb: 2.5 }}>
                        <TextField
                            fullWidth
                            label="Total Budget"
                            type="number"
                            value={formData.budget}
                            onChange={(e) => handleChange('budget', Number(e.target.value))}
                            InputProps={{ inputProps: { min: 0 } }}
                            size="small"
                        />
                        <TextField
                            fullWidth
                            label="Spent"
                            type="number"
                            value={formData.spent}
                            onChange={(e) => handleChange('spent', Number(e.target.value))}
                            InputProps={{ inputProps: { min: 0 } }}
                            size="small"
                        />
                    </Box>

                    <TextField
                        fullWidth
                        label="Progress (%)"
                        type="number"
                        value={formData.progress}
                        onChange={(e) => handleChange('progress', Math.min(100, Math.max(0, Number(e.target.value))))}
                        InputProps={{ inputProps: { min: 0, max: 100 } }}
                        size="small"
                        sx={{ mb: 2.5 }}
                    />

                    <Divider sx={{ my: 2.5, borderColor: '#F1F5F9' }} />

                    {/* Project Settings */}
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5, fontSize: '1rem', color: '#1E293B' }}>
                        Project Settings
                    </Typography>

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={formData.requireTimesheets}
                                onChange={(e) => handleChange('requireTimesheets', e.target.checked)}
                                sx={{
                                    color: '#CBD5E1',
                                    '&.Mui-checked': { color: '#16A34A' },
                                }}
                            />
                        }
                        label={
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.85rem' }}>
                                    Require Timesheets
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                                    Team members must track time for this project
                                </Typography>
                            </Box>
                        }
                        sx={{ mb: 1, alignItems: 'flex-start' }}
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={formData.clientTimesheetApproval}
                                onChange={(e) => handleChange('clientTimesheetApproval', e.target.checked)}
                                sx={{
                                    color: '#CBD5E1',
                                    '&.Mui-checked': { color: '#16A34A' },
                                }}
                            />
                        }
                        label={
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.85rem' }}>
                                    Client Timesheet Approval
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                                    Client must approve timesheets before billing
                                </Typography>
                            </Box>
                        }
                        sx={{ mb: 2.5, alignItems: 'flex-start' }}
                    />

                    <Divider sx={{ my: 2.5, borderColor: '#F1F5F9' }} />

                    {/* Tags */}
                    <TextField
                        fullWidth
                        label="Tags (comma-separated)"
                        placeholder="Website, Design, Development"
                        value={tagsInput}
                        onChange={(e) => setTagsInput(e.target.value)}
                        size="small"
                        sx={{ mb: 2 }}
                    />
                </Box>

                {/* Footer */}
                <Box
                    sx={{
                        px: 3,
                        py: 2,
                        borderTop: '1px solid #E2E8F0',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 1.5,
                        backgroundColor: '#FAFBFC',
                    }}
                >
                    <Button
                        variant="outlined"
                        onClick={handleClose}
                        sx={{
                            color: '#475569',
                            borderColor: '#E2E8F0',
                            px: 3,
                            '&:hover': { borderColor: '#CBD5E1', backgroundColor: '#F8FAFC' },
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={loading}
                        sx={{
                            backgroundColor: '#16A34A',
                            px: 3,
                            '&:hover': { backgroundColor: '#15803D' },
                            '&:disabled': { backgroundColor: '#86EFAC' },
                        }}
                    >
                        {loading ? (
                            <CircularProgress size={20} sx={{ color: '#FFFFFF' }} />
                        ) : drawerMode === 'create' ? (
                            'Create Project'
                        ) : (
                            'Save Changes'
                        )}
                    </Button>
                </Box>
            </Box>
        </Drawer>
    );
}
