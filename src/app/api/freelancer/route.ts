import { NextRequest, NextResponse } from 'next/server';
import {
    copyRows,
    createObjectId,
    FreelancerDataRecord,
    getStore,
    TimesheetRow,
    touchRecord,
} from '@/lib/memory-store';

interface TimesheetRowInput {
    project: string;
    task: string;
    hours: number[];
}

interface FreelancerUpdateBody {
    rows?: TimesheetRowInput[];
    status?: 'Draft' | 'Submitted' | 'Approved';
}

function formatWeekRange(weekStart: Date, weekEnd: Date): string {
    const startLabel = weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const endLabel = weekEnd.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
    return `${startLabel} - ${endLabel}`;
}

function isValidRow(row: TimesheetRowInput): boolean {
    return (
        typeof row.project === 'string' &&
        row.project.trim().length > 0 &&
        typeof row.task === 'string' &&
        row.task.trim().length > 0 &&
        Array.isArray(row.hours) &&
        row.hours.length === 7 &&
        row.hours.every((hours) => typeof hours === 'number' && hours >= 0 && hours <= 24)
    );
}

function ensureFreelancerData(): FreelancerDataRecord {
    const store = getStore();

    if (!store.freelancerData) {
        const now = new Date().toISOString();
        store.freelancerData = {
            _id: createObjectId(),
            createdAt: now,
            updatedAt: now,
            name: 'Alex Thompson',
            role: 'Senior Designer',
            weekStart: new Date('2026-01-13').toISOString(),
            weekEnd: new Date('2026-01-19').toISOString(),
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
        };
    }

    return store.freelancerData;
}

export async function GET() {
    try {
        const store = getStore();
        const freelancerData = ensureFreelancerData();
        const activeProjects = store.projects
            .filter((project) => project.status === 'In Progress' || project.status === 'Planning')
            .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
            .slice(0, 5);

        const pendingApprovals = store.approvals.filter(
            (approval) => approval.context === 'client-portal' && approval.status === 'Pending'
        ).length;

        const totalHours = freelancerData.rows.reduce(
            (grandTotal, row) => grandTotal + row.hours.reduce((sum, hours) => sum + hours, 0),
            0
        );

        const dailyTotals = Array.from({ length: 7 }, (_, dayIndex) =>
            freelancerData.rows.reduce((sum, row) => sum + (row.hours[dayIndex] || 0), 0)
        );

        return NextResponse.json(
            {
                success: true,
                data: {
                    profile: {
                        name: freelancerData.name,
                        role: freelancerData.role,
                    },
                    stats: {
                        activeProjects: activeProjects.length,
                        hoursThisWeek: totalHours,
                        pendingApprovals,
                    },
                    projects: activeProjects.map((project) => ({
                        id: project._id,
                        name: project.name,
                        client: project.client,
                        progress: project.progress,
                        status:
                            project.status === 'In Progress'
                                ? 'Active'
                                : project.status === 'Planning'
                                  ? 'Planning'
                                  : project.status,
                    })),
                    timesheet: {
                        weekStart: freelancerData.weekStart,
                        weekEnd: freelancerData.weekEnd,
                        weekLabel: formatWeekRange(
                            new Date(freelancerData.weekStart),
                            new Date(freelancerData.weekEnd)
                        ),
                        status: freelancerData.timesheetStatus,
                        rows: copyRows(freelancerData.rows),
                        dailyTotals,
                        totalHours,
                        billableHours: Number((totalHours * 0.9).toFixed(1)),
                    },
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('GET /api/freelancer error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch freelancer data' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = (await request.json()) as FreelancerUpdateBody;

        if (!body.rows || !Array.isArray(body.rows) || body.rows.some((row) => !isValidRow(row))) {
            return NextResponse.json(
                { success: false, error: 'Invalid timesheet rows' },
                { status: 400 }
            );
        }

        const freelancerData = ensureFreelancerData();
        const nextRows: TimesheetRow[] = body.rows.map((row) => ({
            project: row.project.trim(),
            task: row.task.trim(),
            hours: row.hours.map((hours) => Number(hours)),
        }));

        freelancerData.rows = nextRows;

        if (body.status && ['Draft', 'Submitted', 'Approved'].includes(body.status)) {
            freelancerData.timesheetStatus = body.status;
        }

        touchRecord(freelancerData);

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error('PUT /api/freelancer error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update timesheet' },
            { status: 500 }
        );
    }
}
