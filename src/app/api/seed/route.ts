import { NextResponse } from 'next/server';
import { resetStore } from '@/lib/memory-store';

export async function POST() {
    try {
        resetStore();

        return NextResponse.json(
            {
                success: true,
                message:
                    'Memory store seeded successfully with projects, clients, deals, contacts, approvals, activities, and freelancer data',
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('POST /api/seed error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to seed memory store' },
            { status: 500 }
        );
    }
}
