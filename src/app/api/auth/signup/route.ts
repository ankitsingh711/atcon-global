import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
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

        await dbConnect();

        const existingUser = await User.findOne({ email }).lean();
        if (existingUser) {
            return NextResponse.json(
                { success: false, error: 'An account with this email already exists' },
                { status: 409 }
            );
        }

        const passwordHash = await hashPassword(password);
        const user = await User.create({
            name,
            email,
            passwordHash,
        });

        const token = createSessionToken({
            id: user.id,
            email: user.email,
            name: user.name,
        });

        const response = NextResponse.json(
            {
                success: true,
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                },
            },
            { status: 201 }
        );

        setSessionCookie(response, token);
        return response;
    } catch (error: unknown) {
        if (typeof error === 'object' && error !== null && 'code' in error && error.code === 11000) {
            return NextResponse.json(
                { success: false, error: 'An account with this email already exists' },
                { status: 409 }
            );
        }

        console.error('POST /api/auth/signup error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create account' },
            { status: 500 }
        );
    }
}
