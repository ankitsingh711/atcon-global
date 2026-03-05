import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Deal from '@/lib/models/Deal';
import Activity from '@/lib/models/Activity';

const STAGES = ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won'] as const;

interface DealRequestBody {
    name?: string;
    client?: string;
    value?: number;
    stage?: (typeof STAGES)[number];
    probability?: number;
}

export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search')?.trim() || '';
        const stage = searchParams.get('stage')?.trim() || '';

        const filter: {
            $or?: Array<{ name?: { $regex: string; $options: string }; client?: { $regex: string; $options: string } }>;
            stage?: string;
        } = {};

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { client: { $regex: search, $options: 'i' } },
            ];
        }

        if (stage && STAGES.includes(stage as (typeof STAGES)[number])) {
            filter.stage = stage;
        }

        const deals = await Deal.find(filter).sort({ createdAt: -1 }).lean();
        return NextResponse.json({ success: true, data: deals }, { status: 200 });
    } catch (error) {
        console.error('GET /api/deals error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch deals' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = (await request.json()) as DealRequestBody;
        const name = body.name?.trim();
        const client = body.client?.trim();
        const stage = body.stage ?? 'Lead';
        const value = Number(body.value ?? 0);
        const probability = Number(body.probability ?? 20);

        if (!name || !client) {
            return NextResponse.json(
                { success: false, error: 'Deal name and client are required' },
                { status: 400 }
            );
        }

        if (!STAGES.includes(stage)) {
            return NextResponse.json(
                { success: false, error: 'Invalid deal stage' },
                { status: 400 }
            );
        }

        if (Number.isNaN(value) || value < 0) {
            return NextResponse.json(
                { success: false, error: 'Deal value must be a non-negative number' },
                { status: 400 }
            );
        }

        if (Number.isNaN(probability) || probability < 0 || probability > 100) {
            return NextResponse.json(
                { success: false, error: 'Probability must be between 0 and 100' },
                { status: 400 }
            );
        }

        await dbConnect();

        const deal = await Deal.create({
            name,
            client,
            stage,
            value,
            probability,
        });

        await Activity.create({
            user: 'Sales',
            action: `New deal created: ${name}`,
            color: '#6366F1',
            occurredAt: new Date(),
        });

        return NextResponse.json({ success: true, data: deal }, { status: 201 });
    } catch (error) {
        console.error('POST /api/deals error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create deal' },
            { status: 500 }
        );
    }
}
