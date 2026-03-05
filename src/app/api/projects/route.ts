import { NextRequest, NextResponse } from 'next/server';
import { createObjectId, getStore, ProjectRecord } from '@/lib/memory-store';

function compareValues(left: unknown, right: unknown): number {
    if (typeof left === 'number' && typeof right === 'number') {
        return left - right;
    }

    const leftDate = new Date(String(left)).getTime();
    const rightDate = new Date(String(right)).getTime();
    if (!Number.isNaN(leftDate) && !Number.isNaN(rightDate)) {
        return leftDate - rightDate;
    }

    return String(left ?? '').localeCompare(String(right ?? ''), undefined, { sensitivity: 'base' });
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search')?.trim().toLowerCase() || '';
        const status = searchParams.get('status')?.trim() || '';
        const sortBy = searchParams.get('sortBy') || 'createdAt';
        const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1;

        const store = getStore();
        const projects = store.projects
            .filter((project) => {
                const matchesSearch =
                    !search ||
                    project.name.toLowerCase().includes(search) ||
                    project.client.toLowerCase().includes(search) ||
                    project.projectManager.toLowerCase().includes(search);
                const matchesStatus = !status || status === 'All' || project.status === status;
                return matchesSearch && matchesStatus;
            })
            .sort((a, b) => {
                const left = a[sortBy as keyof ProjectRecord];
                const right = b[sortBy as keyof ProjectRecord];
                return compareValues(left, right) * sortOrder;
            });

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
        const body = (await request.json()) as Partial<ProjectRecord>;
        const name = body.name?.trim();
        const client = body.client?.trim();
        const status = body.status;
        const projectManager = body.projectManager?.trim();
        const startDate = body.startDate;
        const endDate = body.endDate;

        if (!name || !client || !status || !projectManager || !startDate || !endDate) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const now = new Date().toISOString();
        const project: ProjectRecord = {
            _id: createObjectId(),
            createdAt: now,
            updatedAt: now,
            name,
            client,
            status,
            projectManager,
            description: body.description?.trim() || '',
            startDate: new Date(startDate).toISOString(),
            endDate: new Date(endDate).toISOString(),
            billingType: body.billingType || 'Fixed Price',
            budget: Number(body.budget ?? 0),
            spent: Number(body.spent ?? 0),
            progress: Number(body.progress ?? 0),
            requireTimesheets: Boolean(body.requireTimesheets),
            clientTimesheetApproval: Boolean(body.clientTimesheetApproval),
            tags: Array.isArray(body.tags) ? body.tags.map((tag) => String(tag).trim()).filter(Boolean) : [],
        };

        getStore().projects.push(project);

        return NextResponse.json({ success: true, data: project }, { status: 201 });
    } catch (error) {
        console.error('POST /api/projects error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create project' },
            { status: 500 }
        );
    }
}
