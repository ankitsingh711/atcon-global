'use client';

import React from 'react';
import {
    Box,
    AppBar,
    Toolbar,
    InputBase,
    IconButton,
    Badge,
    Avatar,
    Typography,
    ClickAwayListener,
    Popper,
    Paper,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    CircularProgress,
    Divider,
} from '@mui/material';
import {
    Search as SearchIcon,
    NotificationsNoneOutlined as NotificationIcon,
    ChatBubbleOutline as ChatIcon,
    AssignmentOutlined as ProjectIcon,
    BusinessOutlined as ClientIcon,
    ReceiptOutlined as InvoiceIcon,
    ConfirmationNumberOutlined as TicketIcon,
    PersonOutline as PersonIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useRef, useState, useEffect } from 'react';
import { SIDEBAR_WIDTH } from './Sidebar';
import ChatWidget from '../chat/ChatWidget';

export default function Header() {
    const router = useRouter();
    const searchRef = useRef<HTMLInputElement>(null);
    const boxRef = useRef<HTMLDivElement>(null);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<{ id: string; type: string; title: string; subtitle: string; url: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                searchRef.current?.focus();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            setOpen(false);
            return;
        }

        const fetchResults = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                const json = await res.json();
                if (json.success) {
                    setResults(json.data);
                    setOpen(true);
                }
            } catch (err) {
                console.error('Search error', err);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(fetchResults, 300);
        return () => clearTimeout(timer);
    }, [query]);

    const handleSelect = (url: string) => {
        setOpen(false);
        setQuery('');
        router.push(url);
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'Project': return <ProjectIcon sx={{ color: '#6366F1' }} />;
            case 'Client': return <ClientIcon sx={{ color: '#10B981' }} />;
            case 'Invoice': return <InvoiceIcon sx={{ color: '#F59E0B' }} />;
            case 'Ticket': return <TicketIcon sx={{ color: '#EF4444' }} />;
            case 'Talent': case 'People': return <PersonIcon sx={{ color: '#8B5CF6' }} />;
            default: return <SearchIcon sx={{ color: '#94A3B8' }} />;
        }
    };

    return (
        <AppBar
            position="fixed"
            elevation={0}
            sx={{
                width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
                ml: `${SIDEBAR_WIDTH}px`,
                backgroundColor: '#FFFFFF',
                borderBottom: '1px solid #E2E8F0',
                zIndex: (theme) => theme.zIndex.drawer - 1,
            }}
        >
            <Toolbar sx={{ justifyContent: 'space-between', minHeight: '64px !important', px: 3 }}>
                {/* Global Search */}
                <ClickAwayListener onClickAway={() => setOpen(false)}>
                    <Box>
                        <Box
                            ref={boxRef}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                backgroundColor: '#F8FAFC',
                                borderRadius: '10px',
                                border: '1px solid #E2E8F0',
                                px: 1.5,
                                py: 0.5,
                                width: 320,
                                transition: 'all 0.2s ease',
                                '&:focus-within': {
                                    borderColor: '#16A34A',
                                    boxShadow: '0 0 0 3px rgba(22, 163, 74, 0.1)',
                                },
                            }}
                        >
                            <SearchIcon sx={{ color: '#94A3B8', fontSize: '1.2rem', mr: 1 }} />
                            <InputBase
                                inputRef={searchRef}
                                placeholder="Search anything..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onFocus={() => { if (query.trim()) setOpen(true); }}
                                sx={{
                                    fontSize: '0.85rem',
                                    color: '#1E293B',
                                    flex: 1,
                                    '& ::placeholder': { color: '#94A3B8' },
                                }}
                            />
                            <Typography
                                variant="caption"
                                sx={{
                                    backgroundColor: '#E2E8F0',
                                    color: '#64748B',
                                    px: 0.8,
                                    py: 0.2,
                                    borderRadius: 1,
                                    fontSize: '0.65rem',
                                    fontWeight: 500,
                                }}
                            >
                                ⌘K
                            </Typography>
                        </Box>

                        <Popper open={open && !!query.trim()} anchorEl={boxRef.current} placement="bottom-start" style={{ zIndex: 1200, width: boxRef.current?.offsetWidth }}>
                            <Paper elevation={3} sx={{ mt: 1, maxHeight: 400, overflow: 'auto', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                                {loading ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}><CircularProgress size={24} sx={{ color: '#16A34A' }} /></Box>
                                ) : results.length > 0 ? (
                                    <List sx={{ p: 0 }}>
                                        {results.map((res, i) => (
                                            <Box key={res.id}>
                                                <ListItem component="div" onClick={() => handleSelect(res.url)} sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#F8FAFC' }, py: 1.5 }}>
                                                    <ListItemIcon sx={{ minWidth: 40 }}>
                                                        <Avatar sx={{ width: 32, height: 32, bgcolor: '#F1F5F9' }}>{getIcon(res.type)}</Avatar>
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={<Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#1E293B' }}>{res.title}</Typography>}
                                                        secondary={
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.3 }}>
                                                                <Typography component="span" sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748B', px: 0.6, py: 0.2, bgcolor: '#F1F5F9', borderRadius: '4px' }}>{res.type}</Typography>
                                                                <Typography component="span" sx={{ fontSize: '0.75rem', color: '#64748B' }}>{res.subtitle}</Typography>
                                                            </Box>
                                                        }
                                                    />
                                                </ListItem>
                                                {i < results.length - 1 && <Divider />}
                                            </Box>
                                        ))}
                                    </List>
                                ) : (
                                    <Box sx={{ p: 3, textAlign: 'center' }}>
                                        <Typography sx={{ color: '#64748B', fontSize: '0.85rem' }}>No results found for &quot;{query}&quot;</Typography>
                                    </Box>
                                )}
                            </Paper>
                        </Popper>
                    </Box>
                </ClickAwayListener>

                {/* Right Actions */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton
                        size="small"
                        sx={{
                            color: '#64748B',
                            '&:hover': { backgroundColor: '#F1F5F9' },
                        }}
                    >
                        <Badge
                            variant="dot"
                            color="error"
                            sx={{ '& .MuiBadge-badge': { width: 8, height: 8, minWidth: 8 } }}
                        >
                            <NotificationIcon sx={{ fontSize: '1.3rem' }} />
                        </Badge>
                    </IconButton>

                    <IconButton
                        size="small"
                        onClick={() => setChatOpen((prev) => !prev)}
                        sx={{
                            color: chatOpen ? '#6366F1' : '#64748B',
                            backgroundColor: chatOpen ? '#EEF2FF' : 'transparent',
                            '&:hover': { backgroundColor: chatOpen ? '#EEF2FF' : '#F1F5F9' },
                        }}
                    >
                        <ChatIcon sx={{ fontSize: '1.25rem' }} />
                    </IconButton>

                    <Box sx={{ ml: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar
                            sx={{
                                width: 34,
                                height: 34,
                                bgcolor: '#6366F1',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                            }}
                        >
                            AS
                        </Avatar>
                    </Box>
                </Box>
            </Toolbar>
            <ChatWidget open={chatOpen} onClose={() => setChatOpen(false)} />
        </AppBar>
    );
}
