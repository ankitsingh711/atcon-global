import { NextRequest, NextResponse } from 'next/server';
import { createObjectId, getStore, PersonRecord } from '@/lib/memory-store';

export async function GET() {
    try {
        const people = [...getStore().people].sort(
            (a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime()
        );

        return NextResponse.json({ success: true, data: people }, { status: 200 });
    } catch (error) {
        console.error('GET /api/people error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch people' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = (await request.json()) as Partial<PersonRecord>;
        if (!body.name || !body.email) {
            return NextResponse.json(
                { success: false, error: 'Name and email are required' },
                { status: 400 }
            );
        }

        const colors = ['#6366F1', '#3B82F6', '#EC4899', '#10B981', '#F59E0B'];
        const now = new Date().toISOString();
        const person: PersonRecord = {
            _id: createObjectId(),
            createdAt: now,
            updatedAt: now,
            name: body.name,
            email: body.email,
            department: body.department || '',
            role: body.role || '',
            type: body.type || 'Employee',
            status: 'Active',
            joinDate: now,
            color: colors[Math.floor(Math.random() * colors.length)],
        };

        getStore().people.push(person);

        return NextResponse.json({ success: true, data: person }, { status: 201 });
    } catch (error) {
        console.error('POST /api/people error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create person' },
            { status: 500 }
        );
    }
}
