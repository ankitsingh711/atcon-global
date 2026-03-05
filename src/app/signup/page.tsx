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

export default function SignupPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCheckingSession, setIsCheckingSession] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function checkSession() {
            try {
                const response = await fetch('/api/auth/me', { cache: 'no-store' });
                if (!cancelled && response.ok) {
                    router.replace('/dashboard');
                    router.refresh();
                    return;
                }
            } catch {
                // Ignore and let the user sign up.
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

        if (name.trim().length < 2) {
            setError('Name must be at least 2 characters long');
            return;
        }

        if (!email.trim()) {
            setError('Email is required');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name.trim(),
                    email: email.trim(),
                    password,
                }),
            });

            const result = (await response.json()) as { success?: boolean; error?: string };
            if (!response.ok || !result.success) {
                throw new Error(result.error || 'Signup failed');
            }

            router.replace('/dashboard');
            router.refresh();
        } catch (submitError) {
            setError(
                submitError instanceof Error
                    ? submitError.message
                    : 'Unable to create account. Please try again.'
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
                    maxWidth: 460,
                    borderRadius: 3,
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 18px 60px rgba(15,23,42,0.08)',
                }}
            >
                <CardContent sx={{ p: 4 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#0F172A', mb: 1 }}>
                        Create account
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748B', mb: 3 }}>
                        Start using Operations Hub with your team.
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <Stack spacing={2}>
                            {error ? <Alert severity="error">{error}</Alert> : null}

                            <TextField
                                label="Full name"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                autoComplete="name"
                                required
                                fullWidth
                            />

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
                                autoComplete="new-password"
                                required
                                helperText="Use at least 8 characters"
                                fullWidth
                            />

                            <TextField
                                label="Confirm password"
                                type="password"
                                value={confirmPassword}
                                onChange={(event) => setConfirmPassword(event.target.value)}
                                autoComplete="new-password"
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
                                {isSubmitting ? 'Creating account...' : 'Create account'}
                            </Button>

                            <Typography variant="body2" sx={{ textAlign: 'center', color: '#475569' }}>
                                Already have an account?{' '}
                                <Link href="/login" style={{ color: '#16A34A', fontWeight: 600 }}>
                                    Log in
                                </Link>
                            </Typography>
                        </Stack>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}
