import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Talent from '@/lib/models/Talent';

const SEED_DATA = [
    { name: 'Sarah Johnson', role: 'Senior React Developer', skills: ['React', 'TypeScript', 'Node.js'], experience: '8 years', rate: '$95/hr', availability: 'Available' as const, rating: 4.9, color: '#6366F1' },
    { name: 'Mike Chen', role: 'Full Stack Developer', skills: ['Python', 'Django', 'React'], experience: '6 years', rate: '$85/hr', availability: 'Available' as const, rating: 4.7, color: '#F59E0B' },
    { name: 'Emily Rodriguez', role: 'UI/UX Designer', skills: ['Figma', 'Sketch', 'Adobe XD'], experience: '5 years', rate: '$80/hr', availability: 'On Project' as const, rating: 4.8, color: '#EC4899' },
    { name: 'David Kim', role: 'DevOps Engineer', skills: ['AWS', 'Docker', 'Kubernetes'], experience: '7 years', rate: '$100/hr', availability: 'Available' as const, rating: 4.6, color: '#10B981' },
    { name: 'Lisa Patel', role: 'Data Scientist', skills: ['Python', 'TensorFlow', 'SQL'], experience: '4 years', rate: '$90/hr', availability: 'On Project' as const, rating: 4.5, color: '#8B5CF6' },
    { name: 'James Wilson', role: 'Mobile Developer', skills: ['React Native', 'Swift', 'Kotlin'], experience: '5 years', rate: '$88/hr', availability: 'Available' as const, rating: 4.7, color: '#3B82F6' },
];

async function ensureSeed() {
    const count = await Talent.countDocuments();
    if (count === 0) await Talent.insertMany(SEED_DATA);
}

export async function GET() {
    try {
        await dbConnect();
        await ensureSeed();
        const talent = await Talent.find({}).sort({ createdAt: -1 }).lean();
        return NextResponse.json({ success: true, data: talent }, { status: 200 });
    } catch (error) {
        console.error('GET /api/talent error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch talent' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        if (!body.name || !body.role) {
            return NextResponse.json({ success: false, error: 'Name and role are required' }, { status: 400 });
        }
        await dbConnect();
        const colors = ['#6366F1', '#F59E0B', '#EC4899', '#10B981', '#8B5CF6', '#3B82F6'];
        const talent = await Talent.create({
            name: body.name,
            role: body.role,
            skills: body.skills ? (typeof body.skills === 'string' ? body.skills.split(',').map((s: string) => s.trim()) : body.skills) : [],
            experience: body.experience || '',
            rate: body.rate || '',
            availability: body.availability || 'Available',
            rating: 4.5,
            color: colors[Math.floor(Math.random() * colors.length)],
        });
        return NextResponse.json({ success: true, data: talent }, { status: 201 });
    } catch (error) {
        console.error('POST /api/talent error:', error);
        return NextResponse.json({ success: false, error: 'Failed to create talent' }, { status: 500 });
    }
}
