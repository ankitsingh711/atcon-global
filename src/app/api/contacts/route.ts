import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Contact from '@/lib/models/Contact';
import Activity from '@/lib/models/Activity';

const STATUS_OPTIONS = ['Active', 'Inactive'] as const;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ContactRequestBody {
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
    role?: string;
    status?: (typeof STATUS_OPTIONS)[number];
}

export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search')?.trim() || '';
        const status = searchParams.get('status')?.trim() || '';

        const filter: {
            $or?: Array<{
                name?: { $regex: string; $options: string };
                email?: { $regex: string; $options: string };
                company?: { $regex: string; $options: string };
            }>;
            status?: string;
        } = {};

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { company: { $regex: search, $options: 'i' } },
            ];
        }

        if (status && STATUS_OPTIONS.includes(status as (typeof STATUS_OPTIONS)[number])) {
            filter.status = status;
        }

        const contacts = await Contact.find(filter).sort({ createdAt: -1 }).lean();
        return NextResponse.json({ success: true, data: contacts }, { status: 200 });
    } catch (error) {
        console.error('GET /api/contacts error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch contacts' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = (await request.json()) as ContactRequestBody;
        const name = body.name?.trim();
        const email = body.email?.trim().toLowerCase();
        const status = body.status ?? 'Active';

        if (!name || !email) {
            return NextResponse.json(
                { success: false, error: 'Name and email are required' },
                { status: 400 }
            );
        }

        if (!EMAIL_REGEX.test(email)) {
            return NextResponse.json(
                { success: false, error: 'Please enter a valid email address' },
                { status: 400 }
            );
        }

        if (!STATUS_OPTIONS.includes(status)) {
            return NextResponse.json(
                { success: false, error: 'Invalid contact status' },
                { status: 400 }
            );
        }

        await dbConnect();

        const contact = await Contact.create({
            name,
            email,
            phone: body.phone?.trim() ?? '',
            company: body.company?.trim() ?? '',
            role: body.role?.trim() ?? '',
            status,
        });

        await Activity.create({
            user: 'CRM',
            action: `New contact added: ${name}`,
            color: '#16A34A',
            occurredAt: new Date(),
        });

        return NextResponse.json({ success: true, data: contact }, { status: 201 });
    } catch (error) {
        console.error('POST /api/contacts error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create contact' },
            { status: 500 }
        );
    }
}
