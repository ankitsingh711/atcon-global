import { NextRequest, NextResponse } from 'next/server';
import { createObjectId, DealRecord, getStore } from '@/lib/memory-store';

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
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search')?.trim().toLowerCase() || '';
        const stage = searchParams.get('stage')?.trim() || '';

        const deals = getStore()
            .deals.filter((deal) => {
                const matchesSearch =
                    !search ||
                    deal.name.toLowerCase().includes(search) ||
                    deal.client.toLowerCase().includes(search);
                const matchesStage =
                    !stage ||
                    !STAGES.includes(stage as (typeof STAGES)[number]) ||
                    deal.stage === stage;
                return matchesSearch && matchesStage;
            })
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

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

        const now = new Date().toISOString();
        const deal: DealRecord = {
            _id: createObjectId(),
            createdAt: now,
            updatedAt: now,
            name,
            client,
            stage,
            value,
            probability,
        };

        const store = getStore();
        store.deals.push(deal);
        store.activities.unshift({
            _id: createObjectId(),
            createdAt: now,
            updatedAt: now,
            user: 'Sales',
            action: `New deal created: ${name}`,
            color: '#6366F1',
            occurredAt: now,
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
