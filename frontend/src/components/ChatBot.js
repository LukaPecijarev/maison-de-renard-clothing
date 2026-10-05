import React, { useState, useRef, useEffect } from 'react';
import { Box, IconButton, TextField, Typography, Paper, Tooltip } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EastRoundedIcon from '@mui/icons-material/EastRounded';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axios/axios';
import { startProductTransition } from '../utils/sharedImageTransition';
import ConfirmDialog from './ConfirmDialog';
import { getProductImages, FALLBACK_PRODUCT_IMAGE } from '../utils/productImages';

// Desktop = MUI's `lg` breakpoint (1200px) and up, with a real mouse. Phones and
// tablets (including large tablets in landscape) get the compact styling below
// and never have the panel open by itself.
const isDesktop = () =>
    typeof window.matchMedia === 'function'
        ? window.matchMedia('(min-width: 1200px) and (hover: hover) and (pointer: fine)').matches
        : window.innerWidth >= 1200;

const WELCOME_MESSAGE = 'Добредојдовте во Maison de Renard! Прашајте ме за производи, цени или категории. Како можам да ви помогнам?';

// Shown while the conversation is still just the welcome message, so it's easy
// to start; tapping one sends it.
const QUICK_REPLIES = ['Нови колекции', 'Идеи за подарок', 'Специјални понуди', 'Помогни ми да изберам палто'];

const ChatBot = () => {
    const navigate = useNavigate();
    // Always starts open on a fresh page load/refresh on desktop, rather than
    // remembering whether it was closed last time - but starts closed (just the
    // floating button) on phones and tablets, where it would cover a large part
    // of the screen the moment the site loads.
    const [isOpen, setIsOpen] = useState(isDesktop);

    const [messages, setMessages] = useState(() => {
        const saved = localStorage.getItem('chatbotMessages');
        return saved ? JSON.parse(saved) : [{ role: 'assistant', content: WELCOME_MESSAGE, products: [] }];
    });

    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [confirmClearOpen, setConfirmClearOpen] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        localStorage.setItem('chatbotMessages', JSON.stringify(messages));
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

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

    const handleClearChat = () => setConfirmClearOpen(true);

    const clearChat = () => {
        const initialMessage = { role: 'assistant', content: WELCOME_MESSAGE, products: [] };
        setMessages([initialMessage]);
        localStorage.setItem('chatbotMessages', JSON.stringify([initialMessage]));
        setConfirmClearOpen(false);
    };

    // Sends `text` (a typed message or a tapped quick reply).
    const sendMessage = async (text) => {
        if (!text.trim() || loading) return;

        const userMessage = { role: 'user', content: text, products: [] };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const conversationHistory = messages
                .filter(m => m.role !== 'system')
                .map(m => ({ role: m.role, content: m.content }));

            // Земи ги прегледаните производи од localStorage
            const viewedProducts = JSON.parse(localStorage.getItem('viewedProducts') || '[]');

            const response = await axiosInstance.post('/chat', {
                message: text,
                conversationHistory: conversationHistory,
                viewedProducts: viewedProducts.map(p => p.name),
            });

            const data = response.data;

            setMessages(prev => [...prev, { role: 'assistant', content: data.reply, products: data.products || [] }]);
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [
                ...prev,
                { role: 'assistant', content: '😊 Извинете, имаше проблем. Обидете се повторно!', products: [] },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(input);
        }
    };

    const openProduct = (e, product, imageUrl) => {
        // In-app navigation (this used to be a full page reload) with the
        // thumbnail flying into the product page. The chat stays open on desktop,
        // where it doesn't cover the product - the reload used to reopen it there
        // anyway - and closes on phones/tablets, where it would.
        startProductTransition(product.id, e.currentTarget.querySelector('img'), imageUrl, { source: 'chat' });
        if (!isDesktop()) setIsOpen(false);
        navigate(`/products/${product.id}`, { state: { preview: product, imageIndex: 0 } });
    };

    const showQuickReplies = messages.length === 1 && !loading;

    const headerIconSx = {
        color: '#8b7355',
        transition: 'background-color 0.25s ease, color 0.25s ease',
        '&:hover': { backgroundColor: 'rgba(212, 184, 150, 0.16)', color: '#2c2c2c' },
    };

    return (
        <>
            <ConfirmDialog
                open={confirmClearOpen}
                title="Избриши го разговорот?"
                message="Сите пораки во овој разговор ќе бидат избришани."
                confirmLabel="Избриши"
                cancelLabel="Откажи"
                onConfirm={clearChat}
                onCancel={() => setConfirmClearOpen(false)}
            />
            {!isOpen && (
                <IconButton
                    onClick={handleToggleChat}
                    aria-label="Open chat assistant"
                    sx={{
                        position: 'fixed',
                        bottom: { xs: 'calc(16px + env(safe-area-inset-bottom))', sm: 20, lg: 24 },
                        right: { xs: 16, sm: 20, lg: 24 },
                        width: { xs: 48, sm: 52, lg: 64 },
                        height: { xs: 48, sm: 52, lg: 64 },
                        backgroundColor: '#d4b896',
                        color: '#ffffff',
                        // Thin light ring + softer shadow on phones/tablets, so the
                        // smaller button reads as a refined accent rather than a blob.
                        border: { xs: '1.5px solid rgba(255, 255, 255, 0.75)', lg: 'none' },
                        boxShadow: {
                            xs: '0 4px 14px rgba(139, 115, 85, 0.28)',
                            lg: '0 6px 24px rgba(212, 184, 150, 0.45)',
                        },
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
                    <ChatIcon sx={{ fontSize: { xs: 22, sm: 24, lg: 28 } }} />
                </IconButton>
            )}

            {(isOpen || isClosing) && (
                <Paper
                    elevation={0}
                    sx={{
                        position: 'fixed',
                        // Phones: a floating card inset from the edges (instead of a
                        // near-fullscreen sheet). Tablets: a compact card. Desktop: as before.
                        bottom: { xs: 'calc(12px + env(safe-area-inset-bottom))', sm: 20, lg: 24 },
                        right: { xs: 12, sm: 20, lg: 24 },
                        left: { xs: 12, sm: 'auto' },
                        width: { xs: 'auto', sm: 306, lg: 333 },
                        height: { xs: 'min(63vh, 486px)', sm: 'min(432px, 68vh)', lg: 468 },
                        maxHeight: { xs: 'min(63vh, 486px)', sm: 'min(432px, 68vh)', lg: 468 },
                        display: 'flex',
                        flexDirection: 'column',
                        backgroundColor: '#fdfbf5',
                        borderRadius: { xs: '20px', lg: '22px' },
                        overflow: 'hidden',
                        boxShadow: '0 24px 60px rgba(44, 44, 44, 0.18), 0 2px 8px rgba(44, 44, 44, 0.06)',
                        border: '1px solid rgba(212, 184, 150, 0.35)',
                        // Above MUI Fabs (1050) - on phones the card spans the width and
                        // would otherwise sit under the admin's "+" button - but below
                        // dialogs/snackbars (1300+).
                        zIndex: 1100,
                        animation: isClosing
                            ? 'slideOutDown 0.5s cubic-bezier(0.25, 0.8, 0.25, 1) forwards'
                            : 'slideInUp 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)',
                        '@keyframes slideInUp': {
                            '0%': { opacity: 0, transform: 'translateY(40px) scale(0.92)' },
                            '100%': { opacity: 1, transform: 'translateY(0) scale(1)' },
                        },
                        '@keyframes slideOutDown': {
                            '0%': { opacity: 1, transform: 'translateY(0) scale(1)' },
                            '100%': { opacity: 0, transform: 'translateY(30px) scale(0.94)' },
                        },
                        '@keyframes chatMessageIn': {
                            '0%': { opacity: 0, transform: 'translateY(8px)' },
                            '100%': { opacity: 1, transform: 'none' },
                        },
                        '@keyframes chatTypingDot': {
                            '0%, 60%, 100%': { transform: 'translateY(0)', opacity: 0.45 },
                            '30%': { transform: 'translateY(-4px)', opacity: 1 },
                        },
                    }}
                >
                    {/* Header */}
                    <Box sx={{
                        display: 'flex', alignItems: 'center', gap: 1.4,
                        px: 2, py: 1.5,
                        backgroundColor: '#fdfbf5',
                        borderBottom: '1px solid rgba(212, 184, 150, 0.3)',
                    }}>
                        <Box sx={{ position: 'relative', flex: '0 0 auto' }}>
                            <Box sx={{
                                width: 40, height: 40, borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: 'linear-gradient(135deg, #e6ccb2 0%, #d4b896 100%)',
                                boxShadow: '0 4px 12px rgba(212, 184, 150, 0.45)',
                            }}>
                                <Box component="img" src="/logo.png" alt="" sx={{ height: 22, filter: 'brightness(0) invert(1)' }} />
                            </Box>
                            {/* online dot */}
                            <Box sx={{
                                position: 'absolute', right: 0, bottom: 0, width: 11, height: 11, borderRadius: '50%',
                                backgroundColor: '#4caf50', border: '2px solid #fdfbf5',
                            }} />
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.2rem', color: '#2c2c2c', lineHeight: 1.1 }}>
                                Maison Assistant
                            </Typography>
                            <Typography sx={{ fontFamily: '"Lato", sans-serif', fontSize: '0.68rem', color: '#a0826d', letterSpacing: '0.04em' }}>
                                Online · Powered by Claude
                            </Typography>
                        </Box>
                        <Tooltip title="Clear chat" placement="bottom">
                            <IconButton size="small" onClick={handleClearChat} sx={headerIconSx} aria-label="Clear chat">
                                <DeleteOutlineIcon sx={{ fontSize: 19 }} />
                            </IconButton>
                        </Tooltip>
                        <IconButton size="small" onClick={handleToggleChat} sx={headerIconSx} aria-label="Close chat">
                            <CloseRoundedIcon sx={{ fontSize: 20 }} />
                        </IconButton>
                    </Box>

                    {/* Messages */}
                    <Box sx={{
                        flex: 1, overflowY: 'auto', px: { xs: 1.5, lg: 2 }, py: 2,
                        backgroundColor: '#f7f2e9',
                        display: 'flex', flexDirection: 'column', gap: 1.6,
                        '&::-webkit-scrollbar': { width: 5 },
                        '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(212, 184, 150, 0.5)', borderRadius: 3 },
                    }}>
                        {messages.map((message, index) => {
                            const isUser = message.role === 'user';
                            return (
                                <Box key={index} sx={{ animation: 'chatMessageIn 0.35s ease' }}>
                                    <Box sx={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
                                        <Box sx={{
                                            maxWidth: '82%',
                                            px: 1.6, py: 1.1,
                                            borderRadius: isUser ? '18px 18px 6px 18px' : '18px 18px 18px 6px',
                                            background: isUser ? 'linear-gradient(135deg, #d4b896 0%, #c4a886 100%)' : '#ffffff',
                                            color: isUser ? '#ffffff' : '#2c2c2c',
                                            boxShadow: isUser ? '0 4px 14px rgba(196, 168, 134, 0.35)' : '0 2px 10px rgba(44, 44, 44, 0.05)',
                                            border: isUser ? 'none' : '1px solid rgba(212, 184, 150, 0.25)',
                                        }}>
                                            <Typography sx={{
                                                fontFamily: '"Lato", sans-serif',
                                                fontSize: '0.82rem', lineHeight: 1.55, whiteSpace: 'pre-wrap',
                                            }}>
                                                {message.content}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* Product Cards */}
                                    {message.products && message.products.length > 0 && (
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1, maxWidth: '88%' }}>
                                            {message.products.map((product) => {
                                                const images = getProductImages(product);
                                                const imageUrl = images[0] || FALLBACK_PRODUCT_IMAGE;

                                                return (
                                                    <Box
                                                        key={product.id}
                                                        onClick={(e) => openProduct(e, product, imageUrl)}
                                                        sx={{
                                                            display: 'flex', alignItems: 'center', gap: 1.5,
                                                            backgroundColor: '#ffffff',
                                                            borderRadius: '14px', p: 1,
                                                            border: '1px solid rgba(212, 184, 150, 0.25)',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                            '& .chat-product-arrow': { transition: 'transform 0.3s ease, color 0.3s ease' },
                                                            '&:hover': {
                                                                boxShadow: '0 8px 22px rgba(139, 115, 85, 0.18)',
                                                                transform: 'translateY(-2px)',
                                                                borderColor: 'rgba(212, 184, 150, 0.55)',
                                                            },
                                                            '&:hover .chat-product-arrow': { transform: 'translateX(3px)', color: '#8b7355' },
                                                        }}
                                                    >
                                                        <Box component="img" src={imageUrl} alt={product.name}
                                                             sx={{ width: 52, height: 68, objectFit: 'cover', borderRadius: '9px', flex: '0 0 auto', backgroundColor: '#f5f1e8' }} />
                                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                                            <Typography sx={{
                                                                fontFamily: '"Lato", sans-serif',
                                                                fontSize: '0.78rem', fontWeight: 700, color: '#2c2c2c', mb: 0.3,
                                                                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                                            }}>
                                                                {product.name}
                                                            </Typography>
                                                            <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.05rem', color: '#8b7355' }}>
                                                                €{product.price.toFixed(0)}
                                                            </Typography>
                                                        </Box>
                                                        <EastRoundedIcon className="chat-product-arrow" sx={{ fontSize: 18, color: '#c4a886', mr: 0.5 }} />
                                                    </Box>
                                                );
                                            })}
                                        </Box>
                                    )}
                                </Box>
                            );
                        })}

                        {/* Quick replies - only while the conversation is fresh */}
                        {showQuickReplies && (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, animation: 'chatMessageIn 0.45s ease' }}>
                                {QUICK_REPLIES.map((reply) => (
                                    <Box
                                        key={reply}
                                        component="button"
                                        type="button"
                                        onClick={() => sendMessage(reply)}
                                        sx={{
                                            cursor: 'pointer',
                                            px: 1.4, py: 0.7, borderRadius: '999px',
                                            border: '1px solid rgba(212, 184, 150, 0.6)',
                                            backgroundColor: '#fffdf8',
                                            fontFamily: '"Lato", sans-serif', fontSize: '0.74rem', color: '#6b5640',
                                            transition: 'all 0.25s ease',
                                            '&:hover': { backgroundColor: '#d4b896', borderColor: '#d4b896', color: '#ffffff', transform: 'translateY(-1px)' },
                                        }}
                                    >
                                        {reply}
                                    </Box>
                                ))}
                            </Box>
                        )}

                        {/* Typing indicator */}
                        {loading && (
                            <Box sx={{ display: 'flex', justifyContent: 'flex-start', animation: 'chatMessageIn 0.3s ease' }}>
                                <Box sx={{
                                    display: 'flex', alignItems: 'center', gap: 0.6,
                                    px: 1.8, py: 1.4, borderRadius: '18px 18px 18px 6px',
                                    backgroundColor: '#ffffff',
                                    border: '1px solid rgba(212, 184, 150, 0.25)',
                                    boxShadow: '0 2px 10px rgba(44, 44, 44, 0.05)',
                                }}>
                                    {[0, 1, 2].map((i) => (
                                        <Box key={i} sx={{
                                            width: 7, height: 7, borderRadius: '50%', backgroundColor: '#c4a886',
                                            animation: `chatTypingDot 1.2s ease-in-out ${i * 0.15}s infinite`,
                                        }} />
                                    ))}
                                </Box>
                            </Box>
                        )}
                        <div ref={messagesEndRef} />
                    </Box>

                    {/* Input */}
                    <Box sx={{
                        p: 1.5, backgroundColor: '#fdfbf5',
                        borderTop: '1px solid rgba(212, 184, 150, 0.3)',
                        display: 'flex', alignItems: 'flex-end', gap: 1,
                    }}>
                        <TextField
                            fullWidth multiline maxRows={3}
                            size="small"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Прашајте за производи..."
                            disabled={loading}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    fontFamily: '"Lato", sans-serif',
                                    // 16px on phones: iOS Safari zooms the whole page in when
                                    // an input smaller than that gets focus.
                                    fontSize: { xs: '16px', sm: '0.82rem' },
                                    borderRadius: '22px',
                                    backgroundColor: '#ffffff',
                                    py: 1, px: 1.8,
                                    transition: 'box-shadow 0.25s ease',
                                    '& fieldset': { borderColor: 'rgba(212, 184, 150, 0.4)' },
                                    '&:hover fieldset': { borderColor: '#d4b896' },
                                    '&.Mui-focused': { boxShadow: '0 0 0 4px rgba(212, 184, 150, 0.15)' },
                                    '&.Mui-focused fieldset': { borderColor: '#c4a886', borderWidth: '1px' },
                                },
                            }}
                        />
                        <IconButton
                            onClick={() => sendMessage(input)}
                            disabled={!input.trim() || loading}
                            aria-label="Send message"
                            sx={{
                                flex: '0 0 auto',
                                background: 'linear-gradient(135deg, #d4b896 0%, #c4a886 100%)', color: '#ffffff',
                                width: 40, height: 40, mb: '1px',
                                boxShadow: '0 4px 12px rgba(196, 168, 134, 0.4)',
                                transition: 'transform 0.25s ease, box-shadow 0.25s ease, opacity 0.25s ease',
                                '&:hover': { transform: 'translateY(-1px) scale(1.05)', boxShadow: '0 6px 16px rgba(196, 168, 134, 0.5)' },
                                '&.Mui-disabled': {
                                    background: 'rgba(212, 184, 150, 0.3)',
                                    color: 'rgba(255, 255, 255, 0.85)',
                                    boxShadow: 'none',
                                },
                            }}
                        >
                            <ArrowUpwardRoundedIcon sx={{ fontSize: 20 }} />
                        </IconButton>
                    </Box>
                </Paper>
            )}
        </>
    );
};

export default ChatBot;
