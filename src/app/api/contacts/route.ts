import { NextRequest, NextResponse } from 'next/server';
import { ContactRecord, createObjectId, getStore } from '@/lib/memory-store';

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
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search')?.trim().toLowerCase() || '';
        const status = searchParams.get('status')?.trim() || '';

        const contacts = getStore()
            .contacts.filter((contact) => {
                const matchesSearch =
                    !search ||
                    contact.name.toLowerCase().includes(search) ||
                    contact.email.toLowerCase().includes(search) ||
                    contact.company.toLowerCase().includes(search);
                const matchesStatus =
                    !status ||
                    !STATUS_OPTIONS.includes(status as (typeof STATUS_OPTIONS)[number]) ||
                    contact.status === status;
                return matchesSearch && matchesStatus;
            })
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

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

        const now = new Date().toISOString();
        const contact: ContactRecord = {
            _id: createObjectId(),
            createdAt: now,
            updatedAt: now,
            name,
            email,
            phone: body.phone?.trim() ?? '',
            company: body.company?.trim() ?? '',
            role: body.role?.trim() ?? '',
            status,
        };

        const store = getStore();
        store.contacts.push(contact);
        store.activities.unshift({
            _id: createObjectId(),
            createdAt: now,
            updatedAt: now,
            user: 'CRM',
            action: `New contact added: ${name}`,
            color: '#16A34A',
            occurredAt: now,
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
