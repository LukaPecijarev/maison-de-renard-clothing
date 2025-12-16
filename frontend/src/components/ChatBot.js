import React, { useState, useRef, useEffect } from 'react';
import { Box, IconButton, TextField, Typography, Paper, CircularProgress, Tooltip } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useNavigate } from 'react-router-dom';

const ChatBot = () => {
    const navigate = useNavigate();

    // ========== ENHANCED LANGUAGE UNDERSTANDING ==========
    const ChatBotHelpers = {
        synonyms: {
            men: ['мажи', 'men', 'man', 'машки', 'машка', 'машко', 'маж', 'машка категорија', 'машки производи', "men's", 'mens', 'male', 'gentleman', 'gentlemen', 'guy', 'guys', 'boys', 'момчиња', 'момци', 'машки работи', 'маски'],
            women: ['жени', 'women', 'woman', 'женски', 'женска', 'женско', 'жена', 'женска категорија', 'женски производи', "women's", 'womens', 'female', 'дами', 'lady', 'ladies', 'girl', 'girls', 'девојки', 'госпоѓи', 'дама', 'женска работа', 'жени'],
            gifts: ['подарок', 'gift', 'present', 'поклон', 'gifts', 'presents', 'подароци', 'поклони', 'за подарок', 'подарунок', 'честитка', 'поклонче', 'подарунци'],
            essentials: ['essential', 'основно', 'essentials', 'основни', 'basics', 'must-have', 'задолжително', 'неопходно', 'базични'],
            quality: ['квалитет', 'quality', 'добр', 'добро', 'добра', 'good', 'great', 'одличн', 'excellent', 'exceptional', 'врвн', 'top', 'premium', 'луксузн', 'luxury', 'најдобр', 'best', 'супер', 'super', 'висок', 'high'],
            winter: ['зима', 'winter', 'студено', 'cold', 'зимски', 'топло', 'warm', 'мраз', 'frost', 'снег', 'snow', 'греење'],
            bags: ['чанта', 'чанти', 'bag', 'bags', 'backpack', 'торба', 'торби', 'ташна', 'ташни', 'ранец', 'раници', 'кеса', 'кеси'],
            recommend: ['препорачај', 'препорака', 'recommend', 'recommendation', 'suggestion', 'совет', 'предлог', 'покажи', 'show', 'прикажи', 'display', 'посочи', 'propose', 'сакам', 'want', 'дај', 'give'],
            buy: ['купи', 'buy', 'купам', 'purchase', 'набави', 'земи', 'get', 'зафати', 'купување'],
            price: ['цена', 'price', 'колку', 'чини', 'колку чини', 'how much', 'цени', 'prices', 'скап', 'expensive', 'евтин', 'cheap', 'пари', 'money'],
        },

        normalize(text) {
            return text.toLowerCase().trim().replace(/[?!.,;:]/g, '').replace(/\s+/g, ' ');
        },

        containsSynonym(text, category) {
            const normalized = this.normalize(text);
            const synonymList = this.synonyms[category] || [];
            return synonymList.some(syn => normalized.includes(syn.toLowerCase()));
        },

        fuzzyMatch(word, targetWord) {
            if (word === targetWord) return true;
            if (Math.abs(word.length - targetWord.length) > 2) return false;
            let matches = 0;
            const minLength = Math.min(word.length, targetWord.length);
            for (let i = 0; i < minLength; i++) {
                if (word[i] === targetWord[i]) matches++;
            }
            return matches / minLength > 0.7;
        },

        smartSearch(products, keywords) {
            return products.filter(product => {
                const productText = `${product.name} ${product.description}`.toLowerCase();
                return keywords.some(keyword => {
                    if (productText.includes(keyword)) return true;
                    const productWords = productText.split(' ');
                    return productWords.some(word => this.fuzzyMatch(keyword, word));
                });
            });
        },

        getPositiveIntro() {
            const intros = ['✨ Одличен избор! ', '💎 Со задоволство! ', '🌟 Перфектно! ', '👌 Excellent! ', '🎯 Супер прашање! ', '💫 Great! '];
            return intros[Math.floor(Math.random() * intros.length)];
        },
    };
    // ========== END ENHANCED UNDERSTANDING ==========

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
            },
        ];
    });
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [conversationContext, setConversationContext] = useState(() => {
        const saved = localStorage.getItem('chatbotContext');
        return saved ? JSON.parse(saved) : null;
    });
    const [isAnimating, setIsAnimating] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        localStorage.setItem('chatbotOpen', JSON.stringify(isOpen));
    }, [isOpen]);

    useEffect(() => {
        localStorage.setItem('chatbotMessages', JSON.stringify(messages));
    }, [messages]);

    useEffect(() => {
        localStorage.setItem('chatbotContext', JSON.stringify(conversationContext));
    }, [conversationContext]);

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
                content: 'Добредојдовте во Maison de Renard! Прашајте ме за производи, цени или категории. Како можам да ви помогнам?',
            };
            setMessages([initialMessage]);
            setConversationContext(null);
            localStorage.setItem('chatbotMessages', JSON.stringify([initialMessage]));
            localStorage.setItem('chatbotContext', JSON.stringify(null));
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMessage = { role: 'user', content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:8080/api/products');
            const products = await response.json();

            await new Promise(resolve => setTimeout(resolve, 600));

            const query = input.toLowerCase();
            let responseData = null;

            // Enhanced containsAny with synonym support
            const containsAny = (keywords) => keywords.some(keyword => query.includes(keyword));

            // NEW: Use enhanced synonym checking
            const isMen = ChatBotHelpers.containsSynonym(query, 'men');
            const isWomen = ChatBotHelpers.containsSynonym(query, 'women');
            const isGifts = ChatBotHelpers.containsSynonym(query, 'gifts');
            const isEssentials = ChatBotHelpers.containsSynonym(query, 'essentials');
            const isQuality = ChatBotHelpers.containsSynonym(query, 'quality');
            const isWinter = ChatBotHelpers.containsSynonym(query, 'winter');
            const isRecommend = ChatBotHelpers.containsSynonym(query, 'recommend');
            const isBuy = ChatBotHelpers.containsSynonym(query, 'buy');
            const isPrice = ChatBotHelpers.containsSynonym(query, 'price');

            // Enhanced product search
            const searchProducts = (keyword) => {
                const basicResults = products.filter(p =>
                    p.name.toLowerCase().includes(keyword) ||
                    p.description?.toLowerCase().includes(keyword)
                );

                // If few results, try fuzzy search
                if (basicResults.length < 3) {
                    const keywords = [keyword];
                    return ChatBotHelpers.smartSearch(products, keywords);
                }
                return basicResults;
            };

            const isAsking = isRecommend || containsAny(['прашајте', 'ask', 'што има', 'what do you have', 'имаш ли', 'do you have']);

            // SPECIFIC ITEMS
            if (query.includes('капа') || query.includes('hat') || query.includes('beanie')) {
                const hats = searchProducts('beanie');
                responseData = {
                    text: hats.length > 0
                        ? `${ChatBotHelpers.getPositiveIntro()}Имаме ${hats.length} прекрасни капи:`
                        : '😊 Моментално немаме капи, но имаме amazing accessories во Gifts! Погледнете ги! 🎁',
                    products: hats.slice(0, 3),
                };
                setConversationContext({ type: 'search', keyword: 'hat', results: hats });
            }
            else if (query.includes('шал') || query.includes('scarf')) {
                const scarves = searchProducts('scarf');
                responseData = {
                    text: `${ChatBotHelpers.getPositiveIntro()}Имаме ${scarves.length} луксузни шалови од finest cashmere:`,
                    products: scarves.slice(0, 3),
                };
                setConversationContext({ type: 'search', keyword: 'scarf', results: scarves });
            }
            else if (query.includes('ракавиц') || query.includes('glove')) {
                const gloves = searchProducts('glove');
                responseData = {
                    text: `${ChatBotHelpers.getPositiveIntro()}Имаме ${gloves.length} елегантни ракавици:`,
                    products: gloves.slice(0, 3),
                };
                setConversationContext({ type: 'search', keyword: 'glove', results: gloves });
            }
            else if (query.includes('џемпер') || query.includes('sweater') || query.includes('jumper') || query.includes('пуловер')) {
                const sweaters = searchProducts('sweater');
                responseData = {
                    text: `${ChatBotHelpers.getPositiveIntro()}Имаме ${sweaters.length} прекрасни cashmere џемпери:`,
                    products: sweaters.slice(0, 3),
                };
                setConversationContext({ type: 'search', keyword: 'sweater', results: sweaters });
            }
            else if (query.includes('палто') || query.includes('coat') || query.includes('jacket')) {
                const coats = searchProducts('coat').concat(searchProducts('jacket'));
                responseData = {
                    text: `${ChatBotHelpers.getPositiveIntro()}Имаме ${coats.length} елегантни палта и јакни:`,
                    products: coats.slice(0, 3),
                };
                setConversationContext({ type: 'search', keyword: 'coat', results: coats });
            }
            // BAGS
            else if (ChatBotHelpers.containsSynonym(query, 'bags') || (containsAny(['кожн', 'leather']) && containsAny(['чанта', 'bag']))) {
                const bags = searchProducts('bag');
                const backpacks = searchProducts('backpack');
                const wallets = searchProducts('wallet');
                const allBags = [...bags, ...backpacks, ...wallets].filter((item, index, self) =>
                    index === self.findIndex((t) => t.id === item.id)
                );

                if (allBags.length > 0) {
                    responseData = {
                        text: `${ChatBotHelpers.getPositiveIntro()}👜 Имаме ${allBags.length} луксузни чанти од finest leather:`,
                        products: allBags.slice(0, 3),
                    };
                    setConversationContext({ type: 'search', keyword: 'bag', results: allBags, offset: 3 });
                } else {
                    responseData = {
                        text: `✨ Моментално немаме чанти, но имаме amazing leather accessories во Gifts! Погледнете ги! 🎁`,
                    };
                }
            }
            // LEATHER
            else if (containsAny(['кожн', 'leather']) && !ChatBotHelpers.containsSynonym(query, 'bags')) {
                const leatherProducts = searchProducts('leather');
                responseData = {
                    text: `${ChatBotHelpers.getPositiveIntro()}Имаме ${leatherProducts.length} premium leather производи:`,
                    products: leatherProducts.slice(0, 3),
                };
                setConversationContext({ type: 'search', keyword: 'leather', results: leatherProducts, offset: 3 });
            }
            // WINTER
            else if (isWinter || (containsAny(['најдобр', 'best']) && containsAny(['зима', 'winter']))) {
                const winterItems = [
                    ...searchProducts('sweater'),
                    ...searchProducts('coat'),
                    ...searchProducts('scarf'),
                    ...searchProducts('glove'),
                ].filter((item, index, self) => index === self.findIndex((t) => t.id === item.id));

                responseData = {
                    text: `${ChatBotHelpers.getPositiveIntro()}❄️ За зима препорачуваме premium winter essentials!\n\nНашите cashmere парчиња се perfect за студено време:`,
                    products: winterItems.slice(0, 3),
                };
                setConversationContext({ type: 'search', keyword: 'winter', results: winterItems, offset: 3 });
            }
            // QUALITY & WHY BUY
            else if ((containsAny(['зошто', 'why']) && isBuy) || (isQuality && containsAny(['зошто', 'why']))) {
                responseData = {
                    text: `${ChatBotHelpers.getPositiveIntro()}🌟 Maison de Renard е синоним за врвен квалитет!\n\n💎 **Exceptional Quality**\n• 100% најфин Italian cashmere\n• Handcrafted со внимание\n• Premium materials\n\n⏳ **Timeless Investment**\n• Трае 10+ години\n• Timeless дизајн\n\n💰 **Real Value**\n• €1000 џемпер / 10 години = €100/год\n• True luxury investment!\n\nШто ве интересира конкретно? 🛍️`,
                };
            }
            else if (isQuality) {
                responseData = {
                    text: `${ChatBotHelpers.getPositiveIntro()}💎 Квалитетот е наш #1 приоритет!\n\n🇮🇹 **Premium Materials**\n• 100% Italian cashmere\n• Finest кожа\n• Luxury текстил\n\n⭐ **Customer Satisfaction**\n• Нашите клиенти се враќаат секогаш!\n• Еднаш кога ќе почувствувате разлика...\n\nИмате прашања? 🌟`,
                };
            }
            else if (containsAny(['скап', 'expensive', 'многу пари'])) {
                responseData = {
                    text: `${ChatBotHelpers.getPositiveIntro()}💰 Нашите цени = exceptional квалитет!\n\n📊 **Long-term Value**\n• Cashmere џемпер = 10+ години\n• "Fast fashion" = 1 сезона\n\n💎 **Investment**\n• €1000/10 години = €100/година\n• For premium Italian cashmere = steal!\n\nPlus Special Offers до 50%! 🎉`,
                };
            }
            // SHOW MORE
            else if (conversationContext && (containsAny(['уште', 'more', 'повеќе', 'next']) || (containsAny(['друг', 'other']) && !containsAny(['продавниц', 'store'])))) {
                if (conversationContext.type === 'category') {
                    const categoryProducts = products.filter(p => p.categoryId === conversationContext.id);
                    const offset = conversationContext.offset || 3;
                    const moreProducts = categoryProducts.slice(offset, offset + 3);

                    responseData = moreProducts.length > 0
                        ? { text: `${ChatBotHelpers.getPositiveIntro()}Еве уште ${moreProducts.length} од ${conversationContext.name}:`, products: moreProducts }
                        : { text: `Тоа се сите од ${conversationContext.name}. Друга категорија? 💎` };

                    setConversationContext({ ...conversationContext, offset: offset + 3 });
                } else if (conversationContext.type === 'search') {
                    const offset = conversationContext.offset || 3;
                    const moreItems = conversationContext.results.slice(offset, offset + 3);

                    responseData = moreItems.length > 0
                        ? { text: `${ChatBotHelpers.getPositiveIntro()}Еве уште ${moreItems.length}:`, products: moreItems }
                        : { text: `Тоа е се! Барате нешто друго? 💎` };

                    setConversationContext({ ...conversationContext, offset: offset + 3 });
                }
            }
            // CATEGORIES
            else if (!conversationContext && isWomen) {
                const womenProducts = products.filter(p => p.categoryId === 1);
                responseData = {
                    text: `${ChatBotHelpers.getPositiveIntro()}👗 Women колекција! ${womenProducts.length} изгледни парчиња:`,
                    products: womenProducts.slice(0, 3),
                };
                setConversationContext({ type: 'category', id: 1, name: 'Women', offset: 3 });
            }
            else if (!conversationContext && isMen) {
                const menProducts = products.filter(p => p.categoryId === 2);
                responseData = {
                    text: `${ChatBotHelpers.getPositiveIntro()}👔 Men колекција! ${menProducts.length} изгледни парчиња:`,
                    products: menProducts.slice(0, 3),
                };
                setConversationContext({ type: 'category', id: 2, name: 'Men', offset: 3 });
            }
            else if (!conversationContext && isGifts) {
                const gifts = products.filter(p => p.categoryId === 3);
                responseData = {
                    text: `${ChatBotHelpers.getPositiveIntro()}🎁 Gifts колекција! ${gifts.length} луксузни подароци:`,
                    products: gifts.slice(0, 3),
                };
                setConversationContext({ type: 'category', id: 3, name: 'Gifts', offset: 3 });
            }
            else if (!conversationContext && isEssentials) {
                const essentials = products.filter(p => p.categoryId === 4);
                responseData = {
                    text: `${ChatBotHelpers.getPositiveIntro()}⭐ Essentials! ${essentials.length} must-have парчиња:`,
                    products: essentials.slice(0, 3),
                };
                setConversationContext({ type: 'category', id: 4, name: 'Essentials', offset: 3 });
            }
            // SPECIAL OFFERS
            else if (containsAny(['попуст', 'offer', 'sale', 'discount', 'промоција'])) {
                const specialOffers = products.filter(p => p.categoryId === 5);
                responseData = specialOffers.length > 0
                    ? { text: `${ChatBotHelpers.getPositiveIntro()}🎉 Special Offers - попусти до 50%!`, products: specialOffers.slice(0, 3) }
                    : { text: `💎 Моментално немаме попусти, но exceptional value на сè! Погледнете колекциите! ✨` };

                if (specialOffers.length > 0) {
                    setConversationContext({ type: 'category', id: 5, name: 'Special Offers', offset: 3 });
                }
            }
            // PRICE
            else if (isPrice && !containsAny(['попуст', 'offer'])) {
                const words = query.split(' ');
                const matchedProduct = products.find(p => {
                    const productWords = p.name.toLowerCase().split(' ');
                    return words.some(word => productWords.includes(word) && word.length > 3);
                });

                responseData = matchedProduct
                    ? { text: `${ChatBotHelpers.getPositiveIntro()}${matchedProduct.name} = €${matchedProduct.price.toFixed(0)} 💎`, products: [matchedProduct] }
                    : { text: `Нашите цени: €600 - €3500. Кој производ ве интересира? 💎` };
            }
            // CASHMERE
            else if (query.includes('cashmere') || query.includes('кашмир')) {
                const cashmereProducts = searchProducts('cashmere');
                responseData = {
                    text: `${ChatBotHelpers.getPositiveIntro()}🐐 Legendary cashmere! ${cashmereProducts.length} парчиња:`,
                    products: cashmereProducts.slice(0, 3),
                };
                setConversationContext({ type: 'search', keyword: 'cashmere', results: cashmereProducts, offset: 3 });
            }
            // GREETING
            else if (query.includes('здраво') || query.includes('hello') || query.includes('hi') || query.includes('хеј')) {
                responseData = {
                    text: `${ChatBotHelpers.getPositiveIntro()}👋 Добредојдовте! Како можам да помогнам? 🌟`,
                };
                setConversationContext(null);
            }
            // THANK YOU
            else if (containsAny(['благодар', 'thank', 'фала', 'thanks'])) {
                responseData = {
                    text: `${ChatBotHelpers.getPositiveIntro()}🙏 Благодарам што избравте Maison de Renard! Среќен шопинг! ✨`,
                };
            }
            // SHOW EVERYTHING
            else if (containsAny(['што имате', 'what do you have', 'покажи', 'show me', 'категории', 'categories', 'сè', 'all'])) {
                const menCount = products.filter(p => p.categoryId === 2).length;
                const womenCount = products.filter(p => p.categoryId === 1).length;
                const giftsCount = products.filter(p => p.categoryId === 3).length;

                responseData = {
                    text: `${ChatBotHelpers.getPositiveIntro()}🌟 Еве што нудиме:\n\n👔 Men (${menCount})\n👗 Women (${womenCount})\n🎁 Gifts (${giftsCount})\n🎉 Special Offers\n\nШто ве интересира? 💎`,
                };
                setConversationContext(null);
            }
            // DEFAULT
            else {
                const menCount = products.filter(p => p.categoryId === 2).length;
                const womenCount = products.filter(p => p.categoryId === 1).length;
                const giftsCount = products.filter(p => p.categoryId === 3).length;

                responseData = isAsking || containsAny(['производ', 'product', 'имате', 'have'])
                    ? { text: `${ChatBotHelpers.getPositiveIntro()}🌟 Нудиме:\n\n👔 Men (${menCount})\n👗 Women (${womenCount})\n🎁 Gifts (${giftsCount})\n\nКоја категорија? 💎` }
                    : { text: `😊 Не разбрав целосно. Прашајте за:\n\n• Категории (Men/Women/Gifts)\n• Производи (џемпери/палта/шалови)\n• Цени\n• Квалитет\n\nШто барате? 🛍️` };

                setConversationContext(null);
            }

            const assistantMessage = {
                role: 'assistant',
                content: responseData.text,
                products: responseData.products,
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Error:', error);
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: '😊 Извинете, имаше проблем. Обидете се повторно!',
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
                    <Box
                        sx={{
                            background: 'linear-gradient(135deg, #d4b896 0%, #c4a886 100%)',
                            color: '#ffffff',
                            p: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <SmartToyOutlinedIcon sx={{ fontSize: 24 }} />
                            <Box>
                                <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.1rem', fontWeight: 500, letterSpacing: '0.05em' }}>
                                    Maison Assistant
                                </Typography>
                                <Typography sx={{ fontFamily: '"Lato", sans-serif', fontSize: '0.7rem', opacity: 0.9, letterSpacing: '0.05em' }}>
                                    Smart Product Assistant
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Tooltip title="Clear Chat" placement="bottom">
                                <IconButton onClick={handleClearChat} sx={{ color: '#ffffff', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' } }}>
                                    <DeleteOutlineIcon sx={{ fontSize: 20 }} />
                                </IconButton>
                            </Tooltip>
                            <IconButton onClick={handleToggleChat} sx={{ color: '#ffffff', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)', transform: 'rotate(90deg)' } }}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    </Box>

                    <Box sx={{ flex: 1, overflowY: 'auto', p: 2, backgroundColor: '#f5f1e8', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        {messages.map((message, index) => (
                            <Box key={index}>
                                <Box sx={{ display: 'flex', justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start' }}>
                                    <Box
                                        sx={{
                                            maxWidth: '75%',
                                            p: 1.5,
                                            borderRadius: message.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                            backgroundColor: message.role === 'user' ? '#d4b896' : '#ffffff',
                                            color: message.role === 'user' ? '#ffffff' : '#2c2c2c',
                                            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                                            border: message.role === 'assistant' ? '1px solid rgba(212, 184, 150, 0.15)' : 'none',
                                        }}
                                    >
                                        <Typography sx={{ fontFamily: '"Lato", sans-serif', fontSize: '0.875rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                                            {message.content}
                                        </Typography>
                                    </Box>
                                </Box>

                                {message.products && message.products.length > 0 && (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
                                        {message.products.map((product) => {
                                            const images = product.imageUrl ? product.imageUrl.split(',').map(url => url.trim()) : [];
                                            const imageUrl = images[0] || 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300';

                                            return (
                                                <Box
                                                    key={product.id}
                                                    sx={{
                                                        display: 'flex',
                                                        gap: 1.5,
                                                        backgroundColor: '#ffffff',
                                                        borderRadius: '14px',
                                                        p: 1.2,
                                                        border: '1px solid rgba(212, 184, 150, 0.15)',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                        '&:hover': { boxShadow: '0 6px 20px rgba(212, 184, 150, 0.25)', transform: 'translateY(-3px)', borderColor: 'rgba(212, 184, 150, 0.3)' },
                                                    }}
                                                    onClick={() => {
                                                        setIsOpen(false);
                                                        window.location.href = `/products/${product.id}`;
                                                    }}
                                                >
                                                    <Box component="img" src={imageUrl} alt={product.name} sx={{ width: 60, height: 80, objectFit: 'cover', borderRadius: '8px' }} />
                                                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                                        <Typography sx={{ fontFamily: '"Lato", sans-serif', fontSize: '0.8rem', fontWeight: 500, color: '#2c2c2c', mb: 0.5 }}>
                                                            {product.name}
                                                        </Typography>
                                                        <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1rem', fontWeight: 600, color: '#d4b896' }}>
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
                                <Box sx={{ p: 1.5, borderRadius: '18px 18px 18px 4px', backgroundColor: '#ffffff', boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)', border: '1px solid rgba(212, 184, 150, 0.15)' }}>
                                    <CircularProgress size={20} sx={{ color: '#d4b896' }} />
                                </Box>
                            </Box>
                        )}

                        <div ref={messagesEndRef} />
                    </Box>

                    <Box sx={{ p: 2, backgroundColor: '#ffffff', borderTop: '1px solid rgba(212, 184, 150, 0.15)', display: 'flex', gap: 1 }}>
                        <TextField
                            fullWidth
                            multiline
                            maxRows={3}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Прашајте за производи..."
                            disabled={loading}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    fontFamily: '"Lato", sans-serif',
                                    fontSize: '0.875rem',
                                    borderRadius: '16px',
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
                                backgroundColor: '#d4b896',
                                color: '#ffffff',
                                width: 48,
                                height: 48,
                                '&:hover': { backgroundColor: '#c4a886', transform: 'scale(1.05)' },
                                '&.Mui-disabled': { backgroundColor: 'rgba(212, 184, 150, 0.3)', color: 'rgba(255, 255, 255, 0.5)' },
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