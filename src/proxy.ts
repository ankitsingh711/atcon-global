import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, DEV_FALLBACK_SECRET } from '@/lib/auth/constants';

const AUTH_PAGES = new Set(['/login', '/signup']);
const AUTH_API_PREFIX = '/api/auth';

interface SessionPayload {
    exp: number;
}

function getAuthSecret(): string {
    return process.env.AUTH_SECRET || DEV_FALLBACK_SECRET;
}

function toBase64(value: string): string {
    const paddedLength = Math.ceil(value.length / 4) * 4;
    const padded = value.padEnd(paddedLength, '=');
    return padded.replace(/-/g, '+').replace(/_/g, '/');
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
    return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}

function decodeBase64UrlToBytes(value: string): ArrayBuffer | null {
    try {
        const decoded = atob(toBase64(value));
        const bytes = new Uint8Array(decoded.length);
        for (let index = 0; index < decoded.length; index += 1) {
            bytes[index] = decoded.charCodeAt(index);
        }
        return toArrayBuffer(bytes);
    } catch {
        return null;
    }
}

function decodePayload(encodedPayload: string): SessionPayload | null {
    try {
        const rawPayload = atob(toBase64(encodedPayload));
        return JSON.parse(rawPayload) as SessionPayload;
    } catch {
        return null;
    }
}

async function isValidSessionToken(token: string | undefined): Promise<boolean> {
    if (!token) {
        return false;
    }

    const [encodedPayload, signature] = token.split('.');
    if (!encodedPayload || !signature) {
        return false;
    }

    const signatureBytes = decodeBase64UrlToBytes(signature);
    if (!signatureBytes) {
        return false;
    }

    const secret = getAuthSecret();
    const secretBytes = new TextEncoder().encode(secret);
    const payloadBytes = new TextEncoder().encode(encodedPayload);
    const key = await crypto.subtle.importKey(
        'raw',
        toArrayBuffer(secretBytes),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['verify']
    );

    const signatureValid = await crypto.subtle.verify(
        'HMAC',
        key,
        signatureBytes,
        toArrayBuffer(payloadBytes)
    );

    if (!signatureValid) {
        return false;
    }

    const payload = decodePayload(encodedPayload);
    if (!payload || typeof payload.exp !== 'number') {
        return false;
    }

    return payload.exp > Math.floor(Date.now() / 1000);
}

export async function proxy(request: NextRequest) {
    if (request.method === 'OPTIONS') {
        return NextResponse.next();
    }

    const pathname = request.nextUrl.pathname;
    const isApiRoute = pathname.startsWith('/api/');
    const isAuthApiRoute = pathname.startsWith(AUTH_API_PREFIX);
    const isAuthPage = AUTH_PAGES.has(pathname);
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

    const isAuthenticated = await isValidSessionToken(token);

    if (isAuthenticated && (isAuthPage || pathname === '/')) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (!isAuthenticated) {
        if (isAuthPage || isAuthApiRoute) {
            return NextResponse.next();
        }

        if (isApiRoute) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const loginUrl = new URL('/login', request.url);
        if (pathname !== '/') {
            loginUrl.searchParams.set('next', pathname);
        }
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
