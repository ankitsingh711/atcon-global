import { NextRequest, NextResponse } from 'next/server';
import { createObjectId, getStore, InvoiceRecord } from '@/lib/memory-store';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const body = (await request.json()) as Partial<InvoiceRecord>;

        const invoiceNumber = body.invoiceNumber?.trim() || `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
        const client = body.client?.trim() || 'Unknown Client';
        const project = body.project?.trim() || '';
        const amount = Number(body.amount) || 0;
        const date = body.date || new Date().toISOString();
        const dueDate = body.dueDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
        const status = body.status || 'Pending';

        const now = new Date().toISOString();
        const invoice: InvoiceRecord = {
            _id: createObjectId(),
            createdAt: now,
            updatedAt: now,
            invoiceNumber,
            client,
            project,
            amount,
            date,
            dueDate,
            status: status as InvoiceRecord['status'],
        };

        getStore().invoices.push(invoice);

        return NextResponse.json({ success: true, data: invoice }, { status: 201 });
    } catch (error) {
        console.error('POST /api/invoices error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create invoice' },
            { status: 500 }
        );
    }
}
