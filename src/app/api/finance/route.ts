import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Invoice from '@/lib/models/Invoice';
import Project from '@/lib/models/Project';

const SEED_DATA = [
    { invoiceNumber: 'INV-2026-001', client: 'Acme Corporation', project: 'Website Redesign', amount: 28500, date: new Date('2026-03-01'), dueDate: new Date('2026-03-15'), status: 'Pending' as const },
    { invoiceNumber: 'INV-2026-002', client: 'Global Finance Ltd', project: 'E-Commerce Platform', amount: 15200, date: new Date('2026-02-28'), dueDate: new Date('2026-03-14'), status: 'Paid' as const },
    { invoiceNumber: 'INV-2026-003', client: 'Tech Startup Inc', project: 'CRM Integration', amount: 42000, date: new Date('2026-02-25'), dueDate: new Date('2026-03-10'), status: 'Overdue' as const },
    { invoiceNumber: 'INV-2025-012', client: 'Creative Agency', project: 'Brand Identity', amount: 18750, date: new Date('2026-02-20'), dueDate: new Date('2026-03-05'), status: 'Paid' as const },
    { invoiceNumber: 'INV-2025-011', client: 'Acme Corporation', project: 'Website Redesign', amount: 33400, date: new Date('2026-02-15'), dueDate: new Date('2026-03-01'), status: 'Paid' as const },
];

async function ensureSeed() {
    const count = await Invoice.countDocuments();
    if (count === 0) await Invoice.insertMany(SEED_DATA);
}

export async function GET() {
    try {
        await dbConnect();
        await ensureSeed();
        const [invoices, projectCount] = await Promise.all([
            Invoice.find({}).sort({ date: -1 }).lean(),
            Project.countDocuments({ status: { $in: ['In Progress', 'Planning'] } }),
        ]);
        const totalRevenue = invoices.reduce((s, i) => s + i.amount, 0);
        const outstanding = invoices.filter((i) => i.status !== 'Paid').reduce((s, i) => s + i.amount, 0);
        const expenses = Math.round(totalRevenue * 0.08);
        return NextResponse.json({
            success: true,
            data: {
                stats: { totalRevenue, outstanding, expenses, netProfit: totalRevenue - expenses, outstandingCount: invoices.filter((i) => i.status !== 'Paid').length, activeProjects: projectCount },
                invoices: invoices.map((inv) => ({
                    ...inv, _id: (inv._id as { toString: () => string }).toString(),
                    amount: `$${inv.amount.toLocaleString()}`,
                    date: new Date(inv.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    dueDate: new Date(inv.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                })),
            },
        }, { status: 200 });
    } catch (error) {
        console.error('GET /api/finance error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch finance data' }, { status: 500 });
    }
}
