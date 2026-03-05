import { NextRequest, NextResponse } from 'next/server';
import { createObjectId, getStore, isObjectId, touchRecord } from '@/lib/memory-store';

interface RouteParams {
    params: Promise<{ id: string }>;
}

interface ApprovalUpdateBody {
    status?: 'Pending' | 'Approved' | 'Rejected';
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;

        if (!isObjectId(id)) {
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

        const store = getStore();
        const approval = store.approvals.find((entry) => entry._id === id);

        if (!approval) {
            return NextResponse.json(
                { success: false, error: 'Approval not found' },
                { status: 404 }
            );
        }

        approval.status = body.status;
        touchRecord(approval);

        const now = new Date().toISOString();
        store.activities.unshift({
            _id: createObjectId(),
            createdAt: now,
            updatedAt: now,
            user: 'Client Portal',
            action: `${approval.type} ${body.status.toLowerCase()}: ${approval.title}`,
            color:
                body.status === 'Approved'
                    ? '#16A34A'
                    : body.status === 'Rejected'
                      ? '#EF4444'
                      : '#6366F1',
            occurredAt: now,
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
