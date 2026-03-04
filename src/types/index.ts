export type ProjectStatus = 'Planning' | 'In Progress' | 'Completed' | 'On Hold' | 'Cancelled';

export type BillingType = 'Fixed Price' | 'Hourly' | 'Retainer';

export type ViewMode = 'list' | 'kanban' | 'grid';

export interface IProject {
  _id: string;
  name: string;
  client: string;
  status: ProjectStatus;
  projectManager: string;
  description: string;
  startDate: string;
  endDate: string;
  billingType: BillingType;
  budget: number;
  spent: number;
  progress: number;
  requireTimesheets: boolean;
  clientTimesheetApproval: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface IClient {
  _id: string;
  name: string;
  email: string;
  company: string;
}

export interface ProjectFormData {
  name: string;
  client: string;
  status: ProjectStatus;
  projectManager: string;
  description: string;
  startDate: string;
  endDate: string;
  billingType: BillingType;
  budget: number;
  spent: number;
  progress: number;
  requireTimesheets: boolean;
  clientTimesheetApproval: boolean;
  tags: string[];
}

export interface ProjectsState {
  projects: IProject[];
  selectedProject: IProject | null;
  clients: IClient[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  statusFilter: ProjectStatus | 'All';
}

export interface UIState {
  drawerOpen: boolean;
  drawerMode: 'create' | 'edit';
  editingProjectId: string | null;
  viewMode: ViewMode;
  sidebarCollapsed: boolean;
}
