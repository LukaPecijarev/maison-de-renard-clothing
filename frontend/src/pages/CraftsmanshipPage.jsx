import React from 'react';
import InfoPage from './InfoPage';

const CraftsmanshipPage = () => (
    <InfoPage
        title="Craftsmanship"
        subtitle="The Hands Behind the Maison"
        paragraphs={[
            'Every Maison de Renard piece is built by artisans who have spent decades perfecting a single craft — pattern cutting, hand-finishing, leatherwork — and who measure their work in hours, not units.',
            'We favor construction methods that take longer but last longer: hand-set buttons, fully canvassed tailoring, and seams finished to be let out or taken in as a garment is worn for years, not seasons.',
            'It is a slower way to build a collection. It is also the only way we know that stays true to the Maison\'s name.',
        ]}
    />
);

export default CraftsmanshipPage;
