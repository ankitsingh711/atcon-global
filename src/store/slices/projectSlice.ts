import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { IProject, ProjectsState, ProjectStatus, ProjectFormData } from '@/types';

const initialState: ProjectsState = {
    projects: [],
    selectedProject: null,
    clients: [],
    loading: false,
    error: null,
    searchQuery: '',
    statusFilter: 'All',
};

export const fetchProjects = createAsyncThunk(
    'projects/fetchProjects',
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState() as { projects: ProjectsState };
            const { searchQuery, statusFilter } = state.projects;
            const params = new URLSearchParams();
            if (searchQuery) params.set('search', searchQuery);
            if (statusFilter && statusFilter !== 'All') params.set('status', statusFilter);

            const response = await fetch(`/api/projects?${params.toString()}`);
            const data = await response.json();
            if (!data.success) throw new Error(data.error);
            return data.data as IProject[];
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const fetchProjectById = createAsyncThunk(
    'projects/fetchProjectById',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/projects/${id}`);
            const data = await response.json();
            if (!data.success) throw new Error(data.error);
            return data.data as IProject;
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const createProject = createAsyncThunk(
    'projects/createProject',
    async (projectData: ProjectFormData, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(projectData),
            });
            const data = await response.json();
            if (!data.success) throw new Error(data.error);
            return data.data as IProject;
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const updateProject = createAsyncThunk(
    'projects/updateProject',
    async ({ id, projectData }: { id: string; projectData: Partial<ProjectFormData> }, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/projects/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(projectData),
            });
            const data = await response.json();
            if (!data.success) throw new Error(data.error);
            return data.data as IProject;
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const deleteProject = createAsyncThunk(
    'projects/deleteProject',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/projects/${id}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            if (!data.success) throw new Error(data.error);
            return id;
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const fetchClients = createAsyncThunk(
    'projects/fetchClients',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/clients');
            const data = await response.json();
            if (!data.success) throw new Error(data.error);
            return data.data;
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

const projectSlice = createSlice({
    name: 'projects',
    initialState,
    reducers: {
        setSearchQuery(state, action: PayloadAction<string>) {
            state.searchQuery = action.payload;
        },
        setStatusFilter(state, action: PayloadAction<ProjectStatus | 'All'>) {
            state.statusFilter = action.payload;
        },
        clearSelectedProject(state) {
            state.selectedProject = null;
        },
        clearError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all projects
            .addCase(fetchProjects.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProjects.fulfilled, (state, action) => {
                state.loading = false;
                state.projects = action.payload;
            })
            .addCase(fetchProjects.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Fetch project by ID
            .addCase(fetchProjectById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProjectById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedProject = action.payload;
            })
            .addCase(fetchProjectById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Create project
            .addCase(createProject.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createProject.fulfilled, (state, action) => {
                state.loading = false;
                state.projects.unshift(action.payload);
            })
            .addCase(createProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Update project
            .addCase(updateProject.fulfilled, (state, action) => {
                const index = state.projects.findIndex((p) => p._id === action.payload._id);
                if (index !== -1) state.projects[index] = action.payload;
                if (state.selectedProject?._id === action.payload._id) {
                    state.selectedProject = action.payload;
                }
            })
            // Delete project
            .addCase(deleteProject.fulfilled, (state, action) => {
                state.projects = state.projects.filter((p) => p._id !== action.payload);
                if (state.selectedProject?._id === action.payload) {
                    state.selectedProject = null;
                }
            })
            // Fetch clients
            .addCase(fetchClients.fulfilled, (state, action) => {
                state.clients = action.payload;
            });
    },
});

export const { setSearchQuery, setStatusFilter, clearSelectedProject, clearError } =
    projectSlice.actions;
export default projectSlice.reducer;
