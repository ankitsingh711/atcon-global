import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Project from '@/lib/models/Project';
import mongoose from 'mongoose';

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
    try {
        await dbConnect();
        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, error: 'Invalid project ID' },
                { status: 400 }
            );
        }

        const project = await Project.findById(id).lean();

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
        await dbConnect();
        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, error: 'Invalid project ID' },
                { status: 400 }
            );
        }

        const body = await request.json();

        const project = await Project.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true, runValidators: true }
        ).lean();

        if (!project) {
            return NextResponse.json(
                { success: false, error: 'Project not found' },
                { status: 404 }
            );
        }

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
        await dbConnect();
        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, error: 'Invalid project ID' },
                { status: 400 }
            );
        }

        const project = await Project.findByIdAndDelete(id).lean();

        if (!project) {
            return NextResponse.json(
                { success: false, error: 'Project not found' },
                { status: 404 }
            );
        }

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
