import { NextRequest, NextResponse } from 'next/server';
import { getStore, isObjectId, ProjectRecord, touchRecord } from '@/lib/memory-store';

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;

        if (!isObjectId(id)) {
            return NextResponse.json(
                { success: false, error: 'Invalid project ID' },
                { status: 400 }
            );
        }

        const project = getStore().projects.find((entry) => entry._id === id);

        if (!project) {
            return NextResponse.json(
                { success: false, error: 'Project not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: project }, { status: 200 });
    } catch (error) {
        console.error('GET /api/projects/[id] error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch project' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;

        if (!isObjectId(id)) {
            return NextResponse.json(
                { success: false, error: 'Invalid project ID' },
                { status: 400 }
            );
        }

        const body = (await request.json()) as Partial<ProjectRecord>;
        const store = getStore();
        const project = store.projects.find((entry) => entry._id === id);

        if (!project) {
            return NextResponse.json(
                { success: false, error: 'Project not found' },
                { status: 404 }
            );
        }

        const { _id: _ignoredId, createdAt: _ignoredCreatedAt, ...updates } = body as Record<
            string,
            unknown
        >;
        void _ignoredId;
        void _ignoredCreatedAt;
        Object.assign(project, updates);

        if (typeof project.startDate === 'string') {
            project.startDate = new Date(project.startDate).toISOString();
        }
        if (typeof project.endDate === 'string') {
            project.endDate = new Date(project.endDate).toISOString();
        }

        touchRecord(project);

        return NextResponse.json({ success: true, data: project }, { status: 200 });
    } catch (error) {
        console.error('PUT /api/projects/[id] error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update project' },
            { status: 500 }
        );
    }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;

        if (!isObjectId(id)) {
            return NextResponse.json(
                { success: false, error: 'Invalid project ID' },
                { status: 400 }
            );
        }

        const store = getStore();
        const projectIndex = store.projects.findIndex((entry) => entry._id === id);

        if (projectIndex < 0) {
            return NextResponse.json(
                { success: false, error: 'Project not found' },
                { status: 404 }
            );
        }

        store.projects.splice(projectIndex, 1);

        return NextResponse.json(
            { success: true, message: 'Project deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('DELETE /api/projects/[id] error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete project' },
            { status: 500 }
        );
    }
}
