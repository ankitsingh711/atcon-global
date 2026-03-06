'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    Box,
    Typography,
    Button,
    Card,
    Chip,
    Grid,
    Divider,
    CircularProgress,
    IconButton,
    LinearProgress,
    Tabs,
    Tab,
    Avatar,
    AvatarGroup,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Checkbox,
    TextField,
    InputAdornment,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from '@mui/material';
import {
    ArrowBack as BackIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    CalendarToday as CalendarIcon,
    AttachMoney as MoneyIcon,
    Person as PersonIcon,
    Business as BusinessIcon,
    Description as DescriptionIcon,
    LocalOffer as TagIcon,
    CheckCircle as DoneIcon,
    RadioButtonUnchecked as TodoIcon,
    PlayCircle as InProgressIcon,
    InsertDriveFile as FileIcon,
    CloudUpload as UploadIcon,
    AccessTime as TimeIcon,
    Search as SearchIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProjectById, deleteProject, fetchProjects } from '@/store/slices/projectSlice';
import { openEditDrawer } from '@/store/slices/uiSlice';
import StatusBadge from '@/components/projects/StatusBadge';
import ProjectDrawer from '@/components/projects/ProjectDrawer';

// ---------- Mock Data ----------
interface Task {
    id: string;
    title: string;
    status: 'To Do' | 'In Progress' | 'Done';
    assignee: string;
    dueDate: string;
    priority: 'High' | 'Medium' | 'Low';
}

interface TeamMember {
    id: string;
    name: string;
    role: string;
    email: string;
    avatar: string;
    allocation: number;
    hoursLogged: number;
}

interface TimesheetEntry {
    id: string;
    member: string;
    date: string;
    hours: number;
    task: string;
    status: 'Approved' | 'Pending' | 'Rejected';
}

interface ProjectFile {
    id: string;
    name: string;
    type: string;
    size: string;
    uploadedBy: string;
    uploadedAt: string;
}

const mockTasks: Task[] = [
    { id: '1', title: 'Design homepage mockups', status: 'Done', assignee: 'Sarah Wilson', dueDate: '2026-01-20', priority: 'High' },
    { id: '2', title: 'Develop user authentication', status: 'In Progress', assignee: 'John Doe', dueDate: '2026-02-15', priority: 'High' },
    { id: '3', title: 'Create database schema', status: 'Done', assignee: 'Mike Johnson', dueDate: '2026-01-25', priority: 'Medium' },
    { id: '4', title: 'Implement payment gateway', status: 'To Do', assignee: 'Emily Davis', dueDate: '2026-03-01', priority: 'High' },
    { id: '5', title: 'Write unit tests', status: 'To Do', assignee: 'Jane Smith', dueDate: '2026-03-10', priority: 'Medium' },
    { id: '6', title: 'Set up CI/CD pipeline', status: 'In Progress', assignee: 'John Doe', dueDate: '2026-02-28', priority: 'Low' },
    { id: '7', title: 'API documentation', status: 'To Do', assignee: 'Sarah Wilson', dueDate: '2026-03-15', priority: 'Low' },
    { id: '8', title: 'Mobile responsive design', status: 'In Progress', assignee: 'Emily Davis', dueDate: '2026-02-20', priority: 'Medium' },
];

const mockTeam: TeamMember[] = [
    { id: '1', name: 'John Doe', role: 'Lead Developer', email: 'john@company.com', avatar: 'JD', allocation: 100, hoursLogged: 240 },
    { id: '2', name: 'Sarah Wilson', role: 'UI/UX Designer', email: 'sarah@company.com', avatar: 'SW', allocation: 75, hoursLogged: 180 },
    { id: '3', name: 'Mike Johnson', role: 'Backend Developer', email: 'mike@company.com', avatar: 'MJ', allocation: 50, hoursLogged: 120 },
    { id: '4', name: 'Jane Smith', role: 'QA Engineer', email: 'jane@company.com', avatar: 'JS', allocation: 60, hoursLogged: 96 },
    { id: '5', name: 'Emily Davis', role: 'Frontend Developer', email: 'emily@company.com', avatar: 'ED', allocation: 80, hoursLogged: 160 },
];

const mockTimesheets: TimesheetEntry[] = [
    { id: '1', member: 'John Doe', date: '2026-02-24', hours: 8, task: 'User authentication', status: 'Approved' },
    { id: '2', member: 'Sarah Wilson', date: '2026-02-24', hours: 6, task: 'Homepage mockups', status: 'Approved' },
    { id: '3', member: 'Mike Johnson', date: '2026-02-24', hours: 7, task: 'Database schema', status: 'Pending' },
    { id: '4', member: 'Emily Davis', date: '2026-02-24', hours: 8, task: 'Mobile responsive', status: 'Pending' },
    { id: '5', member: 'John Doe', date: '2026-02-25', hours: 7.5, task: 'CI/CD pipeline', status: 'Approved' },
    { id: '6', member: 'Jane Smith', date: '2026-02-25', hours: 6, task: 'Test planning', status: 'Pending' },
    { id: '7', member: 'Sarah Wilson', date: '2026-02-25', hours: 8, task: 'Design system', status: 'Approved' },
    { id: '8', member: 'Mike Johnson', date: '2026-02-25', hours: 5, task: 'API development', status: 'Rejected' },
];

const mockFiles: ProjectFile[] = [
    { id: '1', name: 'Project Brief.pdf', type: 'PDF', size: '2.4 MB', uploadedBy: 'John Doe', uploadedAt: '2026-01-05' },
    { id: '2', name: 'Homepage Design v3.fig', type: 'Figma', size: '12.8 MB', uploadedBy: 'Sarah Wilson', uploadedAt: '2026-01-22' },
    { id: '3', name: 'Database Schema.sql', type: 'SQL', size: '156 KB', uploadedBy: 'Mike Johnson', uploadedAt: '2026-01-25' },
    { id: '4', name: 'API Docs.md', type: 'Markdown', size: '45 KB', uploadedBy: 'John Doe', uploadedAt: '2026-02-10' },
    { id: '5', name: 'Brand Assets.zip', type: 'Archive', size: '34.2 MB', uploadedBy: 'Sarah Wilson', uploadedAt: '2026-01-18' },
    { id: '6', name: 'Meeting Notes - Sprint 4.docx', type: 'Word', size: '890 KB', uploadedBy: 'Jane Smith', uploadedAt: '2026-02-20' },
];

// ---------- Tab Panels ----------
interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
    return (
        <Box role="tabpanel" hidden={value !== index} sx={{ py: 3 }}>
            {value === index && children}
        </Box>
    );
}

// ---------- Task Status Badge ----------
function TaskStatusChip({ status }: { status: Task['status'] }) {
    const config = {
        'To Do': { bg: '#F1F5F9', color: '#64748B', icon: <TodoIcon sx={{ fontSize: '0.9rem' }} /> },
        'In Progress': { bg: '#DBEAFE', color: '#2563EB', icon: <InProgressIcon sx={{ fontSize: '0.9rem' }} /> },
        Done: { bg: '#DCFCE7', color: '#16A34A', icon: <DoneIcon sx={{ fontSize: '0.9rem' }} /> },
    };
    const c = config[status];
    return (
        <Chip
            icon={c.icon}
            label={status}
            size="small"
            sx={{ backgroundColor: c.bg, color: c.color, fontWeight: 600, fontSize: '0.72rem', height: 26, '& .MuiChip-icon': { color: c.color } }}
        />
    );
}

function PriorityChip({ priority }: { priority: Task['priority'] }) {
    const colors = { High: '#EF4444', Medium: '#F59E0B', Low: '#94A3B8' };
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: colors[priority] }} />
            <Typography variant="body2" sx={{ fontSize: '0.8rem', color: '#475569' }}>{priority}</Typography>
        </Box>
    );
}

// ---------- Main Component ----------
export default function ProjectDetailPage() {
    const params = useParams();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { selectedProject: project, loading } = useAppSelector((state) => state.projects);
    const [activeTab, setActiveTab] = useState(0);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const projectId = params?.id as string;

    useEffect(() => {
        if (projectId) {
            dispatch(fetchProjectById(projectId));
        }
    }, [projectId, dispatch]);

    const handleEdit = () => {
        if (projectId) {
            dispatch(fetchProjects()).then(() => {
                dispatch(openEditDrawer(projectId));
            });
        }
    };

    const handleDeleteClick = () => {
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        setIsDeleteDialogOpen(false);
        await dispatch(deleteProject(projectId));
        router.push('/projects');
    };

    const handleCancelDelete = () => {
        setIsDeleteDialogOpen(false);
    };

    const formatDate = (dateStr: string) => {
        try { return format(new Date(dateStr), 'MMM d, yyyy'); }
        catch { return dateStr; }
    };

    const formatCurrency = (val: number) => `$${val.toLocaleString()}`;

    if (loading || !project) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress sx={{ color: '#16A34A' }} />
            </Box>
        );
    }

    const budgetUsagePercent = project.budget > 0 ? Math.round((project.spent / project.budget) * 100) : 0;
    const tasksDone = mockTasks.filter((t) => t.status === 'Done').length;
    const tasksInProgress = mockTasks.filter((t) => t.status === 'In Progress').length;
    const tasksTodo = mockTasks.filter((t) => t.status === 'To Do').length;

    return (
        <Box sx={{ px: 3.5, py: 3 }}>
            {/* Page Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <IconButton
                    onClick={() => router.push('/projects')}
                    sx={{ mr: 1.5, backgroundColor: '#F1F5F9', '&:hover': { backgroundColor: '#E2E8F0' } }}
                >
                    <BackIcon sx={{ fontSize: '1.2rem', color: '#475569' }} />
                </IconButton>
                <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B', fontSize: '1.5rem' }}>
                            {project.name}
                        </Typography>
                        <StatusBadge status={project.status} />
                    </Box>
                    <Typography variant="body2" sx={{ color: '#64748B', mt: 0.3 }}>
                        {project.client} • {project.projectManager}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <Button
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={handleEdit}
                        sx={{ color: '#475569', borderColor: '#E2E8F0', '&:hover': { borderColor: '#CBD5E1', backgroundColor: '#F8FAFC' } }}
                    >
                        Edit Project
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<DeleteIcon />}
                        onClick={handleDeleteClick}
                        sx={{ color: '#EF4444', borderColor: '#FEE2E2', '&:hover': { borderColor: '#EF4444', backgroundColor: '#FEF2F2' } }}
                    >
                        Delete
                    </Button>
                </Box>
            </Box>

            {/* Quick Stats Row */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, mb: 3 }}>
                <Card sx={{ p: 2.5 }}>
                    <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.8rem', mb: 0.5 }}>Progress</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#16A34A' }}>{project.progress}%</Typography>
                        <LinearProgress variant="determinate" value={project.progress} sx={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: '#E2E8F0', '& .MuiLinearProgress-bar': { borderRadius: 3, backgroundColor: '#16A34A' } }} />
                    </Box>
                </Card>
                <Card sx={{ p: 2.5 }}>
                    <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.8rem', mb: 0.5 }}>Budget</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#1E293B' }}>{formatCurrency(project.budget)}</Typography>
                    <Typography variant="caption" sx={{ color: budgetUsagePercent > 90 ? '#EF4444' : '#64748B' }}>{formatCurrency(project.spent)} spent ({budgetUsagePercent}%)</Typography>
                </Card>
                <Card sx={{ p: 2.5 }}>
                    <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.8rem', mb: 0.5 }}>Team</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1E293B' }}>{mockTeam.length}</Typography>
                        <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 28, height: 28, fontSize: '0.7rem', border: '2px solid white' } }}>
                            {mockTeam.map((m) => (
                                <Avatar key={m.id} sx={{ bgcolor: ['#6366F1', '#16A34A', '#F59E0B', '#EF4444', '#3B82F6'][parseInt(m.id) % 5] }}>{m.avatar}</Avatar>
                            ))}
                        </AvatarGroup>
                    </Box>
                </Card>
                <Card sx={{ p: 2.5 }}>
                    <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.8rem', mb: 0.5 }}>Timeline</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#1E293B', fontSize: '0.85rem' }}>{formatDate(project.startDate)}</Typography>
                    <Typography variant="caption" sx={{ color: '#64748B' }}>to {formatDate(project.endDate)}</Typography>
                </Card>
            </Box>

            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: '#E2E8F0', mb: 0 }}>
                <Tabs
                    value={activeTab}
                    onChange={(_, v) => setActiveTab(v)}
                    sx={{
                        '& .MuiTab-root': { textTransform: 'none', fontWeight: 500, fontSize: '0.9rem', color: '#64748B', minHeight: 48 },
                        '& .Mui-selected': { color: '#16A34A !important', fontWeight: 600 },
                        '& .MuiTabs-indicator': { backgroundColor: '#16A34A', height: 3, borderRadius: '3px 3px 0 0' },
                    }}
                >
                    <Tab label="Overview" />
                    <Tab label={`Tasks (${mockTasks.length})`} />
                    <Tab label={`Team (${mockTeam.length})`} />
                    <Tab label="Timesheets" />
                    <Tab label={`Files (${mockFiles.length})`} />
                </Tabs>
            </Box>

            {/* ========== OVERVIEW TAB ========== */}
            <TabPanel value={activeTab} index={0}>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Card sx={{ p: 3, mb: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.05rem', mb: 2 }}>Project Overview</Typography>
                            {project.description && (
                                <Box sx={{ mb: 2.5 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <DescriptionIcon sx={{ fontSize: '1.1rem', color: '#64748B' }} />
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#475569' }}>Description</Typography>
                                    </Box>
                                    <Typography variant="body2" sx={{ color: '#475569', lineHeight: 1.7, pl: 3.5 }}>{project.description}</Typography>
                                </Box>
                            )}
                            <Divider sx={{ my: 2, borderColor: '#F1F5F9' }} />
                            <Grid container spacing={3}>
                                <Grid size={{ xs: 6, sm: 3 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                        <PersonIcon sx={{ fontSize: '1rem', color: '#64748B' }} />
                                        <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 500 }}>Project Manager</Typography>
                                    </Box>
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#1E293B', pl: 3 }}>{project.projectManager}</Typography>
                                </Grid>
                                <Grid size={{ xs: 6, sm: 3 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                        <BusinessIcon sx={{ fontSize: '1rem', color: '#64748B' }} />
                                        <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 500 }}>Client</Typography>
                                    </Box>
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#1E293B', pl: 3 }}>{project.client}</Typography>
                                </Grid>
                                <Grid size={{ xs: 6, sm: 3 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                        <MoneyIcon sx={{ fontSize: '1rem', color: '#64748B' }} />
                                        <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 500 }}>Billing Type</Typography>
                                    </Box>
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#1E293B', pl: 3 }}>{project.billingType}</Typography>
                                </Grid>
                                <Grid size={{ xs: 6, sm: 3 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                        <CalendarIcon sx={{ fontSize: '1rem', color: '#64748B' }} />
                                        <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 500 }}>Duration</Typography>
                                    </Box>
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#1E293B', pl: 3 }}>{formatDate(project.startDate)} - {formatDate(project.endDate)}</Typography>
                                </Grid>
                            </Grid>
                            {project.tags && project.tags.length > 0 && (
                                <Box sx={{ mt: 2.5 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <TagIcon sx={{ fontSize: '1rem', color: '#64748B' }} />
                                        <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 500 }}>Tags</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', pl: 3 }}>
                                        {project.tags.map((tag) => (
                                            <Chip key={tag} label={tag} size="small" sx={{ backgroundColor: '#EEF2FF', color: '#6366F1', fontWeight: 500, fontSize: '0.72rem' }} />
                                        ))}
                                    </Box>
                                </Box>
                            )}
                        </Card>

                        {/* Recent Activity */}
                        <Card sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.05rem', mb: 2 }}>Recent Activity</Typography>
                            {[
                                { user: 'John Doe', action: 'completed task "Database schema"', time: '2 hours ago', color: '#16A34A' },
                                { user: 'Sarah Wilson', action: 'uploaded "Homepage Design v3.fig"', time: '5 hours ago', color: '#3B82F6' },
                                { user: 'Emily Davis', action: 'started task "Mobile responsive design"', time: '1 day ago', color: '#F59E0B' },
                                { user: 'Mike Johnson', action: 'submitted timesheet for review', time: '1 day ago', color: '#6366F1' },
                                { user: 'Jane Smith', action: 'added comment on "Unit tests"', time: '2 days ago', color: '#EF4444' },
                            ].map((activity, idx) => (
                                <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, py: 1.5, borderBottom: idx < 4 ? '1px solid #F1F5F9' : 'none' }}>
                                    <Avatar sx={{ width: 32, height: 32, fontSize: '0.7rem', bgcolor: activity.color }}>
                                        {activity.user.split(' ').map((n) => n[0]).join('')}
                                    </Avatar>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="body2" sx={{ fontSize: '0.83rem' }}>
                                            <strong>{activity.user}</strong> {activity.action}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#94A3B8' }}>{activity.time}</Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Card>
                    </Grid>

                    {/* Right sidebar */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Card sx={{ p: 3, mb: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem', mb: 2 }}>Task Summary</Typography>
                            {[
                                { label: 'Done', value: tasksDone, color: '#16A34A', bg: '#DCFCE7' },
                                { label: 'In Progress', value: tasksInProgress, color: '#3B82F6', bg: '#DBEAFE' },
                                { label: 'To Do', value: tasksTodo, color: '#64748B', bg: '#F1F5F9' },
                            ].map((item) => (
                                <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: item.color }} />
                                        <Typography variant="body2" sx={{ color: '#475569' }}>{item.label}</Typography>
                                    </Box>
                                    <Chip label={item.value} size="small" sx={{ backgroundColor: item.bg, color: item.color, fontWeight: 700, fontSize: '0.75rem', height: 24 }} />
                                </Box>
                            ))}
                        </Card>

                        <Card sx={{ p: 3, mb: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem', mb: 2 }}>Project Settings</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                                <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: project.requireTimesheets ? '#16A34A' : '#CBD5E1' }} />
                                <Typography variant="body2" sx={{ color: '#475569' }}>Timesheets: {project.requireTimesheets ? 'Required' : 'Not Required'}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: project.clientTimesheetApproval ? '#16A34A' : '#CBD5E1' }} />
                                <Typography variant="body2" sx={{ color: '#475569' }}>Client Approval: {project.clientTimesheetApproval ? 'Enabled' : 'Disabled'}</Typography>
                            </Box>
                        </Card>
                    </Grid>
                </Grid>
            </TabPanel>

            {/* ========== TASKS TAB ========== */}
            <TabPanel value={activeTab} index={1}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
                    <TextField
                        placeholder="Search tasks..."
                        size="small"
                        sx={{ width: 300, '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                        InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: '1.1rem', color: '#94A3B8' }} /></InputAdornment> }}
                    />
                    <Button variant="contained" sx={{ backgroundColor: '#16A34A', '&:hover': { backgroundColor: '#15803D' } }}>
                        + Add Task
                    </Button>
                </Box>

                <Paper sx={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #E2E8F0', boxShadow: 'none' }}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell padding="checkbox"><Checkbox size="small" sx={{ color: '#CBD5E1' }} /></TableCell>
                                    <TableCell>Task</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Assignee</TableCell>
                                    <TableCell>Priority</TableCell>
                                    <TableCell>Due Date</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {mockTasks.map((task) => (
                                    <TableRow key={task.id} hover sx={{ '&:hover': { backgroundColor: '#FAFBFC' } }}>
                                        <TableCell padding="checkbox"><Checkbox size="small" sx={{ color: '#CBD5E1', '&.Mui-checked': { color: '#16A34A' } }} /></TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#1E293B' }}>{task.title}</Typography>
                                        </TableCell>
                                        <TableCell><TaskStatusChip status={task.status} /></TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Avatar sx={{ width: 24, height: 24, fontSize: '0.65rem', bgcolor: '#6366F1' }}>
                                                    {task.assignee.split(' ').map((n) => n[0]).join('')}
                                                </Avatar>
                                                <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.82rem' }}>{task.assignee}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell><PriorityChip priority={task.priority} /></TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.8rem' }}>{formatDate(task.dueDate)}</Typography>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </TabPanel>

            {/* ========== TEAM TAB ========== */}
            <TabPanel value={activeTab} index={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
                    <Typography variant="body2" sx={{ color: '#64748B' }}>{mockTeam.length} team members assigned</Typography>
                    <Button variant="contained" sx={{ backgroundColor: '#16A34A', '&:hover': { backgroundColor: '#15803D' } }}>
                        + Add Member
                    </Button>
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 2.5 }}>
                    {mockTeam.map((member) => (
                        <Card key={member.id} sx={{ p: 3, transition: 'all 0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' } }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <Avatar sx={{ width: 44, height: 44, bgcolor: ['#6366F1', '#16A34A', '#F59E0B', '#EF4444', '#3B82F6'][parseInt(member.id) % 5], fontWeight: 600 }}>
                                    {member.avatar}
                                </Avatar>
                                <Box>
                                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#1E293B' }}>{member.name}</Typography>
                                    <Typography variant="caption" sx={{ color: '#64748B' }}>{member.role}</Typography>
                                </Box>
                            </Box>
                            <Divider sx={{ mb: 2, borderColor: '#F1F5F9' }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="caption" sx={{ color: '#94A3B8' }}>Allocation</Typography>
                                <Typography variant="caption" sx={{ fontWeight: 600, color: '#1E293B' }}>{member.allocation}%</Typography>
                            </Box>
                            <LinearProgress variant="determinate" value={member.allocation} sx={{ height: 6, borderRadius: 3, backgroundColor: '#E2E8F0', mb: 1.5, '& .MuiLinearProgress-bar': { borderRadius: 3, backgroundColor: member.allocation > 80 ? '#EF4444' : '#6366F1' } }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="caption" sx={{ color: '#94A3B8' }}>Hours Logged</Typography>
                                <Typography variant="caption" sx={{ fontWeight: 600, color: '#1E293B' }}>{member.hoursLogged}h</Typography>
                            </Box>
                        </Card>
                    ))}
                </Box>
            </TabPanel>

            {/* ========== TIMESHEETS TAB ========== */}
            <TabPanel value={activeTab} index={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        {[
                            { label: 'All', count: mockTimesheets.length },
                            { label: 'Pending', count: mockTimesheets.filter((t) => t.status === 'Pending').length },
                            { label: 'Approved', count: mockTimesheets.filter((t) => t.status === 'Approved').length },
                        ].map((filter) => (
                            <Chip key={filter.label} label={`${filter.label} (${filter.count})`} size="small" sx={{ backgroundColor: '#F1F5F9', color: '#475569', fontWeight: 500, cursor: 'pointer', '&:hover': { backgroundColor: '#E2E8F0' } }} />
                        ))}
                    </Box>
                    <Typography variant="body2" sx={{ color: '#64748B' }}>
                        <TimeIcon sx={{ fontSize: '1rem', verticalAlign: 'middle', mr: 0.5 }} />
                        Total: <strong>{mockTimesheets.reduce((s, t) => s + t.hours, 0)}h</strong>
                    </Typography>
                </Box>

                <Paper sx={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #E2E8F0', boxShadow: 'none' }}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Team Member</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Hours</TableCell>
                                    <TableCell>Task</TableCell>
                                    <TableCell>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {mockTimesheets.map((entry) => (
                                    <TableRow key={entry.id} hover>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Avatar sx={{ width: 28, height: 28, fontSize: '0.65rem', bgcolor: '#6366F1' }}>
                                                    {entry.member.split(' ').map((n) => n[0]).join('')}
                                                </Avatar>
                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>{entry.member}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell><Typography variant="body2" sx={{ color: '#475569', fontSize: '0.82rem' }}>{formatDate(entry.date)}</Typography></TableCell>
                                        <TableCell><Typography variant="body2" sx={{ fontWeight: 600, color: '#1E293B' }}>{entry.hours}h</Typography></TableCell>
                                        <TableCell><Typography variant="body2" sx={{ color: '#475569' }}>{entry.task}</Typography></TableCell>
                                        <TableCell>
                                            <Chip
                                                label={entry.status}
                                                size="small"
                                                sx={{
                                                    backgroundColor: entry.status === 'Approved' ? '#DCFCE7' : entry.status === 'Pending' ? '#FEF3C7' : '#FEE2E2',
                                                    color: entry.status === 'Approved' ? '#16A34A' : entry.status === 'Pending' ? '#D97706' : '#EF4444',
                                                    fontWeight: 600,
                                                    fontSize: '0.72rem',
                                                    height: 24,
                                                }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </TabPanel>

            {/* ========== FILES TAB ========== */}
            <TabPanel value={activeTab} index={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
                    <TextField
                        placeholder="Search files..."
                        size="small"
                        sx={{ width: 300, '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                        InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: '1.1rem', color: '#94A3B8' }} /></InputAdornment> }}
                    />
                    <Button variant="contained" startIcon={<UploadIcon />} sx={{ backgroundColor: '#16A34A', '&:hover': { backgroundColor: '#15803D' } }}>
                        Upload File
                    </Button>
                </Box>

                <Paper sx={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #E2E8F0', boxShadow: 'none' }}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>File Name</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell>Size</TableCell>
                                    <TableCell>Uploaded By</TableCell>
                                    <TableCell>Date</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {mockFiles.map((file) => (
                                    <TableRow key={file.id} hover sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#FAFBFC' } }}>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <Box sx={{ width: 36, height: 36, borderRadius: '8px', backgroundColor: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <FileIcon sx={{ fontSize: '1.1rem', color: '#6366F1' }} />
                                                </Box>
                                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#1E293B' }}>{file.name}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Chip label={file.type} size="small" sx={{ backgroundColor: '#F1F5F9', color: '#475569', fontSize: '0.72rem', height: 22 }} />
                                        </TableCell>
                                        <TableCell><Typography variant="body2" sx={{ color: '#475569' }}>{file.size}</Typography></TableCell>
                                        <TableCell><Typography variant="body2" sx={{ color: '#475569' }}>{file.uploadedBy}</Typography></TableCell>
                                        <TableCell><Typography variant="body2" sx={{ color: '#475569', fontSize: '0.82rem' }}>{formatDate(file.uploadedAt)}</Typography></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </TabPanel>

            {/* Delete Confirmation Modal */}
            <Dialog open={isDeleteDialogOpen} onClose={handleCancelDelete}>
                <DialogTitle sx={{ fontWeight: 600, color: '#1E293B' }}>Delete Project</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ color: '#475569' }}>
                        Are you sure you want to delete this project? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleCancelDelete} sx={{ color: '#64748B' }}>
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmDelete} variant="contained" color="error" sx={{ backgroundColor: '#EF4444', '&:hover': { backgroundColor: '#DC2626' } }}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <ProjectDrawer />
        </Box>
    );
}
