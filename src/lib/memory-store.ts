import crypto from 'crypto';

export type ProjectStatus = 'Planning' | 'In Progress' | 'Completed' | 'On Hold' | 'Cancelled';
export type BillingType = 'Fixed Price' | 'Hourly' | 'Retainer';
export type ClientStatus = 'Active' | 'Inactive' | 'Prospect';
export type DealStage = 'Lead' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Closed Won';
export type ContactStatus = 'Active' | 'Inactive';
export type ApprovalContext = 'dashboard' | 'client-portal';
export type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected';
export type ApprovalType = 'Timesheet' | 'Invoice' | 'Leave';

interface BaseRecord {
    _id: string;
    createdAt: string;
    updatedAt: string;
}

export interface ProjectRecord extends BaseRecord {
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

export interface ClientRecord extends BaseRecord {
    name: string;
    email: string;
    company: string;
    industry: string;
    contact: string;
    status: ClientStatus;
}

export interface DealRecord extends BaseRecord {
    name: string;
    client: string;
    value: number;
    stage: DealStage;
    probability: number;
    expectedCloseDate?: string;
}

export interface ContactRecord extends BaseRecord {
    name: string;
    email: string;
    phone: string;
    company: string;
    role: string;
    status: ContactStatus;
}

export interface ApprovalRecord extends BaseRecord {
    context: ApprovalContext;
    type: ApprovalType;
    title: string;
    dueDate: string;
    freelancer?: string;
    project?: string;
    week?: string;
    hours?: number;
    amount?: number;
    status: ApprovalStatus;
}

export interface ActivityRecord extends BaseRecord {
    user: string;
    action: string;
    color: string;
    occurredAt: string;
}

export interface TimesheetRow {
    project: string;
    task: string;
    hours: number[];
}

export interface FreelancerDataRecord extends BaseRecord {
    name: string;
    role: string;
    weekStart: string;
    weekEnd: string;
    timesheetStatus: 'Draft' | 'Submitted' | 'Approved';
    rows: TimesheetRow[];
}

export interface PersonRecord extends BaseRecord {
    name: string;
    email: string;
    department: string;
    role: string;
    type: 'Employee' | 'Contractor';
    status: 'Active' | 'On Leave' | 'Offboarded';
    joinDate: string;
    color: string;
}

export interface TalentRecord extends BaseRecord {
    name: string;
    role: string;
    skills: string[];
    experience: string;
    rate: string;
    availability: 'Available' | 'On Project';
    rating: number;
    color: string;
}

export interface FormEntryRecord extends BaseRecord {
    name: string;
    type: string;
    submissions: number;
    status: 'Active' | 'Draft' | 'Closed';
    completion: number;
    lastSubmission: string | null;
}

export interface SupportTicketRecord extends BaseRecord {
    ticketId: string;
    title: string;
    client: string;
    priority: 'High' | 'Medium' | 'Low';
    status: 'Open' | 'In Progress' | 'Resolved';
    assignee: string;
}

export interface InvoiceRecord extends BaseRecord {
    invoiceNumber: string;
    client: string;
    project: string;
    amount: number;
    date: string;
    dueDate: string;
    status: 'Paid' | 'Pending' | 'Overdue';
}

export interface UserRecord extends BaseRecord {
    name: string;
    email: string;
    passwordHash: string;
}

export interface MemoryStore {
    projects: ProjectRecord[];
    clients: ClientRecord[];
    deals: DealRecord[];
    contacts: ContactRecord[];
    approvals: ApprovalRecord[];
    activities: ActivityRecord[];
    freelancerData: FreelancerDataRecord | null;
    people: PersonRecord[];
    talent: TalentRecord[];
    forms: FormEntryRecord[];
    supportTickets: SupportTicketRecord[];
    invoices: InvoiceRecord[];
    users: UserRecord[];
}

const OBJECT_ID_REGEX = /^[a-f\d]{24}$/i;

function toIso(value: Date | string): string {
    return new Date(value).toISOString();
}

export function createObjectId(): string {
    return crypto.randomBytes(12).toString('hex');
}

export function isObjectId(value: string): boolean {
    return OBJECT_ID_REGEX.test(value);
}

function createRecord<T extends object>(value: T, timestamp?: Date | string): T & BaseRecord {
    const now = toIso(timestamp ?? new Date());
    return {
        ...value,
        _id: createObjectId(),
        createdAt: now,
        updatedAt: now,
    };
}

export function touchRecord<T extends BaseRecord>(value: T): T {
    value.updatedAt = new Date().toISOString();
    return value;
}

export function copyRows(rows: TimesheetRow[]): TimesheetRow[] {
    return rows.map((row) => ({
        project: row.project,
        task: row.task,
        hours: [...row.hours],
    }));
}

function createSeedStore(): MemoryStore {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const twoDaysLater = new Date(today);
    twoDaysLater.setDate(today.getDate() + 2);

    const clients: ClientRecord[] = [
        createRecord(
            {
                name: 'Acme Corporation',
                email: 'contact@acmecorp.com',
                company: 'Acme Corporation',
                industry: 'Technology',
                contact: 'Jennifer Davis',
                status: 'Active',
            },
            '2026-01-02T09:00:00.000Z'
        ),
        createRecord(
            {
                name: 'Tech Startup Inc',
                email: 'hello@techstartup.com',
                company: 'Tech Startup Inc',
                industry: 'SaaS',
                contact: 'Robert Chen',
                status: 'Active',
            },
            '2026-01-03T09:00:00.000Z'
        ),
        createRecord(
            {
                name: 'Local Retail Co',
                email: 'info@localretail.com',
                company: 'Local Retail Co',
                industry: 'Retail',
                contact: 'Lisa Martinez',
                status: 'Active',
            },
            '2026-01-04T09:00:00.000Z'
        ),
        createRecord(
            {
                name: 'Global Finance Ltd',
                email: 'admin@globalfinance.com',
                company: 'Global Finance Ltd',
                industry: 'Finance',
                contact: 'David Park',
                status: 'Inactive',
            },
            '2026-01-05T09:00:00.000Z'
        ),
        createRecord(
            {
                name: 'Creative Agency',
                email: 'team@creativeagency.com',
                company: 'Creative Agency',
                industry: 'Design',
                contact: 'Emma Wilson',
                status: 'Active',
            },
            '2026-01-06T09:00:00.000Z'
        ),
    ];

    const projects: ProjectRecord[] = [
        createRecord(
            {
                name: 'Website Redesign',
                client: clients[0].name,
                status: 'In Progress',
                projectManager: 'John Doe',
                description:
                    'Complete redesign of the corporate website with modern UI/UX principles. Focus on responsive design, improved navigation, and brand consistency across all pages.',
                startDate: toIso('2026-01-05'),
                endDate: toIso('2026-03-15'),
                billingType: 'Fixed Price',
                budget: 45000,
                spent: 28500,
                progress: 65,
                requireTimesheets: true,
                clientTimesheetApproval: false,
                tags: ['Website', 'Design', 'UI/UX'],
            },
            '2026-01-05T11:00:00.000Z'
        ),
        createRecord(
            {
                name: 'Mobile App Development',
                client: clients[1].name,
                status: 'Planning',
                projectManager: 'Jane Smith',
                description:
                    'Develop a cross-platform mobile application for iOS and Android. The app will include user authentication, push notifications, and real-time data synchronization.',
                startDate: toIso('2026-02-01'),
                endDate: toIso('2026-06-30'),
                billingType: 'Hourly',
                budget: 85000,
                spent: 5200,
                progress: 10,
                requireTimesheets: true,
                clientTimesheetApproval: true,
                tags: ['Mobile', 'iOS', 'Android'],
            },
            '2026-02-01T11:00:00.000Z'
        ),
        createRecord(
            {
                name: 'Brand Identity Package',
                client: clients[2].name,
                status: 'Completed',
                projectManager: 'Sarah Wilson',
                description:
                    'Complete brand identity package including logo design, brand guidelines, business cards, letterheads, and social media templates.',
                startDate: toIso('2025-12-01'),
                endDate: toIso('2026-01-15'),
                billingType: 'Fixed Price',
                budget: 15000,
                spent: 14800,
                progress: 100,
                requireTimesheets: false,
                clientTimesheetApproval: false,
                tags: ['Branding', 'Design', 'Print'],
            },
            '2025-12-01T11:00:00.000Z'
        ),
        createRecord(
            {
                name: 'E-Commerce Platform',
                client: clients[3].name,
                status: 'In Progress',
                projectManager: 'John Doe',
                description:
                    'Build a full-featured e-commerce platform with product catalog, shopping cart, payment integration, and order management system.',
                startDate: toIso('2026-01-15'),
                endDate: toIso('2026-05-30'),
                billingType: 'Fixed Price',
                budget: 120000,
                spent: 45000,
                progress: 38,
                requireTimesheets: true,
                clientTimesheetApproval: true,
                tags: ['E-Commerce', 'Web', 'Payments'],
            },
            '2026-01-15T11:00:00.000Z'
        ),
        createRecord(
            {
                name: 'Marketing Dashboard',
                client: clients[4].name,
                status: 'Planning',
                projectManager: 'Jane Smith',
                description:
                    'Analytics dashboard for tracking marketing campaigns, social media metrics, and ROI analysis with real-time data visualization.',
                startDate: toIso('2026-03-01'),
                endDate: toIso('2026-06-15'),
                billingType: 'Retainer',
                budget: 35000,
                spent: 0,
                progress: 0,
                requireTimesheets: true,
                clientTimesheetApproval: false,
                tags: ['Dashboard', 'Analytics', 'Marketing'],
            },
            '2026-03-01T11:00:00.000Z'
        ),
        createRecord(
            {
                name: 'CRM Integration',
                client: clients[0].name,
                status: 'On Hold',
                projectManager: 'Sarah Wilson',
                description:
                    'Integration of the existing CRM system with third-party tools including email marketing platforms, social media management, and accounting software.',
                startDate: toIso('2026-02-15'),
                endDate: toIso('2026-04-30'),
                billingType: 'Hourly',
                budget: 28000,
                spent: 8500,
                progress: 25,
                requireTimesheets: true,
                clientTimesheetApproval: false,
                tags: ['CRM', 'Integration', 'API'],
            },
            '2026-02-15T11:00:00.000Z'
        ),
    ];

    const deals: DealRecord[] = [
        createRecord(
            {
                name: 'Acme Corp Website Redesign',
                client: 'Acme Corporation',
                value: 45000,
                stage: 'Proposal',
                probability: 75,
            },
            '2026-02-10T10:00:00.000Z'
        ),
        createRecord(
            {
                name: 'TechStart SaaS Platform',
                client: 'Tech Startup Inc',
                value: 85000,
                stage: 'Qualified',
                probability: 40,
            },
            '2026-02-12T10:00:00.000Z'
        ),
        createRecord(
            {
                name: 'Retail Analytics Dashboard',
                client: 'Local Retail Co',
                value: 28000,
                stage: 'Negotiation',
                probability: 90,
            },
            '2026-02-14T10:00:00.000Z'
        ),
        createRecord(
            {
                name: 'Finance App Revamp',
                client: 'Global Finance Ltd',
                value: 120000,
                stage: 'Lead',
                probability: 20,
            },
            '2026-02-16T10:00:00.000Z'
        ),
        createRecord(
            {
                name: 'Creative Brand Package',
                client: 'Creative Agency',
                value: 15000,
                stage: 'Closed Won',
                probability: 100,
            },
            '2026-02-18T10:00:00.000Z'
        ),
    ];

    const contacts: ContactRecord[] = [
        createRecord(
            {
                name: 'Jennifer Davis',
                email: 'jennifer@acme.com',
                phone: '+1 (555) 123-4567',
                company: 'Acme Corporation',
                role: 'CEO',
                status: 'Active',
            },
            '2026-02-01T09:00:00.000Z'
        ),
        createRecord(
            {
                name: 'Robert Chen',
                email: 'robert@techstart.io',
                phone: '+1 (555) 234-5678',
                company: 'Tech Startup Inc',
                role: 'CTO',
                status: 'Active',
            },
            '2026-02-02T09:00:00.000Z'
        ),
        createRecord(
            {
                name: 'Lisa Martinez',
                email: 'lisa@retail.com',
                phone: '+1 (555) 345-6789',
                company: 'Local Retail Co',
                role: 'Marketing Director',
                status: 'Active',
            },
            '2026-02-03T09:00:00.000Z'
        ),
        createRecord(
            {
                name: 'David Park',
                email: 'david@finance.com',
                phone: '+1 (555) 456-7890',
                company: 'Global Finance Ltd',
                role: 'VP Operations',
                status: 'Inactive',
            },
            '2026-02-04T09:00:00.000Z'
        ),
        createRecord(
            {
                name: 'Emma Wilson',
                email: 'emma@creative.co',
                phone: '+1 (555) 567-8901',
                company: 'Creative Agency',
                role: 'Creative Director',
                status: 'Active',
            },
            '2026-02-05T09:00:00.000Z'
        ),
        createRecord(
            {
                name: 'James Taylor',
                email: 'james@solutions.com',
                phone: '+1 (555) 678-9012',
                company: 'Solutions Corp',
                role: 'Project Lead',
                status: 'Active',
            },
            '2026-02-06T09:00:00.000Z'
        ),
    ];

    const activities: ActivityRecord[] = [
        createRecord(
            {
                user: 'Sarah J.',
                action: 'New deal created: Acme Corp Website',
                color: '#6366F1',
                occurredAt: toIso(new Date(now.getTime() - 5 * 60 * 1000)),
            },
            new Date(now.getTime() - 5 * 60 * 1000)
        ),
        createRecord(
            {
                user: 'Mike T.',
                action: 'Project milestone completed: Q1 Launch',
                color: '#16A34A',
                occurredAt: toIso(new Date(now.getTime() - 60 * 60 * 1000)),
            },
            new Date(now.getTime() - 60 * 60 * 1000)
        ),
        createRecord(
            {
                user: 'Finance',
                action: 'Invoice #INV-1234 paid',
                color: '#F59E0B',
                occurredAt: toIso(new Date(now.getTime() - 2 * 60 * 60 * 1000)),
            },
            new Date(now.getTime() - 2 * 60 * 60 * 1000)
        ),
        createRecord(
            {
                user: 'HR',
                action: 'New candidate application: Senior Designer',
                color: '#EF4444',
                occurredAt: toIso(new Date(now.getTime() - 3 * 60 * 60 * 1000)),
            },
            new Date(now.getTime() - 3 * 60 * 60 * 1000)
        ),
        createRecord(
            {
                user: 'John D.',
                action: 'Timesheet submitted for Week 3',
                color: '#3B82F6',
                occurredAt: toIso(new Date(now.getTime() - 4 * 60 * 60 * 1000)),
            },
            new Date(now.getTime() - 4 * 60 * 60 * 1000)
        ),
    ];

    const approvals: ApprovalRecord[] = [
        createRecord(
            {
                context: 'dashboard',
                type: 'Timesheet',
                title: 'John Doe - Week 2',
                dueDate: toIso(today),
                status: 'Pending',
                freelancer: 'John Doe',
                project: projects[0].name,
                week: 'Week 2',
                hours: 42,
                amount: 3150,
            },
            today
        ),
        createRecord(
            {
                context: 'dashboard',
                type: 'Invoice',
                title: 'Client Invoice #1245',
                dueDate: toIso(tomorrow),
                status: 'Pending',
            },
            today
        ),
        createRecord(
            {
                context: 'dashboard',
                type: 'Leave',
                title: 'Sarah Wilson - Annual Leave',
                dueDate: toIso(twoDaysLater),
                status: 'Pending',
            },
            today
        ),
        createRecord(
            {
                context: 'client-portal',
                type: 'Timesheet',
                title: 'John Doe - Jan 13 - 19',
                dueDate: toIso(today),
                status: 'Pending',
                freelancer: 'John Doe',
                project: 'Website Redesign',
                week: 'Jan 13 - 19, 2026',
                hours: 42,
                amount: 3150,
            },
            today
        ),
        createRecord(
            {
                context: 'client-portal',
                type: 'Timesheet',
                title: 'Sarah Wilson - Jan 13 - 19',
                dueDate: toIso(tomorrow),
                status: 'Pending',
                freelancer: 'Sarah Wilson',
                project: 'Website Redesign',
                week: 'Jan 13 - 19, 2026',
                hours: 38,
                amount: 2850,
            },
            today
        ),
    ];

    const freelancerData = createRecord(
        {
            name: 'Alex Thompson',
            role: 'Senior Designer',
            weekStart: toIso('2026-01-13'),
            weekEnd: toIso('2026-01-19'),
            timesheetStatus: 'Draft' as const,
            rows: [
                {
                    project: 'Website Redesign',
                    task: 'Frontend Development',
                    hours: [8, 7.5, 8, 6, 8, 4, 0],
                },
                {
                    project: 'Website Redesign',
                    task: 'Code Review',
                    hours: [0, 0.5, 0, 2, 0, 0, 0],
                },
                {
                    project: 'Mobile App Development',
                    task: 'API Integration',
                    hours: [0, 0, 0, 0, 0, 2, 0],
                },
            ],
        },
        '2026-01-13T08:00:00.000Z'
    );

    const people: PersonRecord[] = [
        createRecord(
            {
                name: 'John Doe',
                email: 'john@atcon.com',
                department: 'Engineering',
                role: 'Senior Developer',
                type: 'Employee',
                status: 'Active',
                joinDate: toIso('2024-01-15'),
                color: '#3B82F6',
            },
            '2024-01-15T09:00:00.000Z'
        ),
        createRecord(
            {
                name: 'Sarah Johnson',
                email: 'sarah@atcon.com',
                department: 'Design',
                role: 'Lead Designer',
                type: 'Contractor',
                status: 'Active',
                joinDate: toIso('2024-03-01'),
                color: '#EC4899',
            },
            '2024-03-01T09:00:00.000Z'
        ),
        createRecord(
            {
                name: 'Mike Chen',
                email: 'mike@atcon.com',
                department: 'Engineering',
                role: 'Backend Developer',
                type: 'Employee',
                status: 'Active',
                joinDate: toIso('2024-06-15'),
                color: '#F59E0B',
            },
            '2024-06-15T09:00:00.000Z'
        ),
        createRecord(
            {
                name: 'Emily Rodriguez',
                email: 'emily@atcon.com',
                department: 'Marketing',
                role: 'Marketing Manager',
                type: 'Employee',
                status: 'On Leave',
                joinDate: toIso('2024-02-01'),
                color: '#10B981',
            },
            '2024-02-01T09:00:00.000Z'
        ),
        createRecord(
            {
                name: 'David Kim',
                email: 'david@atcon.com',
                department: 'Operations',
                role: 'DevOps Lead',
                type: 'Employee',
                status: 'Active',
                joinDate: toIso('2023-08-01'),
                color: '#8B5CF6',
            },
            '2023-08-01T09:00:00.000Z'
        ),
        createRecord(
            {
                name: 'Lisa Patel',
                email: 'lisa@atcon.com',
                department: 'Finance',
                role: 'Financial Analyst',
                type: 'Employee',
                status: 'Active',
                joinDate: toIso('2024-11-01'),
                color: '#6366F1',
            },
            '2024-11-01T09:00:00.000Z'
        ),
        createRecord(
            {
                name: 'James Wilson',
                email: 'james@atcon.com',
                department: 'Engineering',
                role: 'Mobile Developer',
                type: 'Contractor',
                status: 'Active',
                joinDate: toIso('2024-09-01'),
                color: '#EF4444',
            },
            '2024-09-01T09:00:00.000Z'
        ),
    ];

    const talent: TalentRecord[] = [
        createRecord(
            {
                name: 'Sarah Johnson',
                role: 'Senior React Developer',
                skills: ['React', 'TypeScript', 'Node.js'],
                experience: '8 years',
                rate: '$95/hr',
                availability: 'Available',
                rating: 4.9,
                color: '#6366F1',
            },
            '2026-02-01T08:00:00.000Z'
        ),
        createRecord(
            {
                name: 'Mike Chen',
                role: 'Full Stack Developer',
                skills: ['Python', 'Django', 'React'],
                experience: '6 years',
                rate: '$85/hr',
                availability: 'Available',
                rating: 4.7,
                color: '#F59E0B',
            },
            '2026-02-02T08:00:00.000Z'
        ),
        createRecord(
            {
                name: 'Emily Rodriguez',
                role: 'UI/UX Designer',
                skills: ['Figma', 'Sketch', 'Adobe XD'],
                experience: '5 years',
                rate: '$80/hr',
                availability: 'On Project',
                rating: 4.8,
                color: '#EC4899',
            },
            '2026-02-03T08:00:00.000Z'
        ),
        createRecord(
            {
                name: 'David Kim',
                role: 'DevOps Engineer',
                skills: ['AWS', 'Docker', 'Kubernetes'],
                experience: '7 years',
                rate: '$100/hr',
                availability: 'Available',
                rating: 4.6,
                color: '#10B981',
            },
            '2026-02-04T08:00:00.000Z'
        ),
        createRecord(
            {
                name: 'Lisa Patel',
                role: 'Data Scientist',
                skills: ['Python', 'TensorFlow', 'SQL'],
                experience: '4 years',
                rate: '$90/hr',
                availability: 'On Project',
                rating: 4.5,
                color: '#8B5CF6',
            },
            '2026-02-05T08:00:00.000Z'
        ),
        createRecord(
            {
                name: 'James Wilson',
                role: 'Mobile Developer',
                skills: ['React Native', 'Swift', 'Kotlin'],
                experience: '5 years',
                rate: '$88/hr',
                availability: 'Available',
                rating: 4.7,
                color: '#3B82F6',
            },
            '2026-02-06T08:00:00.000Z'
        ),
    ];

    const forms: FormEntryRecord[] = [
        createRecord(
            {
                name: 'Client Onboarding Form',
                type: 'Intake',
                submissions: 24,
                status: 'Active',
                completion: 85,
                lastSubmission: toIso('2026-03-05'),
            },
            '2026-03-05T08:00:00.000Z'
        ),
        createRecord(
            {
                name: 'Project Brief Template',
                type: 'Brief',
                submissions: 18,
                status: 'Active',
                completion: 92,
                lastSubmission: toIso('2026-03-04'),
            },
            '2026-03-04T08:00:00.000Z'
        ),
        createRecord(
            {
                name: 'Freelancer Application',
                type: 'Application',
                submissions: 45,
                status: 'Active',
                completion: 78,
                lastSubmission: toIso('2026-03-03'),
            },
            '2026-03-03T08:00:00.000Z'
        ),
        createRecord(
            {
                name: 'Feedback Survey',
                type: 'Survey',
                submissions: 12,
                status: 'Active',
                completion: 65,
                lastSubmission: toIso('2026-03-02'),
            },
            '2026-03-02T08:00:00.000Z'
        ),
        createRecord(
            {
                name: 'NDA Agreement',
                type: 'Legal',
                submissions: 31,
                status: 'Active',
                completion: 100,
                lastSubmission: toIso('2026-03-01'),
            },
            '2026-03-01T08:00:00.000Z'
        ),
        createRecord(
            {
                name: 'Q1 Performance Review',
                type: 'Review',
                submissions: 8,
                status: 'Draft',
                completion: 40,
                lastSubmission: null,
            },
            '2026-02-28T08:00:00.000Z'
        ),
    ];

    const supportTickets: SupportTicketRecord[] = [
        createRecord(
            {
                ticketId: 'TK-001',
                title: 'Access issue with project files',
                client: 'Acme Corporation',
                priority: 'High',
                status: 'Open',
                assignee: 'John Doe',
            },
            '2026-02-24T08:00:00.000Z'
        ),
        createRecord(
            {
                ticketId: 'TK-002',
                title: 'Invoice discrepancy for January',
                client: 'Global Finance Ltd',
                priority: 'Medium',
                status: 'In Progress',
                assignee: 'Lisa Patel',
            },
            '2026-02-25T08:00:00.000Z'
        ),
        createRecord(
            {
                ticketId: 'TK-003',
                title: 'Deployment failure on staging',
                client: 'Tech Startup Inc',
                priority: 'High',
                status: 'Open',
                assignee: 'David Kim',
            },
            '2026-02-26T08:00:00.000Z'
        ),
        createRecord(
            {
                ticketId: 'TK-004',
                title: 'Design feedback pending review',
                client: 'Creative Agency',
                priority: 'Low',
                status: 'In Progress',
                assignee: 'Emily Rodriguez',
            },
            '2026-02-27T08:00:00.000Z'
        ),
        createRecord(
            {
                ticketId: 'TK-005',
                title: 'API rate limiting issue',
                client: 'Acme Corporation',
                priority: 'Medium',
                status: 'Resolved',
                assignee: 'Mike Chen',
            },
            '2026-02-28T08:00:00.000Z'
        ),
        createRecord(
            {
                ticketId: 'TK-006',
                title: 'Login authentication timeout',
                client: 'Tech Startup Inc',
                priority: 'High',
                status: 'Resolved',
                assignee: 'James Wilson',
            },
            '2026-03-01T08:00:00.000Z'
        ),
    ];

    const invoices: InvoiceRecord[] = [
        createRecord(
            {
                invoiceNumber: 'INV-2026-001',
                client: 'Acme Corporation',
                project: 'Website Redesign',
                amount: 28500,
                date: toIso('2026-03-01'),
                dueDate: toIso('2026-03-15'),
                status: 'Pending',
            },
            '2026-03-01T08:00:00.000Z'
        ),
        createRecord(
            {
                invoiceNumber: 'INV-2026-002',
                client: 'Global Finance Ltd',
                project: 'E-Commerce Platform',
                amount: 15200,
                date: toIso('2026-02-28'),
                dueDate: toIso('2026-03-14'),
                status: 'Paid',
            },
            '2026-02-28T08:00:00.000Z'
        ),
        createRecord(
            {
                invoiceNumber: 'INV-2026-003',
                client: 'Tech Startup Inc',
                project: 'CRM Integration',
                amount: 42000,
                date: toIso('2026-02-25'),
                dueDate: toIso('2026-03-10'),
                status: 'Overdue',
            },
            '2026-02-25T08:00:00.000Z'
        ),
        createRecord(
            {
                invoiceNumber: 'INV-2025-012',
                client: 'Creative Agency',
                project: 'Brand Identity',
                amount: 18750,
                date: toIso('2026-02-20'),
                dueDate: toIso('2026-03-05'),
                status: 'Paid',
            },
            '2026-02-20T08:00:00.000Z'
        ),
        createRecord(
            {
                invoiceNumber: 'INV-2025-011',
                client: 'Acme Corporation',
                project: 'Website Redesign',
                amount: 33400,
                date: toIso('2026-02-15'),
                dueDate: toIso('2026-03-01'),
                status: 'Paid',
            },
            '2026-02-15T08:00:00.000Z'
        ),
    ];

    return {
        projects,
        clients,
        deals,
        contacts,
        approvals,
        activities,
        freelancerData,
        people,
        talent,
        forms,
        supportTickets,
        invoices,
        users: [],
    };
}

declare global {
    var atconMemoryStore: MemoryStore | undefined;
}

export function getStore(): MemoryStore {
    if (!global.atconMemoryStore) {
        global.atconMemoryStore = createSeedStore();
    }

    return global.atconMemoryStore;
}

export function resetStore(): MemoryStore {
    global.atconMemoryStore = createSeedStore();
    return global.atconMemoryStore;
}
