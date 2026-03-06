import { NextRequest, NextResponse } from 'next/server';
import { getStore, isObjectId, touchRecord } from '@/lib/memory-store';

export const dynamic = 'force-dynamic';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        if (!isObjectId(id)) {
            return NextResponse.json({ success: false, error: 'Invalid invoice ID' }, { status: 400 });
        }

        const body = await request.json();
        const { status } = body;

        if (!status) {
            return NextResponse.json({ success: false, error: 'Status is required' }, { status: 400 });
        }

        const store = getStore();
        const invoice = store.invoices.find((i) => i._id === id);

        if (!invoice) {
            return NextResponse.json({ success: false, error: 'Invoice not found' }, { status: 404 });
        }

        invoice.status = status;
        touchRecord(invoice);

        return NextResponse.json({ success: true, data: invoice }, { status: 200 });
    } catch (error) {
        console.error('PUT /api/invoices/[id] error:', error);
        return NextResponse.json({ success: false, error: 'Failed to update invoice' }, { status: 500 });
    }
}
