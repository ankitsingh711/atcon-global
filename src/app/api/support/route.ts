import { NextRequest, NextResponse } from 'next/server';
import { createObjectId, getStore, SupportTicketRecord } from '@/lib/memory-store';

export async function GET() {
    try {
        const tickets = [...getStore().supportTickets].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        return NextResponse.json({ success: true, data: tickets }, { status: 200 });
    } catch (error) {
        console.error('GET /api/support error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch tickets' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = (await request.json()) as Partial<SupportTicketRecord>;
        if (!body.title || !body.client) {
            return NextResponse.json(
                { success: false, error: 'Title and client are required' },
                { status: 400 }
            );
        }

        const store = getStore();
        const now = new Date().toISOString();
        const ticket: SupportTicketRecord = {
            _id: createObjectId(),
            createdAt: now,
            updatedAt: now,
            ticketId: `TK-${String(store.supportTickets.length + 1).padStart(3, '0')}`,
            title: body.title,
            client: body.client,
            priority: body.priority ?? 'Medium',
            status: 'Open',
            assignee: body.assignee ?? 'Unassigned',
        };

        store.supportTickets.push(ticket);

        return NextResponse.json({ success: true, data: ticket }, { status: 201 });
    } catch (error) {
        console.error('POST /api/support error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create ticket' },
            { status: 500 }
        );
    }
}
