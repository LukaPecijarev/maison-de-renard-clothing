import React, { useState, useRef, useEffect } from 'react';
import { Box, IconButton, TextField, Typography, Paper, CircularProgress, Tooltip } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(() => {
        const saved = localStorage.getItem('chatbotOpen');
        return saved ? JSON.parse(saved) : false;
    });

    const [messages, setMessages] = useState(() => {
        const saved = localStorage.getItem('chatbotMessages');
        return saved ? JSON.parse(saved) : [
            {
                role: 'assistant',
                content: 'Добредојдовте во Maison de Renard! Прашајте ме за производи, цени или категории. Како можам да ви помогнам?',
                products: [],
            },
        ];
    });

    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        localStorage.setItem('chatbotOpen', JSON.stringify(isOpen));
    }, [isOpen]);

    useEffect(() => {
        localStorage.setItem('chatbotMessages', JSON.stringify(messages));
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleToggleChat = () => {
        if (!isAnimating) {
            if (isOpen) {
                setIsClosing(true);
                setIsAnimating(true);
                setTimeout(() => {
                    setIsOpen(false);
                    setIsClosing(false);
                    setIsAnimating(false);
                }, 500);
            } else {
                setIsAnimating(true);
                setIsOpen(true);
                setTimeout(() => setIsAnimating(false), 500);
            }
        }
    };

    const handleClearChat = () => {
        if (window.confirm('Дали сакате да го избришете chat-от?')) {
            const initialMessage = {
                role: 'assistant',
                content: 'Добредојдовте во Maison de Renard! Прашајте ме за производи, цени или категории. Kako можам да ви помогнам?',
                products: [],
            };
            setMessages([initialMessage]);
            localStorage.setItem('chatbotMessages', JSON.stringify([initialMessage]));
        }
    };

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMessage = { role: 'user', content: input, products: [] };
        const currentInput = input;

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            // Подготви conversation history (без products, само role и content)
            const conversationHistory = messages
                .filter(m => m.role !== 'system')
                .map(m => ({ role: m.role, content: m.content }));

            const response = await fetch('http://localhost:8080/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: currentInput,
                    conversationHistory: conversationHistory,
                }),
            });

            const data = await response.json();

            const assistantMessage = {
                role: 'assistant',
                content: data.reply,
                products: data.products || [],
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [
                ...prev,
                {
                    role: 'assistant',
                    content: '😊 Извинете, имаше проблем. Обидете се повторно!',
                    products: [],
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {!isOpen && (
                <IconButton
                    onClick={handleToggleChat}
                    sx={{
                        position: 'fixed',
                        bottom: 24,
                        right: 24,
                        width: 64,
                        height: 64,
                        backgroundColor: '#d4b896',
                        color: '#ffffff',
                        boxShadow: '0 6px 24px rgba(212, 184, 150, 0.45)',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        zIndex: 1000,
                        animation: 'fadeInUp 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)',
                        '@keyframes fadeInUp': {
                            '0%': { opacity: 0, transform: 'translateY(30px) scale(0.7)' },
                            '100%': { opacity: 1, transform: 'translateY(0) scale(1)' },
                        },
                        '&:hover': {
                            backgroundColor: '#c4a886',
                            transform: 'scale(1.08) translateY(-2px)',
                            boxShadow: '0 8px 30px rgba(196, 168, 134, 0.55)',
                        },
                    }}
                >
                    <ChatIcon sx={{ fontSize: 28 }} />
                </IconButton>
            )}

            {(isOpen || isClosing) && (
                <Paper
                    elevation={8}
                    sx={{
                        position: 'fixed',
                        bottom: 24,
                        right: 24,
                        width: 380,
                        height: 550,
                        display: 'flex',
                        flexDirection: 'column',
                        backgroundColor: '#ffffff',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                        border: '1px solid rgba(212, 184, 150, 0.25)',
                        zIndex: 1000,
                        animation: isClosing
                            ? 'slideOutDown 0.5s cubic-bezier(0.25, 0.8, 0.25, 1) forwards'
                            : 'slideInUp 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)',
                        '@keyframes slideInUp': {
                            '0%': { opacity: 0, transform: 'translateY(60px) scale(0.85)' },
                            '100%': { opacity: 1, transform: 'translateY(0) scale(1)' },
                        },
                        '@keyframes slideOutDown': {
                            '0%': { opacity: 1, transform: 'translateY(0) scale(1)' },
                            '100%': { opacity: 0, transform: 'translateY(40px) scale(0.9)' },
                        },
                    }}
                >
                    {/* Header */}
                    <Box sx={{
                        background: 'linear-gradient(135deg, #d4b896 0%, #c4a886 100%)',
                        color: '#ffffff',
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <SmartToyOutlinedIcon sx={{ fontSize: 24 }} />
                            <Box>
                                <Typography sx={{
                                    fontFamily: '"Cormorant Garamond", serif',
                                    fontSize: '1.1rem', fontWeight: 500, letterSpacing: '0.05em',
                                }}>
                                    Maison Assistant
                                </Typography>
                                <Typography sx={{
                                    fontFamily: '"Lato", sans-serif',
                                    fontSize: '0.7rem', opacity: 0.9, letterSpacing: '0.05em',
                                }}>
                                    Powered by Claude AI
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Tooltip title="Clear Chat" placement="bottom">
                                <IconButton onClick={handleClearChat} sx={{
                                    color: '#ffffff',
                                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
                                }}>
                                    <DeleteOutlineIcon sx={{ fontSize: 20 }} />
                                </IconButton>
                            </Tooltip>
                            <IconButton onClick={handleToggleChat} sx={{
                                color: '#ffffff',
                                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
                            }}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    </Box>

                    {/* Messages */}
                    <Box sx={{
                        flex: 1, overflowY: 'auto', p: 2,
                        backgroundColor: '#f5f1e8',
                        display: 'flex', flexDirection: 'column', gap: 1.5,
                    }}>
                        {messages.map((message, index) => (
                            <Box key={index}>
                                <Box sx={{ display: 'flex', justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start' }}>
                                    <Box sx={{
                                        maxWidth: '75%',
                                        p: 1.5,
                                        borderRadius: message.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                        backgroundColor: message.role === 'user' ? '#d4b896' : '#ffffff',
                                        color: message.role === 'user' ? '#ffffff' : '#2c2c2c',
                                        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                                        border: message.role === 'assistant' ? '1px solid rgba(212, 184, 150, 0.15)' : 'none',
                                    }}>
                                        <Typography sx={{
                                            fontFamily: '"Lato", sans-serif',
                                            fontSize: '0.875rem', lineHeight: 1.6, whiteSpace: 'pre-wrap',
                                        }}>
                                            {message.content}
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* Product Cards */}
                                {message.products && message.products.length > 0 && (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
                                        {message.products.map((product) => {
                                            const images = product.imageUrl
                                                ? product.imageUrl.split(',').map(url => url.trim())
                                                : [];
                                            const imageUrl = images[0] || 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300';

                                            return (
                                                <Box
                                                    key={product.id}
                                                    sx={{
                                                        display: 'flex', gap: 1.5,
                                                        backgroundColor: '#ffffff',
                                                        borderRadius: '14px', p: 1.2,
                                                        border: '1px solid rgba(212, 184, 150, 0.15)',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                        '&:hover': {
                                                            boxShadow: '0 6px 20px rgba(212, 184, 150, 0.25)',
                                                            transform: 'translateY(-3px)',
                                                            borderColor: 'rgba(212, 184, 150, 0.3)',
                                                        },
                                                    }}
                                                    onClick={() => {
                                                        setIsOpen(false);
                                                        window.location.href = `/products/${product.id}`;
                                                    }}
                                                >
                                                    <Box component="img" src={imageUrl} alt={product.name}
                                                         sx={{ width: 60, height: 80, objectFit: 'cover', borderRadius: '8px' }} />
                                                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                                        <Typography sx={{
                                                            fontFamily: '"Lato", sans-serif',
                                                            fontSize: '0.8rem', fontWeight: 500, color: '#2c2c2c', mb: 0.5,
                                                        }}>
                                                            {product.name}
                                                        </Typography>
                                                        <Typography sx={{
                                                            fontFamily: '"Cormorant Garamond", serif',
                                                            fontSize: '1rem', fontWeight: 600, color: '#d4b896',
                                                        }}>
                                                            €{product.price.toFixed(0)}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            );
                                        })}
                                    </Box>
                                )}
                            </Box>
                        ))}

                        {loading && (
                            <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                                <Box sx={{
                                    p: 1.5, borderRadius: '18px 18px 18px 4px',
                                    backgroundColor: '#ffffff',
                                    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                                    border: '1px solid rgba(212, 184, 150, 0.15)',
                                }}>
                                    <CircularProgress size={20} sx={{ color: '#d4b896' }} />
                                </Box>
                            </Box>
                        )}
                        <div ref={messagesEndRef} />
                    </Box>

                    {/* Input */}
                    <Box sx={{
                        p: 2, backgroundColor: '#ffffff',
                        borderTop: '1px solid rgba(212, 184, 150, 0.15)',
                        display: 'flex', gap: 1,
                    }}>
                        <TextField
                            fullWidth multiline maxRows={3}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Прашајте за производи..."
                            disabled={loading}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    fontFamily: '"Lato", sans-serif',
                                    fontSize: '0.875rem', borderRadius: '16px',
                                    '& fieldset': { borderColor: 'rgba(212, 184, 150, 0.25)', borderWidth: '1.5px' },
                                    '&:hover fieldset': { borderColor: '#d4b896' },
                                    '&.Mui-focused fieldset': { borderColor: '#c4a886', borderWidth: '2px' },
                                },
                            }}
                        />
                        <IconButton
                            onClick={handleSend}
                            disabled={!input.trim() || loading}
                            sx={{
                                backgroundColor: '#d4b896', color: '#ffffff',
                                width: 48, height: 48,
                                '&:hover': { backgroundColor: '#c4a886', transform: 'scale(1.05)' },
                                '&.Mui-disabled': {
                                    backgroundColor: 'rgba(212, 184, 150, 0.3)',
                                    color: 'rgba(255, 255, 255, 0.5)',
                                },
                            }}
                        >
                            <SendIcon />
                        </IconButton>
                    </Box>
                </Paper>
            )}
        </>
    );
};

export default ChatBot;