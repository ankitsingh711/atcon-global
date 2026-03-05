import { NextResponse } from 'next/server';
import { getStore } from '@/lib/memory-store';

export async function GET() {
    try {
        const forms = [...getStore().forms].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        return NextResponse.json(
            {
                success: true,
                data: forms.map((form) => ({
                    ...form,
                    lastSubmission: form.lastSubmission
                        ? new Date(form.lastSubmission).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                          })
                        : '-',
                })),
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('GET /api/forms error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch forms' },
            { status: 500 }
        );
    }
}
