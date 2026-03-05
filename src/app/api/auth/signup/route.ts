import { NextRequest, NextResponse } from 'next/server';
import { createObjectId, getStore } from '@/lib/memory-store';
import { hashPassword } from '@/lib/auth/password';
import { createSessionToken, setSessionCookie } from '@/lib/auth/session';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface SignupRequestBody {
    name?: string;
    email?: string;
    password?: string;
}

export async function POST(request: NextRequest) {
    try {
        const body = (await request.json()) as SignupRequestBody;
        const name = body.name?.trim();
        const email = body.email?.trim().toLowerCase();
        const password = body.password ?? '';

        if (!name || name.length < 2) {
            return NextResponse.json(
                { success: false, error: 'Name must be at least 2 characters long' },
                { status: 400 }
            );
        }

        if (!email || !EMAIL_REGEX.test(email)) {
            return NextResponse.json(
                { success: false, error: 'Please enter a valid email address' },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { success: false, error: 'Password must be at least 8 characters long' },
                { status: 400 }
            );
        }

        const store = getStore();
        const existingUser = store.users.find((user) => user.email === email);
        if (existingUser) {
            return NextResponse.json(
                { success: false, error: 'An account with this email already exists' },
                { status: 409 }
            );
        }

        const passwordHash = await hashPassword(password);
        const now = new Date().toISOString();
        const user = {
            _id: createObjectId(),
            createdAt: now,
            updatedAt: now,
            name,
            email,
            passwordHash,
        };

        store.users.push(user);

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
            { status: 201 }
        );

        setSessionCookie(response, token);
        return response;
    } catch (error) {
        console.error('POST /api/auth/signup error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create account' },
            { status: 500 }
        );
    }
}
