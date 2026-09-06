import React from 'react';
import InfoPage from './InfoPage';

const LegalPage = () => (
    <InfoPage
        title="Legal"
        subtitle="Terms of Use"
        paragraphs={[
            'By using this site, you agree to purchase products for personal, non-commercial use only, in accordance with the terms presented at checkout.',
            'All content on this site — including images, text, and the Maison de Renard name and logo — is the property of Maison de Renard and may not be reproduced without permission.',
            'These terms are governed by the laws of the jurisdiction in which Maison de Renard is registered.',
        ]}
    />
);

export default LegalPage;
