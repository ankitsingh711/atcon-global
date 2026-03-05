import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@/lib/memory-store';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const context = searchParams.get('context') || 'client-portal';

        const approvals = getStore()
            .approvals.filter((approval) => approval.context === context)
            .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

        return NextResponse.json({ success: true, data: approvals }, { status: 200 });
    } catch (error) {
        console.error('GET /api/approvals error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch approvals' },
            { status: 500 }
        );
    }
}
