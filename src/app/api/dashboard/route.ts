import { NextResponse } from 'next/server';
import { getStore } from '@/lib/memory-store';

function formatRelativeTime(date: Date): string {
    const diffMs = Date.now() - date.getTime();
    const minutes = Math.floor(diffMs / (1000 * 60));

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes} min ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;

    const days = Math.floor(hours / 24);
    return `${days} day${days === 1 ? '' : 's'} ago`;
}

function formatDueLabel(date: Date): string {
    const today = new Date();
    const due = new Date(date);
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);

    const diffDays = Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays > 1) return `In ${diffDays} days`;
    return `${Math.abs(diffDays)} day${Math.abs(diffDays) === 1 ? '' : 's'} overdue`;
}

export async function GET() {
    try {
        const store = getStore();

        const deals = store.deals;
        const projects = store.projects;
        const contacts = store.contacts.filter((contact) => contact.status === 'Active');
        const activities = [...store.activities]
            .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())
            .slice(0, 8);
        const pendingApprovals = store.approvals
            .filter((approval) => approval.context === 'dashboard' && approval.status === 'Pending')
            .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
            .slice(0, 6);

        const activeDeals = deals.filter((deal) => deal.stage !== 'Closed Won').length;
        const monthlyRevenue = deals
            .filter((deal) => deal.stage === 'Closed Won')
            .reduce((sum, deal) => sum + (deal.value || 0), 0);
        const activeProjects = projects.filter(
            (project) => project.status === 'In Progress' || project.status === 'Planning'
        ).length;
        const teamMembers = contacts.length;

        return NextResponse.json(
            {
                success: true,
                data: {
                    stats: {
                        activeDeals,
                        monthlyRevenue,
                        activeProjects,
                        teamMembers,
                    },
                    recentActivity: activities.map((activity) => ({
                        id: activity._id,
                        user: activity.user,
                        action: activity.action,
                        color: activity.color,
                        time: formatRelativeTime(new Date(activity.occurredAt)),
                    })),
                    pendingApprovals: pendingApprovals.map((approval) => ({
                        id: approval._id,
                        type: approval.type,
                        title: approval.title,
                        due: formatDueLabel(new Date(approval.dueDate)),
                    })),
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('GET /api/dashboard error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch dashboard data' },
            { status: 500 }
        );
    }
}
