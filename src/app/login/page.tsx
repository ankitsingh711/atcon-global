'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Stack,
    TextField,
    Typography,
} from '@mui/material';

function getRedirectPath(nextPath: string | null): string {
    if (nextPath && nextPath.startsWith('/') && !nextPath.startsWith('//')) {
        return nextPath;
    }

    return '/dashboard';
}

export default function LoginPage() {
    const router = useRouter();
    const [redirectPath, setRedirectPath] = useState('/dashboard');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCheckingSession, setIsCheckingSession] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function checkSession() {
            const nextPath = getRedirectPath(
                new URLSearchParams(window.location.search).get('next')
            );
            setRedirectPath(nextPath);

            try {
                const response = await fetch('/api/auth/me', { cache: 'no-store' });
                if (!cancelled && response.ok) {
                    router.replace(nextPath);
                    router.refresh();
                    return;
                }
            } catch {
                // Ignore and let the user login.
            } finally {
                if (!cancelled) {
                    setIsCheckingSession(false);
                }
            }
        }

        checkSession();

        return () => {
            cancelled = true;
        };
    }, [router]);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);

        if (!email.trim() || !password) {
            setError('Email and password are required');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email.trim(),
                    password,
                }),
            });

            const result = (await response.json()) as { success?: boolean; error?: string };
            if (!response.ok || !result.success) {
                throw new Error(result.error || 'Login failed');
            }

            router.replace(redirectPath);
            router.refresh();
        } catch (submitError) {
            setError(
                submitError instanceof Error
                    ? submitError.message
                    : 'Unable to login. Please try again.'
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isCheckingSession) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'grid',
                    placeItems: 'center',
                    background:
                        'radial-gradient(circle at top, rgba(22,163,74,0.18), transparent 50%), #F8FAFC',
                }}
            >
                <CircularProgress size={28} />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'grid',
                placeItems: 'center',
                p: 2,
                background:
                    'radial-gradient(circle at top, rgba(22,163,74,0.18), transparent 50%), #F8FAFC',
            }}
        >
            <Card
                elevation={0}
                sx={{
                    width: '100%',
                    maxWidth: 420,
                    borderRadius: 3,
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 18px 60px rgba(15,23,42,0.08)',
                }}
            >
                <CardContent sx={{ p: 4 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#0F172A', mb: 1 }}>
                        Log in
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748B', mb: 3 }}>
                        Access your Operations Hub account.
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <Stack spacing={2}>
                            {error ? <Alert severity="error">{error}</Alert> : null}

                            <TextField
                                label="Email"
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                autoComplete="email"
                                required
                                fullWidth
                            />

                            <TextField
                                label="Password"
                                type="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                autoComplete="current-password"
                                required
                                fullWidth
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                disabled={isSubmitting}
                                sx={{
                                    mt: 1,
                                    py: 1.2,
                                    fontWeight: 600,
                                    backgroundColor: '#16A34A',
                                    '&:hover': { backgroundColor: '#15803D' },
                                }}
                            >
                                {isSubmitting ? 'Logging in...' : 'Log in'}
                            </Button>

                            <Typography variant="body2" sx={{ textAlign: 'center', color: '#475569' }}>
                                Don&apos;t have an account?{' '}
                                <Link href="/signup" style={{ color: '#16A34A', fontWeight: 600 }}>
                                    Sign up
                                </Link>
                            </Typography>
                        </Stack>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}
