import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import FormEntry from '@/lib/models/FormEntry';

const SEED_DATA = [
    { name: 'Client Onboarding Form', type: 'Intake', submissions: 24, status: 'Active' as const, completion: 85, lastSubmission: new Date('2026-03-05') },
    { name: 'Project Brief Template', type: 'Brief', submissions: 18, status: 'Active' as const, completion: 92, lastSubmission: new Date('2026-03-04') },
    { name: 'Freelancer Application', type: 'Application', submissions: 45, status: 'Active' as const, completion: 78, lastSubmission: new Date('2026-03-03') },
    { name: 'Feedback Survey', type: 'Survey', submissions: 12, status: 'Active' as const, completion: 65, lastSubmission: new Date('2026-03-02') },
    { name: 'NDA Agreement', type: 'Legal', submissions: 31, status: 'Active' as const, completion: 100, lastSubmission: new Date('2026-03-01') },
    { name: 'Q1 Performance Review', type: 'Review', submissions: 8, status: 'Draft' as const, completion: 40, lastSubmission: null },
];

async function ensureSeed() {
    const count = await FormEntry.countDocuments();
    if (count === 0) await FormEntry.insertMany(SEED_DATA);
}

export async function GET() {
    try {
        await dbConnect();
        await ensureSeed();
        const forms = await FormEntry.find({}).sort({ createdAt: -1 }).lean();
        return NextResponse.json({
            success: true,
            data: forms.map((f) => ({
                ...f, _id: (f._id as { toString: () => string }).toString(),
                lastSubmission: f.lastSubmission
                    ? new Date(f.lastSubmission).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : '-',
            })),
        }, { status: 200 });
    } catch (error) {
        console.error('GET /api/forms error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch forms' }, { status: 500 });
    }
}
