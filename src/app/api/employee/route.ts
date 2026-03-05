import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Project from '@/lib/models/Project';

export async function GET() {
    try {
        await dbConnect();

        const activeProjects = await Project.find({ status: { $in: ['In Progress', 'Planning'] } })
            .sort({ startDate: 1 })
            .limit(10)
            .lean();

        const recentTasks = [
            { title: 'Update project documentation', project: 'Website Redesign', dueDate: 'Mar 5', priority: 'High' },
            { title: 'Review PR #128', project: 'Mobile App', dueDate: 'Mar 6', priority: 'Medium' },
            { title: 'Deploy staging release', project: 'Website Redesign', dueDate: 'Mar 7', priority: 'High' },
            { title: 'Setup CI/CD pipeline', project: 'API Integration', dueDate: 'Mar 7', priority: 'Low' },
            { title: 'Write unit tests for auth module', project: 'Mobile App', dueDate: 'Mar 8', priority: 'Medium' },
        ];

        return NextResponse.json(
            {
                success: true,
                data: {
                    profile: {
                        name: 'John Doe',
                        role: 'Senior Developer',
                    },
                    stats: {
                        tasksDue: 5,
                        timesheetsToSubmit: 1,
                        approvalsNeeded: 3,
                        activeProjects: activeProjects.length,
                    },
                    recentTasks,
                    timesheetStatus: 'Draft',
                    hoursThisWeek: 32,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('GET /api/employee error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch employee data' }, { status: 500 });
    }
}
