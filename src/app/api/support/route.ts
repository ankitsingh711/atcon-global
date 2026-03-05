import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import SupportTicket from '@/lib/models/SupportTicket';

const SEED_DATA = [
    { ticketId: 'TK-001', title: 'Access issue with project files', client: 'Acme Corporation', priority: 'High' as const, status: 'Open' as const, assignee: 'John Doe' },
    { ticketId: 'TK-002', title: 'Invoice discrepancy for January', client: 'Global Finance Ltd', priority: 'Medium' as const, status: 'In Progress' as const, assignee: 'Lisa Patel' },
    { ticketId: 'TK-003', title: 'Deployment failure on staging', client: 'Tech Startup Inc', priority: 'High' as const, status: 'Open' as const, assignee: 'David Kim' },
    { ticketId: 'TK-004', title: 'Design feedback pending review', client: 'Creative Agency', priority: 'Low' as const, status: 'In Progress' as const, assignee: 'Emily Rodriguez' },
    { ticketId: 'TK-005', title: 'API rate limiting issue', client: 'Acme Corporation', priority: 'Medium' as const, status: 'Resolved' as const, assignee: 'Mike Chen' },
    { ticketId: 'TK-006', title: 'Login authentication timeout', client: 'Tech Startup Inc', priority: 'High' as const, status: 'Resolved' as const, assignee: 'James Wilson' },
];

async function ensureSeed() {
    const count = await SupportTicket.countDocuments();
    if (count === 0) await SupportTicket.insertMany(SEED_DATA);
}

export async function GET() {
    try {
        await dbConnect();
        await ensureSeed();
        const tickets = await SupportTicket.find({}).sort({ createdAt: -1 }).lean();
        return NextResponse.json({ success: true, data: tickets }, { status: 200 });
    } catch (error) {
        console.error('GET /api/support error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch tickets' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        if (!body.title || !body.client) {
            return NextResponse.json({ success: false, error: 'Title and client are required' }, { status: 400 });
        }
        await dbConnect();
        const count = await SupportTicket.countDocuments();
        const ticket = await SupportTicket.create({
            ticketId: `TK-${String(count + 1).padStart(3, '0')}`,
            title: body.title, client: body.client,
            priority: body.priority || 'Medium', status: 'Open',
            assignee: body.assignee || 'Unassigned',
        });
        return NextResponse.json({ success: true, data: ticket }, { status: 201 });
    } catch (error) {
        console.error('POST /api/support error:', error);
        return NextResponse.json({ success: false, error: 'Failed to create ticket' }, { status: 500 });
    }
}
