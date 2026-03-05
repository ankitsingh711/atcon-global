import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import Approval from '@/lib/models/Approval';
import Activity from '@/lib/models/Activity';

interface RouteParams {
    params: Promise<{ id: string }>;
}

interface ApprovalUpdateBody {
    status?: 'Pending' | 'Approved' | 'Rejected';
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
    try {
        await dbConnect();
        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, error: 'Invalid approval ID' },
                { status: 400 }
            );
        }

        const body = (await request.json()) as ApprovalUpdateBody;
        if (!body.status || !['Pending', 'Approved', 'Rejected'].includes(body.status)) {
            return NextResponse.json(
                { success: false, error: 'Invalid status value' },
                { status: 400 }
            );
        }

        const approval = await Approval.findByIdAndUpdate(
            id,
            { $set: { status: body.status } },
            { new: true, runValidators: true }
        ).lean();

        if (!approval) {
            return NextResponse.json(
                { success: false, error: 'Approval not found' },
                { status: 404 }
            );
        }

        await Activity.create({
            user: 'Client Portal',
            action: `${approval.type} ${body.status.toLowerCase()}: ${approval.title}`,
            color: body.status === 'Approved' ? '#16A34A' : body.status === 'Rejected' ? '#EF4444' : '#6366F1',
            occurredAt: new Date(),
        });

        return NextResponse.json({ success: true, data: approval }, { status: 200 });
    } catch (error) {
        console.error('PATCH /api/approvals/[id] error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update approval' },
            { status: 500 }
        );
    }
}
