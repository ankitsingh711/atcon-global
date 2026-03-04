import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UIState, ViewMode } from '@/types';

const initialState: UIState = {
    drawerOpen: false,
    drawerMode: 'create',
    editingProjectId: null,
    viewMode: 'list',
    sidebarCollapsed: false,
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        openCreateDrawer(state) {
            state.drawerOpen = true;
            state.drawerMode = 'create';
            state.editingProjectId = null;
        },
        openEditDrawer(state, action: PayloadAction<string>) {
            state.drawerOpen = true;
            state.drawerMode = 'edit';
            state.editingProjectId = action.payload;
        },
        closeDrawer(state) {
            state.drawerOpen = false;
            state.editingProjectId = null;
        },
        setViewMode(state, action: PayloadAction<ViewMode>) {
            state.viewMode = action.payload;
        },
        toggleSidebar(state) {
            state.sidebarCollapsed = !state.sidebarCollapsed;
        },
    },
});

export const { openCreateDrawer, openEditDrawer, closeDrawer, setViewMode, toggleSidebar } =
    uiSlice.actions;
export default uiSlice.reducer;
