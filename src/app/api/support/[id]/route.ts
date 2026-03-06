import { NextRequest, NextResponse } from 'next/server';
import { getStore, isObjectId, touchRecord } from '@/lib/memory-store';

export const dynamic = 'force-dynamic';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        if (!isObjectId(id)) {
            return NextResponse.json({ success: false, error: 'Invalid ticket ID' }, { status: 400 });
        }

        const body = await request.json();
        const { status, priority } = body;

        if (!status && !priority) {
            return NextResponse.json({ success: false, error: 'Status or Priority is required' }, { status: 400 });
        }

        const store = getStore();
        const ticket = store.supportTickets.find((t) => t._id === id);

        if (!ticket) {
            return NextResponse.json({ success: false, error: 'Ticket not found' }, { status: 404 });
        }

        if (status) ticket.status = status;
        if (priority) ticket.priority = priority;

        touchRecord(ticket);

        return NextResponse.json({ success: true, data: ticket }, { status: 200 });
    } catch (error) {
        console.error('PUT /api/support/[id] error:', error);
        return NextResponse.json({ success: false, error: 'Failed to update ticket' }, { status: 500 });
    }
}
