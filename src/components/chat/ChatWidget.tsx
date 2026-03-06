'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
    Box,
    Typography,
    IconButton,
    Paper,
    TextField,
    Avatar,
    InputAdornment,
    CircularProgress,
} from '@mui/material';
import {
    Close as CloseIcon,
    Send as SendIcon,
    SmartToy as BotIcon,
} from '@mui/icons-material';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

interface ChatWidgetProps {
    open: boolean;
    onClose: () => void;
}

export default function ChatWidget({ open, onClose }: ChatWidgetProps) {
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', role: 'assistant', content: 'Hi there! I am your AI assistant. Ask me about your projects, invoices, or tickets.' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (open) {
            scrollToBottom();
        }
    }, [messages, open]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input.trim() };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [...messages, userMessage] }),
            });
            const json = await res.json();

            if (json.success) {
                const assistantMessage: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: json.data };
                setMessages((prev) => [...prev, assistantMessage]);
            } else {
                setMessages((prev) => [...prev, { id: Date.now().toString(), role: 'assistant', content: 'Sorry, I encountered an error. Please try again later.' }]);
            }
        } catch (error) {
            setMessages((prev) => [...prev, { id: Date.now().toString(), role: 'assistant', content: 'Network error. Please try again.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (!open) return null;

    return (
        <Paper
            elevation={6}
            sx={{
                position: 'fixed',
                bottom: 24,
                right: 24,
                width: 360,
                height: 520,
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '16px',
                overflow: 'hidden',
                zIndex: 1300,
                border: '1px solid #E2E8F0',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            }}
        >
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#6366F1', color: '#fff', p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 32, height: 32 }}>
                        <BotIcon sx={{ fontSize: '1.2rem' }} />
                    </Avatar>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '0.95rem' }}>AI Assistant</Typography>
                </Box>
                <IconButton onClick={onClose} size="small" sx={{ color: '#fff', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </Box>

            {/* Chat History */}
            <Box sx={{ flex: 1, p: 2, overflowY: 'auto', bgcolor: '#F8FAFC', display: 'flex', flexDirection: 'column', gap: 2 }}>
                {messages.map((msg) => (
                    <Box key={msg.id} sx={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                        <Box
                            sx={{
                                maxWidth: '80%',
                                p: 1.5,
                                pt: 1,
                                borderRadius: '12px',
                                borderTopRightRadius: msg.role === 'user' ? 0 : '12px',
                                borderTopLeftRadius: msg.role === 'assistant' ? 0 : '12px',
                                bgcolor: msg.role === 'user' ? '#6366F1' : '#FFFFFF',
                                color: msg.role === 'user' ? '#fff' : '#1E293B',
                                border: msg.role === 'assistant' ? '1px solid #E2E8F0' : 'none',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                wordBreak: 'break-word',
                            }}
                        >
                            <Typography sx={{ fontSize: '0.85rem' }}>{msg.content}</Typography>
                        </Box>
                    </Box>
                ))}
                {isLoading && (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <Box sx={{ p: 1.5, borderRadius: '12px', borderTopLeftRadius: 0, bgcolor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
                            <CircularProgress size={16} sx={{ color: '#94A3B8' }} />
                        </Box>
                    </Box>
                )}
                <div ref={messagesEndRef} />
            </Box>

            {/* Input Area */}
            <Box sx={{ p: 2, bgcolor: '#fff', borderTop: '1px solid #E2E8F0' }}>
                <TextField
                    fullWidth
                    placeholder="Ask me anything..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                    variant="outlined"
                    size="small"
                    sx={{
                        '& .MuiOutlinedInput-root': { borderRadius: '24px', pr: 0.5 },
                        '& input': { fontSize: '0.9rem', py: 1.2 },
                    }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={handleSend}
                                    disabled={!input.trim() || isLoading}
                                    sx={{
                                        color: '#fff',
                                        bgcolor: input.trim() ? '#6366F1' : '#CBD5E1',
                                        '&:hover': { bgcolor: input.trim() ? '#4F46E5' : '#CBD5E1' },
                                        width: 32,
                                        height: 32,
                                        mr: 0.5,
                                    }}
                                >
                                    <SendIcon sx={{ fontSize: '1rem' }} />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>
        </Paper>
    );
}
