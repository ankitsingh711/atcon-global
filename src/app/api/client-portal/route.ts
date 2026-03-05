import { NextResponse } from 'next/server';
import { getStore } from '@/lib/memory-store';

export async function GET() {
    try {
        const store = getStore();
        const client = [...store.clients].sort(
            (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )[0];

        const clientName = client?.name ?? 'Acme Corporation';
        const contactName = client?.contact || 'Client Contact';

        const projects = store.projects
            .filter((project) => project.client === clientName)
            .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

        const statusMap: Record<string, string> = {
            'In Progress': 'On Track',
            Planning: 'In Progress',
            Completed: 'Completed',
        };

        return NextResponse.json(
            {
                success: true,
                data: {
                    clientName,
                    contactName,
                    stats: {
                        activeProjects: projects.filter(
                            (project) =>
                                project.status !== 'Completed' && project.status !== 'Cancelled'
                        ).length,
                        pendingTimesheets: 5,
                        openTickets: 2,
                        recentInvoices: 4,
                    },
                    projects: projects
                        .filter(
                            (project) =>
                                project.status !== 'Completed' && project.status !== 'Cancelled'
                        )
                        .slice(0, 5)
                        .map((project) => ({
                            id: project._id,
                            name: project.name,
                            status: statusMap[project.status] || project.status,
                            progress: project.progress,
                        })),
                    supportTickets: [
                        { title: 'Access issue with project files', status: 'Open', time: '2 hours ago' },
                        { title: 'Invoice discrepancy for Jan', status: 'Open', time: '1 day ago' },
                    ],
                    invoices: [
                        { number: 'INV-2026-001', amount: '$28,500', status: 'Pending' },
                        { number: 'INV-2026-002', amount: '$15,200', status: 'Paid' },
                        { number: 'INV-2025-012', amount: '$42,000', status: 'Paid' },
                        { number: 'INV-2025-011', amount: '$18,750', status: 'Paid' },
                    ],
                    talentShortlists: [
                        { role: 'Senior React Developer', candidates: 3 },
                        { role: 'UI/UX Designer', candidates: 5 },
                        { role: 'DevOps Engineer', candidates: 2 },
                    ],
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('GET /api/client-portal error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch client portal data' },
            { status: 500 }
        );
    }
}
