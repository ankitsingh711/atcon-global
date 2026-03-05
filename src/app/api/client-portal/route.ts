import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Client from '@/lib/models/Client';
import Project from '@/lib/models/Project';
import Approval from '@/lib/models/Approval';

export async function GET() {
    try {
        await dbConnect();

        const client = await Client.findOne({}).sort({ createdAt: 1 }).lean();
        const clientName = client?.name ?? 'Client';
        const contactName = client?.contact || 'Client Contact';

        const projects = await Project.find({ client: clientName }).sort({ startDate: 1 }).lean();
        const projectNames = projects.map((project) => project.name);

        const pendingApprovals = await Approval.find({
            context: 'client-portal',
            status: 'Pending',
            ...(projectNames.length ? { project: { $in: projectNames } } : {}),
        })
            .sort({ dueDate: 1 })
            .lean();

        return NextResponse.json(
            {
                success: true,
                data: {
                    clientName,
                    contactName,
                    projects: projects.map((project) => ({
                        id: project._id.toString(),
                        name: project.name,
                        startDate: project.startDate,
                        progress: project.progress,
                        status: project.status,
                        budget: project.budget,
                        hoursLogged: Math.round((project.spent || 0) / 120),
                        teamSize: Math.max(1, Math.round((project.progress || 0) / 20) + 2),
                    })),
                    pendingApprovals: pendingApprovals.map((approval) => ({
                        id: approval._id.toString(),
                        freelancer: approval.freelancer || 'Freelancer',
                        project: approval.project || 'Project',
                        week: approval.week || '-',
                        hours: approval.hours || 0,
                        amount: approval.amount || 0,
                        status: approval.status,
                    })),
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
