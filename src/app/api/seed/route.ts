import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Project from '@/lib/models/Project';
import Client from '@/lib/models/Client';

export async function POST() {
    try {
        await dbConnect();

        // Clear existing data
        await Project.deleteMany({});
        await Client.deleteMany({});

        // Seed clients
        const clients = await Client.insertMany([
            { name: 'Acme Corporation', email: 'contact@acmecorp.com', company: 'Acme Corporation' },
            { name: 'Tech Startup Inc', email: 'hello@techstartup.com', company: 'Tech Startup Inc' },
            { name: 'Local Retail Co', email: 'info@localretail.com', company: 'Local Retail Co' },
            { name: 'Global Finance Ltd', email: 'admin@globalfinance.com', company: 'Global Finance Ltd' },
            { name: 'Creative Agency', email: 'team@creativeagency.com', company: 'Creative Agency' },
        ]);

        // Seed projects matching Figma mock data
        await Project.insertMany([
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

        return NextResponse.json(
            { success: true, message: 'Database seeded successfully with 6 projects and 5 clients' },
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
