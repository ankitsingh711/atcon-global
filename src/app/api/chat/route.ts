import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@/lib/memory-store';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { messages } = body as { messages: { role: string; content: string }[] };

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return NextResponse.json({ success: false, error: 'Messages are required' }, { status: 400 });
        }

        const lastMessage = messages[messages.length - 1].content.toLowerCase();
        let reply = "I'm not exactly sure how to answer that.";

        const store = getStore();

        // Very basic mock logic to extract some value from our memory store based on keywords
        if (lastMessage.includes('hello') || lastMessage.includes('hi')) {
            reply = 'Hello! I am Operations Hub AI. How can I help you manage your projects or finances today?';
        } else if (lastMessage.includes('revenue') || lastMessage.includes('profit') || lastMessage.includes('finance')) {
            const revenue = store.invoices.reduce((sum, i) => sum + i.amount, 0);
            const expenses = Math.round(revenue * 0.08); // Mocking 8% expense
            reply = `Currently, the total generated revenue is $${revenue.toLocaleString()} with estimated expenses of $${expenses.toLocaleString()}, leaving a net profit of $${(revenue - expenses).toLocaleString()}.`;
        } else if (lastMessage.includes('project')) {
            const activeProjects = store.projects.filter(p => p.status === 'In Progress').length;
            reply = `You currently have ${store.projects.length} projects in total, and ${activeProjects} of those are marked as "In Progress".`;
        } else if (lastMessage.includes('ticket') || lastMessage.includes('support')) {
            const openTickets = store.supportTickets.filter(t => t.status === 'Open').length;
            reply = `There are ${openTickets} support tickets currently open and awaiting resolution.`;
        } else if (lastMessage.includes('talent') || lastMessage.includes('people')) {
            reply = `Your organization currently manages ${store.talent.length} talent profiles and ${store.people.length} internal team members.`;
        } else if (lastMessage.includes('invoice')) {
            const pendingInvoices = store.invoices.filter(i => i.status === 'Pending').length;
            reply = `You have ${pendingInvoices} pending invoices waiting to be paid.`;
        } else {
            reply = "I'm still learning and don't have a specific answer for that. Try asking me about our revenue, active projects, open support tickets, or pending invoices!";
        }

        // Simulate network latency for a slightly more realistic chat experience
        await new Promise(resolve => setTimeout(resolve, 800));

        return NextResponse.json({ success: true, data: reply }, { status: 200 });

    } catch (error) {
        console.error('POST /api/chat error:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
