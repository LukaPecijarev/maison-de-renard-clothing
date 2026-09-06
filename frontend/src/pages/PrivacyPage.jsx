import React from 'react';
import InfoPage from './InfoPage';

const PrivacyPage = () => (
    <InfoPage
        title="Privacy & Cookie Notice"
        subtitle="How We Handle Your Data"
        paragraphs={[
            'We collect only the information needed to process your orders and, if you choose to create one, manage your account — your name, contact details, shipping address, and order history.',
            'We never sell your personal data. It is used solely to fulfill orders, provide support, and, if you opt in, send occasional updates about new arrivals.',
            'Cookies on this site are used to keep you signed in and remember items in your cart and wishlist. You can clear them at any time through your browser settings.',
        ]}
    />
);

export default PrivacyPage;
