import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Project from '@/lib/models/Project';
import Approval from '@/lib/models/Approval';

export async function GET() {
    try {
        await dbConnect();
        const [projects, pendingApprovals, allApprovals] = await Promise.all([
            Project.find({ status: { $in: ['In Progress', 'Planning'] } }).sort({ startDate: 1 }).limit(10).lean(),
            Approval.countDocuments({ status: 'Pending' }),
            Approval.find({}).sort({ createdAt: -1 }).limit(10).lean(),
        ]);

        return NextResponse.json({
            success: true,
            data: {
                profile: { name: 'John Doe', role: 'Senior Developer' },
                stats: { tasksDue: 5, timesheetsToSubmit: 1, approvalsNeeded: pendingApprovals, activeProjects: projects.length },
                projects: projects.map((p) => ({
                    id: p._id.toString(), name: p.name, client: p.client, status: p.status,
                    progress: p.progress, role: 'Developer', dueDate: p.endDate ? new Date(p.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
                })),
                tasks: [
                    { title: 'Update project documentation', project: projects[0]?.name || 'Website Redesign', priority: 'High', due: 'Mar 5', done: false },
                    { title: 'Review PR #128', project: projects[1]?.name || 'Mobile App', priority: 'Medium', due: 'Mar 6', done: false },
                    { title: 'Deploy staging release', project: projects[0]?.name || 'Website Redesign', priority: 'High', due: 'Mar 7', done: false },
                    { title: 'Setup CI/CD pipeline', project: projects[2]?.name || 'API Integration', priority: 'Low', due: 'Mar 7', done: true },
                    { title: 'Write unit tests for auth module', project: projects[1]?.name || 'Mobile App', priority: 'Medium', due: 'Mar 8', done: true },
                    { title: 'Fix responsive layout issues', project: projects[0]?.name || 'Website Redesign', priority: 'High', due: 'Mar 10', done: false },
                ],
                timesheets: [
                    { week: 'Mar 3 - Mar 7', project: projects[0]?.name || 'Website Redesign', hours: 32, status: 'Submitted' },
                    { week: 'Feb 24 - Feb 28', project: projects[0]?.name || 'Website Redesign', hours: 40, status: 'Approved' },
                    { week: 'Feb 24 - Feb 28', project: projects[1]?.name || 'Mobile App', hours: 8, status: 'Approved' },
                    { week: 'Feb 17 - Feb 21', project: projects[0]?.name || 'Website Redesign', hours: 38, status: 'Approved' },
                ],
                expenses: [
                    { description: 'Client dinner - ' + (projects[0]?.client || 'Acme Corp'), category: 'Meals', amount: '$125.00', date: 'Mar 3, 2026', status: 'Pending' },
                    { description: 'Taxi to client office', category: 'Travel', amount: '$45.00', date: 'Mar 2, 2026', status: 'Approved' },
                    { description: 'Software subscription - Figma', category: 'Software', amount: '$15.00', date: 'Mar 1, 2026', status: 'Approved' },
                    { description: 'Office supplies', category: 'Supplies', amount: '$82.50', date: 'Feb 28, 2026', status: 'Approved' },
                ],
                leave: {
                    balances: [
                        { type: 'Annual Leave', total: 20, used: 8, remaining: 12 },
                        { type: 'Sick Leave', total: 10, used: 2, remaining: 8 },
                        { type: 'Personal Leave', total: 5, used: 0, remaining: 5 },
                    ],
                    requests: [
                        { type: 'Annual Leave', from: 'Mar 15, 2026', to: 'Mar 19, 2026', days: 5, status: 'Approved', reason: 'Family vacation' },
                        { type: 'Sick Leave', from: 'Feb 10, 2026', to: 'Feb 10, 2026', days: 1, status: 'Approved', reason: 'Feeling unwell' },
                        { type: 'Annual Leave', from: 'Apr 1, 2026', to: 'Apr 3, 2026', days: 3, status: 'Pending', reason: 'Personal' },
                    ],
                },
                hoursThisWeek: 32,
            },
        }, { status: 200 });
    } catch (error) {
        console.error('GET /api/employee error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch employee data' }, { status: 500 });
    }
}
