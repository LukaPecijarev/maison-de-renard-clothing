import React from 'react';
import InfoPage from './InfoPage';

const CompliancePage = () => (
    <InfoPage
        title="Compliance"
        subtitle="Standards We Hold Ourselves To"
        paragraphs={[
            'Maison de Renard requires every partner mill and workshop to meet independently audited standards for labor practices, workplace safety, and material sourcing.',
            'We comply with applicable consumer protection, product safety, and trade regulations in every market we ship to.',
            'Questions about a specific compliance certificate or audit report can be directed to our Get in Touch page.',
        ]}
    />
);

export default CompliancePage;
