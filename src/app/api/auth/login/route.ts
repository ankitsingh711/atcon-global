import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@/lib/memory-store';
import { verifyPassword } from '@/lib/auth/password';
import { createSessionToken, setSessionCookie } from '@/lib/auth/session';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface LoginRequestBody {
    email?: string;
    password?: string;
}

export async function POST(request: NextRequest) {
    try {
        const body = (await request.json()) as LoginRequestBody;
        const email = body.email?.trim().toLowerCase();
        const password = body.password ?? '';

        if (!email || !EMAIL_REGEX.test(email)) {
            return NextResponse.json(
                { success: false, error: 'Please enter a valid email address' },
                { status: 400 }
            );
        }

        if (!password) {
            return NextResponse.json(
                { success: false, error: 'Password is required' },
                { status: 400 }
            );
        }

        const user = getStore().users.find((entry) => entry.email === email);
        if (!user || !user.passwordHash) {
            return NextResponse.json(
                { success: false, error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        const passwordMatches = await verifyPassword(password, user.passwordHash);
        if (!passwordMatches) {
            return NextResponse.json(
                { success: false, error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        const token = createSessionToken({
            id: user._id,
            email: user.email,
            name: user.name,
        });

        const response = NextResponse.json(
            {
                success: true,
                data: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                },
            },
            { status: 200 }
        );

        setSessionCookie(response, token);
        return response;
    } catch (error) {
        console.error('POST /api/auth/login error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to log in' },
            { status: 500 }
        );
    }
}
