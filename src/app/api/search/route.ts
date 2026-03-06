import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@/lib/memory-store';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const q = searchParams.get('q')?.trim().toLowerCase() || '';

        if (!q) {
            return NextResponse.json({ success: true, data: [] }, { status: 200 });
        }

        const store = getStore();
        const results: Array<{ id: string; type: string; title: string; subtitle: string; url: string }> = [];

        // Search Projects
        store.projects.forEach(p => {
            if (p.name.toLowerCase().includes(q) || p.client.toLowerCase().includes(q)) {
                results.push({ id: p._id, type: 'Project', title: p.name, subtitle: `Client: ${p.client}`, url: `/projects/${p._id}` });
            }
        });

        // Search Clients
        store.clients.forEach(c => {
            if (c.name.toLowerCase().includes(q) || c.industry.toLowerCase().includes(q)) {
                results.push({ id: c._id, type: 'Client', title: c.name, subtitle: c.industry, url: `/clients` });
            }
        });

        // Search Invoices
        store.invoices.forEach(i => {
            if (i.invoiceNumber.toLowerCase().includes(q) || i.client.toLowerCase().includes(q)) {
                results.push({ id: i._id, type: 'Invoice', title: i.invoiceNumber, subtitle: `Client: ${i.client}`, url: `/finance` });
            }
        });

        // Search Support Tickets
        store.supportTickets.forEach(t => {
            if (t.title.toLowerCase().includes(q) || t.ticketId.toLowerCase().includes(q)) {
                results.push({ id: t._id, type: 'Ticket', title: t.ticketId, subtitle: t.title, url: `/support` });
            }
        });

        // Search Talent
        store.talent.forEach(t => {
            if (t.name.toLowerCase().includes(q) || t.role.toLowerCase().includes(q)) {
                results.push({ id: t._id, type: 'Talent', title: t.name, subtitle: t.role, url: `/talent` });
            }
        });

        // Search People
        store.people.forEach(p => {
            if (p.name.toLowerCase().includes(q) || p.role.toLowerCase().includes(q)) {
                results.push({ id: p._id, type: 'People', title: p.name, subtitle: p.role, url: `/people` });
            }
        });

        const limitedResults = results.slice(0, 10); // Limit to top 10 matches for performance/UI

        return NextResponse.json({ success: true, data: limitedResults }, { status: 200 });
    } catch (error) {
        console.error('GET /api/search error:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
