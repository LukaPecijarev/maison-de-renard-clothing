import React from 'react';
import InfoPage from './InfoPage';

const ServicesPage = () => (
    <InfoPage
        title="Services"
        subtitle="Beyond the Purchase"
        paragraphs={[
            'Private Appointments — book a one-on-one styling session at our atelier in Italy, by appointment only.',
            'Complimentary Alterations — every full-price purchase includes one round of tailoring adjustments at any of our boutiques.',
            'Gift Wrapping — every order can be wrapped in the Maison\'s signature packaging at checkout, at no extra cost.',
        ]}
    />
);

export default ServicesPage;
