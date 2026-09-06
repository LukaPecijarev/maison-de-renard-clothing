import React from 'react';
import './WalletCard.css';

// Adapted from a Uiverse.io component by byllzz (https://uiverse.io/byllzz/rude-bat-50),
// restyled for the site's palette and repurposed as a payment-method picker
// that fans the cards out on hover/tap and reveals the order total.

const CARDS = [
    {
        id: 'visa',
        position: 'wc-pos-1',
        brand: 'Visa',
        label: 'Card Holder',
        value: 'JOHN DOE',
        masked: '**** 1481',
        number: '4539 7812 1481',
    },
    {
        id: 'mastercard',
        position: 'wc-pos-2',
        brand: 'Mastercard',
        label: 'Card Holder',
        value: 'JOHN DOE',
        masked: '**** 5588',
        number: '5412 7534 5588',
    },
    {
        id: 'paypal',
        position: 'wc-pos-3',
        brand: null,
        label: 'Account',
        value: 'you@email.com',
        masked: '**** 0099',
        number: 'PP 2024 0099',
    },
];

const WalletCard = ({ selected, onSelect, total = 0 }) => {
    return (
        <div className="wc-app-container">
            <div className="wc-wallet">
                <div className="wc-wallet-back" />

                {CARDS.map((card) => (
                    <div
                        key={card.id}
                        className={`wc-card ${card.position} ${selected === card.id ? 'wc-selected' : ''}`}
                        onClick={() => onSelect?.(card.id)}
                        role="button"
                        tabIndex={0}
                        aria-pressed={selected === card.id}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                onSelect?.(card.id);
                            }
                        }}
                    >
                        <div className="wc-card-inner">
                            <div className="wc-card-top">
                                <span>
                                    {card.id === 'paypal'
                                        ? <>Pay<b style={{ color: '#8b6f47' }}>Pal</b></>
                                        : card.brand}
                                </span>
                                <div className="wc-chip" />
                            </div>
                            <div className="wc-card-bottom">
                                <div className="wc-card-info">
                                    <span className="wc-label">{card.label}</span>
                                    <span className="wc-value">{card.value}</span>
                                </div>
                                <div className="wc-card-number-wrapper">
                                    <span className="wc-hidden-stars">{card.masked}</span>
                                    <span className="wc-card-number">{card.number}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                <div className="wc-pocket">
                    <svg className="wc-pocket-svg" viewBox="0 0 280 160" fill="none">
                        <path
                            d="M 0 20 C 0 10, 5 10, 10 10 C 20 10, 25 25, 40 25 L 240 25 C 255 25, 260 10, 270 10 C 275 10, 280 10, 280 20 L 280 120 C 280 155, 260 160, 240 160 L 40 160 C 20 160, 0 155, 0 120 Z"
                            fill="#2c2c2c"
                        />
                        <path
                            d="M 8 22 C 8 16, 12 16, 15 16 C 23 16, 27 29, 40 29 L 240 29 C 253 29, 257 16, 265 16 C 268 16, 272 16, 272 22 L 272 120 C 272 150, 255 152, 240 152 L 40 152 C 25 152, 8 152, 8 120 Z"
                            stroke="#5a4f3f"
                            strokeWidth="1.5"
                            strokeDasharray="6 4"
                        />
                    </svg>
                    <div className="wc-pocket-content">
                        <div style={{ position: 'relative', height: 24, width: '100%' }}>
                            <div className="wc-balance-stars">******</div>
                            <div className="wc-balance-real">€{total.toFixed(2)}</div>
                        </div>
                        <div className="wc-pocket-label">Order Total</div>
                        <div className="wc-eye-icon-wrapper">
                            <svg className="wc-eye-icon wc-eye-slash" width="20" height="20" viewBox="0 0 24 24"
                                 fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                                <line x1="3" y1="3" x2="21" y2="21" />
                            </svg>
                            <svg className="wc-eye-icon wc-eye-open" style={{ opacity: 0 }} width="20" height="20"
                                 viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WalletCard;
