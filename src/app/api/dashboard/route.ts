import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Deal from '@/lib/models/Deal';
import Project from '@/lib/models/Project';
import Contact from '@/lib/models/Contact';
import Activity from '@/lib/models/Activity';
import Approval from '@/lib/models/Approval';

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
        await dbConnect();

        const [deals, projects, contacts, activities, pendingApprovals] = await Promise.all([
            Deal.find({}).lean(),
            Project.find({}).lean(),
            Contact.find({ status: 'Active' }).lean(),
            Activity.find({}).sort({ occurredAt: -1 }).limit(8).lean(),
            Approval.find({ context: 'dashboard', status: 'Pending' })
                .sort({ dueDate: 1 })
                .limit(6)
                .lean(),
        ]);

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
                        id: activity._id.toString(),
                        user: activity.user,
                        action: activity.action,
                        color: activity.color,
                        time: formatRelativeTime(new Date(activity.occurredAt)),
                    })),
                    pendingApprovals: pendingApprovals.map((approval) => ({
                        id: approval._id.toString(),
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
