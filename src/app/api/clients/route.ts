import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Client from '@/lib/models/Client';
import Project from '@/lib/models/Project';
import Activity from '@/lib/models/Activity';

const STATUS_OPTIONS = ['Active', 'Inactive', 'Prospect'] as const;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ClientRequestBody {
    name?: string;
    industry?: string;
    contact?: string;
    email?: string;
    status?: (typeof STATUS_OPTIONS)[number];
}

export async function GET() {
    try {
        await dbConnect();

        const [clients, projectSummary] = await Promise.all([
            Client.find({}).sort({ name: 1 }).lean(),
            Project.aggregate<{ _id: string; projects: number; revenue: number }>([
                {
                    $group: {
                        _id: '$client',
                        projects: { $sum: 1 },
                        revenue: { $sum: '$budget' },
                    },
                },
            ]),
        ]);

        const summaryMap = new Map(
            projectSummary.map((entry) => [
                entry._id,
                { projects: entry.projects, revenue: entry.revenue },
            ])
        );

        const clientsWithStats = clients.map((client) => {
            const summary = summaryMap.get(client.name) || { projects: 0, revenue: 0 };
            return {
                ...client,
                projects: summary.projects,
                revenue: summary.revenue,
            };
        });

        return NextResponse.json({ success: true, data: clientsWithStats }, { status: 200 });
    } catch (error) {
        console.error('GET /api/clients error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch clients' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = (await request.json()) as ClientRequestBody;
        const name = body.name?.trim();
        const email = body.email?.trim().toLowerCase();
        const status = body.status ?? 'Active';

        if (!name || !email) {
            return NextResponse.json(
                { success: false, error: 'Client name and email are required' },
                { status: 400 }
            );
        }

        if (!EMAIL_REGEX.test(email)) {
            return NextResponse.json(
                { success: false, error: 'Please enter a valid email address' },
                { status: 400 }
            );
        }

        if (!STATUS_OPTIONS.includes(status)) {
            return NextResponse.json(
                { success: false, error: 'Invalid client status' },
                { status: 400 }
            );
        }

        await dbConnect();

        const client = await Client.create({
            name,
            company: name,
            email,
            industry: body.industry?.trim() ?? '',
            contact: body.contact?.trim() ?? '',
            status,
        });

        await Activity.create({
            user: 'CRM',
            action: `New client added: ${name}`,
            color: '#3B82F6',
            occurredAt: new Date(),
        });

        return NextResponse.json(
            { success: true, data: { ...client.toObject(), projects: 0, revenue: 0 } },
            { status: 201 }
        );
    } catch (error) {
        console.error('POST /api/clients error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create client' },
            { status: 500 }
        );
    }
}
