import React from 'react';
import InfoPage from './InfoPage';

const ShippingPage = () => (
    <InfoPage
        title="Delivery & Shipping"
        subtitle="Complimentary, Worldwide"
        paragraphs={[
            'All orders ship free of charge, with express delivery in 2-4 business days across Europe and 5-7 business days internationally.',
            'Every parcel is fully insured and requires a signature on delivery.',
            'You will receive tracking details by email as soon as your order leaves the atelier.',
        ]}
    />
);

export default ShippingPage;
