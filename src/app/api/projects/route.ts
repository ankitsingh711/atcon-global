import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Project from '@/lib/models/Project';

export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';
        const status = searchParams.get('status') || '';
        const sortBy = searchParams.get('sortBy') || 'createdAt';
        const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1;

        // Build query filter
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const filter: any = {};

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { client: { $regex: search, $options: 'i' } },
                { projectManager: { $regex: search, $options: 'i' } },
            ];
        }

        if (status && status !== 'All') {
            filter.status = status;
        }

        const projects = await Project.find(filter)
            .sort({ [sortBy]: sortOrder })
            .lean();

        return NextResponse.json({ success: true, data: projects }, { status: 200 });
    } catch (error) {
        console.error('GET /api/projects error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch projects' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        const body = await request.json();

        // Validate required fields
        const { name, client, status, projectManager, startDate, endDate } = body;
        if (!name || !client || !status || !projectManager || !startDate || !endDate) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const project = await Project.create(body);

        return NextResponse.json({ success: true, data: project }, { status: 201 });
    } catch (error) {
        console.error('POST /api/projects error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create project' },
            { status: 500 }
        );
    }
}
