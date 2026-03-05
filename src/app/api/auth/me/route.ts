import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import {
    AUTH_COOKIE_NAME,
    clearSessionCookie,
    createSessionToken,
    setSessionCookie,
    verifySessionToken,
} from '@/lib/auth/session';

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
        const session = verifySessionToken(token);

        if (!session) {
            const response = NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
            clearSessionCookie(response);
            return response;
        }

        await dbConnect();
        const user = await User.findById(session.sub).lean();

        if (!user) {
            const response = NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
            clearSessionCookie(response);
            return response;
        }

        const refreshedToken = createSessionToken({
            id: user._id.toString(),
            email: user.email,
            name: user.name,
        });

        const response = NextResponse.json(
            {
                success: true,
                data: {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                },
            },
            { status: 200 }
        );

        setSessionCookie(response, refreshedToken);
        return response;
    } catch (error) {
        console.error('GET /api/auth/me error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch user profile' },
            { status: 500 }
        );
    }
}
