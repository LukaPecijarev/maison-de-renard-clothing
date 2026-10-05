// Groups the free-text material/color values on products into a short list of
// families for the shop filters - e.g. "Wool", "Wool Felt", "Merino Wool" and
// "Stretch Wool Twill" all filter as "Wool", "Navy" and "Midnight Blue" as
// "Blue". A blend belongs to each of its families ("Merino Wool / Cashmere
// Blend" shows under both Wool and Cashmere; "White/Brown" under White & Brown).
//
// Rules are keyword matches, listed in the order the options are shown. To
// support a new material/color, add its keyword to the right family.

const MATERIAL_FAMILIES = [
    { name: 'Wool', match: /wool|merino|tweed|flannel/i },
    { name: 'Cashmere', match: /cashm/i }, // also catches the "Cashmare" typo in the data
    { name: 'Silk', match: /silk/i },
    { name: 'Cotton', match: /cotton|oxford/i },
    { name: 'Denim', match: /denim/i },
    { name: 'Leather', match: /(?<!synthetic )leather|calfskin|alligator/i }, // faux leather is Technical only
    { name: 'Suede', match: /suede/i },
    { name: 'Technical', match: /nylon|polyester|technical|mesh|synthetic/i },
    { name: 'Wood & Rattan', match: /wood|rattan/i },
];

const COLOR_FAMILIES = [
    { name: 'Black', match: /black/i },
    { name: 'White & Ivory', match: /white|ivory|tapioca/i },
    { name: 'Grey', match: /gr[ae]y|charcoal/i },
    { name: 'Beige & Camel', match: /beige|camel|sand|taupe|khaki|straw|stone|nude/i },
    { name: 'Brown', match: /brown|cognac|chocolate|espresso|tobacco|walnut|hazel|rust|sienna|terracotta/i },
    { name: 'Blue', match: /blue|navy|indigo|teal|glacier/i },
    { name: 'Red', match: /red|scarlet|burgundy|brick/i },
    { name: 'Pink', match: /pink|rose|blush|mauve/i },
    { name: 'Purple', match: /purple|lilac|violet/i },
    { name: 'Green', match: /green|olive|sage/i },
    { name: 'Gold & Yellow', match: /gold|yellow|kummel/i },
    { name: 'Patterned', match: /leopard|print|check|stripe/i },
];

const OTHER = 'Other';

// Swatch shown next to each colour family in the shop's Color filter.
export const COLOR_SWATCHES = {
    'Black': '#1f1f1f',
    'White & Ivory': '#f7f3ea',
    'Grey': '#9b9b9b',
    'Beige & Camel': '#d2b48c',
    'Brown': '#7b5236',
    'Blue': '#2f4a7a',
    'Red': '#a83232',
    'Pink': '#e8a6b6',
    'Purple': '#8a6aa8',
    'Green': '#6b7f4a',
    'Gold & Yellow': '#d4af37',
    'Patterned': 'repeating-linear-gradient(45deg, #c9a27e 0 3px, #5a4632 3px 6px)',
    [OTHER]: 'conic-gradient(#d4b896, #9b9b9b, #2f4a7a, #a83232, #d4b896)',
};

const familiesOf = (value, families) => {
    if (!value || !value.trim()) return [];
    const matched = families.filter((f) => f.match.test(value)).map((f) => f.name);
    return matched.length > 0 ? matched : [OTHER];
};

export const materialFamilies = (material) => familiesOf(material, MATERIAL_FAMILIES);
export const colorFamilies = (color) => familiesOf(color, COLOR_FAMILIES);

// The families actually present in `products`, in display order ("Other" last).
const presentFamilies = (products, getFamilies, families) => {
    const present = new Set(products.flatMap(getFamilies));
    return [...families.map((f) => f.name), OTHER].filter((name) => present.has(name));
};

export const materialOptions = (products) =>
    presentFamilies(products, (p) => materialFamilies(p.material), MATERIAL_FAMILIES);
export const colorOptions = (products) =>
    presentFamilies(products, (p) => colorFamilies(p.color), COLOR_FAMILIES);
