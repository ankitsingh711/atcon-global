import crypto from 'crypto';
import { NextResponse } from 'next/server';
import {
    AUTH_COOKIE_NAME,
    DEV_FALLBACK_SECRET,
    SESSION_MAX_AGE_SECONDS,
} from '@/lib/auth/constants';

export interface SessionPayload {
    sub: string;
    email: string;
    name: string;
    exp: number;
}

export interface SessionUser {
    id: string;
    email: string;
    name: string;
}

function getAuthSecret(): string {
    return process.env.AUTH_SECRET || DEV_FALLBACK_SECRET;
}

function encodePayload(payload: SessionPayload): string {
    return Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
}

function decodePayload(encodedPayload: string): SessionPayload | null {
    try {
        const rawPayload = Buffer.from(encodedPayload, 'base64url').toString('utf8');
        return JSON.parse(rawPayload) as SessionPayload;
    } catch {
        return null;
    }
}

function signPayload(encodedPayload: string): string {
    return crypto.createHmac('sha256', getAuthSecret()).update(encodedPayload).digest('base64url');
}

function safeCompare(a: string, b: string): boolean {
    const aBuffer = Buffer.from(a);
    const bBuffer = Buffer.from(b);

    if (aBuffer.length !== bBuffer.length) {
        return false;
    }

    return crypto.timingSafeEqual(aBuffer, bBuffer);
}

export function createSessionToken(user: SessionUser): string {
    const payload: SessionPayload = {
        sub: user.id,
        email: user.email,
        name: user.name,
        exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS,
    };

    const encodedPayload = encodePayload(payload);
    const signature = signPayload(encodedPayload);
    return `${encodedPayload}.${signature}`;
}

export function verifySessionToken(token: string | undefined): SessionPayload | null {
    if (!token) {
        return null;
    }

    const [encodedPayload, signature] = token.split('.');

    if (!encodedPayload || !signature) {
        return null;
    }

    const expectedSignature = signPayload(encodedPayload);
    if (!safeCompare(signature, expectedSignature)) {
        return null;
    }

    const payload = decodePayload(encodedPayload);
    if (!payload || !payload.sub || !payload.email || !payload.name || !payload.exp) {
        return null;
    }

    if (payload.exp <= Math.floor(Date.now() / 1000)) {
        return null;
    }

    return payload;
}

function getCookieBaseOptions() {
    return {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        path: '/',
    };
}

export function setSessionCookie(response: NextResponse, token: string): void {
    response.cookies.set({
        name: AUTH_COOKIE_NAME,
        value: token,
        maxAge: SESSION_MAX_AGE_SECONDS,
        ...getCookieBaseOptions(),
    });
}

export function clearSessionCookie(response: NextResponse): void {
    response.cookies.set({
        name: AUTH_COOKIE_NAME,
        value: '',
        maxAge: 0,
        ...getCookieBaseOptions(),
    });
}

export { AUTH_COOKIE_NAME, SESSION_MAX_AGE_SECONDS };
