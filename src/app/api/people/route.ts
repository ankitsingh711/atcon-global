import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Person from '@/lib/models/Person';

const SEED_DATA = [
    { name: 'John Doe', email: 'john@atcon.com', department: 'Engineering', role: 'Senior Developer', type: 'Employee' as const, status: 'Active' as const, joinDate: new Date('2024-01-15'), color: '#3B82F6' },
    { name: 'Sarah Johnson', email: 'sarah@atcon.com', department: 'Design', role: 'Lead Designer', type: 'Contractor' as const, status: 'Active' as const, joinDate: new Date('2024-03-01'), color: '#EC4899' },
    { name: 'Mike Chen', email: 'mike@atcon.com', department: 'Engineering', role: 'Backend Developer', type: 'Employee' as const, status: 'Active' as const, joinDate: new Date('2024-06-15'), color: '#F59E0B' },
    { name: 'Emily Rodriguez', email: 'emily@atcon.com', department: 'Marketing', role: 'Marketing Manager', type: 'Employee' as const, status: 'On Leave' as const, joinDate: new Date('2024-02-01'), color: '#10B981' },
    { name: 'David Kim', email: 'david@atcon.com', department: 'Operations', role: 'DevOps Lead', type: 'Employee' as const, status: 'Active' as const, joinDate: new Date('2023-08-01'), color: '#8B5CF6' },
    { name: 'Lisa Patel', email: 'lisa@atcon.com', department: 'Finance', role: 'Financial Analyst', type: 'Employee' as const, status: 'Active' as const, joinDate: new Date('2024-11-01'), color: '#6366F1' },
    { name: 'James Wilson', email: 'james@atcon.com', department: 'Engineering', role: 'Mobile Developer', type: 'Contractor' as const, status: 'Active' as const, joinDate: new Date('2024-09-01'), color: '#EF4444' },
];

async function ensureSeed() {
    const count = await Person.countDocuments();
    if (count === 0) await Person.insertMany(SEED_DATA);
}

export async function GET() {
    try {
        await dbConnect();
        await ensureSeed();
        const people = await Person.find({}).sort({ joinDate: -1 }).lean();
        return NextResponse.json({ success: true, data: people }, { status: 200 });
    } catch (error) {
        console.error('GET /api/people error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch people' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        if (!body.name || !body.email) {
            return NextResponse.json({ success: false, error: 'Name and email are required' }, { status: 400 });
        }
        await dbConnect();
        const colors = ['#6366F1', '#3B82F6', '#EC4899', '#10B981', '#F59E0B'];
        const person = await Person.create({
            name: body.name, email: body.email, department: body.department || '', role: body.role || '',
            type: body.type || 'Employee', status: 'Active', joinDate: new Date(),
            color: colors[Math.floor(Math.random() * colors.length)],
        });
        return NextResponse.json({ success: true, data: person }, { status: 201 });
    } catch (error) {
        console.error('POST /api/people error:', error);
        return NextResponse.json({ success: false, error: 'Failed to create person' }, { status: 500 });
    }
}
