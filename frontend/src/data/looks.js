// The two photographed looks ("Shop the Look" on the home page, and the
// dedicated /looks page). Shared so both show exactly the same pieces.

// Carousel content for the Men "Shop the Look" banner - these 5 pieces
// from the photographed outfit. A person wearing the piece should only
// ever appear in the full banner photo (ManOutfit.jpg) - every card here,
// default AND hover, uses a plain, isolated shot of the item alone (the
// same defaults the product grid/detail pages use, plus a second
// isolated angle for the hover swap). `name` is the shortened display
// label; `productName` is the exact DataInitializer product name (they
// differ for a few pieces) and is what HomePage/LooksPage match on to
// find the real product and route to it.
export const manOutfitPieces = [
    { image: '/products/men/ManCoat5.jpg', hoverImage: '/products/men/ManCoat6.jpg', name: 'Navy Wool Overcoat', productName: 'Navy Wool Overcoat', subtitle: 'Virgin Wool' },
    { image: '/products/men/ManCardigan5.jpg', hoverImage: '/products/men/ManCardigan6.jpg', name: 'Cable Knit Cardigan', productName: 'Cable Knit Wool Cardigan', subtitle: 'Wool' },
    { image: '/products/men/ManShirt5.jpg', hoverImage: '/products/men/ManShirt6.jpg', name: 'Classic Cotton Shirt', productName: 'Classic Cotton Shirt', subtitle: 'Cotton' },
    { image: '/products/men/ManTrousers5.jpg', hoverImage: '/products/men/ManTrousers6.jpg', name: 'Pleated Trousers', productName: 'Pleated Wool Trousers', subtitle: 'Wool' },
    { image: '/products/men/ManHat2.jpg', hoverImage: '/products/men/ManHat4.jpg', name: 'Wool Flat Cap', productName: 'Wool Flat Cap', subtitle: 'Wool' },
];

// Carousel content for the Women "Shop the Look" banner - same
// convention as manOutfitPieces above: plain isolated shots only, a
// person only ever shows up in the WomenFullLook.jpg banner photo.
// See manOutfitPieces above for why `productName` is separate from `name`.
export const womanOutfitPieces = [
    { image: '/products/women/WomanCoat5.jpg', hoverImage: '/products/women/WomanCoat6.jpg', name: 'Tweed Stand-Collar Jacket', productName: 'Tweed Stand-Collar Jacket', subtitle: 'Wool Tweed' },
    { image: '/products/women/WomanHat2.jpg', hoverImage: '/products/women/WomanHat3.jpg', name: 'Wide-Brim Wool Hat', productName: 'Wide-Brim Wool Hat', subtitle: 'Wool Felt' },
    { image: '/products/women/WomanTrousers5.jpg', hoverImage: '/products/women/WomanTrousers6.jpg', name: 'Wide-Leg Trousers', productName: 'Wide-Leg Checked Wool Trousers', subtitle: 'Wool' },
    { image: '/products/women/WomanShoes4.jpg', hoverImage: '/products/women/WomanShoes6.jpg', name: 'Leopard Bow Loafers', productName: 'Leopard Print Bow Loafers', subtitle: 'Silk' },
];

export const LOOKS = [
    {
        id: 'men',
        title: 'Men',
        categoryId: 2,
        image: '/products/men/ManOutfit.jpg',
        tagline: 'Quiet tailoring for cold mornings',
        description: 'A navy overcoat over a cable-knit cardigan, crisp cotton and pleated wool - finished with a flat cap. Layered warmth, nothing superfluous.',
        pieces: manOutfitPieces,
    },
    {
        id: 'women',
        title: 'Women',
        categoryId: 1,
        image: '/products/women/WomenFullLook.jpg',
        tagline: 'Tweed, felt and a flash of leopard',
        description: 'A stand-collar tweed jacket with wide-leg checked trousers, a wide-brim felt hat and leopard bow loafers. Heritage textures, worn lightly.',
        pieces: womanOutfitPieces,
    },
];
