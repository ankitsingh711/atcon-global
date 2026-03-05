import { NextRequest, NextResponse } from 'next/server';
import { createObjectId, getStore, TalentRecord } from '@/lib/memory-store';

export async function GET() {
    try {
        const talent = [...getStore().talent].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        return NextResponse.json({ success: true, data: talent }, { status: 200 });
    } catch (error) {
        console.error('GET /api/talent error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch talent' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = (await request.json()) as Partial<TalentRecord> & {
            skills?: string[] | string;
        };

        if (!body.name || !body.role) {
            return NextResponse.json(
                { success: false, error: 'Name and role are required' },
                { status: 400 }
            );
        }

        const colors = ['#6366F1', '#F59E0B', '#EC4899', '#10B981', '#8B5CF6', '#3B82F6'];
        const now = new Date().toISOString();
        const skills = body.skills
            ? typeof body.skills === 'string'
                ? body.skills
                      .split(',')
                      .map((skill) => skill.trim())
                      .filter(Boolean)
                : body.skills
            : [];

        const talent: TalentRecord = {
            _id: createObjectId(),
            createdAt: now,
            updatedAt: now,
            name: body.name,
            role: body.role,
            skills,
            experience: body.experience || '',
            rate: body.rate || '',
            availability: body.availability || 'Available',
            rating: 4.5,
            color: colors[Math.floor(Math.random() * colors.length)],
        };

        getStore().talent.push(talent);

        return NextResponse.json({ success: true, data: talent }, { status: 201 });
    } catch (error) {
        console.error('POST /api/talent error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create talent' },
            { status: 500 }
        );
    }
}
