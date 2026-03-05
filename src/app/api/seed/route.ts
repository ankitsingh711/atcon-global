import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Project from '@/lib/models/Project';
import Client from '@/lib/models/Client';
import Deal from '@/lib/models/Deal';
import Contact from '@/lib/models/Contact';
import Approval from '@/lib/models/Approval';
import Activity from '@/lib/models/Activity';
import FreelancerData from '@/lib/models/FreelancerData';

export async function POST() {
    try {
        await dbConnect();

        // Clear existing data
        await Promise.all([
            Project.deleteMany({}),
            Client.deleteMany({}),
            Deal.deleteMany({}),
            Contact.deleteMany({}),
            Approval.deleteMany({}),
            Activity.deleteMany({}),
            FreelancerData.deleteMany({}),
        ]);

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const twoDaysLater = new Date(today);
        twoDaysLater.setDate(today.getDate() + 2);

        // Seed clients
        const clients = await Client.insertMany([
            {
                name: 'Acme Corporation',
                email: 'contact@acmecorp.com',
                company: 'Acme Corporation',
                industry: 'Technology',
                contact: 'Jennifer Davis',
                status: 'Active',
            },
            {
                name: 'Tech Startup Inc',
                email: 'hello@techstartup.com',
                company: 'Tech Startup Inc',
                industry: 'SaaS',
                contact: 'Robert Chen',
                status: 'Active',
            },
            {
                name: 'Local Retail Co',
                email: 'info@localretail.com',
                company: 'Local Retail Co',
                industry: 'Retail',
                contact: 'Lisa Martinez',
                status: 'Active',
            },
            {
                name: 'Global Finance Ltd',
                email: 'admin@globalfinance.com',
                company: 'Global Finance Ltd',
                industry: 'Finance',
                contact: 'David Park',
                status: 'Inactive',
            },
            {
                name: 'Creative Agency',
                email: 'team@creativeagency.com',
                company: 'Creative Agency',
                industry: 'Design',
                contact: 'Emma Wilson',
                status: 'Active',
            },
        ]);

        // Seed projects
        const projects = await Project.insertMany([
            {
                name: 'Website Redesign',
                client: clients[0].name,
                status: 'In Progress',
                projectManager: 'John Doe',
                description: 'Complete redesign of the corporate website with modern UI/UX principles. Focus on responsive design, improved navigation, and brand consistency across all pages.',
                startDate: new Date('2026-01-05'),
                endDate: new Date('2026-03-15'),
                billingType: 'Fixed Price',
                budget: 45000,
                spent: 28500,
                progress: 65,
                requireTimesheets: true,
                clientTimesheetApproval: false,
                tags: ['Website', 'Design', 'UI/UX'],
            },
            {
                name: 'Mobile App Development',
                client: clients[1].name,
                status: 'Planning',
                projectManager: 'Jane Smith',
                description: 'Develop a cross-platform mobile application for iOS and Android. The app will include user authentication, push notifications, and real-time data synchronization.',
                startDate: new Date('2026-02-01'),
                endDate: new Date('2026-06-30'),
                billingType: 'Hourly',
                budget: 85000,
                spent: 5200,
                progress: 10,
                requireTimesheets: true,
                clientTimesheetApproval: true,
                tags: ['Mobile', 'iOS', 'Android'],
            },
            {
                name: 'Brand Identity Package',
                client: clients[2].name,
                status: 'Completed',
                projectManager: 'Sarah Wilson',
                description: 'Complete brand identity package including logo design, brand guidelines, business cards, letterheads, and social media templates.',
                startDate: new Date('2025-12-01'),
                endDate: new Date('2026-01-15'),
                billingType: 'Fixed Price',
                budget: 15000,
                spent: 14800,
                progress: 100,
                requireTimesheets: false,
                clientTimesheetApproval: false,
                tags: ['Branding', 'Design', 'Print'],
            },
            {
                name: 'E-Commerce Platform',
                client: clients[3].name,
                status: 'In Progress',
                projectManager: 'John Doe',
                description: 'Build a full-featured e-commerce platform with product catalog, shopping cart, payment integration, and order management system.',
                startDate: new Date('2026-01-15'),
                endDate: new Date('2026-05-30'),
                billingType: 'Fixed Price',
                budget: 120000,
                spent: 45000,
                progress: 38,
                requireTimesheets: true,
                clientTimesheetApproval: true,
                tags: ['E-Commerce', 'Web', 'Payments'],
            },
            {
                name: 'Marketing Dashboard',
                client: clients[4].name,
                status: 'Planning',
                projectManager: 'Jane Smith',
                description: 'Analytics dashboard for tracking marketing campaigns, social media metrics, and ROI analysis with real-time data visualization.',
                startDate: new Date('2026-03-01'),
                endDate: new Date('2026-06-15'),
                billingType: 'Retainer',
                budget: 35000,
                spent: 0,
                progress: 0,
                requireTimesheets: true,
                clientTimesheetApproval: false,
                tags: ['Dashboard', 'Analytics', 'Marketing'],
            },
            {
                name: 'CRM Integration',
                client: clients[0].name,
                status: 'On Hold',
                projectManager: 'Sarah Wilson',
                description: 'Integration of the existing CRM system with third-party tools including email marketing platforms, social media management, and accounting software.',
                startDate: new Date('2026-02-15'),
                endDate: new Date('2026-04-30'),
                billingType: 'Hourly',
                budget: 28000,
                spent: 8500,
                progress: 25,
                requireTimesheets: true,
                clientTimesheetApproval: false,
                tags: ['CRM', 'Integration', 'API'],
            },
        ]);

        // Seed sales deals
        await Deal.insertMany([
            {
                name: 'Acme Corp Website Redesign',
                client: 'Acme Corporation',
                value: 45000,
                stage: 'Proposal',
                probability: 75,
            },
            {
                name: 'TechStart SaaS Platform',
                client: 'Tech Startup Inc',
                value: 85000,
                stage: 'Qualified',
                probability: 40,
            },
            {
                name: 'Retail Analytics Dashboard',
                client: 'Local Retail Co',
                value: 28000,
                stage: 'Negotiation',
                probability: 90,
            },
            {
                name: 'Finance App Revamp',
                client: 'Global Finance Ltd',
                value: 120000,
                stage: 'Lead',
                probability: 20,
            },
            {
                name: 'Creative Brand Package',
                client: 'Creative Agency',
                value: 15000,
                stage: 'Closed Won',
                probability: 100,
            },
        ]);

        // Seed contacts
        await Contact.insertMany([
            {
                name: 'Jennifer Davis',
                email: 'jennifer@acme.com',
                phone: '+1 (555) 123-4567',
                company: 'Acme Corporation',
                role: 'CEO',
                status: 'Active',
            },
            {
                name: 'Robert Chen',
                email: 'robert@techstart.io',
                phone: '+1 (555) 234-5678',
                company: 'Tech Startup Inc',
                role: 'CTO',
                status: 'Active',
            },
            {
                name: 'Lisa Martinez',
                email: 'lisa@retail.com',
                phone: '+1 (555) 345-6789',
                company: 'Local Retail Co',
                role: 'Marketing Director',
                status: 'Active',
            },
            {
                name: 'David Park',
                email: 'david@finance.com',
                phone: '+1 (555) 456-7890',
                company: 'Global Finance Ltd',
                role: 'VP Operations',
                status: 'Inactive',
            },
            {
                name: 'Emma Wilson',
                email: 'emma@creative.co',
                phone: '+1 (555) 567-8901',
                company: 'Creative Agency',
                role: 'Creative Director',
                status: 'Active',
            },
            {
                name: 'James Taylor',
                email: 'james@solutions.com',
                phone: '+1 (555) 678-9012',
                company: 'Solutions Corp',
                role: 'Project Lead',
                status: 'Active',
            },
        ]);

        // Seed dashboard activities
        await Activity.insertMany([
            {
                user: 'Sarah J.',
                action: 'New deal created: Acme Corp Website',
                color: '#6366F1',
                occurredAt: new Date(now.getTime() - 5 * 60 * 1000),
            },
            {
                user: 'Mike T.',
                action: 'Project milestone completed: Q1 Launch',
                color: '#16A34A',
                occurredAt: new Date(now.getTime() - 60 * 60 * 1000),
            },
            {
                user: 'Finance',
                action: 'Invoice #INV-1234 paid',
                color: '#F59E0B',
                occurredAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
            },
            {
                user: 'HR',
                action: 'New candidate application: Senior Designer',
                color: '#EF4444',
                occurredAt: new Date(now.getTime() - 3 * 60 * 60 * 1000),
            },
            {
                user: 'John D.',
                action: 'Timesheet submitted for Week 3',
                color: '#3B82F6',
                occurredAt: new Date(now.getTime() - 4 * 60 * 60 * 1000),
            },
        ]);

        // Seed approvals for dashboard and client portal
        await Approval.insertMany([
            {
                context: 'dashboard',
                type: 'Timesheet',
                title: 'John Doe - Week 2',
                dueDate: today,
                status: 'Pending',
                freelancer: 'John Doe',
                project: projects[0].name,
                week: 'Week 2',
                hours: 42,
                amount: 3150,
            },
            {
                context: 'dashboard',
                type: 'Invoice',
                title: 'Client Invoice #1245',
                dueDate: tomorrow,
                status: 'Pending',
            },
            {
                context: 'dashboard',
                type: 'Leave',
                title: 'Sarah Wilson - Annual Leave',
                dueDate: twoDaysLater,
                status: 'Pending',
            },
            {
                context: 'client-portal',
                type: 'Timesheet',
                title: 'John Doe - Jan 13 - 19',
                dueDate: today,
                status: 'Pending',
                freelancer: 'John Doe',
                project: 'Website Redesign',
                week: 'Jan 13 - 19, 2026',
                hours: 42,
                amount: 3150,
            },
            {
                context: 'client-portal',
                type: 'Timesheet',
                title: 'Sarah Wilson - Jan 13 - 19',
                dueDate: tomorrow,
                status: 'Pending',
                freelancer: 'Sarah Wilson',
                project: 'Website Redesign',
                week: 'Jan 13 - 19, 2026',
                hours: 38,
                amount: 2850,
            },
        ]);

        // Seed freelancer portal data
        await FreelancerData.create({
            name: 'Alex Thompson',
            role: 'Senior Designer',
            weekStart: new Date('2026-01-13'),
            weekEnd: new Date('2026-01-19'),
            timesheetStatus: 'Draft',
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
        });

        return NextResponse.json(
            {
                success: true,
                message:
                    'Database seeded successfully with projects, clients, deals, contacts, approvals, activities, and freelancer data',
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('POST /api/seed error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to seed database' },
            { status: 500 }
        );
    }
}
