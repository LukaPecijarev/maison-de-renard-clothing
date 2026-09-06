import React from 'react';
import InfoPage from './InfoPage';

const ReturnsPage = () => (
    <InfoPage
        title="Returns & Exchange"
        subtitle="30 Days to Decide"
        paragraphs={[
            'Unworn items with original tags attached may be returned within 30 days of delivery for a full refund to the original payment method.',
            'Exchanges for a different size or color are free of charge — reach out to us and we\'ll arrange collection of the original piece.',
            'Made-to-order and personalized pieces are final sale unless faulty on arrival.',
        ]}
    />
);

export default ReturnsPage;
