import { NextResponse } from 'next/server';
import { getStore } from '@/lib/memory-store';

export async function GET() {
    try {
        const store = getStore();
        const invoices = [...store.invoices].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        const projectCount = store.projects.filter(
            (project) => project.status === 'In Progress' || project.status === 'Planning'
        ).length;

        const totalRevenue = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
        const outstanding = invoices
            .filter((invoice) => invoice.status !== 'Paid')
            .reduce((sum, invoice) => sum + invoice.amount, 0);
        const expenses = Math.round(totalRevenue * 0.08);

        return NextResponse.json(
            {
                success: true,
                data: {
                    stats: {
                        totalRevenue,
                        outstanding,
                        expenses,
                        netProfit: totalRevenue - expenses,
                        outstandingCount: invoices.filter((invoice) => invoice.status !== 'Paid').length,
                        activeProjects: projectCount,
                    },
                    invoices: invoices.map((invoice) => ({
                        ...invoice,
                        amount: `$${invoice.amount.toLocaleString()}`,
                        date: new Date(invoice.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                        }),
                        dueDate: new Date(invoice.dueDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                        }),
                    })),
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('GET /api/finance error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch finance data' },
            { status: 500 }
        );
    }
}
