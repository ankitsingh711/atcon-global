import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Client from '@/lib/models/Client';

export async function GET() {
    try {
        await dbConnect();

        const clients = await Client.find({}).sort({ name: 1 }).lean();

        return NextResponse.json({ success: true, data: clients }, { status: 200 });
    } catch (error) {
        console.error('GET /api/clients error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch clients' },
            { status: 500 }
        );
    }
}
