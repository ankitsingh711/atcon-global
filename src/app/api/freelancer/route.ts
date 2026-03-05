import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Project from '@/lib/models/Project';
import Approval from '@/lib/models/Approval';
import FreelancerData from '@/lib/models/FreelancerData';

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
    const endLabel = weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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

async function ensureFreelancerData() {
    let freelancerData = await FreelancerData.findOne({}).sort({ createdAt: 1 });

    if (!freelancerData) {
        const weekStart = new Date('2026-01-13');
        const weekEnd = new Date('2026-01-19');
        freelancerData = await FreelancerData.create({
            name: 'Alex Thompson',
            role: 'Senior Designer',
            weekStart,
            weekEnd,
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
    }

    return freelancerData;
}

export async function GET() {
    try {
        await dbConnect();

        const [freelancerData, activeProjects, pendingApprovals] = await Promise.all([
            ensureFreelancerData(),
            Project.find({ status: { $in: ['In Progress', 'Planning'] } })
                .sort({ startDate: 1 })
                .limit(5)
                .lean(),
            Approval.countDocuments({ context: 'client-portal', status: 'Pending' }),
        ]);

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
                        id: project._id.toString(),
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
                        rows: freelancerData.rows,
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

        await dbConnect();
        const freelancerData = await ensureFreelancerData();

        freelancerData.rows = body.rows.map((row) => ({
            project: row.project.trim(),
            task: row.task.trim(),
            hours: row.hours.map((hours) => Number(hours)),
        }));

        if (body.status && ['Draft', 'Submitted', 'Approved'].includes(body.status)) {
            freelancerData.timesheetStatus = body.status;
        }

        await freelancerData.save();

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error('PUT /api/freelancer error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update timesheet' },
            { status: 500 }
        );
    }
}
