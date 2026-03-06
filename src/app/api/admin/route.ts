import { NextResponse } from 'next/server';
import { getStore } from '@/lib/memory-store';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const store = getStore();

        const users = store.contacts.filter((c) => c.status === 'Active').length;
        const projects = store.projects.length; // Or active only
        const clients = store.clients.length;
        const deals = store.deals.length;

        return NextResponse.json(
            {
                success: true,
                data: {
                    teamMembers: users,
                    activeProjects: projects,
                    totalClients: clients,
                    activeDeals: deals,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('GET /api/admin error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch admin stats' },
            { status: 500 }
        );
    }
}
